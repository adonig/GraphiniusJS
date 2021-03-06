"use strict";
/// <reference path="../../typings/tsd.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const $N = require("./Nodes");
const $E = require("./Edges");
const $DS = require("../utils/structUtils");
const $BFS = require("../search/BFS");
const $DFS = require("../search/DFS");
const BellmanFord_1 = require("../search/BellmanFord");
const logger_1 = require("../utils/logger");
let logger = new logger_1.Logger();
const DEFAULT_WEIGHT = 1;
var GraphMode;
(function (GraphMode) {
    GraphMode[GraphMode["INIT"] = 0] = "INIT";
    GraphMode[GraphMode["DIRECTED"] = 1] = "DIRECTED";
    GraphMode[GraphMode["UNDIRECTED"] = 2] = "UNDIRECTED";
    GraphMode[GraphMode["MIXED"] = 3] = "MIXED";
})(GraphMode = exports.GraphMode || (exports.GraphMode = {}));
class BaseGraph {
    // protected _typed_nodes: { [type: string] : { [key: string] : $N.IBaseNode } };
    // protected _typed_dir_edges: { [type: string] : { [key: string] : $E.IBaseEdge } };
    // protected _typed_und_edges: { [type: string] : { [key: string] : $E.IBaseEdge } };
    constructor(_label) {
        this._label = _label;
        this._nr_nodes = 0;
        this._nr_dir_edges = 0;
        this._nr_und_edges = 0;
        this._mode = GraphMode.INIT;
        this._nodes = {};
        this._dir_edges = {};
        this._und_edges = {};
    }
    /**
     * Version 1: do it in-place (to the object you receive)
     * Version 2: clone the graph first, return the mutated clone
     */
    toDirectedGraph(copy = false) {
        let result_graph = copy ? this.clone() : this;
        // if graph has no edges, we want to throw an exception
        if (this._nr_dir_edges === 0 && this._nr_und_edges === 0) {
            throw new Error("Cowardly refusing to re-interpret an empty graph.");
        }
        return result_graph;
    }
    toUndirectedGraph() {
        return this;
    }
    /**
     * what to do if some edges are not weighted at all?
     * Since graph traversal algortihms (and later maybe graphs themselves)
     * use default weights anyways, I am simply ignoring them for now...
     * @todo figure out how to test this...
     */
    hasNegativeEdge() {
        let has_neg_edge = false, edge;
        // negative und_edges are always negative cycles
        //reminder: a return statement breaks out of the for loop and finishes the function
        for (let edge_id in this._und_edges) {
            edge = this._und_edges[edge_id];
            if (!edge.isWeighted()) {
                continue;
            }
            if (edge.getWeight() < 0) {
                return true;
            }
        }
        for (let edge_id in this._dir_edges) {
            edge = this._dir_edges[edge_id];
            if (!edge.isWeighted()) {
                continue;
            }
            if (edge.getWeight() < 0) {
                has_neg_edge = true;
                break;
            }
        }
        return has_neg_edge;
    }
    /**
     * Do we want to throw an error if an edge is unweighted?
     * Or shall we let the traversal algorithm deal with DEFAULT weights like now?
     */
    hasNegativeCycles(node) {
        if (!this.hasNegativeEdge()) {
            return false;
        }
        let negative_cycle = false, start = node ? node : this.getRandomNode();
        /**
         * Now do Bellman Ford over all graph components
         */
        $DFS.DFS(this, start).forEach(comp => {
            let min_count = Number.POSITIVE_INFINITY, comp_start_node;
            Object.keys(comp).forEach(node_id => {
                if (min_count > comp[node_id].counter) {
                    min_count = comp[node_id].counter;
                    comp_start_node = node_id;
                }
            });
            if (BellmanFord_1.BellmanFordArray(this, this._nodes[comp_start_node]).neg_cycle) {
                negative_cycle = true;
            }
        });
        return negative_cycle;
    }
    /**
     *
     * @param incoming
     */
    nextArray(incoming = false) {
        let next = [], node_keys = Object.keys(this._nodes);
        //?? - but AdjDict contains distance value only for the directly reachable neighbors for each node, not all!	
        //I do not understand but it works so it should be okay	
        const adjDict = this.adjListDict(incoming, true, 0);
        for (let i = 0; i < this._nr_nodes; ++i) {
            next.push([]);
            for (let j = 0; j < this._nr_nodes; ++j) {
                next[i].push([]);
                next[i][j].push(i === j ? j : isFinite(adjDict[node_keys[i]][node_keys[j]]) ? j : null);
            }
        }
        return next;
    }
    /**
     * This function iterates over the adjDict in order to use it's advantage
     * of being able to override edges if edges with smaller weights exist
     *
     * However, the order of nodes in the array represents the order of nodes
     * at creation time, no other implicit alphabetical or collational sorting.
     *
     * This has to be considered when further processing the result
     *
     * @param incoming whether or not to consider incoming edges as well
     * @param include_self contains a distance to itself apart?
     * @param self_dist default distance to self
     */
    adjListArray(incoming = false) {
        let adjList = [], node_keys = Object.keys(this._nodes);
        const adjDict = this.adjListDict(incoming, true, 0);
        for (let i = 0; i < this._nr_nodes; ++i) {
            adjList.push([]);
            for (let j = 0; j < this._nr_nodes; ++j) {
                adjList[i].push(i === j ? 0 : isFinite(adjDict[node_keys[i]][node_keys[j]]) ? adjDict[node_keys[i]][node_keys[j]] : Number.POSITIVE_INFINITY);
            }
        }
        return adjList;
    }
    /**
     *
     * @param incoming whether or not to consider incoming edges as well
     * @param include_self contains a distance to itself apart?
     * @param self_dist default distance to self
     */
    adjListDict(incoming = false, include_self = false, self_dist = 0) {
        let adj_list_dict = {}, nodes = this.getNodes(), cur_dist, key, cur_edge_weight;
        for (key in nodes) {
            adj_list_dict[key] = {};
            if (include_self) {
                adj_list_dict[key][key] = self_dist;
            }
        }
        for (key in nodes) {
            let neighbors = incoming ? nodes[key].reachNodes().concat(nodes[key].prevNodes()) : nodes[key].reachNodes();
            neighbors.forEach((ne) => {
                cur_dist = adj_list_dict[key][ne.node.getID()] || Number.POSITIVE_INFINITY;
                cur_edge_weight = isNaN(ne.edge.getWeight()) ? DEFAULT_WEIGHT : ne.edge.getWeight();
                if (cur_edge_weight < cur_dist) {
                    adj_list_dict[key][ne.node.getID()] = cur_edge_weight;
                    if (incoming) { // we need to update the 'inverse' entry as well
                        adj_list_dict[ne.node.getID()][key] = cur_edge_weight;
                    }
                }
                else {
                    adj_list_dict[key][ne.node.getID()] = cur_dist;
                    if (incoming) { // we need to update the 'inverse' entry as well
                        adj_list_dict[ne.node.getID()][key] = cur_dist;
                    }
                }
            });
        }
        return adj_list_dict;
    }
    getMode() {
        return this._mode;
    }
    getStats() {
        return {
            mode: this._mode,
            nr_nodes: this._nr_nodes,
            nr_und_edges: this._nr_und_edges,
            nr_dir_edges: this._nr_dir_edges,
            density_dir: this._nr_dir_edges / (this._nr_nodes * (this._nr_nodes - 1)),
            density_und: 2 * this._nr_und_edges / (this._nr_nodes * (this._nr_nodes - 1))
        };
    }
    nrNodes() {
        return this._nr_nodes;
    }
    nrDirEdges() {
        return this._nr_dir_edges;
    }
    nrUndEdges() {
        return this._nr_und_edges;
    }
    /**
     *
     * @param id
     * @param opts
     *
     * @todo addNode functions should check if a node with a given ID already exists -> node IDs have to be unique...
     */
    addNodeByID(id, opts) {
        if (this.hasNodeID(id)) {
            throw new Error("Won't add node with duplicate ID.");
        }
        var node = new $N.BaseNode(id, opts);
        return this.addNode(node) ? node : null;
    }
    addNode(node) {
        if (this.hasNodeID(node.getID())) {
            throw new Error("Won't add node with duplicate ID.");
        }
        this._nodes[node.getID()] = node;
        this._nr_nodes += 1;
        return true;
    }
    /**
     * Instantiates a new node object, copies the features and
     * adds the node to the graph, but does NOT clone it's edges
     * @param node the node object to clone
     */
    cloneAndAddNode(node) {
        let new_node = new $N.BaseNode(node.getID());
        new_node.setFeatures($DS.clone(node.getFeatures()));
        this._nodes[node.getID()] = new_node;
        this._nr_nodes += 1;
        return new_node;
    }
    hasNodeID(id) {
        return !!this._nodes[id];
    }
    getNodeById(id) {
        return this._nodes[id];
    }
    getNodes() {
        return this._nodes;
    }
    /**
     * CAUTION - This function takes linear time in # nodes
     */
    getRandomNode() {
        return this.pickRandomProperty(this._nodes);
    }
    deleteNode(node) {
        var rem_node = this._nodes[node.getID()];
        if (!rem_node) {
            throw new Error('Cannot remove un-added node.');
        }
        // Edges?
        var in_deg = node.inDegree();
        var out_deg = node.outDegree();
        var deg = node.degree();
        // Delete all edges brutally...
        if (in_deg) {
            this.deleteInEdgesOf(node);
        }
        if (out_deg) {
            this.deleteOutEdgesOf(node);
        }
        if (deg) {
            this.deleteUndEdgesOf(node);
        }
        delete this._nodes[node.getID()];
        this._nr_nodes -= 1;
    }
    hasEdgeID(id) {
        return !!this._dir_edges[id] || !!this._und_edges[id];
    }
    getEdgeById(id) {
        var edge = this._dir_edges[id] || this._und_edges[id];
        if (!edge) {
            throw new Error("cannot retrieve edge with non-existing ID.");
        }
        return edge;
    }
    checkExistanceOfEdgeNodes(node_a, node_b) {
        if (!node_a) {
            throw new Error("Cannot find edge. Node A does not exist (in graph).");
        }
        if (!node_b) {
            throw new Error("Cannot find edge. Node B does not exist (in graph).");
        }
    }
    // get the edge from node_a to node_b (or undirected)
    getDirEdgeByNodeIDs(node_a_id, node_b_id) {
        const node_a = this.getNodeById(node_a_id);
        const node_b = this.getNodeById(node_b_id);
        this.checkExistanceOfEdgeNodes(node_a, node_b);
        // check for outgoing directed edges
        let edges_dir = node_a.outEdges(), edges_dir_keys = Object.keys(edges_dir);
        for (let i = 0; i < edges_dir_keys.length; i++) {
            var edge = edges_dir[edges_dir_keys[i]];
            if (edge.getNodes().b.getID() == node_b_id) {
                return edge;
            }
        }
        // if we managed to arrive here, there is no edge!
        throw new Error(`Cannot find edge. There is no edge between Node ${node_a_id} and ${node_b_id}.`);
    }
    getUndEdgeByNodeIDs(node_a_id, node_b_id) {
        const node_a = this.getNodeById(node_a_id);
        const node_b = this.getNodeById(node_b_id);
        this.checkExistanceOfEdgeNodes(node_a, node_b);
        // check for undirected edges
        let edges_und = node_a.undEdges(), edges_und_keys = Object.keys(edges_und);
        for (let i = 0; i < edges_und_keys.length; i++) {
            var edge = edges_und[edges_und_keys[i]];
            var b;
            (edge.getNodes().a.getID() == node_a_id) ? (b = edge.getNodes().b.getID()) : (b = edge.getNodes().a.getID());
            if (b == node_b_id) {
                return edge;
            }
        }
    }
    getDirEdges() {
        return this._dir_edges;
    }
    getUndEdges() {
        return this._und_edges;
    }
    getDirEdgesArray() {
        let edges = [];
        for (let e_id in this._dir_edges) {
            edges.push(this._dir_edges[e_id]);
        }
        return edges;
    }
    getUndEdgesArray() {
        let edges = [];
        for (let e_id in this._und_edges) {
            edges.push(this._und_edges[e_id]);
        }
        return edges;
    }
    addEdgeByNodeIDs(label, node_a_id, node_b_id, opts) {
        var node_a = this.getNodeById(node_a_id), node_b = this.getNodeById(node_b_id);
        if (!node_a) {
            throw new Error("Cannot add edge. Node A does not exist");
        }
        else if (!node_b) {
            throw new Error("Cannot add edge. Node B does not exist");
        }
        else {
            return this.addEdgeByID(label, node_a, node_b, opts);
        }
    }
    /**
     * Now all test cases pertaining addEdge() call this one...
     */
    addEdgeByID(id, node_a, node_b, opts) {
        let edge = new $E.BaseEdge(id, node_a, node_b, opts || {});
        return this.addEdge(edge);
    }
    /**
     * Test cases should be reversed / completed
     */
    addEdge(edge) {
        let node_a = edge.getNodes().a, node_b = edge.getNodes().b;
        if (!this.hasNodeID(node_a.getID()) || !this.hasNodeID(node_b.getID())
            || this._nodes[node_a.getID()] !== node_a || this._nodes[node_b.getID()] !== node_b) {
            throw new Error("can only add edge between two nodes existing in graph");
        }
        // connect edge to first node anyways
        node_a.addEdge(edge);
        if (edge.isDirected()) {
            // add edge to second node too
            node_b.addEdge(edge);
            this._dir_edges[edge.getID()] = edge;
            this._nr_dir_edges += 1;
            this.updateGraphMode();
        }
        else {
            // add edge to both nodes, except they are the same...
            if (node_a !== node_b) {
                node_b.addEdge(edge);
            }
            this._und_edges[edge.getID()] = edge;
            this._nr_und_edges += 1;
            this.updateGraphMode();
        }
        return edge;
    }
    deleteEdge(edge) {
        var dir_edge = this._dir_edges[edge.getID()];
        var und_edge = this._und_edges[edge.getID()];
        if (!dir_edge && !und_edge) {
            throw new Error('cannot remove non-existing edge.');
        }
        var nodes = edge.getNodes();
        nodes.a.removeEdge(edge);
        if (nodes.a !== nodes.b) {
            nodes.b.removeEdge(edge);
        }
        if (dir_edge) {
            delete this._dir_edges[edge.getID()];
            this._nr_dir_edges -= 1;
        }
        else {
            delete this._und_edges[edge.getID()];
            this._nr_und_edges -= 1;
        }
        this.updateGraphMode();
    }
    // Some atomicity / rollback feature would be nice here...
    deleteInEdgesOf(node) {
        this.checkConnectedNodeOrThrow(node);
        var in_edges = node.inEdges();
        var key, edge;
        for (key in in_edges) {
            edge = in_edges[key];
            edge.getNodes().a.removeEdge(edge);
            delete this._dir_edges[edge.getID()];
            this._nr_dir_edges -= 1;
        }
        node.clearInEdges();
        this.updateGraphMode();
    }
    // Some atomicity / rollback feature would be nice here...
    deleteOutEdgesOf(node) {
        this.checkConnectedNodeOrThrow(node);
        var out_edges = node.outEdges();
        var key, edge;
        for (key in out_edges) {
            edge = out_edges[key];
            edge.getNodes().b.removeEdge(edge);
            delete this._dir_edges[edge.getID()];
            this._nr_dir_edges -= 1;
        }
        node.clearOutEdges();
        this.updateGraphMode();
    }
    // Some atomicity / rollback feature would be nice here...
    deleteDirEdgesOf(node) {
        this.deleteInEdgesOf(node);
        this.deleteOutEdgesOf(node);
    }
    // Some atomicity / rollback feature would be nice here...
    deleteUndEdgesOf(node) {
        this.checkConnectedNodeOrThrow(node);
        var und_edges = node.undEdges();
        var key, edge;
        for (key in und_edges) {
            edge = und_edges[key];
            var conns = edge.getNodes();
            conns.a.removeEdge(edge);
            if (conns.a !== conns.b) {
                conns.b.removeEdge(edge);
            }
            delete this._und_edges[edge.getID()];
            this._nr_und_edges -= 1;
        }
        node.clearUndEdges();
        this.updateGraphMode();
    }
    // Some atomicity / rollback feature would be nice here...
    deleteAllEdgesOf(node) {
        this.deleteDirEdgesOf(node);
        this.deleteUndEdgesOf(node);
    }
    /**
     * Remove all the (un)directed edges in the graph
     */
    clearAllDirEdges() {
        for (var edge in this._dir_edges) {
            this.deleteEdge(this._dir_edges[edge]);
        }
    }
    clearAllUndEdges() {
        for (var edge in this._und_edges) {
            this.deleteEdge(this._und_edges[edge]);
        }
    }
    clearAllEdges() {
        this.clearAllDirEdges();
        this.clearAllUndEdges();
    }
    /**
     * CAUTION - This function is linear in # directed edges
     */
    getRandomDirEdge() {
        return this.pickRandomProperty(this._dir_edges);
    }
    /**
     * CAUTION - This function is linear in # undirected edges
     */
    getRandomUndEdge() {
        return this.pickRandomProperty(this._und_edges);
    }
    clone() {
        let new_graph = new BaseGraph(this._label), old_nodes = this.getNodes(), old_edge, new_node_a = null, new_node_b = null;
        for (let node_id in old_nodes) {
            new_graph.addNode(old_nodes[node_id].clone());
        }
        [this.getDirEdges(), this.getUndEdges()].forEach((old_edges) => {
            for (let edge_id in old_edges) {
                old_edge = old_edges[edge_id];
                new_node_a = new_graph.getNodeById(old_edge.getNodes().a.getID());
                new_node_b = new_graph.getNodeById(old_edge.getNodes().b.getID());
                new_graph.addEdge(old_edge.clone(new_node_a, new_node_b));
            }
        });
        return new_graph;
    }
    cloneSubGraph(root, cutoff) {
        let new_graph = new BaseGraph(this._label);
        let config = $BFS.prepareBFSStandardConfig();
        var bfsNodeUnmarkedTestCallback = function (context) {
            if (config.result[context.next_node.getID()].counter > cutoff) {
                context.queue = [];
            }
            else { //This means we only add cutoff -1 nodes to the cloned graph, # of nodes is then equal to cutoff
                new_graph.addNode(context.next_node.clone());
            }
        };
        config.callbacks.node_unmarked.push(bfsNodeUnmarkedTestCallback);
        $BFS.BFS(this, root, config);
        let old_edge, new_node_a = null, new_node_b = null;
        [this.getDirEdges(), this.getUndEdges()].forEach((old_edges) => {
            for (let edge_id in old_edges) {
                old_edge = old_edges[edge_id];
                new_node_a = new_graph.getNodeById(old_edge.getNodes().a.getID());
                new_node_b = new_graph.getNodeById(old_edge.getNodes().b.getID());
                if (new_node_a != null && new_node_b != null)
                    new_graph.addEdge(old_edge.clone(new_node_a, new_node_b));
            }
        });
        return new_graph;
    }
    checkConnectedNodeOrThrow(node) {
        var node = this._nodes[node.getID()];
        if (!node) {
            throw new Error('Cowardly refusing to delete edges of un-added node.');
        }
    }
    updateGraphMode() {
        var nr_dir = this._nr_dir_edges, nr_und = this._nr_und_edges;
        if (nr_dir && nr_und) {
            this._mode = GraphMode.MIXED;
        }
        else if (nr_dir) {
            this._mode = GraphMode.DIRECTED;
        }
        else if (nr_und) {
            this._mode = GraphMode.UNDIRECTED;
        }
        else {
            this._mode = GraphMode.INIT;
        }
    }
    pickRandomProperty(propList) {
        let tmpList = Object.keys(propList);
        let randomPropertyName = tmpList[Math.floor(Math.random() * tmpList.length)];
        return propList[randomPropertyName];
    }
    /**
     * In some cases we need to give back a large number of objects
     * in one swoop, as calls to Object.keys() are really slow
     * for large input objects.
     *
     * In order to do this, we only extract the keys once and then
     * iterate over the key list and add them to a result array
     * with probability = amount / keys.length
     *
     * We also mark all used keys in case we haven't picked up
     * enough entities for the result array after the first round.
     * We then just fill up the rest of the result array linearly
     * with as many unused keys as necessary
     *
     *
     * @todo include generic Test Cases
     * @todo check if amount is larger than propList size
     * @todo This seems like a simple hack - filling up remaining objects
     * Could be replaced by a better fraction-increasing function above...
     *
     * @param propList
     * @param fraction
     * @returns {Array}
     */
    pickRandomProperties(propList, amount) {
        let ids = [];
        let keys = Object.keys(propList);
        let fraction = amount / keys.length;
        let used_keys = {};
        for (let i = 0; ids.length < amount && i < keys.length; i++) {
            if (Math.random() < fraction) {
                ids.push(keys[i]);
                used_keys[keys[i]] = i;
            }
        }
        let diff = amount - ids.length;
        for (let i = 0; i < keys.length && diff; i++) {
            if (used_keys[keys[i]] == null) {
                ids.push(keys[i]);
                diff--;
            }
        }
        return ids;
    }
}
exports.BaseGraph = BaseGraph;
