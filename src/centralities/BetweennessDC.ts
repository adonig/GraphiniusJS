/// <reference path="../../typings/tsd.d.ts" />

import * as $G from '../core/Graph';
import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
import * as $P from '../search/PFS';
import * as $JO from '../search/Johnsons';
import * as $BF from '../search/BellmanFord';
import * as $SU from '../utils/structUtils';
import * as $BH from '../datastructs/binaryHeap';
import * as $B from '../centralities/Brandes';
import { nbind } from 'q';


//do a fake partitioning - will be replaced with a real one later
function fakePartition(graph: $G.IGraph): {} {

  //check for negative cycles/edges, and stop/reweigh accordingly
  if (graph.hasNegativeEdge()) {
    var extraNode: $N.IBaseNode = new $N.BaseNode("extraNode");
    graph = $JO.addExtraNandE(graph, extraNode);
    let BFresult = $BF.BellmanFordDict(graph, extraNode);

    if (BFresult.neg_cycle) {
      throw new Error("The graph contains a negative cycle, thus it can not be processed");
    }
    else {
      let newWeights: {} = BFresult.distances;

      graph = $JO.reWeighGraph(graph, newWeights, extraNode);
      graph.deleteNode(extraNode);
    }
  }

  let nodes = graph.getNodes();
  let N = Object.keys(nodes).length;
  let part1 = {};
  let part2 = {};
  let result = {};
  let i = 0;

  //do the fake partitioning
  for (let node in nodes) {
    let actualNode = nodes[node];
    if (i++ <= N / 2 - 1) {
      //now true is put in for all, later a change to false means deletion (but faster)
      part1[actualNode.getID()] = true;
    }
    else {
      part2[actualNode.getID()] = true;
    }
  }

  let partCount = 0;
  result[partCount++] = part1;
  result[partCount++] = part2;

  return result;
}


//one function to handle Brandes++ and Brandes++All (with and without target node set)
//LOGIC: partitions are labeled with integers starting with 0. Target nodes, if any, will be labeled as partition -1
function prepareSuperNode(graph: $G.IGraph, partitions: {}, targetSet?: { [key: string]: boolean }) {

  let skeleton = new $G.BaseGraph("skeleton");
  //intraSN edges will be sorted similarly as the nodes in the partitions object
  let intraSNedges = {};
  let frontiersDict = {};

  //first label each node with partition number and label as non-frontier
  for (let part in partitions) {
    let dict = partitions[part];
    intraSNedges[part] = {};
    frontiersDict[part] = {};
    for (let id in dict) {
      let node: $N.IBaseNode = graph.getNodeById(id);

      //if it is a target node, we set its features accordingly and "remove" it from the partition
      if (targetSet && targetSet[id] !== undefined) {
        partitions[part][id] = false;
        node.setFeatures({ "partition": -1, "frontier": false });
      }
      else {
        node.setFeatures({ "partition": part, "frontier": false });
      }
    }
  }

  //get all edges
  let dirEdges = graph.getDirEdgesArray();
  let undEdges = graph.getUndEdgesArray();
  let allEdges = dirEdges;
  for (let edge of undEdges) {
    allEdges.push(edge);
  }

  //used to record which nodes are added to the skeleton, to avoid duplicates
  let nodeIDsInSK = {};

  for (let edge of allEdges) {
    let ends = edge.getNodes();
    let a_part = ends.a.getFeatures().partition;
    let b_part = ends.b.getFeatures().partition;

    //interSN edge
    //if one end node is a target node, it is automatically an interSN edge!
    //however, target set nodes are NOT frontiers. 
    if (a_part !== b_part || a_part === -1 || b_part === -1) {
      a_part !== -1 ? ends.a.setFeature("frontier", true) :
        ends.a.setFeature("frontier", false);
      b_part !== -1 ? ends.b.setFeature("frontier", true) :
        ends.b.setFeature("frontier", false);
      if (!nodeIDsInSK[ends.a.getID()]) {
        skeleton.cloneAndAddNode(ends.a);
        nodeIDsInSK[ends.a.getID()] = true;

        if (a_part !== -1) {
          frontiersDict[a_part][ends.a.getID()] = true;
        }
      }

      if (!nodeIDsInSK[ends.b.getID()]) {
        skeleton.cloneAndAddNode(ends.b);
        nodeIDsInSK[ends.b.getID()] = true;

        if (b_part !== -1) {
          frontiersDict[b_part][ends.b.getID()] = true;
        }
      }

      //similar to nodes, partition of -1 means it is an interSN edge
      edge.setFeatures({ "partition": -1, "sigma": 1 });
      skeleton.cloneAndAddEdge(edge);
    }
    //intraSN edge
    else {
      //only a boolean is put in, later all edge properties can be obtained from the graph object
      intraSNedges[a_part][edge.getID()] = true;
      edge.setFeature("partition", a_part);
    }
  }
  return { partitions, intraSNedges, frontiersDict, skeleton };
}

