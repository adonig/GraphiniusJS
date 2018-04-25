/// <reference path="../../typings/tsd.d.ts" />

import * as $G from '../core/Graph';
import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
import * as $P from '../search/PFS';
import * as $SU from '../utils/structUtils';
import * as $BH from '../datastructs/binaryHeap';

//do a fake partitioning - will be replaced with a real one later

function fakePartition(graph: $G.IGraph): {} {
  let nodes = graph.getNodes();
  let N = Object.keys(nodes).length;
  let part1: Array<string> = [];
  let part2: Array<string> = [];
  let result = {};
  let i = 0;

  //do the fake partitioning
  for (let node in nodes) {
    let actualNode = nodes[node];
    if (i <= N / 2 - 1) {
      part1.push(actualNode.getID());
    }
    else {
      part2.push(actualNode.getID());
    }
    i++;
  }
  result["part1"] = part1;
  result["part2"] = part2;

  return result;
}


function prepareSuperNode(graph: $G.IGraph, partitions: {}) {
  //first label each node with partition number and label as non-frontier
  let i = 0;
  for (let part in partitions) {
    let array = partitions[part];
    for (let id of array) {
      let node: $N.IBaseNode = graph.getNodeById(id);
      node.setFeatures({ "partition": i, "frontier": false });
    }
    i++;
  }

  //identify frontiers and label them in features,
  //at the same time, sort edges as interSN and intraSN
  let dirEdges = graph.getDirEdgesArray();
  let undEdges = graph.getUndEdgesArray();
  let allEdges = dirEdges;
  for (let edge of undEdges) {
    allEdges.push(edge);
  }

  for (let edge of allEdges) {
    let ends = edge.getNodes();
    let a_part = ends["a"].getFeatures().partition;
    let b_part = ends["b"].getFeatures().partition;
    //interSN edges soon get their characteristic tuples
    let interSNedges = {};
    //intraSN edges just get their partition number
    let intraSNedges = {};

    //interSN edge
    if (a_part !== b_part) {
      ends["a"].setFeature("frontier", true);
      ends["b"].setFeature("frontier", true);
      interSNedges[edge.getID()] = { "sigma": 1, "dist": edge.getWeight() };
    }
    //intraSN edge
    else {
      //no need to change the endnodes (frontier:false is set already)
      intraSNedges[edge.getID()] = ends["a"].getFeatures().partition;
    }
  }

  //basically, we are ready to start the Brandes
  //to note: only max 2 frontier nodes per path!




}

export { fakePartition, prepareSuperNode }