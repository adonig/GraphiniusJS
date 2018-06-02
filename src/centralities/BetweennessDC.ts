/// <reference path="../../typings/tsd.d.ts" />

import * as $G from '../core/Graph';
import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
import * as $P from '../search/PFS';
import * as $JO from '../search/Johnsons';
import * as $BF from '../search/BellmanFord';
import * as $SU from '../utils/structUtils';
import * as $BH from '../datastructs/binaryHeap';


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
function prepareSuperNode(graph: $G.IGraph, skeleton: $G.IGraph, partitions: {}, targetSet?: { [key: string]: boolean }) {

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

  //interSN edges soon get their characteristic tuples
  let interSNedges = {};
  //used to record which nodes are added to the skeleton, to avoid duplicates
  let nodeIDsInSK = {};

  for (let edge of allEdges) {
    let ends = edge.getNodes();
    let a_part = ends["a"].getFeatures().partition;
    let b_part = ends["b"].getFeatures().partition;

    //interSN edge
    //if one end node is a target node, it is automatically an interSN edge!
    //however, target set nodes are NOT frontiers. 
    if (a_part !== b_part || a_part === -1 || b_part === -1) {
      a_part !== -1 ? ends["a"].setFeature("frontier", true) :
        ends["a"].setFeature("frontier", false);
      b_part !== -1 ? ends["b"].setFeature("frontier", true) :
        ends["b"].setFeature("frontier", false);
      if (!nodeIDsInSK[ends["a"].getID()]) {
        skeleton.cloneAndAddNode(ends["a"]);
        nodeIDsInSK[ends["a"].getID()] = true;
        if (a_part !== -1) {
          frontiersDict[a_part][ends["a"].getID()] = true;
        }

      }
      if (!nodeIDsInSK[ends["b"].getID()]) {
        skeleton.cloneAndAddNode(ends["b"]);
        nodeIDsInSK[ends["b"].getID()] = true;
        if (b_part !== -1) {
          frontiersDict[b_part][ends["b"].getID()] = true;
        }
      }

      interSNedges[edge.getID()] = { "sigma": 1, "dist": edge.getWeight() };
      //similar to nodes, partition of -1 means it is an interSN edge
      edge.setFeatures({ "partition": -1, "sigma": 1});
      //TODO: substitute with new and simpler function
      skeleton.cloneAndAddEdge(edge);
      //skeleton.addEdgeByNodeIDs(edge.getID(), ends["a"].getID(), ends["b"].getID(), { directed: edge.isDirected(), weighted: true, weight: edge.getWeight() });
    }
    //intraSN edge
    else {
      //only a boolean is put in, later all edge properties can be obtained from the graph object
      intraSNedges[a_part][edge.getID()] = true;
      edge.setFeature("partition", a_part);
    }
  }
  return { partitions, intraSNedges, interSNedges, frontiersDict };
}

export interface BrandesHeapEntry {
  id: string;
  best: number;
}