function Dijkstra_SK(nodeList: {}, edgeList: {}, graph: $G.IGraph) {
  //first make the adjListDict
  let adjListDict = {};
  for (let key in nodeList) {
    if (nodeList[key] === true) {
      adjListDict[key] = {};
    }
  }

  for (let edgeID in edgeList) {
    let edge = graph.getEdgeById(edgeID);
    let ends = edge.getNodes();
    adjListDict[ends.a.getID()][ends.b.getID()] = edge.getWeight();
    if (!edge.isDirected) {
      adjListDict[ends.b.getID()][ends.a.getID()] = edge.getWeight();
    }
  }

  const evalPriority = (nb: $B.BrandesHeapEntry) => nb.best;
  const evalObjID = (nb: $B.BrandesHeapEntry) => nb.id;

  let v: $B.BrandesHeapEntry,    //parent of w, at least one shortest path between s and w leads through v
    w: string,     //neighbour of v, lies one edge further than v from s, type id nodeID, alias string (got from AdjListDict)
    frontierCounter: number,
    sigma: { [key: string]: { [key: string]: number } } = {}, //number of shortest paths from source s to each node
    dist: { [key: string]: { [key: string]: number } } = {},  //distances from source node s to each node
    closedNodes: { [key: string]: boolean } = {},
    Q: $BH.BinaryHeap = new $BH.BinaryHeap($BH.BinaryHeapMode.MIN, evalPriority, evalObjID);

  //eventual target nodes are not represented in the adjListDict, that's why it is better to use that instead of the nodeList
  for (let n in adjListDict) {
    dist[n] = {};
    sigma[n] = {};
    for (let nn in adjListDict) {
      dist[n][nn] = Number.POSITIVE_INFINITY;
      sigma[n][nn] = 0;
    }
  }

  //here this is just a graph traversal (a specialized Dijkstra's)
  for (let s in adjListDict) {

    closedNodes = {};
    dist[s][s] = 0;
    sigma[s][s] = 1;
    frontierCounter = 0;

    let source: $B.BrandesHeapEntry = { id: s, best: 0 };
    Q.insert(source);

    while (Q.size() > 0) {

      v = Q.pop();
      let current_id = v.id;
      if (graph.getNodeById(current_id).getFeature("frontier")) {
        frontierCounter++;
      }

      closedNodes[current_id] = true;

      if (frontierCounter > 2 && graph.getNodeById(current_id).getFeature("frontier")) {
        continue;
      }

      let neighbors = adjListDict[current_id];
      for (let w in neighbors) {

        if (closedNodes[w]) {
          continue;
        }

        let new_dist = dist[s][current_id] + neighbors[w];
        let nextNode: $B.BrandesHeapEntry = { id: w, best: dist[s][w] };
        if (dist[s][w] > new_dist) {
          if (isFinite(dist[s][w])) { //this means the node has already been encountered
            let x = Q.remove(nextNode);
            nextNode.best = new_dist;
            Q.insert(nextNode);
          }
          else {
            nextNode.best = new_dist;
            Q.insert(nextNode);
          }
          sigma[s][w] = 0;
          dist[s][w] = new_dist;
        }

        if (dist[s][w] === new_dist) {
          sigma[s][w] += sigma[s][current_id];
        }
      }
    }
  }
  return { sigma, dist };
}

