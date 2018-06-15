/// <reference path="../../typings/tsd.d.ts" />

import * as $G from '../core/Graph';
import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
import * as $P from '../search/PFS';
import * as $JO from '../search/Johnsons';
import * as $BF from '../search/BellmanFord';
import * as $SU from '../utils/structUtils';
import * as $BH from '../datastructs/binaryHeap';
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
function prepareSuperNode(graph: $G.IGraph, skeleton: $G.IGraph, partitions: {}, targetSet?: { [key: string]: boolean }) {

  /**
   * skeleton is an empty graph here, by default, right?
   * @todo then I would take the parameter out and initialize an empty graph inside of this function
   */

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
  /**
   * @todo Don't we have a function for that in some utils?? think so...
   */
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

    /**
     * @todo would write ends.a|.b instead of ends["a"] => just makes it clear it's a defined property somewhere
     */
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

      //similar to nodes, partition of -1 means it is an interSN edge
      edge.setFeatures({ "partition": -1, "sigma": 1 });
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
  return { partitions, intraSNedges, frontiersDict };
}

export interface BrandesHeapEntry {
  id: string;
  best: number;
}

function Dijkstra_SK(nodeList: {}, edgeList: {}, graph: $G.IGraph, BCdict: { [key: string]: number }) {
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

  //eventual target nodes are not represented in the adjListDict, that's why it is better to use that instead of the nodeList
  for (let n in adjListDict) {
    dist[n] = {};
    sigma[n] = {};
    for (let nn in adjListDict) {
      dist[n][nn] = Number.POSITIVE_INFINITY;
      sigma[n][nn] = 0;
    }
  }

  /**
   * @todo definitely abstract out to Brandes.ts => split up the methods there!!
   * => This just results in too much code...
   */
  //here this is just a graph traversal (a specialized Dijkstra's)
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
  return { sigma, dist };
}