function Dijkstra_SK(nodeList: {}, edgeList: {}, graph: $G.IGraph, BCdict: { [key: string]: number }, withTargets: boolean) {
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

  const evalPriority = (nb: BrandesHeapEntry) => nb.best;
  const evalObjID = (nb: BrandesHeapEntry) => nb.id;

  let v: BrandesHeapEntry,    //parent of w, at least one shortest path between s and w leads through v
    w: string,     //neighbour of v, lies one edge further than v from s, type id nodeID, alias string (got from AdjListDict)
    frontierCounter: number,
    sigma: { [key: string]: { [key: string]: number } } = {}, //number of shortest paths from source s to each node
    dist: { [key: string]: { [key: string]: number } } = {},  //distances from source node s to each node
    closedNodes: { [key: string]: boolean } = {},
    Q: $BH.BinaryHeap = new $BH.BinaryHeap($BH.BinaryHeapMode.MIN, evalPriority, evalObjID);
  //extras needed for regular Brandes
  let delta: { [key: string]: number } = {},
    S: string[] = [],
    Pred: { [key: string]: string[] } = {};

  //eventual target nodes are not represented in the adjListDict, that's why it is better to use that instead of the nodeList
  for (let n in adjListDict) {
    dist[n] = {};
    sigma[n] = {};
    for (let nn in adjListDict) {
      dist[n][nn] = Number.POSITIVE_INFINITY;
      sigma[n][nn] = 0;
      if (!withTargets) {
        delta[nn] = 0;
        Pred[nn] = [];
      }
    }
  }

  //in case there is no targetSet (withTargets ===false), it might be the best to do a real Brandes for this SN
  if (withTargets) {
    for (let s in adjListDict) {

      closedNodes = {};
      dist[s][s] = 0;
      sigma[s][s] = 1;
      frontierCounter = 0;

      let source: BrandesHeapEntry = { id: s, best: 0 };
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
          let nextNode: BrandesHeapEntry = { id: w, best: dist[s][w] };
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
  }
  else {
    for (let s in adjListDict) {

      closedNodes = {};
      dist[s][s] = 0;
      sigma[s][s] = 1;
      frontierCounter = 0;

      let source: BrandesHeapEntry = { id: s, best: 0 };
      Q.insert(source);

      while (Q.size() > 0) {

        v = Q.pop();
        let current_id = v.id;
        if (graph.getNodeById(current_id).getFeature("frontier")) {
          frontierCounter++;
        }

        S.push(current_id);
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
          let nextNode: BrandesHeapEntry = { id: w, best: dist[s][w] };
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
            Pred[w] = [];
          }

          if (dist[s][w] === new_dist) {
            sigma[s][w] += sigma[s][current_id];
            Pred[w].push(current_id);
          }
        }
      }
      //and here the back-propagation
      while (S.length >= 1) {
        w = S.pop();
        for (let parent of Pred[w]) {
          delta[parent] += (sigma[s][parent] / sigma[s][w] * (1 + delta[w]));
        }
        if (w != s) {
          BCdict[w] += delta[w];
        }

        // reset
        delta[w] = 0;
        Pred[w] = [];
      }
    }
  }


  return { sigma, dist };

}

