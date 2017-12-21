"use strict";
var $SU = require('../utils/structUtils');
var GPU = require('gpu.js');
function FloydWarshallGPU(size) {
    var gpu = new GPU();
    var opt = {
        output: [size]
    };
    var execFW = gpu.createKernel(function () {
        return this.thread.x;
    }, opt);
    return execFW();
}
exports.FloydWarshallGPU = FloydWarshallGPU;
function initializeDistsWithEdges(graph) {
    var dists = {}, edges = $SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]);
    for (var edge in edges) {
        var a = edges[edge].getNodes().a.getID();
        var b = edges[edge].getNodes().b.getID();
        if (dists[a] == null)
            dists[a] = {};
        dists[a][b] = (isNaN(edges[edge].getWeight()) ? 1 : edges[edge].getWeight());
        if (!edges[edge].isDirected()) {
            if (dists[b] == null)
                dists[b] = {};
            dists[b][a] = (isNaN(edges[edge].getWeight()) ? 1 : edges[edge].getWeight());
        }
    }
    return dists;
}
function FloydWarshallAPSP(graph) {
    if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
        throw new Error("Cowardly refusing to traverse graph without edges.");
    }
    var dists = graph.adjListArray();
    var next = graph.nextArray();
    var N = dists.length;
    for (var k = 0; k < N; ++k) {
        for (var i = 0; i < N; ++i) {
            for (var j = 0; j < N; ++j) {
                if (dists[i][j] == (dists[i][k] + dists[k][j]) && k != i && k != j) {
                    next[i][j] = $SU.mergeOrderedArraysNoDups(next[i][j], next[i][k]);
                }
                if ((!dists[i][j] && dists[i][j] != 0) || (dists[i][j] > dists[i][k] + dists[k][j])) {
                    next[i][j] = next[i][k].slice(0);
                    dists[i][j] = dists[i][k] + dists[k][j];
                }
            }
        }
    }
    return [dists, next];
}
exports.FloydWarshallAPSP = FloydWarshallAPSP;
function FloydWarshallArray(graph) {
    if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
        throw new Error("Cowardly refusing to traverse graph without edges.");
    }
    var dists = graph.adjListArray();
    var N = dists.length;
    for (var k = 0; k < N; ++k) {
        for (var i = 0; i < N; ++i) {
            for (var j = 0; j < N; ++j) {
                if (dists[i][j] > dists[i][k] + dists[k][j]) {
                    dists[i][j] = dists[i][k] + dists[k][j];
                }
            }
        }
    }
    return dists;
}
exports.FloydWarshallArray = FloydWarshallArray;
function FloydWarshallDict(graph) {
    if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
        throw new Error("Cowardly refusing to traverse graph without edges.");
    }
    var dists = initializeDistsWithEdges(graph);
    for (var k in dists) {
        for (var i in dists) {
            for (var j in dists) {
                if (i === j) {
                    continue;
                }
                if (dists[i][k] == null || dists[k][j] == null) {
                    continue;
                }
                if ((!dists[i][j] && dists[i][j] != 0) || (dists[i][j] > dists[i][k] + dists[k][j])) {
                    dists[i][j] = dists[i][k] + dists[k][j];
                }
            }
        }
    }
    return dists;
}
exports.FloydWarshallDict = FloydWarshallDict;
