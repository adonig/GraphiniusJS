"use strict";
/// <reference path="../../../typings/tsd.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const $G = require("../../core/Graph");
const $R = require("../../utils/remoteUtils");
const logger_1 = require("../../utils/logger");
let logger = new logger_1.Logger();
const DEFAULT_WEIGHT = 1;
const CSV_EXTENSION = ".csv";
class CSVInput {
    constructor(_separator = ',', _explicit_direction = true, _direction_mode = false, _weighted = false) {
        this._separator = _separator;
        this._explicit_direction = _explicit_direction;
        this._direction_mode = _direction_mode;
        this._weighted = _weighted;
    }
    readFromAdjacencyListURL(config, cb) {
        this.readGraphFromURL(config, cb, this.readFromAdjacencyList);
    }
    readFromEdgeListURL(config, cb) {
        this.readGraphFromURL(config, cb, this.readFromEdgeList);
    }
    readGraphFromURL(config, cb, localFun) {
        var self = this, graph_name = config.file_name, graph, request;
        // Node or browser ??
        if (typeof window !== 'undefined') {
            let fileurl = config.remote_host + config.remote_path + config.file_name + CSV_EXTENSION;
            logger.log(`Requesting file via XMLHTTPRequest: ${fileurl}`);
            // Browser...
            request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    var input = request.responseText.split('\n');
                    graph = localFun.apply(self, [input, graph_name]);
                    cb(graph, undefined);
                }
            };
            request.open("GET", fileurl, true);
            request.setRequestHeader('Content-Type', 'text/csv; charset=ISO-8859-1');
            request.send();
        }
        else {
            // Node.js
            $R.retrieveRemoteFile(config, function (raw_graph) {
                var input = raw_graph.toString().split('\n');
                graph = localFun.apply(self, [input, graph_name]);
                cb(graph, undefined);
            });
        }
    }
    readFromAdjacencyListFile(filepath) {
        return this.readFileAndReturn(filepath, this.readFromAdjacencyList);
    }
    readFromEdgeListFile(filepath) {
        return this.readFileAndReturn(filepath, this.readFromEdgeList);
    }
    readFileAndReturn(filepath, func) {
        this.checkNodeEnvironment();
        var graph_name = path.basename(filepath);
        var input = fs.readFileSync(filepath).toString().split('\n');
        return func.apply(this, [input, graph_name]);
    }
    readFromAdjacencyList(input, graph_name) {
        var graph = new $G.BaseGraph(graph_name);
        for (var idx in input) {
            var line = input[idx], elements = this._separator.match(/\s+/g) ? line.match(/\S+/g) : line.replace(/\s+/g, '').split(this._separator), node_id = elements[0], node, edge_array = elements.slice(1), edge, target_node_id, target_node, dir_char, directed, edge_id, edge_id_u2;
            if (!node_id) {
                // end of file or empty line, just treat like an empty line...
                continue;
            }
            node = graph.hasNodeID(node_id) ? graph.getNodeById(node_id) : graph.addNodeByID(node_id);
            for (var e = 0; e < edge_array.length;) {
                if (this._explicit_direction && (!edge_array || edge_array.length % 2)) {
                    throw new Error('Every edge entry has to contain its direction info in explicit mode.');
                }
                target_node_id = edge_array[e++];
                target_node = graph.hasNodeID(target_node_id) ? graph.getNodeById(target_node_id) : graph.addNodeByID(target_node_id);
                /**
                 * The direction determines if we have to check for the existence
                 * of an edge in 'both' directions or only from one node to the other
                 * Within the CSV module this check is done simply via ID check,
                 * as we are following a rigorous naming scheme anyways...
                 */
                dir_char = this._explicit_direction ? edge_array[e++] : this._direction_mode ? 'd' : 'u';
                if (dir_char !== 'd' && dir_char !== 'u') {
                    throw new Error("Specification of edge direction invalid (d and u are valid).");
                }
                directed = dir_char === 'd';
                edge_id = node_id + "_" + target_node_id + "_" + dir_char;
                edge_id_u2 = target_node_id + "_" + node_id + "_" + dir_char;
                if (graph.hasEdgeID(edge_id) || (!directed && graph.hasEdgeID(edge_id_u2))) {
                    // The completely same edge should only be added once...
                    continue;
                }
                else {
                    edge = graph.addEdgeByID(edge_id, node, target_node, { directed: directed });
                }
            }
        }
        return graph;
    }
    readFromEdgeList(input, graph_name, weighted = false) {
        var graph = new $G.BaseGraph(graph_name);
        for (var idx in input) {
            var line = input[idx], elements = this._separator.match(/\s+/g) ? line.match(/\S+/g) : line.replace(/\s+/g, '').split(this._separator);
            if (!elements) {
                // end of file or empty line, just treat like an empty line...
                continue;
            }
            if (elements.length < 2 || elements.length > 3) {
                logger.log(elements);
                throw new Error('Edge list is in wrong format - every line has to consist of two entries (the 2 nodes)');
            }
            var node_id = elements[0], node, target_node, edge, target_node_id = elements[1], dir_char = this._explicit_direction ? elements[2] : this._direction_mode ? 'd' : 'u', directed, edge_id, edge_id_u2, parse_weight, edge_weight;
            node = graph.hasNodeID(node_id) ? graph.getNodeById(node_id) : graph.addNodeByID(node_id);
            target_node = graph.hasNodeID(target_node_id) ? graph.getNodeById(target_node_id) : graph.addNodeByID(target_node_id);
            if (dir_char !== 'd' && dir_char !== 'u') {
                throw new Error("Specification of edge direction invalid (d and u are valid).");
            }
            directed = dir_char === 'd';
            edge_id = node_id + "_" + target_node_id + "_" + dir_char;
            edge_id_u2 = target_node_id + "_" + node_id + "_" + dir_char;
            parse_weight = parseFloat(elements[2]);
            edge_weight = this._weighted ? (isNaN(parse_weight) ? DEFAULT_WEIGHT : parse_weight) : null;
            if (graph.hasEdgeID(edge_id) || (!directed && graph.hasEdgeID(edge_id_u2))) {
                // The completely same edge should only be added once...
                continue;
            }
            else if (this._weighted) {
                edge = graph.addEdgeByID(edge_id, node, target_node, { directed: directed, weighted: true, weight: edge_weight });
            }
            else {
                edge = graph.addEdgeByID(edge_id, node, target_node, { directed: directed });
            }
        }
        return graph;
    }
    checkNodeEnvironment() {
        if (typeof window !== 'undefined') {
            throw new Error('Cannot read file in browser environment.');
        }
    }
}
exports.CSVInput = CSVInput;
