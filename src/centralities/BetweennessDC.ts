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
function prepareSuperNode(graph: $G.IGraph, partitions: {}, targetSet?: { [key: string]: boolean }) {
  //first label each node with partition number and label as non-frontier
  for (let part in partitions) {
    let dict = partitions[part];
    for (let id in dict) {
      let node: $N.IBaseNode = graph.getNodeById(id);

      //if it is a target node, we set its features accordingly and "remove" it from the partition
      if (targetSet && targetSet[id] !== undefined) {
        partitions[part][id] = false;
        node.setFeatures({ "partition": -1, "frontier": true });
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
  //intraSN edges will be sorted smilarly as the nodes in the partitions object
  let intraSNedges = {};
  for (let key in partitions){
    intraSNedges[key]={};
  }

  for (let edge of allEdges) {
    let ends = edge.getNodes();
    let a_part = ends["a"].getFeatures().partition;
    let b_part = ends["b"].getFeatures().partition;

    //interSN edge
    //if one end node is a target node, it is automatically an interSN edge!
    if (a_part !== b_part || a_part === -1 || b_part === -1) {
      ends["a"].setFeature("frontier", true);
      ends["b"].setFeature("frontier", true);
      interSNedges[edge.getID()] = { "sigma": 1, "dist": edge.getWeight() };
    }
    //intraSN edge
    else {
      //a simplified edge object is put in - then in the Brandes everything is there and the whole graph is not needed
      let edgeInfo = {};
      edgeInfo["a"] = ends["a"].getID();
      edgeInfo["b"] = ends["b"].getID();
      edgeInfo["isDir"] = edge.isDirected();
      edgeInfo["weight"] = edge.getWeight();
      intraSNedges[a_part][edge.getID()] = edgeInfo;
    }
  }
  return { partitions, intraSNedges, interSNedges };
}


function BrandesForSuperNode(nodeList: {}, edgeList: {}) {
  //first make the adjListDict
  let adjListDict = {};
  for (let key in nodeList) {
    if (nodeList[key]) {
      adjListDict[key] = {};
    }
  }

  for (let edgeID in edgeList) {
    let simpleEdge = edgeList[edgeID];
    adjListDict[simpleEdge.a][simpleEdge.b] = simpleEdge.weight;
    if (!simpleEdge.isDir) {
      adjListDict[simpleEdge.b][simpleEdge.a] = simpleEdge.weight;
    }
  }

  //temporary return statement for testing!
  return (adjListDict);

  //and here comes the Brandes
  //variables needed: 
  //source, current, next nodes
  //sigma, dist, closedNodes, heap, frontierCrossed (number, initialize to zero, no heap entry from frontier if it is >=2)
  //return value will be a 2-level-dict

  //think about return value...?

}

export { fakePartition, prepareSuperNode, BrandesForSuperNode }