function SkeletonScoring(sID: string, S: string[], graph: $G.IGraph, sigma: {}, delta: {}, dist: {}, Pred: {}, closedNodes: {}, CB: {}, resetNeeded: boolean): void {
  while (S.length >= 1) {
    let w = S.pop();
    for (let parent of Pred[w]) {
      let multi = graph.getUndEdgeByNodeIDs(parent, w).getFeature("sigma");
      if (graph.getNodeById(w).getFeature("frontier")) {
        delta[parent] += (sigma[parent] / sigma[w] * multi * (0 + delta[w]));
      }
      else {
        //target nodes (if target set is given) are not frontiers so they lead to here
        delta[parent] += (sigma[parent] / sigma[w] * multi * (1 + delta[w]));
      }
    }

    if (w !== sID) {
      CB[w] += delta[w];
    }
    //scoring of on-path nodes will be done by a separate function afterwards
  }
}

function FindAndScoreOnPathNodes(BResult: {}, targetSet: {}, frontiersDict: {}, skeleton: $G.IGraph, DijkstraResults: {}): {} {
  let BCdict = BResult[0];
  let SKdist = BResult[1];
  let SKPred = BResult[2];
  let SKdelta = BResult[3];
  let SKsigma = BResult[4];

  for (let s in BCdict) {
    let dist = SKdist[s];
    let Pred = SKPred[s];
    let delta = SKdelta[s];
    let sigma = SKsigma[s];

    for (let targetID in targetSet) {
      if (targetID === s) {
        continue;
      }
      for (let partID in frontiersDict) {
        for (let frontID in frontiersDict[partID]) {
          if (SKdist[s][targetID] === dist[s][frontID] + dist[frontID][targetID]) {
            //frontier node on-path
            for (let parentID of Pred[frontID]) {

              let parentNode = skeleton.getNodeById(parentID);
              if (parentNode.getFeature("frontier") && frontiersDict[partID][parentID] !== undefined) {
                //its parent is a frontier from the same supernode -> there should be on-path nodes to score
                let actualDist = DijkstraResults[partID][1];
                let actualSigma = DijkstraResults[partID][0];
                for (let nodeID in actualDist) {
                  //if this is a frontier node, it has been handled earlier
                  if (frontiersDict[partID][nodeID] !== undefined) {
                    continue;
                  }
                  if (actualDist[parentID][frontID] === actualDist[parentID][nodeID] + actualDist[nodeID][frontID]) {
                    //on-path node
                    delta[nodeID] = (sigma[s][parentID] * actualSigma[parentID][nodeID] * sigma[nodeID][frontID] / sigma[s][frontID] * (0 + delta[frontID]));
                    BCdict[nodeID] += delta[nodeID];
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return BCdict;
}

function Brandes_SK(skeleton: $G.IGraph, graph: $G.IGraph, DijkstraResults: {}, frontiersDict: { [key: string]: { [key: string]: boolean } }, targetSet?: {}): {} {
  let BCdict: {};

  if (targetSet) {
    let BResult: {} = $B.BrandesWeighted(skeleton, false, false, Object.keys(targetSet), SkeletonScoring, true);
    BCdict = FindAndScoreOnPathNodes(BResult, targetSet, frontiersDict, skeleton, DijkstraResults);
  }

  else {
    //first modify the skeleton
    //use Dijkstraresults, make all added edges directed
    for (let part_i in DijkstraResults) {
      let isourceDist = DijkstraResults[part_i][1];
      let isourceSigma = DijkstraResults[part_i][0];
      for (let id in isourceDist) {
        let node = graph.getNodeById(id);
        //no need to handle frontier nodes, they are added already
        if (node.getFeature("frontier")) {
          continue;
        }
        skeleton.cloneAndAddNode(node);
        for (let fr in frontiersDict[part_i]) {
          let edgeToAdd = new $E.BaseEdge("", skeleton.getNodeById(id), skeleton.getNodeById(fr),
            { directed: true, weighted: true, weight: isourceDist[id][fr] },
            { "partition": part_i, "sigma": isourceSigma[id][fr] });
          skeleton.addEdge(edgeToAdd);
        }
      }

      for (let part_j in DijkstraResults) {
        let jsourceDist = DijkstraResults[part_j][1];
        let jsourceSigma = DijkstraResults[part_j][0];

        //missing part! part_i===part_j not yet handled!
        if (part_i !== part_j) {
          for (let id in jsourceDist) {
            let node = graph.getNodeById(id);
            //no need to handle frontier nodes, they are added already
            if (node.getFeature("frontier")) {
              continue;
            }
            skeleton.cloneAndAddNode(node);
            for (let fr in frontiersDict[part_j]) {
              let edgeToAdd = new $E.BaseEdge("", skeleton.getNodeById(fr), skeleton.getNodeById(id),
                { directed: true, weighted: true, weight: jsourceDist[fr][id] },
                { "partition": part_j, "sigma": jsourceSigma[fr][id] });
              skeleton.addEdge(edgeToAdd);
            }
          }
          //and now here call Brandes and score
          let BCdict: {};
          let BResult: {};
          let startNodes: string[] = Object.keys(isourceDist);
          if (part_i === "0" && part_j === "0") {
            //BCdict not yet initialized
            BResult = $B.BrandesWeighted(skeleton, false, false, startNodes, SkeletonScoring, true);
            BCdict = FindAndScoreOnPathNodes(BResult, targetSet, frontiersDict, skeleton, DijkstraResults);
          }
          else {
            BResult = $B.BrandesWeighted(skeleton, false, false, startNodes, SkeletonScoring, true, BCdict);
            BCdict = FindAndScoreOnPathNodes(BResult, targetSet, frontiersDict, skeleton, DijkstraResults);
          }

        }
        //removing the target nodes
        for (let id in jsourceDist) {
          let node = graph.getNodeById(id);
          //no need to handle frontier nodes, they are added already
          if (node.getFeature("frontier")) {
            continue;
          }
          skeleton.deleteNode(node);
        }
      }
      //removing the source nodes
      for (let id in isourceDist) {
        let node = graph.getNodeById(id);
        //no need to handle frontier nodes, they are added already
        if (node.getFeature("frontier")) {
          continue;
        }
        skeleton.deleteNode(node);
      }
    }

  }
  return BCdict;
}


function BrandesDCmain(graph: $G.IGraph, targetSet?: { [key: string]: boolean }): {} {
  //TODO LATER: a better partitioning algorithm comes here 
  let partitions = fakePartition(graph);

  //the prepareSuperNode method adds all frontier (+target) nodes and interSN edges to the skeleton graph already
  let superNodes =
    targetSet ? prepareSuperNode(graph, partitions, targetSet) : prepareSuperNode(graph, partitions);

  let parts = superNodes.partitions;
  let intraSN = superNodes.intraSNedges;
  let frontiers = superNodes.frontiersDict;
  let skeleton = superNodes.skeleton;

  //allResults contains all dist and sigma values for node pairs of each partition
  let allResults = {};
  let nodes = graph.getNodes();

  //TODO LATER: these will be processed by multiple threads
  for (let key in parts) {
    let result = Dijkstra_SK(parts[key], intraSN[key], graph);
    allResults[key] = result;
  }

  //add missing edges to the skeleton graph: edges that connect frontiers of the same partition
  for (let part in frontiers) {
    for (let f in frontiers[part]) {
      for (let ff in frontiers[part]) {
        if (f !== ff) {
          let edgeToAdd = new $E.BaseEdge(part + "_" + f + "_" + ff, skeleton.getNodeById(f), skeleton.getNodeById(ff),
            { directed: false, weighted: true, weight: allResults[part].dist[f][ff] },
            { "partition": part, "sigma": allResults[part].sigma[f][ff] });
          skeleton.addEdge(edgeToAdd);
        }
      }
    }
  }

  let finalRes = (targetSet !== undefined) ? Brandes_SK(skeleton, graph, allResults, frontiers, targetSet) : Brandes_SK(skeleton, graph, allResults, frontiers);

  return (finalRes);
}

export { fakePartition, prepareSuperNode, Dijkstra_SK, BrandesDCmain }