function Brandes_SK(skeleton: $G.IGraph, DijkstraResults: {}, frontiersDict: { [key: string]: { [key: string]: boolean } }, BCdict: {}, targetSet?: {}): void {
  //this needs to be different if there is /isn't a targetSet
  //lets first write both, then we can think how to simplify

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

  for (let s in targetSet) {

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
        let multi = skeleton.getUndEdgeByNodeIDs(parent, w).getFeature("sigma");
        if (skeleton.getNodeById(w).getFeature("frontier")) {
          delta[parent] += (sigma[parent] / sigma[w] * multi * (0 + delta[w]));
        }
        else {
          //target nodes (if target set is given) are not frontiers so they lead to here
          delta[parent] += (sigma[parent] / sigma[w] * multi * (1 + delta[w]));
        }
      }

      if (w !== s) {
        BCdict[w] += delta[w];
      }
      //careful! one can not empty the dictionary items here, because they are still needed!
    }

    //the skeleton nodes are finished by now, now lets find and score the on-path nodes
    if (targetSet) {
      for (let targetID in targetSet) {
        if (targetID === s) {
          continue;
        }
        for (let partID in frontiersDict) {
          for (let frontID in frontiersDict[partID]) {
            if (dist[s][targetID] === dist[s][frontID] + dist[frontID][targetID]) {
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

    //no target-set
    else {
      for (let part_i in DijkstraResults) {
        for (let part_j in DijkstraResults) {
          if (part_i !== part_j) {
            let sourceDist = DijkstraResults[part_i][1];
            let targetDist = DijkstraResults[part_j][1];
            let sourceSigma = DijkstraResults[part_i][0];
            let targetSigma = DijkstraResults[part_j][0];

            let sourceFronts = frontiersDict[part_i];
            let targetFronts = frontiersDict[part_j];

            let srcFrontNode = [];
            let tgtFrontNode = [];
            let shortestDist = Number.POSITIVE_INFINITY;

            for (let sourceID in sourceDist) {
              for (let targetID in targetDist) {
                //find the shortest path and identify the two frontier-"endpoints"
                for (let scrFront in sourceFronts) {
                  for (let tgtFront in targetFronts) {
                    if ((sourceDist[sourceID][scrFront] + dist[scrFront][tgtFront] + targetDist[tgtFront][targetID]) < shortestDist) {
                      shortestDist = sourceDist[sourceID][scrFront] + dist[scrFront][tgtFront] + targetDist[tgtFront][targetID];
                      srcFrontNode = [];
                      srcFrontNode.push(scrFront);
                      tgtFrontNode = [];
                      tgtFrontNode.push(tgtFront);
                    }
                    if ((sourceDist[sourceID][scrFront] + dist[scrFront][tgtFront] + targetDist[tgtFront][targetID]) === shortestDist) {
                      srcFrontNode.push(scrFront);
                      tgtFrontNode.push(tgtFront);
                    }
                  }
                }

                //scoring between target and tgtFront(s)
                for (let tgtFr of tgtFrontNode) {
                  for (let nodeID in targetDist) {
                    if (nodeID === targetID || nodeID === tgtFr) {
                      continue;
                    }
                    //find nodes in the target partition that are on-path and score them
                    if (targetDist[targetID][tgtFr] = targetDist[targetID][nodeID] + targetDist[nodeID][tgtFr]) {
                      delta[nodeID] = targetSigma[targetID][nodeID] * targetSigma[nodeID][tgtFr] / targetSigma[targetID][tgtFr] * (1 + delta[targetID]);
                      BCdict[nodeID] += delta[nodeID];
                    }
                  }
                }

                //now score between tgtFront(s) and srcFront(s)
                for (let i = 0; i < srcFrontNode.length; i++) {
                  let srcFront = srcFrontNode[i];
                  let tgtFront = tgtFrontNode[i];

                  for (let partID in frontiersDict) {
                    for (let frontID in frontiersDict[partID]) {
                      if (frontID === srcFront || frontID === tgtFront) {
                        continue;
                      }
                      if (dist[srcFront][tgtFront] === dist[srcFront][frontID] + dist[frontID][tgtFront]) {
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

                  //scoring between srcFront(s) and source
                  for (let srcFr of srcFrontNode) {
                    for (let nodeID in sourceDist) {
                      if (nodeID === sourceID || nodeID === srcFr) {
                        continue;
                      }
                      //find nodes in the target partition that are on-path and score them
                      if (sourceDist[sourceID][nodeID] = sourceDist[sourceID][nodeID] + sourceDist[nodeID][srcFr]) {
                        delta[nodeID] = targetSigma[sourceID][nodeID] * targetSigma[nodeID][srcFr] / targetSigma[sourceID][srcFr] * (1 + delta[srcFr]);
                        BCdict[nodeID] += delta[nodeID];
                      }
                    }
                  }
                }
              }
            }
          }
          //case: i===j
          else {
            //shortest path stays either in the SN or leaves the SN
            let currentDist = DijkstraResults[part_i][1];
            let currentSigma = DijkstraResults[part_i][0];
            let currentFronts = frontiersDict[part_i];

            for (let src in currentDist) {
              for (let tgt in currentDist) {
                if (src === tgt) {
                  continue;
                }
                let shortestDist = currentDist[src][tgt];
                let scoreShortest = true;
                let scoreOutgoing = false;
                let outgoingSrcFront = [];
                let outgoingTgtFront = [];


                //check if there is any shorter path leaving the SN
                for (let partID in frontiersDict) {
                  for (let frontID in frontiersDict[partID]) {
                    for (let localFront1 in frontiersDict[part_i]) {
                      for (let localFront2 in frontiersDict[part_i]) {
                        if (localFront1 === localFront2) {
                          continue;
                        }
                        //such a path is found and it is shorter
                        if (partID !== part_i &&
                          currentDist[src][localFront1] + dist[localFront1][frontID] + dist[frontID][localFront2] + currentDist[localFront2][tgt] < shortestDist) {
                          shortestDist = currentDist[src][localFront1] + dist[localFront1][frontID] + dist[frontID][localFront2] + currentDist[localFront2][tgt];
                          outgoingSrcFront = [];
                          outgoingSrcFront.push(localFront1);
                          outgoingTgtFront = [];
                          outgoingTgtFront.push(localFront2);
                          scoreShortest = false;
                          scoreOutgoing = true;
                        }
                        else if (partID !== part_i &&
                          currentDist[src][localFront1] + dist[localFront1][frontID] + dist[frontID][localFront2] + currentDist[localFront2][tgt] === shortestDist) {
                          outgoingSrcFront.push(localFront1);
                          outgoingTgtFront.push(localFront2);
                          scoreOutgoing = true;
                        }
                        if (scoreOutgoing === true) {
                          for (let i = 0; i < outgoingSrcFront.length; i++) {
                            let srcFront = outgoingSrcFront[i];
                            let tgtFront = outgoingTgtFront[i];

                            //score nodes between target and tgtFront
                            for (let nodeID in currentDist) {
                              if (nodeID === tgt || nodeID === tgtFront) {
                                continue;
                              }
                              //find nodes in the target partition that are on-path and score them
                              if (currentDist[tgt][tgtFront] = currentDist[tgt][nodeID] + currentDist[nodeID][tgtFront]) {
                                delta[nodeID] = currentSigma[tgt][nodeID] * currentSigma[nodeID][tgtFront] / currentSigma[tgt][tgtFront] * (1 + delta[tgt]);
                                BCdict[nodeID] += delta[nodeID];
                              }
                            }

                            //scoring nodes between two frontiers
                            for (let partID in frontiersDict) {
                              for (let frontID in frontiersDict[partID]) {
                                if (frontID === srcFront || frontID === tgtFront) {
                                  continue;
                                }
                                if (dist[srcFront][tgtFront] === dist[srcFront][frontID] + dist[frontID][tgtFront]) {
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
                                          delta[nodeID] =
                                            (sigma[s][parentID] * actualSigma[parentID][nodeID] * sigma[nodeID][frontID] / sigma[s][frontID] * (0 + delta[frontID]));
                                          BCdict[nodeID] += delta[nodeID];
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                            //score nodes between source and srcFront
                            for (let nodeID in currentDist) {
                              if (nodeID === src || nodeID === srcFront) {
                                continue;
                              }
                              //find nodes in the target partition that are on-path and score them
                              if (currentDist[src][srcFront] = currentDist[src][nodeID] + currentDist[nodeID][srcFront]) {
                                delta[nodeID] = currentSigma[src][nodeID] * currentSigma[nodeID][srcFront] / currentSigma[src][srcFront] * (1 + delta[srcFront]);
                                BCdict[nodeID] += delta[nodeID];
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
                if (scoreShortest) {
                  for (let nodeID in currentDist) {
                    if (nodeID === src || nodeID === tgt) {
                      continue;
                    }
                    if (currentDist[src][nodeID] + currentDist[nodeID][tgt] === currentDist[src][tgt]) {
                      delta[nodeID] = currentSigma[src][nodeID] * currentSigma[nodeID][tgt] / currentSigma[src][tgt] + (1 + delta[tgt]);
                      BCdict[nodeID] += delta[nodeID];
                    }
                  }
                }
              }
            }
          }
        }
      }

      //re-initializing the dictionaries here
      for (let w in Pred) {
        dist[w] = Number.POSITIVE_INFINITY;
        sigma[w] = 0;
        delta[w] = 0;
        Pred[w] = [];
      }
    }
  }
}

function BrandesDCmain(graph: $G.IGraph, targetSet?: { [key: string]: boolean }): {} {
  //TODO LATER: a better partitioning algorithm comes here 
  let partitions = fakePartition(graph);

  let skeleton = new $G.BaseGraph("skeleton");

  //the prepareSuperNode method adds all frontier (+target) nodes and interSN edges to the skeleton graph already
  let superNodes =
    targetSet ? prepareSuperNode(graph, skeleton, partitions, targetSet) : prepareSuperNode(graph, skeleton, partitions);

  /**
   * @todo Destructuring!
   */
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

  //TODO LATER: these will be processed by multiple threads
  for (let key in parts) {
    let result = Dijkstra_SK(parts[key], intraSN[key], graph, BCdict);
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

  targetSet !== undefined ? Brandes_SK(skeleton, allResults, frontiers, BCdict, targetSet) : Brandes_SK(skeleton, allResults, frontiers, BCdict);


  return BCdict;
}


export { fakePartition, prepareSuperNode, Dijkstra_SK, BrandesDCmain }