//the function that calculates BC for each node of the original graph
function Brandes_SK(skeleton: $G.IGraph, DijkstraResults: {}, frontiersDict: {}, BCdict: {}, targetSet?: {}): void {
  //this needs to be different if there is /isn't a targetSet

  if (targetSet) {
    let adjListDict = skeleton.adjListDict();

    const evalPriority = (nb: BrandesHeapEntry) => nb.best;
    const evalObjID = (nb: BrandesHeapEntry) => nb.id;

    let v: BrandesHeapEntry,    //parent of w, at least one shortest path between s and w leads through v
      w: string,     //neighbour of v, lies one edge further than v from s, type id nodeID, alias string (got from AdjListDict)
      sigma: { [key: string]: number } = {}, //number of shortest paths from source s to each node
      dist: { [key: string]: number } = {},  //distances from source node s to each node
      closedNodes: { [key: string]: boolean } = {},
      Q: $BH.BinaryHeap = new $BH.BinaryHeap($BH.BinaryHeapMode.MIN, evalPriority, evalObjID),
      delta: { [key: string]: number } = {},
      S: string[] = [],
      Pred: { [key: string]: string[] } = {};

    for (let n in adjListDict) {
      dist[n] = Number.POSITIVE_INFINITY;
      sigma[n] = 0;
      delta[n] = 0;
      Pred[n] = [];
    }

    for (let s in adjListDict) {

      closedNodes = {};
      dist[s] = 0;
      sigma[s] = 1;

      let source: BrandesHeapEntry = { id: s, best: 0 };
      Q.insert(source);

      while (Q.size() > 0) {

        v = Q.pop();
        let current_id = v.id;

        S.push(current_id);
        closedNodes[current_id] = true;

        let neighbors = adjListDict[current_id];
        for (let w in neighbors) {

          if (closedNodes[w]) {
            continue;
          }

          let new_dist = dist[current_id] + neighbors[w];
          let nextNode: BrandesHeapEntry = { id: w, best: dist[w] };
          if (dist[w] > new_dist) {
            if (isFinite(dist[w])) { //this means the node has already been encountered
              let x = Q.remove(nextNode);
              nextNode.best = new_dist;
              Q.insert(nextNode);
            }
            else {
              nextNode.best = new_dist;
              Q.insert(nextNode);
            }
            sigma[w] = 0;
            dist[w] = new_dist;
            Pred[w] = [];
          }

          if (dist[w] === new_dist) {
            sigma[w] += sigma[current_id];
            Pred[w].push(current_id);
          }
        }
      }
      //and here the back-propagation
      while (S.length >= 1) {
        w = S.pop();
        for (let parent of Pred[w]) {
          //do frontier nodes get this too, or targetSet nodes only?
          let multi = skeleton.getDirEdgeByNodeIDs(parent, w).getFeature("sigma");
          delta[parent] += (sigma[parent] / sigma[w] * multi * (1 + delta[w]));

          if (skeleton.getNodeById(parent).getFeature("frontier") && skeleton.getNodeById(w).getFeature("frontier")) {
            //every node that lie on the path between w and its parent need to be scored
            let currPart = skeleton.getNodeById(parent).getFeature("partition");
            let currDist = DijkstraResults[currPart].dist[s];
            let currSigma = DijkstraResults[currPart].sigma[s];
            let shortestD = adjListDict[parent][w];
            for (let key in currDist) {
              //check if a node is in a shortest path
              if (key !== parent && key !== w && currDist[parent][key] + currDist[key][w] === shortestD) {
                let deltaKey = (currSigma[parent][key] / currSigma[parent][w] * (1 + delta[w]));
              }
            }

          }
        }
        if (w != s) {
          BCdict[w] += delta[w];
        }

        // reset
        dist[w] = 0;
        sigma[w] = 0;
        delta[w] = 0;
        Pred[w] = [];
      }
    }
  }
  //case without targetSet needs to be added here

}


function BrandesDCmain(graph: $G.IGraph, targetSet?: { [key: string]: boolean }): {} {
  //TODO LATER: a better partitioning algorithm comes here 
  let partitions = fakePartition(graph);

  let skeleton = new $G.BaseGraph("skeleton");

  //the prepareSuperNode method adds all frontier (+target) nodes and interSN edges to the skeleton graph already
  let superNodes =
    targetSet ? prepareSuperNode(graph, skeleton, partitions, targetSet) : prepareSuperNode(graph, skeleton, partitions);

  let parts = superNodes.partitions;
  let intraSN = superNodes.intraSNedges;
  let frontiers = superNodes.frontiersDict;
  //allResults contains all dist and sigma values for node pairs of each partition
  let allResults = {};
  let BCdict = {};
  let nodes = graph.getNodes();
  for (let key in nodes) {
    BCdict[key] = 0;
  }

  //TODO LATER: instead of this simple for loop, these will be processed by multiple threads
  for (let key in parts) {
    let result = Dijkstra_SK(parts[key], intraSN[key], graph, BCdict, (targetSet !== undefined));
    allResults[key] = result;
  }

  //add missing edges to the skeleton graph: edges that connect frontiers of the same partition
  for (let part in frontiers) {
    for (let f in frontiers[part]) {
      for (let ff in frontiers[part]) {
        if (f !== ff) {
          let edgeToAdd = new $E.BaseEdge(part + "_" + f + "_" + ff, skeleton.getNodeById(f), skeleton.getNodeById(ff),
            { directed: true, weighted: true, weight: allResults[part].dist[f][ff] },
            { "partition": part, "sigma": allResults[part].sigma[f][ff] });
          skeleton.addEdge(edgeToAdd);
        }
      }
    }
  }

  targetSet !== undefined ? Brandes_SK(skeleton, allResults, frontiers, BCdict, targetSet) : Brandes_SK(skeleton, allResults, frontiers, BCdict);



  return BCdict;
}


export { fakePartition, prepareSuperNode, Dijkstra_SK, BrandesDCmain }