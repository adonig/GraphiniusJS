/// <reference path="../../typings/tsd.d.ts" />

import * as $G from '../core/Graph';
import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
import * as $P from '../search/PFS';
import * as $JO from '../search/Johnsons';
import * as $SU from '../utils/structUtils';
import * as $BH from '../datastructs/binaryHeap';


//do a fake partitioning - will be replaced with a real one later

function fakePartition(graph: $G.IGraph): {} {
  let nodes = graph.getNodes();
  let N = Object.keys(nodes).length;
  let part1 = {};
  let part2 = {};
  let result = {};
  let i = 0;

  //do the fake partitioning
  for (let node in nodes) {
    let actualNode = nodes[node];
    if (i <= N / 2 - 1) {
      //just putting in a value, will not be used
      part1[actualNode.getID()] = 1;
    }
    else {
      part2[actualNode.getID()] = 1;
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
    let dict = partitions[part];
    for (let id in dict) {
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
      //sort intraSN nodes at this point?
      intraSNedges[edge.getID()] = ends["a"].getFeatures().partition;
    }
  }
  //basically, we are ready to start the Brandes
  //pack partitions nodes+intraNS edges into separate objects?
  }

//argument "favorites": keys should be the string IDs of the nodes. Values can be node, number, anything, they will not be needed.
function prepareSuperNodeWithFavs(graph: $G.IGraph, partitions: {}, favorites: {}) {
  //first label each node with partition number and label as non-frontier
  let i = 0;
  for (let part in partitions) {
    let dict = partitions[part];
    for (let id in dict) {
      //favorite nodes need to be removed from the partitions - they will be supernodes by themselves
      if (favorites[id] !== undefined) {
        delete dict[id];
        let node: $N.IBaseNode = graph.getNodeById(id);
        node.setFeatures({ "partition": null, "frontier": false });
      }
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

    //edges which connect at least one favorite node are always interSN edges
    if (a_part === null || b_part === null) {
      a_part === null ? ends["a"].setFeature("frontier", false) : ends["a"].setFeature("frontier", true);
      b_part === null ? ends["b"].setFeature("frontier", false) : ends["b"].setFeature("frontier", true);
      interSNedges[edge.getID()] = { "sigma": 1, "dist": edge.getWeight() };
    }
    //"real" interSN edge
    else if (a_part !== b_part) {
      ends["a"].setFeature("frontier", true);
      ends["b"].setFeature("frontier", true);
      interSNedges[edge.getID()] = { "sigma": 1, "dist": edge.getWeight() };
    }
    //intraSN edge
    else {
      //no need to change the endnodes (frontier:false is set already)
      //sort intraSN nodes at this point?
      intraSNedges[edge.getID()] = ends["a"].getFeatures().partition;
    }
  }
  //basically, we are ready to start the Brandes

  
}

//reminder: only max 2 frontier nodes per path!
function BrandesForSuperNode(graph: $G.IGraph, partition: {}) {
  //do we need these? May not hurt...
  if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
    throw new Error("Cowardly refusing to traverse graph without edges.");
  }
  //do we need these? May not hurt...
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

  //how to get an AdjListDict here?

  //variables needed: 
  //source, current, next nodes
  //sigma, dist, closedNodes, heap, frontierCrossed (number, initialize to zero, no heap entry from frontier if it is >=2)
  //return value will be a 2-level-dict





}

export { fakePartition, prepareSuperNode, prepareSuperNodeWithFavs, BrandesForSuperNode }