"use strict";
/// <reference path="../../typings/tsd.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var $G = require("../core/Graph");
var $N = require("../core/Nodes");
var $JO = require("../search/Johnsons");
var $BF = require("../search/BellmanFord");
var $BH = require("../datastructs/binaryHeap");
//do a fake partitioning - will be replaced with a real one later
function fakePartition(graph) {
    //check for negative cycles/edges, and stop/reweigh accordingly
    if (graph.hasNegativeEdge()) {
        var extraNode = new $N.BaseNode("extraNode");
        graph = $JO.addExtraNandE(graph, extraNode);
        var BFresult = $BF.BellmanFordDict(graph, extraNode);
        if (BFresult.neg_cycle) {
            throw new Error("The graph contains a negative cycle, thus it can not be processed");
        }
        else {
            var newWeights = BFresult.distances;
            graph = $JO.reWeighGraph(graph, newWeights, extraNode);
            graph.deleteNode(extraNode);
        }
    }
    var nodes = graph.getNodes();
    var N = Object.keys(nodes).length;
    var part1 = {};
    var part2 = {};
    var result = {};
    var i = 0;
    //do the fake partitioning
    for (var node in nodes) {
        var actualNode = nodes[node];
        if (i++ <= N / 2 - 1) {
            //now true is put in for all, later a change to false means deletion (but faster)
            part1[actualNode.getID()] = true;
        }
        else {
            part2[actualNode.getID()] = true;
        }
    }
    var partCount = 0;
    result[partCount++] = part1;
    result[partCount++] = part2;
    return result;
}
exports.fakePartition = fakePartition;
//one function to handle Brandes++ and Brandes++All (with and without target node set)
//LOGIC: partitions are labeled with integers starting with 0. Target nodes, if any, will be labeled as partition -1
function prepareSuperNode(graph, skeleton, partitions, targetSet) {
    //intraSN edges will be sorted similarly as the nodes in the partitions object
    var intraSNedges = {};
    var frontiersDict = {};
    //first label each node with partition number and label as non-frontier
    for (var part in partitions) {
        var dict = partitions[part];
        intraSNedges[part] = {};
        frontiersDict[part] = {};
        for (var id in dict) {
            var node = graph.getNodeById(id);
            //TODO: dont put this info in the features, but into the partitions object!
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
    var dirEdges = graph.getDirEdgesArray();
    var undEdges = graph.getUndEdgesArray();
    var allEdges = dirEdges;
    for (var _i = 0, undEdges_1 = undEdges; _i < undEdges_1.length; _i++) {
        var edge = undEdges_1[_i];
        allEdges.push(edge);
    }
    //interSN edges soon get their characteristic tuples
    var interSNedges = {};
    var nodeIDsInSK = {};
    for (var _a = 0, allEdges_1 = allEdges; _a < allEdges_1.length; _a++) {
        var edge = allEdges_1[_a];
        var ends = edge.getNodes();
        var a_part = ends["a"].getFeatures().partition;
        var b_part = ends["b"].getFeatures().partition;
        //interSN edge
        //if one end node is a target node, it is automatically an interSN edge!
        if (a_part !== b_part || a_part === -1 || b_part === -1) {
            ends["a"].setFeature("frontier", true);
            ends["b"].setFeature("frontier", true);
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
            //TODO: substitute with new and simpler function
            skeleton.addEdgeByNodeIDs(edge.getID(), ends["a"].getID(), ends["b"].getID(), { directed: edge.isDirected(), weighted: true, weight: edge.getWeight() });
        }
        //intraSN edge
        else {
            //only a boolean is put in, later all edge properties can be obtained from the graph object
            intraSNedges[a_part][edge.getID()] = true;
        }
    }
    return { partitions: partitions, intraSNedges: intraSNedges, interSNedges: interSNedges, frontiersDict: frontiersDict };
}
exports.prepareSuperNode = prepareSuperNode;
//TOD: think it over, do I need parents here, and delta, too?
function Dijkstra_SK(nodeList, edgeList, graph) {
    //first make the adjListDict
    var adjListDict = {};
    for (var key in nodeList) {
        if (nodeList[key] === true) {
            adjListDict[key] = {};
        }
    }
    for (var edgeID in edgeList) {
        var edge = graph.getEdgeById(edgeID);
        var ends = edge.getNodes();
        adjListDict[ends.a.getID()][ends.b.getID()] = edge.getWeight();
        if (!edge.isDirected) {
            adjListDict[ends.b.getID()][ends.a.getID()] = edge.getWeight();
        }
    }
    var evalPriority = function (nb) { return nb.best; };
    var evalObjID = function (nb) { return nb.id; };
    var v, //parent of w, at least one shortest path between s and w leads through v
    w, //neighbour of v, lies one edge further than v from s, type id nodeID, alias string (got from AdjListDict)
    frontierCounter, sigma = {}, //number of shortest paths from source s to each node as goal node
    dist = {}, //distances from source node s to each node
    closedNodes = {}, Q = new $BH.BinaryHeap($BH.BinaryHeapMode.MIN, evalPriority, evalObjID);
    //eventual target nodes are not represented in the adjListDict, that's why it isbetter to use that instead of the nodeList
    for (var n in adjListDict) {
        dist[n] = {};
        sigma[n] = {};
        for (var nn in adjListDict) {
            dist[n][nn] = Number.POSITIVE_INFINITY;
            sigma[n][nn] = 0;
            closedNodes[nn] = false;
        }
    }
    for (var s in adjListDict) {
        dist[s][s] = 0;
        sigma[s][s] = 1;
        frontierCounter = 0;
        var source = { id: s, best: 0 };
        Q.insert(source);
        while (Q.size() > 0) {
            v = Q.pop();
            var current_id = v.id;
            if (graph.getNodeById(current_id).getFeature("frontier")) {
                frontierCounter++;
            }
            closedNodes[current_id] = true;
            if (frontierCounter > 2 && graph.getNodeById(current_id).getFeature("frontier")) {
                continue;
            }
            var neighbors = adjListDict[current_id];
            for (var w_1 in neighbors) {
                if (closedNodes[w_1]) {
                    continue;
                }
                var new_dist = dist[s][current_id] + neighbors[w_1];
                var nextNode = { id: w_1, best: dist[s][w_1] };
                if (dist[s][w_1] > new_dist) {
                    if (isFinite(dist[s][w_1])) { //this means the node has already been encountered
                        var x = Q.remove(nextNode);
                        nextNode.best = new_dist;
                        Q.insert(nextNode);
                    }
                    else {
                        nextNode.best = new_dist;
                        Q.insert(nextNode);
                    }
                    sigma[s][w_1] = 0;
                    dist[s][w_1] = new_dist;
                }
                if (dist[s][w_1] === new_dist) {
                    sigma[s][w_1] += sigma[s][current_id];
                }
            }
        }
        //re-initializing the closed nodes dictionary
        for (var n in closedNodes) {
            closedNodes[n] = false;
        }
    }
    return { sigma: sigma, dist: dist };
}
exports.Dijkstra_SK = Dijkstra_SK;
function BrandesDCmain(graph, targetSet) {
    //TODO: a better partitioning algorithm comes here 
    var partitions = fakePartition(graph);
    var skeleton = new $G.BaseGraph("skeleton");
    //the prepareSuperNode method adds all frontier (+target) nodes and interSN edges to the skeleton graph already
    var superNodes;
    if (targetSet) {
        superNodes = prepareSuperNode(graph, skeleton, partitions, targetSet);
    }
    else {
        superNodes = prepareSuperNode(graph, skeleton, partitions);
    }
    var parts = superNodes.partitions;
    var intraSN = superNodes.intraSNedges;
    var frontiers = superNodes.frontiersDict;
    var allResults = {};
    //TODO: instead of this simple for loop, these will be processed by multiple threads
    for (var key in parts) {
        var result = Dijkstra_SK(parts[key], intraSN[key], graph);
        allResults[key] = result;
    }
    //add missing edges to the skeleton graph: edges that connect frontiers of the same partition
    for (var part in frontiers) {
        for (var f in frontiers[part]) {
            for (var ff in frontiers[part]) {
                if (f !== ff) {
                    skeleton.addEdgeByNodeIDs(part + "_" + f + "_" + ff, f, ff, { directed: true, weighted: true, weight: allResults[part].dist[f][ff] });
                }
            }
        }
    }
    //TODO: put the sigma of the edge into the edge features!
    return skeleton;
}
exports.BrandesDCmain = BrandesDCmain;
