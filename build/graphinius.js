/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var Edges			      = __webpack_require__(1);
	var Nodes 		      = __webpack_require__(2);
	var Graph 		      = __webpack_require__(4);
	var CSVInput 	      = __webpack_require__(13);
	var CSVOutput       = __webpack_require__(18);
	var JSONInput       = __webpack_require__(19);
	var JSONOutput      = __webpack_require__(20);
	var BFS				      = __webpack_require__(7);
	var DFS				      = __webpack_require__(9);
	var PFS             = __webpack_require__(11);
	var BellmanFord     = __webpack_require__(10);
	var FloydWarshall		= __webpack_require__(21);
	var structUtils     = __webpack_require__(3);
	var remoteUtils     = __webpack_require__(17);
	var callbackUtils   = __webpack_require__(8);
	var randGen         = __webpack_require__(49);
	var binaryHeap      = __webpack_require__(12);
	var simplePerturbation = __webpack_require__(50);
	var MCMFBoykov			= __webpack_require__(51);
	var DegreeCent		 	= __webpack_require__(52);
	var ClosenessCent	 	= __webpack_require__(53);
	var BetweennessCent	= __webpack_require__(54);
	var PRGauss					= __webpack_require__(55);
	var PRRandomWalk		= __webpack_require__(57);

	// Define global object
	var out = typeof window !== 'undefined' ? window : global;

	/**
	 * Inside Global or Window object
	 */
	out.$G = {
		core: {
			BaseEdge 				: Edges.BaseEdge,
			BaseNode 				: Nodes.BaseNode,
			BaseGraph 			: Graph.BaseGraph,
			GraphMode		    : Graph.GraphMode
		},
		centralities: {
			Degree: DegreeCent,
			Closeness: ClosenessCent,
			Betweenness: BetweennessCent,
			PageRankGauss: PRGauss,
			PageRankRandWalk: PRRandomWalk
		},
		input: {
			CSVInput 		: CSVInput.CSVInput,
			JSONInput 	: JSONInput.JSONInput
		},
		output: {
			CSVOutput		: CSVOutput.CSVOutput,
			JSONOutput	: JSONOutput.JSONOutput
		},
		search: {
			BFS													   : BFS.BFS,
	    prepareBFSStandardConfig       : BFS.prepareBFSStandardConfig,
			DFS 												   : DFS.DFS,
			DFSVisit										   : DFS.DFSVisit,
			prepareDFSStandardConfig			 : DFS.prepareDFSStandardConfig,
			prepareDFSVisitStandardConfig	 : DFS.prepareDFSVisitStandardConfig,
	    PFS                            : PFS.PFS,
			preparePFSStandardConfig       : PFS.preparePFSStandardConfig,
			BellmanFord										 : BellmanFord,
			FloydWarshall									 : FloydWarshall
		},
		mincut: {
			MCMFBoykov										 : MCMFBoykov.MCMFBoykov
		},
	  utils: {
	    struct          : structUtils,
	    remote          : remoteUtils,
	    callback        : callbackUtils,
	    randgen         : randGen
	  },
	  datastructs: {
	    BinaryHeap  : binaryHeap.BinaryHeap
	  },
		perturbation: {
			SimplePerturber: simplePerturbation.SimplePerturber
		}
	};

	/**
	 * For NodeJS / CommonJS global object
	 */
	module.exports = out.$G;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var $N = __webpack_require__(2);
	var BaseEdge = (function () {
	    function BaseEdge(_id, _node_a, _node_b, options) {
	        this._id = _id;
	        this._node_a = _node_a;
	        this._node_b = _node_b;
	        if (!(_node_a instanceof $N.BaseNode) || !(_node_b instanceof $N.BaseNode)) {
	            throw new Error("cannot instantiate edge without two valid node objects");
	        }
	        options = options || {};
	        this._directed = options.directed || false;
	        this._weighted = options.weighted || false;
	        this._weight = this._weighted ? (isNaN(options.weight) ? 1 : options.weight) : undefined;
	        this._label = options.label || this._id;
	    }
	    BaseEdge.prototype.getID = function () {
	        return this._id;
	    };
	    BaseEdge.prototype.getLabel = function () {
	        return this._label;
	    };
	    BaseEdge.prototype.setLabel = function (label) {
	        this._label = label;
	    };
	    BaseEdge.prototype.isDirected = function () {
	        return this._directed;
	    };
	    BaseEdge.prototype.isWeighted = function () {
	        return this._weighted;
	    };
	    BaseEdge.prototype.getWeight = function () {
	        return this._weight;
	    };
	    BaseEdge.prototype.setWeight = function (w) {
	        if (!this._weighted) {
	            throw new Error("Cannot set weight on unweighted edge.");
	        }
	        this._weight = w;
	    };
	    BaseEdge.prototype.getNodes = function () {
	        return { a: this._node_a, b: this._node_b };
	    };
	    BaseEdge.prototype.clone = function (new_node_a, new_node_b) {
	        if (!(new_node_a instanceof $N.BaseNode) || !(new_node_b instanceof $N.BaseNode)) {
	            throw new Error("refusing to clone edge if any new node is invalid");
	        }
	        return new BaseEdge(this._id, new_node_a, new_node_b, {
	            directed: this._directed,
	            weighted: this._weighted,
	            weight: this._weight,
	            label: this._label
	        });
	    };
	    return BaseEdge;
	}());
	exports.BaseEdge = BaseEdge;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var $SU = __webpack_require__(3);
	var BaseNode = (function () {
	    function BaseNode(_id, features) {
	        this._id = _id;
	        this._in_degree = 0;
	        this._out_degree = 0;
	        this._und_degree = 0;
	        this._in_edges = {};
	        this._out_edges = {};
	        this._und_edges = {};
	        this._features = typeof features !== 'undefined' ? $SU.clone(features) : {};
	        this._label = this._features["label"] || this._id;
	    }
	    BaseNode.prototype.getID = function () {
	        return this._id;
	    };
	    BaseNode.prototype.getLabel = function () {
	        return this._label;
	    };
	    BaseNode.prototype.setLabel = function (label) {
	        this._label = label;
	    };
	    BaseNode.prototype.getFeatures = function () {
	        return this._features;
	    };
	    BaseNode.prototype.getFeature = function (key) {
	        return this._features[key];
	    };
	    BaseNode.prototype.setFeatures = function (features) {
	        this._features = $SU.clone(features);
	    };
	    BaseNode.prototype.setFeature = function (key, value) {
	        this._features[key] = value;
	    };
	    BaseNode.prototype.deleteFeature = function (key) {
	        var feat = this._features[key];
	        delete this._features[key];
	        return feat;
	    };
	    BaseNode.prototype.clearFeatures = function () {
	        this._features = {};
	    };
	    BaseNode.prototype.inDegree = function () {
	        return this._in_degree;
	    };
	    BaseNode.prototype.outDegree = function () {
	        return this._out_degree;
	    };
	    BaseNode.prototype.degree = function () {
	        return this._und_degree;
	    };
	    BaseNode.prototype.addEdge = function (edge) {
	        var nodes = edge.getNodes();
	        if (nodes.a !== this && nodes.b !== this) {
	            throw new Error("Cannot add edge that does not connect to this node");
	        }
	        var edge_id = edge.getID();
	        if (edge.isDirected()) {
	            if (nodes.a === this && !this._out_edges[edge_id]) {
	                this._out_edges[edge_id] = edge;
	                this._out_degree += 1;
	                if (nodes.b === this && !this._in_edges[edge_id]) {
	                    this._in_edges[edge.getID()] = edge;
	                    this._in_degree += 1;
	                }
	            }
	            else if (!this._in_edges[edge_id]) {
	                this._in_edges[edge.getID()] = edge;
	                this._in_degree += 1;
	            }
	        }
	        else {
	            if (this._und_edges[edge.getID()]) {
	                throw new Error("Cannot add same undirected edge multiple times.");
	            }
	            this._und_edges[edge.getID()] = edge;
	            this._und_degree += 1;
	        }
	    };
	    BaseNode.prototype.hasEdge = function (edge) {
	        return !!this._in_edges[edge.getID()] || !!this._out_edges[edge.getID()] || !!this._und_edges[edge.getID()];
	    };
	    BaseNode.prototype.hasEdgeID = function (id) {
	        return !!this._in_edges[id] || !!this._out_edges[id] || !!this._und_edges[id];
	    };
	    BaseNode.prototype.getEdge = function (id) {
	        var edge = this._in_edges[id] || this._out_edges[id] || this._und_edges[id];
	        if (!edge) {
	            throw new Error("Cannot retrieve non-existing edge.");
	        }
	        return edge;
	    };
	    BaseNode.prototype.inEdges = function () {
	        return this._in_edges;
	    };
	    BaseNode.prototype.outEdges = function () {
	        return this._out_edges;
	    };
	    BaseNode.prototype.undEdges = function () {
	        return this._und_edges;
	    };
	    BaseNode.prototype.dirEdges = function () {
	        return $SU.mergeObjects([this._in_edges, this._out_edges]);
	    };
	    BaseNode.prototype.allEdges = function () {
	        return $SU.mergeObjects([this._in_edges, this._out_edges, this._und_edges]);
	    };
	    BaseNode.prototype.removeEdge = function (edge) {
	        if (!this.hasEdge(edge)) {
	            throw new Error("Cannot remove unconnected edge.");
	        }
	        var id = edge.getID();
	        var e = this._und_edges[id];
	        if (e) {
	            delete this._und_edges[id];
	            this._und_degree -= 1;
	        }
	        e = this._in_edges[id];
	        if (e) {
	            delete this._in_edges[id];
	            this._in_degree -= 1;
	        }
	        e = this._out_edges[id];
	        if (e) {
	            delete this._out_edges[id];
	            this._out_degree -= 1;
	        }
	    };
	    BaseNode.prototype.removeEdgeID = function (id) {
	        if (!this.hasEdgeID(id)) {
	            throw new Error("Cannot remove unconnected edge.");
	        }
	        var e = this._und_edges[id];
	        if (e) {
	            delete this._und_edges[id];
	            this._und_degree -= 1;
	        }
	        e = this._in_edges[id];
	        if (e) {
	            delete this._in_edges[id];
	            this._in_degree -= 1;
	        }
	        e = this._out_edges[id];
	        if (e) {
	            delete this._out_edges[id];
	            this._out_degree -= 1;
	        }
	    };
	    BaseNode.prototype.clearOutEdges = function () {
	        this._out_edges = {};
	        this._out_degree = 0;
	    };
	    BaseNode.prototype.clearInEdges = function () {
	        this._in_edges = {};
	        this._in_degree = 0;
	    };
	    BaseNode.prototype.clearUndEdges = function () {
	        this._und_edges = {};
	        this._und_degree = 0;
	    };
	    BaseNode.prototype.clearEdges = function () {
	        this.clearInEdges();
	        this.clearOutEdges();
	        this.clearUndEdges();
	    };
	    BaseNode.prototype.prevNodes = function () {
	        var prevs = [];
	        var key, edge;
	        for (key in this._in_edges) {
	            if (this._in_edges.hasOwnProperty(key)) {
	                edge = this._in_edges[key];
	                prevs.push({
	                    node: edge.getNodes().a,
	                    edge: edge
	                });
	            }
	        }
	        return prevs;
	    };
	    BaseNode.prototype.nextNodes = function () {
	        var nexts = [];
	        var key, edge;
	        for (key in this._out_edges) {
	            if (this._out_edges.hasOwnProperty(key)) {
	                edge = this._out_edges[key];
	                nexts.push({
	                    node: edge.getNodes().b,
	                    edge: edge
	                });
	            }
	        }
	        return nexts;
	    };
	    BaseNode.prototype.connNodes = function () {
	        var conns = [];
	        var key, edge;
	        for (key in this._und_edges) {
	            if (this._und_edges.hasOwnProperty(key)) {
	                edge = this._und_edges[key];
	                var nodes = edge.getNodes();
	                if (nodes.a === this) {
	                    conns.push({
	                        node: edge.getNodes().b,
	                        edge: edge
	                    });
	                }
	                else {
	                    conns.push({
	                        node: edge.getNodes().a,
	                        edge: edge
	                    });
	                }
	            }
	        }
	        return conns;
	    };
	    BaseNode.prototype.reachNodes = function (identityFunc) {
	        var identity = 0;
	        return $SU.mergeArrays([this.nextNodes(), this.connNodes()], identityFunc || function (ne) { return identity++; });
	    };
	    BaseNode.prototype.clone = function () {
	        var new_node = new BaseNode(this._id);
	        new_node.setFeatures(this.getFeatures());
	        return new_node;
	    };
	    return BaseNode;
	}());
	exports.BaseNode = BaseNode;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var $N = __webpack_require__(2);
	var $E = __webpack_require__(1);
	function clone(obj) {
	    if (obj === null || typeof obj !== 'object') {
	        return obj;
	    }
	    if (obj instanceof $N.BaseNode || obj instanceof $E.BaseEdge) {
	        return;
	    }
	    var cloneObj = obj.constructor ? obj.constructor() : {};
	    for (var attribute in obj) {
	        if (!obj.hasOwnProperty(attribute)) {
	            continue;
	        }
	        if (typeof obj[attribute] === "object") {
	            cloneObj[attribute] = clone(obj[attribute]);
	        }
	        else {
	            cloneObj[attribute] = obj[attribute];
	        }
	    }
	    return cloneObj;
	}
	exports.clone = clone;
	function mergeArrays(args, cb) {
	    if (cb === void 0) { cb = undefined; }
	    for (var arg_idx in args) {
	        if (!Array.isArray(args[arg_idx])) {
	            throw new Error('Will only mergeArrays arrays');
	        }
	    }
	    var seen = {}, result = [], identity;
	    for (var i = 0; i < args.length; i++) {
	        for (var j = 0; j < args[i].length; j++) {
	            identity = typeof cb !== 'undefined' ? cb(args[i][j]) : args[i][j];
	            if (seen[identity] !== true) {
	                result.push(args[i][j]);
	                seen[identity] = true;
	            }
	        }
	    }
	    return result;
	}
	exports.mergeArrays = mergeArrays;
	function mergeObjects(args) {
	    for (var i = 0; i < args.length; i++) {
	        if (Object.prototype.toString.call(args[i]) !== '[object Object]') {
	            throw new Error('Will only take objects as inputs');
	        }
	    }
	    var result = {};
	    for (var i = 0; i < args.length; i++) {
	        for (var key in args[i]) {
	            if (args[i].hasOwnProperty(key)) {
	                result[key] = args[i][key];
	            }
	        }
	    }
	    return result;
	}
	exports.mergeObjects = mergeObjects;
	function findKey(obj, cb) {
	    for (var key in obj) {
	        if (obj.hasOwnProperty(key) && cb(obj[key])) {
	            return key;
	        }
	    }
	    return undefined;
	}
	exports.findKey = findKey;
	function mergeOrderedArraysNoDups(a, b) {
	    var ret = [];
	    var idx_a = 0;
	    var idx_b = 0;
	    if (a[0] != null && b[0] != null) {
	        while (true) {
	            if (idx_a >= a.length || idx_b >= b.length)
	                break;
	            if (a[idx_a] == b[idx_b]) {
	                if (ret[ret.length - 1] != a[idx_a])
	                    ret.push(a[idx_a]);
	                idx_a++;
	                idx_b++;
	                continue;
	            }
	            if (a[idx_a] < b[idx_b]) {
	                ret.push(a[idx_a]);
	                idx_a++;
	                continue;
	            }
	            if (b[idx_b] < a[idx_a]) {
	                ret.push(b[idx_b]);
	                idx_b++;
	            }
	        }
	    }
	    while (idx_a < a.length) {
	        if (a[idx_a] != null)
	            ret.push(a[idx_a]);
	        idx_a++;
	    }
	    while (idx_b < b.length) {
	        if (b[idx_b] != null)
	            ret.push(b[idx_b]);
	        idx_b++;
	    }
	    return ret;
	}
	exports.mergeOrderedArraysNoDups = mergeOrderedArraysNoDups;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var $N = __webpack_require__(2);
	var $E = __webpack_require__(1);
	var $DS = __webpack_require__(3);
	var logger_1 = __webpack_require__(5);
	var $BFS = __webpack_require__(7);
	var $DFS = __webpack_require__(9);
	var BellmanFord_1 = __webpack_require__(10);
	var logger = new logger_1.Logger();
	var DEFAULT_WEIGHT = 1;
	(function (GraphMode) {
	    GraphMode[GraphMode["INIT"] = 0] = "INIT";
	    GraphMode[GraphMode["DIRECTED"] = 1] = "DIRECTED";
	    GraphMode[GraphMode["UNDIRECTED"] = 2] = "UNDIRECTED";
	    GraphMode[GraphMode["MIXED"] = 3] = "MIXED";
	})(exports.GraphMode || (exports.GraphMode = {}));
	var GraphMode = exports.GraphMode;
	var BaseGraph = (function () {
	    function BaseGraph(_label) {
	        this._label = _label;
	        this._nr_nodes = 0;
	        this._nr_dir_edges = 0;
	        this._nr_und_edges = 0;
	        this._mode = GraphMode.INIT;
	        this._nodes = {};
	        this._dir_edges = {};
	        this._und_edges = {};
	    }
	    BaseGraph.prototype.toDirectedGraph = function () {
	        return this;
	    };
	    BaseGraph.prototype.toUndirectedGraph = function () {
	        return this;
	    };
	    BaseGraph.prototype.hasNegativeEdge = function () {
	        var has_neg_edge = false, edge;
	        for (var edge_id in this._und_edges) {
	            edge = this._und_edges[edge_id];
	            if (!edge.isWeighted()) {
	                continue;
	            }
	            if (edge.getWeight() < 0) {
	                return true;
	            }
	        }
	        for (var edge_id in this._dir_edges) {
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
	    };
	    BaseGraph.prototype.hasNegativeCycles = function (node) {
	        var _this = this;
	        if (!this.hasNegativeEdge()) {
	            return false;
	        }
	        var negative_cycle = false, start = node ? node : this.getRandomNode();
	        $DFS.DFS(this, start).forEach(function (comp) {
	            var min_count = Number.POSITIVE_INFINITY, comp_start_node;
	            Object.keys(comp).forEach(function (node_id) {
	                if (min_count > comp[node_id].counter) {
	                    min_count = comp[node_id].counter;
	                    comp_start_node = node_id;
	                }
	            });
	            if (BellmanFord_1.BellmanFordArray(_this, _this._nodes[comp_start_node]).neg_cycle) {
	                negative_cycle = true;
	            }
	        });
	        return negative_cycle;
	    };
	    BaseGraph.prototype.nextArray = function (incoming) {
	        if (incoming === void 0) { incoming = false; }
	        var next = [], node_keys = Object.keys(this._nodes);
	        var adjDict = this.adjListDict(incoming, true, 0);
	        for (var i = 0; i < this._nr_nodes; ++i) {
	            next.push([]);
	            for (var j = 0; j < this._nr_nodes; ++j) {
	                next[i].push([]);
	                next[i][j].push(i === j ? j : isFinite(adjDict[node_keys[i]][node_keys[j]]) ? j : null);
	            }
	        }
	        return next;
	    };
	    BaseGraph.prototype.adjListArray = function (incoming) {
	        if (incoming === void 0) { incoming = false; }
	        var adjList = [], node_keys = Object.keys(this._nodes);
	        var adjDict = this.adjListDict(incoming, true, 0);
	        for (var i = 0; i < this._nr_nodes; ++i) {
	            adjList.push([]);
	            for (var j = 0; j < this._nr_nodes; ++j) {
	                adjList[i].push(i === j ? 0 : isFinite(adjDict[node_keys[i]][node_keys[j]]) ? adjDict[node_keys[i]][node_keys[j]] : Number.POSITIVE_INFINITY);
	            }
	        }
	        return adjList;
	    };
	    BaseGraph.prototype.adjListDict = function (incoming, include_self, self_dist) {
	        if (incoming === void 0) { incoming = false; }
	        if (include_self === void 0) { include_self = false; }
	        if (self_dist === void 0) { self_dist = 0; }
	        var adj_list_dict = {}, nodes = this.getNodes(), cur_dist, key, cur_edge_weight;
	        for (key in nodes) {
	            adj_list_dict[key] = {};
	            if (include_self) {
	                adj_list_dict[key][key] = self_dist;
	            }
	        }
	        for (key in nodes) {
	            var neighbors = incoming ? nodes[key].reachNodes().concat(nodes[key].prevNodes()) : nodes[key].reachNodes();
	            neighbors.forEach(function (ne) {
	                cur_dist = adj_list_dict[key][ne.node.getID()] || Number.POSITIVE_INFINITY;
	                cur_edge_weight = isNaN(ne.edge.getWeight()) ? DEFAULT_WEIGHT : ne.edge.getWeight();
	                if (cur_edge_weight < cur_dist) {
	                    adj_list_dict[key][ne.node.getID()] = cur_edge_weight;
	                    if (incoming) {
	                        adj_list_dict[ne.node.getID()][key] = cur_edge_weight;
	                    }
	                }
	                else {
	                    adj_list_dict[key][ne.node.getID()] = cur_dist;
	                    if (incoming) {
	                        adj_list_dict[ne.node.getID()][key] = cur_dist;
	                    }
	                }
	            });
	        }
	        return adj_list_dict;
	    };
	    BaseGraph.prototype.getMode = function () {
	        return this._mode;
	    };
	    BaseGraph.prototype.getStats = function () {
	        return {
	            mode: this._mode,
	            nr_nodes: this._nr_nodes,
	            nr_und_edges: this._nr_und_edges,
	            nr_dir_edges: this._nr_dir_edges,
	            density_dir: this._nr_dir_edges / (this._nr_nodes * (this._nr_nodes - 1)),
	            density_und: 2 * this._nr_und_edges / (this._nr_nodes * (this._nr_nodes - 1))
	        };
	    };
	    BaseGraph.prototype.degreeDistribution = function () {
	        var max_deg = 0, key, node, all_deg;
	        for (key in this._nodes) {
	            node = this._nodes[key];
	            all_deg = node.inDegree() + node.outDegree() + node.degree() + 1;
	            max_deg = all_deg > max_deg ? all_deg : max_deg;
	        }
	        var deg_dist = {
	            in: new Uint16Array(max_deg),
	            out: new Uint16Array(max_deg),
	            dir: new Uint16Array(max_deg),
	            und: new Uint16Array(max_deg),
	            all: new Uint16Array(max_deg)
	        };
	        for (key in this._nodes) {
	            node = this._nodes[key];
	            deg_dist.in[node.inDegree()]++;
	            deg_dist.out[node.outDegree()]++;
	            deg_dist.dir[node.inDegree() + node.outDegree()]++;
	            deg_dist.und[node.degree()]++;
	            deg_dist.all[node.inDegree() + node.outDegree() + node.degree()]++;
	        }
	        return deg_dist;
	    };
	    BaseGraph.prototype.nrNodes = function () {
	        return this._nr_nodes;
	    };
	    BaseGraph.prototype.nrDirEdges = function () {
	        return this._nr_dir_edges;
	    };
	    BaseGraph.prototype.nrUndEdges = function () {
	        return this._nr_und_edges;
	    };
	    BaseGraph.prototype.addNodeByID = function (id, opts) {
	        var node = new $N.BaseNode(id, opts);
	        return this.addNode(node) ? node : null;
	    };
	    BaseGraph.prototype.addNode = function (node) {
	        this._nodes[node.getID()] = node;
	        this._nr_nodes += 1;
	        return true;
	    };
	    BaseGraph.prototype.cloneAndAddNode = function (node) {
	        var new_node = new $N.BaseNode(node.getID());
	        new_node.setFeatures($DS.clone(node.getFeatures()));
	        this._nodes[node.getID()] = new_node;
	        this._nr_nodes += 1;
	        return new_node;
	    };
	    BaseGraph.prototype.hasNodeID = function (id) {
	        return !!this._nodes[id];
	    };
	    BaseGraph.prototype.getNodeById = function (id) {
	        return this._nodes[id];
	    };
	    BaseGraph.prototype.getNodes = function () {
	        return this._nodes;
	    };
	    BaseGraph.prototype.getRandomNode = function () {
	        return this.pickRandomProperty(this._nodes);
	    };
	    BaseGraph.prototype.deleteNode = function (node) {
	        var rem_node = this._nodes[node.getID()];
	        if (!rem_node) {
	            throw new Error('Cannot remove un-added node.');
	        }
	        var in_deg = node.inDegree();
	        var out_deg = node.outDegree();
	        var deg = node.degree();
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
	    };
	    BaseGraph.prototype.hasEdgeID = function (id) {
	        return !!this._dir_edges[id] || !!this._und_edges[id];
	    };
	    BaseGraph.prototype.getEdgeById = function (id) {
	        var edge = this._dir_edges[id] || this._und_edges[id];
	        if (!edge) {
	            throw new Error("cannot retrieve edge with non-existing ID.");
	        }
	        return edge;
	    };
	    BaseGraph.prototype.checkExistanceOfEdgeNodes = function (node_a, node_b) {
	        if (!node_a) {
	            throw new Error("Cannot find edge. Node A does not exist (in graph).");
	        }
	        if (!node_b) {
	            throw new Error("Cannot find edge. Node B does not exist (in graph).");
	        }
	    };
	    BaseGraph.prototype.getDirEdgeByNodeIDs = function (node_a_id, node_b_id) {
	        var node_a = this.getNodeById(node_a_id);
	        var node_b = this.getNodeById(node_b_id);
	        this.checkExistanceOfEdgeNodes(node_a, node_b);
	        var edges_dir = node_a.outEdges(), edges_dir_keys = Object.keys(edges_dir);
	        for (var i = 0; i < edges_dir_keys.length; i++) {
	            var edge = edges_dir[edges_dir_keys[i]];
	            if (edge.getNodes().b.getID() == node_b_id) {
	                return edge;
	            }
	        }
	        throw new Error("Cannot find edge. There is no edge between Node " + node_a_id + " and " + node_b_id + ".");
	    };
	    BaseGraph.prototype.getUndEdgeByNodeIDs = function (node_a_id, node_b_id) {
	        var node_a = this.getNodeById(node_a_id);
	        var node_b = this.getNodeById(node_b_id);
	        this.checkExistanceOfEdgeNodes(node_a, node_b);
	        var edges_und = node_a.undEdges(), edges_und_keys = Object.keys(edges_und);
	        for (var i = 0; i < edges_und_keys.length; i++) {
	            var edge = edges_und[edges_und_keys[i]];
	            var b;
	            (edge.getNodes().a.getID() == node_a_id) ? (b = edge.getNodes().b.getID()) : (b = edge.getNodes().a.getID());
	            if (b == node_b_id) {
	                return edge;
	            }
	        }
	    };
	    BaseGraph.prototype.getDirEdges = function () {
	        return this._dir_edges;
	    };
	    BaseGraph.prototype.getUndEdges = function () {
	        return this._und_edges;
	    };
	    BaseGraph.prototype.getDirEdgesArray = function () {
	        var edges = [];
	        for (var e_id in this._dir_edges) {
	            edges.push(this._dir_edges[e_id]);
	        }
	        return edges;
	    };
	    BaseGraph.prototype.getUndEdgesArray = function () {
	        var edges = [];
	        for (var e_id in this._und_edges) {
	            edges.push(this._und_edges[e_id]);
	        }
	        return edges;
	    };
	    BaseGraph.prototype.addEdgeByNodeIDs = function (label, node_a_id, node_b_id, opts) {
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
	    };
	    BaseGraph.prototype.addEdgeByID = function (id, node_a, node_b, opts) {
	        var edge = new $E.BaseEdge(id, node_a, node_b, opts || {});
	        return this.addEdge(edge);
	    };
	    BaseGraph.prototype.addEdge = function (edge) {
	        var node_a = edge.getNodes().a, node_b = edge.getNodes().b;
	        if (!this.hasNodeID(node_a.getID()) || !this.hasNodeID(node_b.getID())
	            || this._nodes[node_a.getID()] !== node_a || this._nodes[node_b.getID()] !== node_b) {
	            throw new Error("can only add edge between two nodes existing in graph");
	        }
	        node_a.addEdge(edge);
	        if (edge.isDirected()) {
	            node_b.addEdge(edge);
	            this._dir_edges[edge.getID()] = edge;
	            this._nr_dir_edges += 1;
	            this.updateGraphMode();
	        }
	        else {
	            if (node_a !== node_b) {
	                node_b.addEdge(edge);
	            }
	            this._und_edges[edge.getID()] = edge;
	            this._nr_und_edges += 1;
	            this.updateGraphMode();
	        }
	        return edge;
	    };
	    BaseGraph.prototype.deleteEdge = function (edge) {
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
	    };
	    BaseGraph.prototype.deleteInEdgesOf = function (node) {
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
	    };
	    BaseGraph.prototype.deleteOutEdgesOf = function (node) {
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
	    };
	    BaseGraph.prototype.deleteDirEdgesOf = function (node) {
	        this.deleteInEdgesOf(node);
	        this.deleteOutEdgesOf(node);
	    };
	    BaseGraph.prototype.deleteUndEdgesOf = function (node) {
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
	    };
	    BaseGraph.prototype.deleteAllEdgesOf = function (node) {
	        this.deleteDirEdgesOf(node);
	        this.deleteUndEdgesOf(node);
	    };
	    BaseGraph.prototype.clearAllDirEdges = function () {
	        for (var edge in this._dir_edges) {
	            this.deleteEdge(this._dir_edges[edge]);
	        }
	    };
	    BaseGraph.prototype.clearAllUndEdges = function () {
	        for (var edge in this._und_edges) {
	            this.deleteEdge(this._und_edges[edge]);
	        }
	    };
	    BaseGraph.prototype.clearAllEdges = function () {
	        this.clearAllDirEdges();
	        this.clearAllUndEdges();
	    };
	    BaseGraph.prototype.getRandomDirEdge = function () {
	        return this.pickRandomProperty(this._dir_edges);
	    };
	    BaseGraph.prototype.getRandomUndEdge = function () {
	        return this.pickRandomProperty(this._und_edges);
	    };
	    BaseGraph.prototype.clone = function () {
	        var new_graph = new BaseGraph(this._label), old_nodes = this.getNodes(), old_edge, new_node_a = null, new_node_b = null;
	        for (var node_id in old_nodes) {
	            new_graph.addNode(old_nodes[node_id].clone());
	        }
	        [this.getDirEdges(), this.getUndEdges()].forEach(function (old_edges) {
	            for (var edge_id in old_edges) {
	                old_edge = old_edges[edge_id];
	                new_node_a = new_graph.getNodeById(old_edge.getNodes().a.getID());
	                new_node_b = new_graph.getNodeById(old_edge.getNodes().b.getID());
	                new_graph.addEdge(old_edge.clone(new_node_a, new_node_b));
	            }
	        });
	        return new_graph;
	    };
	    BaseGraph.prototype.cloneSubGraph = function (root, cutoff) {
	        var new_graph = new BaseGraph(this._label);
	        var config = $BFS.prepareBFSStandardConfig();
	        var bfsNodeUnmarkedTestCallback = function (context) {
	            if (config.result[context.next_node.getID()].counter > cutoff) {
	                context.queue = [];
	            }
	            else {
	                new_graph.addNode(context.next_node.clone());
	            }
	        };
	        config.callbacks.node_unmarked.push(bfsNodeUnmarkedTestCallback);
	        $BFS.BFS(this, root, config);
	        var old_edge, new_node_a = null, new_node_b = null;
	        [this.getDirEdges(), this.getUndEdges()].forEach(function (old_edges) {
	            for (var edge_id in old_edges) {
	                old_edge = old_edges[edge_id];
	                new_node_a = new_graph.getNodeById(old_edge.getNodes().a.getID());
	                new_node_b = new_graph.getNodeById(old_edge.getNodes().b.getID());
	                if (new_node_a != null && new_node_b != null)
	                    new_graph.addEdge(old_edge.clone(new_node_a, new_node_b));
	            }
	        });
	        return new_graph;
	    };
	    BaseGraph.prototype.checkConnectedNodeOrThrow = function (node) {
	        var node = this._nodes[node.getID()];
	        if (!node) {
	            throw new Error('Cowardly refusing to delete edges of un-added node.');
	        }
	    };
	    BaseGraph.prototype.updateGraphMode = function () {
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
	    };
	    BaseGraph.prototype.pickRandomProperty = function (propList) {
	        var tmpList = Object.keys(propList);
	        var randomPropertyName = tmpList[Math.floor(Math.random() * tmpList.length)];
	        return propList[randomPropertyName];
	    };
	    BaseGraph.prototype.pickRandomProperties = function (propList, amount) {
	        var ids = [];
	        var keys = Object.keys(propList);
	        var fraction = amount / keys.length;
	        var used_keys = {};
	        for (var i = 0; ids.length < amount && i < keys.length; i++) {
	            if (Math.random() < fraction) {
	                ids.push(keys[i]);
	                used_keys[keys[i]] = i;
	            }
	        }
	        var diff = amount - ids.length;
	        for (var i = 0; i < keys.length && diff; i++) {
	            if (used_keys[keys[i]] == null) {
	                ids.push(keys[i]);
	                diff--;
	            }
	        }
	        return ids;
	    };
	    return BaseGraph;
	}());
	exports.BaseGraph = BaseGraph;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var run_config_1 = __webpack_require__(6);
	var Logger = (function () {
	    function Logger(config) {
	        this.config = null;
	        this.config = config || run_config_1.RUN_CONFIG;
	    }
	    Logger.prototype.log = function (msg) {
	        if (this.config.log_level === run_config_1.LOG_LEVELS.debug) {
	            console.log.apply(console, Array.prototype.slice.call(arguments));
	            return true;
	        }
	        return false;
	    };
	    Logger.prototype.error = function (err) {
	        if (this.config.log_level === run_config_1.LOG_LEVELS.debug) {
	            console.error.apply(console, Array.prototype.slice.call(arguments));
	            return true;
	        }
	        return false;
	    };
	    Logger.prototype.dir = function (obj) {
	        if (this.config.log_level === run_config_1.LOG_LEVELS.debug) {
	            console.dir.apply(console, Array.prototype.slice.call(arguments));
	            return true;
	        }
	        return false;
	    };
	    Logger.prototype.info = function (msg) {
	        if (this.config.log_level === run_config_1.LOG_LEVELS.debug) {
	            console.info.apply(console, Array.prototype.slice.call(arguments));
	            return true;
	        }
	        return false;
	    };
	    Logger.prototype.warn = function (msg) {
	        if (this.config.log_level === run_config_1.LOG_LEVELS.debug) {
	            console.warn.apply(console, Array.prototype.slice.call(arguments));
	            return true;
	        }
	        return false;
	    };
	    return Logger;
	}());
	exports.Logger = Logger;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

	"use strict";
	var LOG_LEVELS = {
	    debug: "DEBUG",
	    production: "PRODUCTION"
	};
	exports.LOG_LEVELS = LOG_LEVELS;
	var RUN_CONFIG = {
	    log_level: LOG_LEVELS.debug
	};
	exports.RUN_CONFIG = RUN_CONFIG;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var $G = __webpack_require__(4);
	var $CB = __webpack_require__(8);
	function BFS(graph, v, config) {
	    var config = config || prepareBFSStandardConfig(), callbacks = config.callbacks, dir_mode = config.dir_mode;
	    if (graph.getMode() === $G.GraphMode.INIT) {
	        throw new Error('Cowardly refusing to traverse graph without edges.');
	    }
	    if (dir_mode === $G.GraphMode.INIT) {
	        throw new Error('Cannot traverse a graph with dir_mode set to INIT.');
	    }
	    var bfsScope = {
	        marked: {},
	        nodes: graph.getNodes(),
	        queue: [],
	        current: null,
	        next_node: null,
	        next_edge: null,
	        root_node: v,
	        adj_nodes: []
	    };
	    if (callbacks.init_bfs) {
	        $CB.execCallbacks(callbacks.init_bfs, bfsScope);
	    }
	    bfsScope.queue.push(v);
	    var i = 0;
	    while (i < bfsScope.queue.length) {
	        bfsScope.current = bfsScope.queue[i++];
	        if (dir_mode === $G.GraphMode.MIXED) {
	            bfsScope.adj_nodes = bfsScope.current.reachNodes();
	        }
	        else if (dir_mode === $G.GraphMode.UNDIRECTED) {
	            bfsScope.adj_nodes = bfsScope.current.connNodes();
	        }
	        else if (dir_mode === $G.GraphMode.DIRECTED) {
	            bfsScope.adj_nodes = bfsScope.current.nextNodes();
	        }
	        else {
	            bfsScope.adj_nodes = [];
	        }
	        if (typeof callbacks.sort_nodes === 'function') {
	            callbacks.sort_nodes(bfsScope);
	        }
	        for (var adj_idx in bfsScope.adj_nodes) {
	            bfsScope.next_node = bfsScope.adj_nodes[adj_idx].node;
	            bfsScope.next_edge = bfsScope.adj_nodes[adj_idx].edge;
	            if (config.result[bfsScope.next_node.getID()].distance === Number.POSITIVE_INFINITY) {
	                if (callbacks.node_unmarked) {
	                    $CB.execCallbacks(callbacks.node_unmarked, bfsScope);
	                }
	            }
	            else {
	                if (callbacks.node_marked) {
	                    $CB.execCallbacks(callbacks.node_marked, bfsScope);
	                }
	            }
	        }
	    }
	    return config.result;
	}
	exports.BFS = BFS;
	function prepareBFSStandardConfig() {
	    var config = {
	        result: {},
	        callbacks: {
	            init_bfs: [],
	            node_unmarked: [],
	            node_marked: [],
	            sort_nodes: undefined
	        },
	        dir_mode: $G.GraphMode.MIXED,
	        messages: {},
	        filters: {}
	    }, result = config.result, callbacks = config.callbacks;
	    var count = 0;
	    var counter = function () {
	        return count++;
	    };
	    var initBFS = function (context) {
	        for (var key in context.nodes) {
	            config.result[key] = {
	                distance: Number.POSITIVE_INFINITY,
	                parent: null,
	                counter: -1
	            };
	        }
	        config.result[context.root_node.getID()] = {
	            distance: 0,
	            parent: context.root_node,
	            counter: counter()
	        };
	    };
	    callbacks.init_bfs.push(initBFS);
	    var nodeUnmarked = function (context) {
	        config.result[context.next_node.getID()] = {
	            distance: result[context.current.getID()].distance + 1,
	            parent: context.current,
	            counter: counter()
	        };
	        context.queue.push(context.next_node);
	    };
	    callbacks.node_unmarked.push(nodeUnmarked);
	    return config;
	}
	exports.prepareBFSStandardConfig = prepareBFSStandardConfig;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	"use strict";
	function execCallbacks(cbs, context) {
	    cbs.forEach(function (cb) {
	        if (typeof cb === 'function') {
	            cb(context);
	        }
	        else {
	            throw new Error('Provided callback is not a function.');
	        }
	    });
	}
	exports.execCallbacks = execCallbacks;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var $G = __webpack_require__(4);
	var $CB = __webpack_require__(8);
	function DFSVisit(graph, current_root, config) {
	    var dfsVisitScope = {
	        stack: [],
	        adj_nodes: [],
	        stack_entry: null,
	        current: null,
	        current_root: current_root
	    };
	    var config = config || prepareDFSVisitStandardConfig(), callbacks = config.callbacks, dir_mode = config.dir_mode;
	    if (graph.getMode() === $G.GraphMode.INIT) {
	        throw new Error('Cowardly refusing to traverse graph without edges.');
	    }
	    if (dir_mode === $G.GraphMode.INIT) {
	        throw new Error('Cannot traverse a graph with dir_mode set to INIT.');
	    }
	    if (callbacks.init_dfs_visit) {
	        $CB.execCallbacks(callbacks.init_dfs_visit, dfsVisitScope);
	    }
	    dfsVisitScope.stack.push({
	        node: current_root,
	        parent: current_root,
	        weight: 0
	    });
	    while (dfsVisitScope.stack.length) {
	        dfsVisitScope.stack_entry = dfsVisitScope.stack.pop();
	        dfsVisitScope.current = dfsVisitScope.stack_entry.node;
	        if (callbacks.node_popped) {
	            $CB.execCallbacks(callbacks.node_popped, dfsVisitScope);
	        }
	        if (!config.dfs_visit_marked[dfsVisitScope.current.getID()]) {
	            config.dfs_visit_marked[dfsVisitScope.current.getID()] = true;
	            if (callbacks.node_unmarked) {
	                $CB.execCallbacks(callbacks.node_unmarked, dfsVisitScope);
	            }
	            if (dir_mode === $G.GraphMode.MIXED) {
	                dfsVisitScope.adj_nodes = dfsVisitScope.current.reachNodes();
	            }
	            else if (dir_mode === $G.GraphMode.UNDIRECTED) {
	                dfsVisitScope.adj_nodes = dfsVisitScope.current.connNodes();
	            }
	            else if (dir_mode === $G.GraphMode.DIRECTED) {
	                dfsVisitScope.adj_nodes = dfsVisitScope.current.nextNodes();
	            }
	            if (typeof callbacks.sort_nodes === 'function') {
	                callbacks.sort_nodes(dfsVisitScope);
	            }
	            for (var adj_idx in dfsVisitScope.adj_nodes) {
	                if (callbacks) {
	                }
	                dfsVisitScope.stack.push({
	                    node: dfsVisitScope.adj_nodes[adj_idx].node,
	                    parent: dfsVisitScope.current,
	                    weight: dfsVisitScope.adj_nodes[adj_idx].edge.getWeight()
	                });
	            }
	            if (callbacks.adj_nodes_pushed) {
	                $CB.execCallbacks(callbacks.adj_nodes_pushed, dfsVisitScope);
	            }
	        }
	        else {
	            if (callbacks.node_marked) {
	                $CB.execCallbacks(callbacks.node_marked, dfsVisitScope);
	            }
	        }
	    }
	    return config.visit_result;
	}
	exports.DFSVisit = DFSVisit;
	function DFS(graph, root, config) {
	    var config = config || prepareDFSStandardConfig(), callbacks = config.callbacks, dir_mode = config.dir_mode;
	    if (graph.getMode() === $G.GraphMode.INIT) {
	        throw new Error('Cowardly refusing to traverse graph without edges.');
	    }
	    if (dir_mode === $G.GraphMode.INIT) {
	        throw new Error('Cannot traverse a graph with dir_mode set to INIT.');
	    }
	    var dfsScope = {
	        marked: {},
	        nodes: graph.getNodes()
	    };
	    if (callbacks.init_dfs) {
	        $CB.execCallbacks(callbacks.init_dfs, dfsScope);
	    }
	    callbacks.adj_nodes_pushed = callbacks.adj_nodes_pushed || [];
	    var markNode = function (context) {
	        dfsScope.marked[context.current.getID()] = true;
	    };
	    callbacks.adj_nodes_pushed.push(markNode);
	    var dfs_result = [{}];
	    var dfs_idx = 0;
	    var count = 0;
	    var counter = function () {
	        return count++;
	    };
	    var addToProperSegment = function (context) {
	        dfs_result[dfs_idx][context.current.getID()] = {
	            parent: context.stack_entry.parent,
	            counter: counter()
	        };
	    };
	    if (callbacks && callbacks.node_unmarked) {
	        callbacks.node_unmarked.push(addToProperSegment);
	    }
	    DFSVisit(graph, root, config);
	    for (var node_key in dfsScope.nodes) {
	        if (!dfsScope.marked[node_key]) {
	            dfs_idx++;
	            dfs_result.push({});
	            DFSVisit(graph, dfsScope.nodes[node_key], config);
	        }
	    }
	    return dfs_result;
	}
	exports.DFS = DFS;
	function prepareDFSVisitStandardConfig() {
	    var config = {
	        visit_result: {},
	        callbacks: {},
	        messages: {},
	        dfs_visit_marked: {},
	        dir_mode: $G.GraphMode.MIXED
	    }, result = config.visit_result, callbacks = config.callbacks;
	    var count = 0;
	    var counter = function () {
	        return count++;
	    };
	    callbacks.init_dfs_visit = callbacks.init_dfs_visit || [];
	    var initDFSVisit = function (context) {
	        result[context.current_root.getID()] = {
	            parent: context.current_root
	        };
	    };
	    callbacks.init_dfs_visit.push(initDFSVisit);
	    callbacks.node_unmarked = callbacks.node_unmarked || [];
	    var setResultEntry = function (context) {
	        result[context.current.getID()] = {
	            parent: context.stack_entry.parent,
	            counter: counter()
	        };
	    };
	    callbacks.node_unmarked.push(setResultEntry);
	    return config;
	}
	exports.prepareDFSVisitStandardConfig = prepareDFSVisitStandardConfig;
	function prepareDFSStandardConfig() {
	    var config = prepareDFSVisitStandardConfig(), callbacks = config.callbacks, result = config.visit_result;
	    callbacks.init_dfs = callbacks.init_dfs || [];
	    var setInitialResultEntries = function (context) {
	    };
	    callbacks.init_dfs.push(setInitialResultEntries);
	    return config;
	}
	exports.prepareDFSStandardConfig = prepareDFSStandardConfig;
	;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var PFS_1 = __webpack_require__(11);
	function BFSanityChecks(graph, start) {
	    if (graph == null || start == null) {
	        throw new Error('Graph as well as start node have to be valid objects.');
	    }
	    if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
	        throw new Error('Cowardly refusing to traverse a graph without edges.');
	    }
	    if (!graph.hasNodeID(start.getID())) {
	        throw new Error('Cannot start from an outside node.');
	    }
	}
	function BellmanFordArray(graph, start) {
	    BFSanityChecks(graph, start);
	    var distances = [], nodes = graph.getNodes(), edge, node_keys = Object.keys(nodes), node, id_idx_map = {}, bf_edge_entry, new_weight, neg_cycle = false;
	    for (var n_idx = 0; n_idx < node_keys.length; ++n_idx) {
	        node = nodes[node_keys[n_idx]];
	        distances[n_idx] = (node === start) ? 0 : Number.POSITIVE_INFINITY;
	        id_idx_map[node.getID()] = n_idx;
	    }
	    var graph_edges = graph.getDirEdgesArray().concat(graph.getUndEdgesArray());
	    var bf_edges = [];
	    for (var e_idx = 0; e_idx < graph_edges.length; ++e_idx) {
	        edge = graph_edges[e_idx];
	        var bf_edge_entry_1 = bf_edges.push([
	            id_idx_map[edge.getNodes().a.getID()],
	            id_idx_map[edge.getNodes().b.getID()],
	            isFinite(edge.getWeight()) ? edge.getWeight() : PFS_1.DEFAULT_WEIGHT,
	            edge.isDirected()
	        ]);
	    }
	    for (var i = 0; i < node_keys.length - 1; ++i) {
	        for (var e_idx = 0; e_idx < bf_edges.length; ++e_idx) {
	            edge = bf_edges[e_idx];
	            updateDist(edge[0], edge[1], edge[2]);
	            !edge[3] && updateDist(edge[1], edge[0], edge[2]);
	        }
	    }
	    for (var e_idx = 0; e_idx < bf_edges.length; ++e_idx) {
	        edge = bf_edges[e_idx];
	        if (betterDist(edge[0], edge[1], edge[2]) || (!edge[3] && betterDist(edge[1], edge[0], edge[2]))) {
	            neg_cycle = true;
	            break;
	        }
	    }
	    function updateDist(u, v, weight) {
	        new_weight = distances[u] + weight;
	        if (distances[v] > new_weight) {
	            distances[v] = new_weight;
	        }
	    }
	    function betterDist(u, v, weight) {
	        return (distances[v] > distances[u] + weight);
	    }
	    return { distances: distances, neg_cycle: neg_cycle };
	}
	exports.BellmanFordArray = BellmanFordArray;
	function BellmanFordDict(graph, start) {
	    BFSanityChecks(graph, start);
	    var distances = {}, edges, edge, a, b, weight, new_weight, nodes_size, neg_cycle = false;
	    distances = {};
	    edges = graph.getDirEdgesArray().concat(graph.getUndEdgesArray());
	    nodes_size = graph.nrNodes();
	    for (var node in graph.getNodes()) {
	        distances[node] = Number.POSITIVE_INFINITY;
	    }
	    distances[start.getID()] = 0;
	    for (var i = 0; i < nodes_size - 1; ++i) {
	        for (var e_idx = 0; e_idx < edges.length; ++e_idx) {
	            edge = edges[e_idx];
	            a = edge.getNodes().a.getID();
	            b = edge.getNodes().b.getID();
	            weight = isFinite(edge.getWeight()) ? edge.getWeight() : PFS_1.DEFAULT_WEIGHT;
	            updateDist(a, b, weight);
	            !edge.isDirected() && updateDist(b, a, weight);
	        }
	    }
	    for (var edgeID in edges) {
	        edge = edges[edgeID];
	        a = edge.getNodes().a.getID();
	        b = edge.getNodes().b.getID();
	        weight = isFinite(edge.getWeight()) ? edge.getWeight() : PFS_1.DEFAULT_WEIGHT;
	        if (betterDist(a, b, weight) || (!edge.isDirected() && betterDist(b, a, weight))) {
	            neg_cycle = true;
	        }
	    }
	    function updateDist(u, v, weight) {
	        new_weight = distances[u] + weight;
	        if (distances[v] > new_weight) {
	            distances[v] = new_weight;
	        }
	    }
	    function betterDist(u, v, weight) {
	        return (distances[v] > distances[u] + weight);
	    }
	    return { distances: distances, neg_cycle: neg_cycle };
	}
	exports.BellmanFordDict = BellmanFordDict;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var $E = __webpack_require__(1);
	var $G = __webpack_require__(4);
	var $CB = __webpack_require__(8);
	var $BH = __webpack_require__(12);
	exports.DEFAULT_WEIGHT = 1;
	function PFS(graph, v, config) {
	    var config = config || preparePFSStandardConfig(), callbacks = config.callbacks, dir_mode = config.dir_mode, evalPriority = config.evalPriority, evalObjID = config.evalObjID;
	    if (graph.getMode() === $G.GraphMode.INIT) {
	        throw new Error('Cowardly refusing to traverse graph without edges.');
	    }
	    if (dir_mode === $G.GraphMode.INIT) {
	        throw new Error('Cannot traverse a graph with dir_mode set to INIT.');
	    }
	    var start_ne = {
	        node: v,
	        edge: new $E.BaseEdge('virtual start edge', v, v, { weighted: true, weight: 0 }),
	        best: 0
	    };
	    var scope = {
	        OPEN_HEAP: new $BH.BinaryHeap($BH.BinaryHeapMode.MIN, evalPriority, evalObjID),
	        OPEN: {},
	        CLOSED: {},
	        nodes: graph.getNodes(),
	        root_node: v,
	        current: start_ne,
	        adj_nodes: [],
	        next: null,
	        better_dist: Number.POSITIVE_INFINITY,
	    };
	    callbacks.init_pfs && $CB.execCallbacks(callbacks.init_pfs, scope);
	    scope.OPEN_HEAP.insert(start_ne);
	    scope.OPEN[start_ne.node.getID()] = start_ne;
	    while (scope.OPEN_HEAP.size()) {
	        scope.current = scope.OPEN_HEAP.pop();
	        if (scope.current == null) {
	            console.log("HEAP popped undefined - HEAP size: " + scope.OPEN_HEAP.size());
	        }
	        scope.OPEN[scope.current.node.getID()] = undefined;
	        scope.CLOSED[scope.current.node.getID()] = scope.current;
	        if (scope.current.node === config.goal_node) {
	            config.callbacks.goal_reached && $CB.execCallbacks(config.callbacks.goal_reached, scope);
	            return config.result;
	        }
	        if (dir_mode === $G.GraphMode.MIXED) {
	            scope.adj_nodes = scope.current.node.reachNodes();
	        }
	        else if (dir_mode === $G.GraphMode.UNDIRECTED) {
	            scope.adj_nodes = scope.current.node.connNodes();
	        }
	        else if (dir_mode === $G.GraphMode.DIRECTED) {
	            scope.adj_nodes = scope.current.node.nextNodes();
	        }
	        else {
	            throw new Error('Unsupported traversal mode. Please use directed, undirected, or mixed');
	        }
	        for (var adj_idx in scope.adj_nodes) {
	            scope.next = scope.adj_nodes[adj_idx];
	            if (scope.CLOSED[scope.next.node.getID()]) {
	                config.callbacks.node_closed && $CB.execCallbacks(config.callbacks.node_closed, scope);
	                continue;
	            }
	            if (scope.OPEN[scope.next.node.getID()]) {
	                scope.next.best = scope.OPEN[scope.next.node.getID()].best;
	                config.callbacks.node_open && $CB.execCallbacks(config.callbacks.node_open, scope);
	                scope.better_dist = scope.current.best + (isNaN(scope.next.edge.getWeight()) ? exports.DEFAULT_WEIGHT : scope.next.edge.getWeight());
	                if (scope.next.best > scope.better_dist) {
	                    config.callbacks.better_path && $CB.execCallbacks(config.callbacks.better_path, scope);
	                    scope.OPEN_HEAP.remove(scope.next);
	                    scope.next.best = scope.better_dist;
	                    scope.OPEN_HEAP.insert(scope.next);
	                    scope.OPEN[scope.next.node.getID()].best = scope.better_dist;
	                }
	                if (scope.next.best === scope.better_dist) {
	                    config.callbacks.equal_path && $CB.execCallbacks(config.callbacks.equal_path, scope);
	                }
	                continue;
	            }
	            config.callbacks.not_encountered && $CB.execCallbacks(config.callbacks.not_encountered, scope);
	            scope.OPEN_HEAP.insert(scope.next);
	            scope.OPEN[scope.next.node.getID()] = scope.next;
	        }
	    }
	    return config.result;
	}
	exports.PFS = PFS;
	function preparePFSStandardConfig() {
	    var config = {
	        result: {},
	        callbacks: {
	            init_pfs: [],
	            not_encountered: [],
	            node_open: [],
	            node_closed: [],
	            better_path: [],
	            equal_path: [],
	            goal_reached: []
	        },
	        messages: {
	            init_pfs_msgs: [],
	            not_enc_msgs: [],
	            node_open_msgs: [],
	            node_closed_msgs: [],
	            better_path_msgs: [],
	            equal_path_msgs: [],
	            goal_reached_msgs: []
	        },
	        dir_mode: $G.GraphMode.MIXED,
	        goal_node: null,
	        evalPriority: function (ne) {
	            return ne.best || exports.DEFAULT_WEIGHT;
	        },
	        evalObjID: function (ne) {
	            return ne.node.getID();
	        }
	    }, callbacks = config.callbacks;
	    var count = 0;
	    var counter = function () {
	        return count++;
	    };
	    var initPFS = function (context) {
	        for (var key in context.nodes) {
	            config.result[key] = {
	                distance: Number.POSITIVE_INFINITY,
	                parent: null,
	                counter: -1
	            };
	        }
	        config.result[context.root_node.getID()] = {
	            distance: 0,
	            parent: context.root_node,
	            counter: counter()
	        };
	    };
	    callbacks.init_pfs.push(initPFS);
	    var notEncountered = function (context) {
	        context.next.best = context.current.best + (isNaN(context.next.edge.getWeight()) ? exports.DEFAULT_WEIGHT : context.next.edge.getWeight());
	        config.result[context.next.node.getID()] = {
	            distance: context.next.best,
	            parent: context.current.node,
	            counter: undefined
	        };
	    };
	    callbacks.not_encountered.push(notEncountered);
	    var betterPathFound = function (context) {
	        config.result[context.next.node.getID()].distance = context.better_dist;
	        config.result[context.next.node.getID()].parent = context.current.node;
	    };
	    callbacks.better_path.push(betterPathFound);
	    return config;
	}
	exports.preparePFSStandardConfig = preparePFSStandardConfig;


/***/ }),
/* 12 */
/***/ (function(module, exports) {

	"use strict";
	(function (BinaryHeapMode) {
	    BinaryHeapMode[BinaryHeapMode["MIN"] = 0] = "MIN";
	    BinaryHeapMode[BinaryHeapMode["MAX"] = 1] = "MAX";
	})(exports.BinaryHeapMode || (exports.BinaryHeapMode = {}));
	var BinaryHeapMode = exports.BinaryHeapMode;
	var BinaryHeap = (function () {
	    function BinaryHeap(_mode, _evalPriority, _evalObjID) {
	        if (_mode === void 0) { _mode = BinaryHeapMode.MIN; }
	        if (_evalPriority === void 0) { _evalPriority = function (obj) {
	            if (typeof obj !== 'number' && typeof obj !== 'string') {
	                return NaN;
	            }
	            return parseInt(obj);
	        }; }
	        if (_evalObjID === void 0) { _evalObjID = function (obj) {
	            return obj;
	        }; }
	        this._mode = _mode;
	        this._evalPriority = _evalPriority;
	        this._evalObjID = _evalObjID;
	        this._array = [];
	        this._positions = {};
	    }
	    BinaryHeap.prototype.getMode = function () {
	        return this._mode;
	    };
	    BinaryHeap.prototype.getArray = function () {
	        return this._array;
	    };
	    BinaryHeap.prototype.getPositions = function () {
	        return this._positions;
	    };
	    BinaryHeap.prototype.size = function () {
	        return this._array.length;
	    };
	    BinaryHeap.prototype.getEvalPriorityFun = function () {
	        return this._evalPriority;
	    };
	    BinaryHeap.prototype.evalInputPriority = function (obj) {
	        return this._evalPriority(obj);
	    };
	    BinaryHeap.prototype.getEvalObjIDFun = function () {
	        return this._evalObjID;
	    };
	    BinaryHeap.prototype.evalInputObjID = function (obj) {
	        return this._evalObjID(obj);
	    };
	    BinaryHeap.prototype.peek = function () {
	        return this._array[0];
	    };
	    BinaryHeap.prototype.pop = function () {
	        if (this.size()) {
	            return this.remove(this._array[0]);
	        }
	    };
	    BinaryHeap.prototype.find = function (obj) {
	        var pos = this.getNodePosition(obj);
	        return this._array[pos];
	    };
	    BinaryHeap.prototype.insert = function (obj) {
	        if (isNaN(this._evalPriority(obj))) {
	            throw new Error("Cannot insert object without numeric priority.");
	        }
	        this._array.push(obj);
	        this.setNodePosition(obj, this.size() - 1, false);
	        this.trickleUp(this.size() - 1);
	    };
	    BinaryHeap.prototype.remove = function (obj) {
	        if (isNaN(this._evalPriority(obj))) {
	            throw new Error('Object invalid.');
	        }
	        var objID = this._evalObjID(obj), found = undefined;
	        for (var pos = 0; pos < this._array.length; pos++) {
	            if (this._evalObjID(this._array[pos]) === objID) {
	                found = this._array[pos];
	                var last = this._array.pop();
	                if (this.size()) {
	                    this._array[pos] = last;
	                    this.trickleUp(pos);
	                    this.trickleDown(pos);
	                }
	                return found;
	            }
	        }
	        return found;
	    };
	    BinaryHeap.prototype.trickleDown = function (i) {
	        var parent = this._array[i];
	        while (true) {
	            var right_child_idx = (i + 1) * 2, left_child_idx = right_child_idx - 1, right_child = this._array[right_child_idx], left_child = this._array[left_child_idx], swap = null;
	            if (left_child_idx < this.size() && !this.orderCorrect(parent, left_child)) {
	                swap = left_child_idx;
	            }
	            if (right_child_idx < this.size() && !this.orderCorrect(parent, right_child)
	                && !this.orderCorrect(left_child, right_child)) {
	                swap = right_child_idx;
	            }
	            if (swap === null) {
	                break;
	            }
	            this._array[i] = this._array[swap];
	            this._array[swap] = parent;
	            this.setNodePosition(this._array[i], i, true, swap);
	            this.setNodePosition(this._array[swap], swap, true, i);
	            i = swap;
	        }
	    };
	    BinaryHeap.prototype.trickleUp = function (i) {
	        var child = this._array[i];
	        while (i) {
	            var parent_idx = Math.floor((i + 1) / 2) - 1, parent = this._array[parent_idx];
	            if (this.orderCorrect(parent, child)) {
	                break;
	            }
	            else {
	                this._array[parent_idx] = child;
	                this._array[i] = parent;
	                this.setNodePosition(child, parent_idx, true, i);
	                this.setNodePosition(parent, i, true, parent_idx);
	                i = parent_idx;
	            }
	        }
	    };
	    BinaryHeap.prototype.orderCorrect = function (obj_a, obj_b) {
	        var obj_a_pr = this._evalPriority(obj_a);
	        var obj_b_pr = this._evalPriority(obj_b);
	        if (this._mode === BinaryHeapMode.MIN) {
	            return obj_a_pr <= obj_b_pr;
	        }
	        else {
	            return obj_a_pr >= obj_b_pr;
	        }
	    };
	    BinaryHeap.prototype.setNodePosition = function (obj, new_pos, replace, old_pos) {
	        if (replace === void 0) { replace = true; }
	        if (typeof obj === 'undefined' || obj === null || typeof new_pos === 'undefined' || new_pos === null) {
	            throw new Error('minium required arguments are ojb and new_pos');
	        }
	        if (replace === true && (typeof old_pos === 'undefined' || old_pos === null)) {
	            throw new Error('replacing a node position requires an old_pos');
	        }
	        var pos_obj = {
	            priority: this.evalInputPriority(obj),
	            position: new_pos
	        };
	        var obj_key = this.evalInputObjID(obj);
	        var occurrence = this._positions[obj_key];
	        if (!occurrence) {
	            this._positions[obj_key] = pos_obj;
	        }
	        else if (Array.isArray(occurrence)) {
	            if (replace) {
	                for (var i = 0; i < occurrence.length; i++) {
	                    if (occurrence[i].position === old_pos) {
	                        occurrence[i].position = new_pos;
	                        return;
	                    }
	                }
	            }
	            else {
	                occurrence.push(pos_obj);
	            }
	        }
	        else {
	            if (replace) {
	                this._positions[obj_key] = pos_obj;
	            }
	            else {
	                this._positions[obj_key] = [occurrence, pos_obj];
	            }
	        }
	    };
	    BinaryHeap.prototype.getNodePosition = function (obj) {
	        var obj_key = this.evalInputObjID(obj);
	        var occurrence = this._positions[obj_key];
	        if (!occurrence) {
	            console.log("getNodePosition: no occurrence found");
	            console.log("Neighborhood entry: ");
	            console.dir(obj);
	            console.log("Object KEY: " + obj_key);
	            return undefined;
	        }
	        else if (Array.isArray(occurrence)) {
	            var node = null, min = Number.POSITIVE_INFINITY;
	            for (var i = 0; i < occurrence.length; i++) {
	                if (occurrence[i].position < min) {
	                    node = occurrence[i];
	                }
	            }
	            if (node) {
	                if (typeof node.position === 'undefined')
	                    console.log('Node position: undefined!');
	                return node.position;
	            }
	        }
	        else {
	            if (typeof occurrence.position === 'undefined')
	                console.log('Occurrence position: undefined!');
	            return occurrence.position;
	        }
	    };
	    BinaryHeap.prototype.unsetNodePosition = function (obj) {
	        var obj_key = this.evalInputObjID(obj);
	        var occurrence = this._positions[obj_key];
	        if (!occurrence) {
	            console.log("Neighborhood entry: ");
	            console.log("Object: ");
	            console.dir(obj);
	            console.log("Object KEY: " + obj_key);
	            return undefined;
	        }
	        else if (Array.isArray(occurrence)) {
	            var node_idx = null, node = null, min = Number.POSITIVE_INFINITY;
	            for (var i = 0; i < occurrence.length; i++) {
	                if (occurrence[i].position < min) {
	                    node_idx = i;
	                    node = occurrence[i];
	                }
	            }
	            if (node) {
	                occurrence.splice(node_idx, 1);
	                if (occurrence.length === 1) {
	                    this._positions[obj_key] = occurrence[0];
	                }
	                if (typeof node.position === 'undefined')
	                    console.log('Node position: undefined!');
	                return node.position;
	            }
	        }
	        else {
	            delete this._positions[obj_key];
	            return occurrence.position;
	        }
	    };
	    return BinaryHeap;
	}());
	exports.BinaryHeap = BinaryHeap;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var path = __webpack_require__(14);
	var fs = __webpack_require__(16);
	var $G = __webpack_require__(4);
	var $R = __webpack_require__(17);
	var CSVInput = (function () {
	    function CSVInput(_separator, _explicit_direction, _direction_mode) {
	        if (_separator === void 0) { _separator = ','; }
	        if (_explicit_direction === void 0) { _explicit_direction = true; }
	        if (_direction_mode === void 0) { _direction_mode = false; }
	        this._separator = _separator;
	        this._explicit_direction = _explicit_direction;
	        this._direction_mode = _direction_mode;
	    }
	    CSVInput.prototype.readFromAdjacencyListURL = function (fileurl, cb) {
	        this.readGraphFromURL(fileurl, cb, this.readFromAdjacencyList);
	    };
	    CSVInput.prototype.readFromEdgeListURL = function (fileurl, cb) {
	        this.readGraphFromURL(fileurl, cb, this.readFromEdgeList);
	    };
	    CSVInput.prototype.readGraphFromURL = function (fileurl, cb, localFun) {
	        var self = this, graph_name = path.basename(fileurl), graph, request;
	        if (typeof window !== 'undefined') {
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
	            $R.retrieveRemoteFile(fileurl, function (raw_graph) {
	                var input = raw_graph.toString().split('\n');
	                graph = localFun.apply(self, [input, graph_name]);
	                cb(graph, undefined);
	            });
	        }
	    };
	    CSVInput.prototype.readFromAdjacencyListFile = function (filepath) {
	        return this.readFileAndReturn(filepath, this.readFromAdjacencyList);
	    };
	    CSVInput.prototype.readFromEdgeListFile = function (filepath) {
	        return this.readFileAndReturn(filepath, this.readFromEdgeList);
	    };
	    CSVInput.prototype.readFileAndReturn = function (filepath, func) {
	        this.checkNodeEnvironment();
	        var graph_name = path.basename(filepath);
	        var input = fs.readFileSync(filepath).toString().split('\n');
	        return func.apply(this, [input, graph_name]);
	    };
	    CSVInput.prototype.readFromAdjacencyList = function (input, graph_name) {
	        var graph = new $G.BaseGraph(graph_name);
	        for (var idx in input) {
	            var line = input[idx], elements = this._separator.match(/\s+/g) ? line.match(/\S+/g) : line.replace(/\s+/g, '').split(this._separator), node_id = elements[0], node, edge_array = elements.slice(1), edge, target_node_id, target_node, dir_char, directed, edge_id, edge_id_u2;
	            if (!node_id) {
	                continue;
	            }
	            node = graph.hasNodeID(node_id) ? graph.getNodeById(node_id) : graph.addNodeByID(node_id);
	            for (var e = 0; e < edge_array.length;) {
	                if (this._explicit_direction && (!edge_array || edge_array.length % 2)) {
	                    throw new Error('Every edge entry has to contain its direction info in explicit mode.');
	                }
	                target_node_id = edge_array[e++];
	                target_node = graph.hasNodeID(target_node_id) ? graph.getNodeById(target_node_id) : graph.addNodeByID(target_node_id);
	                dir_char = this._explicit_direction ? edge_array[e++] : this._direction_mode ? 'd' : 'u';
	                if (dir_char !== 'd' && dir_char !== 'u') {
	                    throw new Error("Specification of edge direction invalid (d and u are valid).");
	                }
	                directed = dir_char === 'd';
	                edge_id = node_id + "_" + target_node_id + "_" + dir_char;
	                edge_id_u2 = target_node_id + "_" + node_id + "_" + dir_char;
	                if (graph.hasEdgeID(edge_id) || (!directed && graph.hasEdgeID(edge_id_u2))) {
	                    continue;
	                }
	                else {
	                    edge = graph.addEdgeByID(edge_id, node, target_node, { directed: directed });
	                }
	            }
	        }
	        return graph;
	    };
	    CSVInput.prototype.readFromEdgeList = function (input, graph_name) {
	        var graph = new $G.BaseGraph(graph_name);
	        for (var idx in input) {
	            var line = input[idx], elements = this._separator.match(/\s+/g) ? line.match(/\S+/g) : line.replace(/\s+/g, '').split(this._separator);
	            if (!elements) {
	                continue;
	            }
	            if (elements.length < 2) {
	                console.log(elements);
	                throw new Error('Edge list is in wrong format - every line has to consist of two entries (the 2 nodes)');
	            }
	            var node_id = elements[0], node, target_node, edge, target_node_id = elements[1], dir_char = this._explicit_direction ? elements[2] : this._direction_mode ? 'd' : 'u', directed, edge_id, edge_id_u2;
	            node = graph.hasNodeID(node_id) ? graph.getNodeById(node_id) : graph.addNodeByID(node_id);
	            target_node = graph.hasNodeID(target_node_id) ? graph.getNodeById(target_node_id) : graph.addNodeByID(target_node_id);
	            if (dir_char !== 'd' && dir_char !== 'u') {
	                throw new Error("Specification of edge direction invalid (d and u are valid).");
	            }
	            directed = dir_char === 'd';
	            edge_id = node_id + "_" + target_node_id + "_" + dir_char;
	            edge_id_u2 = target_node_id + "_" + node_id + "_" + dir_char;
	            if (graph.hasEdgeID(edge_id) || (!directed && graph.hasEdgeID(edge_id_u2))) {
	                continue;
	            }
	            else {
	                edge = graph.addEdgeByID(edge_id, node, target_node, { directed: directed });
	            }
	        }
	        return graph;
	    };
	    CSVInput.prototype.checkNodeEnvironment = function () {
	        if (typeof window !== 'undefined') {
	            throw new Error('Cannot read file in browser environment.');
	        }
	    };
	    return CSVInput;
	}());
	exports.CSVInput = CSVInput;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// resolves . and .. elements in a path array with directory names there
	// must be no slashes, empty elements, or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	function normalizeArray(parts, allowAboveRoot) {
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = parts.length - 1; i >= 0; i--) {
	    var last = parts[i];
	    if (last === '.') {
	      parts.splice(i, 1);
	    } else if (last === '..') {
	      parts.splice(i, 1);
	      up++;
	    } else if (up) {
	      parts.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (allowAboveRoot) {
	    for (; up--; up) {
	      parts.unshift('..');
	    }
	  }

	  return parts;
	}

	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	var splitPathRe =
	    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	var splitPath = function(filename) {
	  return splitPathRe.exec(filename).slice(1);
	};

	// path.resolve([from ...], to)
	// posix version
	exports.resolve = function() {
	  var resolvedPath = '',
	      resolvedAbsolute = false;

	  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	    var path = (i >= 0) ? arguments[i] : process.cwd();

	    // Skip empty and invalid entries
	    if (typeof path !== 'string') {
	      throw new TypeError('Arguments to path.resolve must be strings');
	    } else if (!path) {
	      continue;
	    }

	    resolvedPath = path + '/' + resolvedPath;
	    resolvedAbsolute = path.charAt(0) === '/';
	  }

	  // At this point the path should be resolved to a full absolute path, but
	  // handle relative paths to be safe (might happen when process.cwd() fails)

	  // Normalize the path
	  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
	    return !!p;
	  }), !resolvedAbsolute).join('/');

	  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
	};

	// path.normalize(path)
	// posix version
	exports.normalize = function(path) {
	  var isAbsolute = exports.isAbsolute(path),
	      trailingSlash = substr(path, -1) === '/';

	  // Normalize the path
	  path = normalizeArray(filter(path.split('/'), function(p) {
	    return !!p;
	  }), !isAbsolute).join('/');

	  if (!path && !isAbsolute) {
	    path = '.';
	  }
	  if (path && trailingSlash) {
	    path += '/';
	  }

	  return (isAbsolute ? '/' : '') + path;
	};

	// posix version
	exports.isAbsolute = function(path) {
	  return path.charAt(0) === '/';
	};

	// posix version
	exports.join = function() {
	  var paths = Array.prototype.slice.call(arguments, 0);
	  return exports.normalize(filter(paths, function(p, index) {
	    if (typeof p !== 'string') {
	      throw new TypeError('Arguments to path.join must be strings');
	    }
	    return p;
	  }).join('/'));
	};


	// path.relative(from, to)
	// posix version
	exports.relative = function(from, to) {
	  from = exports.resolve(from).substr(1);
	  to = exports.resolve(to).substr(1);

	  function trim(arr) {
	    var start = 0;
	    for (; start < arr.length; start++) {
	      if (arr[start] !== '') break;
	    }

	    var end = arr.length - 1;
	    for (; end >= 0; end--) {
	      if (arr[end] !== '') break;
	    }

	    if (start > end) return [];
	    return arr.slice(start, end - start + 1);
	  }

	  var fromParts = trim(from.split('/'));
	  var toParts = trim(to.split('/'));

	  var length = Math.min(fromParts.length, toParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (fromParts[i] !== toParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }

	  var outputParts = [];
	  for (var i = samePartsLength; i < fromParts.length; i++) {
	    outputParts.push('..');
	  }

	  outputParts = outputParts.concat(toParts.slice(samePartsLength));

	  return outputParts.join('/');
	};

	exports.sep = '/';
	exports.delimiter = ':';

	exports.dirname = function(path) {
	  var result = splitPath(path),
	      root = result[0],
	      dir = result[1];

	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }

	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }

	  return root + dir;
	};


	exports.basename = function(path, ext) {
	  var f = splitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};


	exports.extname = function(path) {
	  return splitPath(path)[3];
	};

	function filter (xs, f) {
	    if (xs.filter) return xs.filter(f);
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        if (f(xs[i], i, xs)) res.push(xs[i]);
	    }
	    return res;
	}

	// String.prototype.substr - negative index don't work in IE8
	var substr = 'ab'.substr(-1) === 'b'
	    ? function (str, start, len) { return str.substr(start, len) }
	    : function (str, start, len) {
	        if (start < 0) start = str.length + start;
	        return str.substr(start, len);
	    }
	;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ }),
/* 15 */
/***/ (function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;

	process.listeners = function (name) { return [] }

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),
/* 16 */
/***/ (function(module, exports) {

	

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var http = __webpack_require__(16);
	function retrieveRemoteFile(url, cb) {
	    if (typeof cb !== 'function') {
	        throw new Error('Provided callback is not a function.');
	    }
	    return http.get(url, function (response) {
	        var body = '';
	        response.on('data', function (d) {
	            body += d;
	        });
	        response.on('end', function () {
	            cb(body);
	        });
	    });
	}
	exports.retrieveRemoteFile = retrieveRemoteFile;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var fs = __webpack_require__(16);
	var CSVOutput = (function () {
	    function CSVOutput(_separator, _explicit_direction, _direction_mode) {
	        if (_separator === void 0) { _separator = ','; }
	        if (_explicit_direction === void 0) { _explicit_direction = true; }
	        if (_direction_mode === void 0) { _direction_mode = false; }
	        this._separator = _separator;
	        this._explicit_direction = _explicit_direction;
	        this._direction_mode = _direction_mode;
	    }
	    CSVOutput.prototype.writeToAdjacencyListFile = function (filepath, graph) {
	        if (typeof window !== 'undefined' && window !== null) {
	            throw new Error('cannot write to File inside of Browser');
	        }
	        fs.writeFileSync(filepath, this.writeToAdjacencyList(graph));
	    };
	    CSVOutput.prototype.writeToAdjacencyList = function (graph) {
	        var graphString = "";
	        var nodes = graph.getNodes(), node = null, adj_nodes = null, adj_node = null;
	        var mergeFunc = function (ne) {
	            return ne.node.getID();
	        };
	        for (var node_key in nodes) {
	            node = nodes[node_key];
	            graphString += node.getID();
	            adj_nodes = node.reachNodes(mergeFunc);
	            for (var adj_idx in adj_nodes) {
	                adj_node = adj_nodes[adj_idx].node;
	                graphString += this._separator + adj_node.getID();
	            }
	            graphString += "\n";
	        }
	        return graphString;
	    };
	    CSVOutput.prototype.writeToEdgeListFile = function (filepath, graph) {
	        throw new Error("CSVOutput.writeToEdgeListFile not implemented yet.");
	    };
	    CSVOutput.prototype.writeToEdgeList = function (graph) {
	        throw new Error("CSVOutput.writeToEdgeList not implemented yet.");
	    };
	    return CSVOutput;
	}());
	exports.CSVOutput = CSVOutput;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var fs = __webpack_require__(16);
	var $G = __webpack_require__(4);
	var $R = __webpack_require__(17);
	var DEFAULT_WEIGHT = 1;
	var JSONInput = (function () {
	    function JSONInput(_explicit_direction, _direction, _weighted_mode) {
	        if (_explicit_direction === void 0) { _explicit_direction = true; }
	        if (_direction === void 0) { _direction = false; }
	        if (_weighted_mode === void 0) { _weighted_mode = false; }
	        this._explicit_direction = _explicit_direction;
	        this._direction = _direction;
	        this._weighted_mode = _weighted_mode;
	    }
	    JSONInput.prototype.readFromJSONFile = function (filepath) {
	        this.checkNodeEnvironment();
	        var json = JSON.parse(fs.readFileSync(filepath).toString());
	        return this.readFromJSON(json);
	    };
	    JSONInput.prototype.readFromJSONURL = function (fileurl, cb) {
	        var self = this, graph, request, json;
	        if (typeof window !== 'undefined') {
	            request = new XMLHttpRequest();
	            request.onreadystatechange = function () {
	                if (request.readyState == 4 && request.status == 200) {
	                    var json = JSON.parse(request.responseText);
	                    graph = self.readFromJSON(json);
	                    if (cb) {
	                        cb(graph, undefined);
	                    }
	                }
	            };
	            request.open("GET", fileurl, true);
	            request.timeout = 60000;
	            request.setRequestHeader('Content-Type', 'application/json');
	            request.send();
	        }
	        else {
	            $R.retrieveRemoteFile(fileurl, function (raw_graph) {
	                graph = self.readFromJSON(JSON.parse(raw_graph));
	                cb(graph, undefined);
	            });
	        }
	    };
	    JSONInput.prototype.readFromJSON = function (json) {
	        var graph = new $G.BaseGraph(json.name), coords_json, coords, coord_idx, coord_val, features, feature;
	        for (var node_id in json.data) {
	            var node = graph.hasNodeID(node_id) ? graph.getNodeById(node_id) : graph.addNodeByID(node_id);
	            if (features = json.data[node_id].features) {
	                node.setFeatures(features);
	            }
	            if (coords_json = json.data[node_id].coords) {
	                coords = {};
	                for (coord_idx in coords_json) {
	                    coords[coord_idx] = +coords_json[coord_idx];
	                }
	                node.setFeature('coords', coords);
	            }
	            var edges = json.data[node_id].edges;
	            for (var e in edges) {
	                var edge_input = edges[e], target_node_id = edge_input.to, directed = this._explicit_direction ? edge_input.directed : this._direction, dir_char = directed ? 'd' : 'u', weight_float = this.handleEdgeWeights(edge_input), weight_info = weight_float === weight_float ? weight_float : DEFAULT_WEIGHT, edge_weight = this._weighted_mode ? weight_info : undefined, target_node = graph.hasNodeID(target_node_id) ? graph.getNodeById(target_node_id) : graph.addNodeByID(target_node_id);
	                var edge_id = node_id + "_" + target_node_id + "_" + dir_char, edge_id_u2 = target_node_id + "_" + node_id + "_" + dir_char;
	                if (graph.hasEdgeID(edge_id) || (!directed && graph.hasEdgeID(edge_id_u2))) {
	                    continue;
	                }
	                else {
	                    var edge = graph.addEdgeByID(edge_id, node, target_node, {
	                        directed: directed,
	                        weighted: this._weighted_mode,
	                        weight: edge_weight
	                    });
	                }
	            }
	        }
	        return graph;
	    };
	    JSONInput.prototype.handleEdgeWeights = function (edge_input) {
	        switch (edge_input.weight) {
	            case "undefined":
	                return DEFAULT_WEIGHT;
	            case "Infinity":
	                return Number.POSITIVE_INFINITY;
	            case "-Infinity":
	                return Number.NEGATIVE_INFINITY;
	            case "MAX":
	                return Number.MAX_VALUE;
	            case "MIN":
	                return Number.MIN_VALUE;
	            default:
	                return parseFloat(edge_input.weight);
	        }
	    };
	    JSONInput.prototype.checkNodeEnvironment = function () {
	        if (typeof window !== 'undefined') {
	            throw new Error('Cannot read file in browser environment.');
	        }
	    };
	    return JSONInput;
	}());
	exports.JSONInput = JSONInput;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var fs = __webpack_require__(16);
	var JSONOutput = (function () {
	    function JSONOutput() {
	    }
	    JSONOutput.prototype.writeToJSONFile = function (filepath, graph) {
	        if (typeof window !== 'undefined' && window !== null) {
	            throw new Error('cannot write to File inside of Browser');
	        }
	        fs.writeFileSync(filepath, this.writeToJSONSString(graph));
	    };
	    JSONOutput.prototype.writeToJSONSString = function (graph) {
	        var nodes, node, node_struct, und_edges, dir_edges, edge, edge_struct, features, coords;
	        var result = {
	            name: graph._label,
	            nodes: graph.nrNodes(),
	            dir_edges: graph.nrDirEdges(),
	            und_edges: graph.nrUndEdges(),
	            data: {}
	        };
	        nodes = graph.getNodes();
	        for (var node_key in nodes) {
	            node = nodes[node_key];
	            node_struct = result.data[node.getID()] = {
	                edges: []
	            };
	            und_edges = node.undEdges();
	            for (var edge_key in und_edges) {
	                edge = und_edges[edge_key];
	                var connected_nodes = edge.getNodes();
	                node_struct.edges.push({
	                    to: connected_nodes.a.getID() === node.getID() ? connected_nodes.b.getID() : connected_nodes.a.getID(),
	                    directed: edge.isDirected(),
	                    weight: edge.isWeighted() ? edge.getWeight() : undefined
	                });
	            }
	            dir_edges = node.outEdges();
	            for (var edge_key in dir_edges) {
	                edge = dir_edges[edge_key];
	                var connected_nodes = edge.getNodes();
	                node_struct.edges.push({
	                    to: connected_nodes.b.getID(),
	                    directed: edge.isDirected(),
	                    weight: this.handleEdgeWeight(edge)
	                });
	            }
	            node_struct.features = node.getFeatures();
	            if ((coords = node.getFeature('coords')) != null) {
	                node_struct['coords'] = coords;
	            }
	        }
	        return JSON.stringify(result);
	    };
	    JSONOutput.prototype.handleEdgeWeight = function (edge) {
	        if (!edge.isWeighted()) {
	            return undefined;
	        }
	        switch (edge.getWeight()) {
	            case Number.POSITIVE_INFINITY:
	                return 'Infinity';
	            case Number.NEGATIVE_INFINITY:
	                return '-Infinity';
	            case Number.MAX_VALUE:
	                return 'MAX';
	            case Number.MIN_VALUE:
	                return 'MIN';
	            default:
	                return edge.getWeight();
	        }
	    };
	    return JSONOutput;
	}());
	exports.JSONOutput = JSONOutput;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var $SU = __webpack_require__(3);
	var GPU = __webpack_require__(22);
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


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var GPU = __webpack_require__(23);
	var alias = __webpack_require__(48);
	var utils = __webpack_require__(24);
	var Input = __webpack_require__(26);
	var Texture = __webpack_require__(27);

	var CPUFunctionBuilder = __webpack_require__(44);
	var CPUFunctionNode = __webpack_require__(45);
	var CPUKernel = __webpack_require__(42);
	var CPURunner = __webpack_require__(41);

	var WebGLFunctionBuilder = __webpack_require__(36);
	var WebGLFunctionNode = __webpack_require__(38);
	var WebGLKernel = __webpack_require__(31);
	var WebGLRunner = __webpack_require__(28);

	GPU.alias = alias;
	GPU.utils = utils;
	GPU.Texture = Texture;
	GPU.Input = Input;
	GPU.input = function (value, size) {
		return new Input(value, size);
	};

	GPU.CPUFunctionBuilder = CPUFunctionBuilder;
	GPU.CPUFunctionNode = CPUFunctionNode;
	GPU.CPUKernel = CPUKernel;
	GPU.CPURunner = CPURunner;

	GPU.WebGLFunctionBuilder = WebGLFunctionBuilder;
	GPU.WebGLFunctionNode = WebGLFunctionNode;
	GPU.WebGLKernel = WebGLKernel;
	GPU.WebGLRunner = WebGLRunner;

	if (true) {
		module.exports = GPU;
	}
	if (typeof window !== 'undefined') {
		window.GPU = GPU;
	}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var utils = __webpack_require__(24);
	var WebGLRunner = __webpack_require__(28);
	var CPURunner = __webpack_require__(41);
	var WebGLValidatorKernel = __webpack_require__(46);
	var GPUCore = __webpack_require__(47);

	/**
	 * Initialises the GPU.js library class which manages the webGlContext for the created functions.
	 * @class
	 * @extends GPUCore
	 */

	var GPU = function (_GPUCore) {
		_inherits(GPU, _GPUCore);

		/**
	  * Creates an instance of GPU.
	  * @param {any} settings - Settings to set mode, andother properties. See #GPUCore
	  * @memberOf GPU#
	  */
		function GPU(settings) {
			_classCallCheck(this, GPU);

			var _this = _possibleConstructorReturn(this, (GPU.__proto__ || Object.getPrototypeOf(GPU)).call(this, settings));

			settings = settings || {};
			_this._canvas = settings.canvas || null;
			_this._webGl = settings.webGl || null;
			var mode = settings.mode || 'webgl';
			if (!utils.isWebGlSupported()) {
				console.warn('Warning: gpu not supported, falling back to cpu support');
				mode = 'cpu';
			}

			_this.kernels = [];

			var runnerSettings = {
				canvas: _this._canvas,
				webGl: _this._webGl
			};

			if (mode) {
				switch (mode.toLowerCase()) {
					case 'cpu':
						_this._runner = new CPURunner(runnerSettings);
						break;
					case 'gpu':
					case 'webgl':
						_this._runner = new WebGLRunner(runnerSettings);
						break;
					case 'webgl-validator':
						_this._runner = new WebGLRunner(runnerSettings);
						_this._runner.Kernel = WebGLValidatorKernel;
						break;
					default:
						throw new Error('"' + mode + '" mode is not defined');
				}
			}
			return _this;
		}
		/**
	  *
	  * This creates a callable function object to call the kernel function with the argument parameter set
	  *
	  * @name createKernel
	  * @function
	  * @memberOf GPU##
	  *
	  * @param {Function} inputFunction - The calling to perform the conversion
	  * @param {Object} settings - The parameter configuration object
	  * @property {String} settings.dimensions - Thread dimension array (Defeaults to [1024])
	  * @property {String} settings.mode - CPU / GPU configuration mode (Defaults to null)
	  *
	  * The following modes are supported
	  * *null* / *'auto'* : Attempts to build GPU mode, else fallbacks
	  * *'gpu'* : Attempts to build GPU mode, else fallbacks
	  * *'cpu'* : Forces JS fallback mode only
	  *
	  *
	  * @returns {Function} callable function to run
	  *
	  */


		_createClass(GPU, [{
			key: 'createKernel',
			value: function createKernel(fn, settings) {
				//
				// basic parameters safety checks
				//
				if (typeof fn === 'undefined') {
					throw 'Missing fn parameter';
				}
				if (!utils.isFunction(fn) && typeof fn !== 'string') {
					throw 'fn parameter not a function';
				}

				var kernel = this._runner.buildKernel(fn, settings || {});

				//if canvas didn't come from this, propagate from kernel
				if (!this._canvas) {
					this._canvas = kernel.getCanvas();
				}
				if (!this._runner.canvas) {
					this._runner.canvas = kernel.getCanvas();
				}

				this.kernels.push(kernel);

				return kernel;
			}

			/**
	   *
	   * Create a super kernel which executes sub kernels
	   * and saves their output to be used with the next sub kernel.
	   * This can be useful if we want to save the output on one kernel,
	   * and then use it as an input to another kernel. *Machine Learning*
	   *
	   * @name createKernelMap
	   * @function
	   * @memberOf GPU#
	   *
	   * @param {Object|Array} subKernels - Sub kernels for this kernel
	   * @param {Function} rootKernel - Root kernel
	   *
	   * @returns {Function} callable kernel function
	   *
	   * @example
	   * const megaKernel = gpu.createKernelMap({
	   *   addResult: function add(a, b) {
	   *     return a[this.thread.x] + b[this.thread.x];
	   *   },
	   *   multiplyResult: function multiply(a, b) {
	   *     return a[this.thread.x] * b[this.thread.x];
	   *   },
	   *  }, function(a, b, c) {
	   *       return multiply(add(a, b), c);
	   * });
	   *
	   * megaKernel(a, b, c);
	   *
	   * Note: You can also define subKernels as an array of functions.
	   * > [add, multiply]
	   *
	   */

		}, {
			key: 'createKernelMap',
			value: function createKernelMap() {
				var fn = void 0;
				var settings = void 0;
				if (typeof arguments[arguments.length - 2] === 'function') {
					fn = arguments[arguments.length - 2];
					settings = arguments[arguments.length - 1];
				} else {
					fn = arguments[arguments.length - 1];
				}

				if (!utils.isWebGlDrawBuffersSupported()) {
					this._runner = new CPURunner(settings);
				}

				var kernel = this.createKernel(fn, settings);
				if (Array.isArray(arguments[0])) {
					var functions = arguments[0];
					for (var i = 0; i < functions.length; i++) {
						kernel.addSubKernel(functions[i]);
					}
				} else {
					var _functions = arguments[0];
					for (var p in _functions) {
						if (!_functions.hasOwnProperty(p)) continue;
						kernel.addSubKernelProperty(p, _functions[p]);
					}
				}

				return kernel;
			}

			/**
	   *
	   * Combine different kernels into one super Kernel,
	   * useful to perform multiple operations inside one
	   * kernel without the penalty of data transfer between
	   * cpu and gpu.
	   *
	   * The number of kernel functions sent to this method can be variable.
	   * You can send in one, two, etc.
	   *
	   * @name combineKernels
	   * @function
	   * @memberOf GPU#
	   *
	   * @param {Function} subKernels - Kernel function(s) to combine.
	   * @param {Function} rootKernel - Root kernel to combine kernels into
	   *
	   * @example
	   * 	combineKernels(add, multiply, function(a,b,c){
	   *	 	return add(multiply(a,b), c)
	   *	})
	   *
	   * @returns {Function} Callable kernel function
	   *
	   */

		}, {
			key: 'combineKernels',
			value: function combineKernels() {
				var lastKernel = arguments[arguments.length - 2];
				var combinedKernel = arguments[arguments.length - 1];
				if (this.getMode() === 'cpu') return combinedKernel;

				var canvas = arguments[0].getCanvas();
				var webGl = arguments[0].getWebGl();

				for (var i = 0; i < arguments.length - 1; i++) {
					arguments[i].setCanvas(canvas).setWebGl(webGl).setOutputToTexture(true);
				}

				return function () {
					combinedKernel.apply(null, arguments);
					var texSize = lastKernel.texSize;
					var gl = lastKernel.getWebGl();
					var threadDim = lastKernel.threadDim;
					var result = void 0;
					if (lastKernel.floatOutput) {
						result = new Float32Array(texSize[0] * texSize[1] * 4);
						gl.readPixels(0, 0, texSize[0], texSize[1], gl.RGBA, gl.FLOAT, result);
					} else {
						var bytes = new Uint8Array(texSize[0] * texSize[1] * 4);
						gl.readPixels(0, 0, texSize[0], texSize[1], gl.RGBA, gl.UNSIGNED_BYTE, bytes);
						result = new Float32Array(bytes.buffer);
					}

					result = result.subarray(0, threadDim[0] * threadDim[1] * threadDim[2]);

					if (lastKernel.output.length === 1) {
						return result;
					} else if (lastKernel.output.length === 2) {
						return utils.splitArray(result, lastKernel.output[0]);
					} else if (lastKernel.output.length === 3) {
						var cube = utils.splitArray(result, lastKernel.output[0] * lastKernel.output[1]);
						return cube.map(function (x) {
							return utils.splitArray(x, lastKernel.output[0]);
						});
					}
				};
			}

			/**
	   *
	   * Adds additional functions, that the kernel may call.
	   *
	   * @name addFunction
	   * @function
	   * @memberOf GPU#
	   *
	   * @param {Function|String} fn - JS Function to do conversion
	   * @param {String[]|Object} paramTypes - Parameter type array, assumes all parameters are 'float' if null
	   * @param {String} returnType - The return type, assumes 'float' if null
	   *
	   * @returns {GPU} returns itself
	   *
	   */

		}, {
			key: 'addFunction',
			value: function addFunction(fn, paramTypes, returnType) {
				this._runner.functionBuilder.addFunction(null, fn, paramTypes, returnType);
				return this;
			}

			/**
	   *
	   * Adds additional native functions, that the kernel may call.
	   *
	   * @name addNativeFunction
	   * @function
	   * @memberOf GPU#
	   *
	   * @param {String} name - native function name, used for reverse lookup
	   * @param {String} nativeFunction - the native function implementation, as it would be defined in it's entirety
	   *
	   * @returns {GPU} returns itself
	   *
	   */

		}, {
			key: 'addNativeFunction',
			value: function addNativeFunction(name, nativeFunction) {
				this._runner.functionBuilder.addNativeFunction(name, nativeFunction);
				return this;
			}

			/**
	   *
	   * Return the current mode in which gpu.js is executing.
	   * @name getMode
	   * @function
	   * @memberOf GPU#
	   *
	   * @returns {String} The current mode, "cpu", "webgl", etc.
	   *
	   */

		}, {
			key: 'getMode',
			value: function getMode() {
				return this._runner.getMode();
			}

			/**
	   *
	   * Return TRUE, if browser supports WebGl AND Canvas
	   *
	   * @name get isWebGlSupported
	   * @function
	   * @memberOf GPU#
	   *
	   * Note: This function can also be called directly `GPU.isWebGlSupported()`
	   *
	   * @returns {Boolean} TRUE if browser supports webGl
	   *
	   */

		}, {
			key: 'isWebGlSupported',
			value: function isWebGlSupported() {
				return utils.isWebGlSupported();
			}

			/**
	   *
	   * Return the canvas object bound to this gpu instance.
	   *
	   * @name getCanvas
	   * @function
	   * @memberOf GPU#
	   *
	   * @returns {Object} Canvas object if present
	   *
	   */

		}, {
			key: 'getCanvas',
			value: function getCanvas() {
				return this._canvas;
			}

			/**
	   *
	   * Return the webGl object bound to this gpu instance.
	   *
	   * @name getWebGl
	   * @function
	   * @memberOf GPU#
	   *
	   * @returns {Object} WebGl object if present
	   *
	   */

		}, {
			key: 'getWebGl',
			value: function getWebGl() {
				return this._webGl;
			}
		}]);

		return GPU;
	}(GPUCore);

	;

	// This ensure static methods are "inherited"
	// See: https://stackoverflow.com/questions/5441508/how-to-inherit-static-methods-from-base-class-in-javascript
	Object.assign(GPU, GPUCore);

	module.exports = GPU;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * 
	 * @classdesc Various utility functions / snippets of code that GPU.JS uses internally.\
	 * This covers various snippets of code that is not entirely gpu.js specific (ie. may find uses elsewhere)
	 *
	 * Note that all methods in this class are *static* by nature `Utils.functionName()`
	 * 
	 * @class Utils
	 * @extends UtilsCore
	 *
	 */

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var UtilsCore = __webpack_require__(25);
	var Input = __webpack_require__(26);
	var Texture = __webpack_require__(27);
	// FUNCTION_NAME regex
	var FUNCTION_NAME = /function ([^(]*)/;

	// STRIP COMMENTS regex
	var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

	// ARGUMENT NAMES regex
	var ARGUMENT_NAMES = /([^\s,]+)/g;

	var _systemEndianness = function () {
		var b = new ArrayBuffer(4);
		var a = new Uint32Array(b);
		var c = new Uint8Array(b);
		a[0] = 0xdeadbeef;
		if (c[0] === 0xef) return 'LE';
		if (c[0] === 0xde) return 'BE';
		throw new Error('unknown endianness');
	}();

	var _isFloatReadPixelsSupported = null;

	var Utils = function (_UtilsCore) {
		_inherits(Utils, _UtilsCore);

		function Utils() {
			_classCallCheck(this, Utils);

			return _possibleConstructorReturn(this, (Utils.__proto__ || Object.getPrototypeOf(Utils)).apply(this, arguments));
		}

		_createClass(Utils, null, [{
			key: 'systemEndianness',


			//-----------------------------------------------------------------------------
			//
			//  System values support (currently only endianness)
			//
			//-----------------------------------------------------------------------------

			/**
	   * @memberOf Utils
	   * @name systemEndianness
	   * @function
	   * @static
	   *
	   * Gets the system endianness, and cache it
	   *
	   * @returns {String} 'LE' or 'BE' depending on system architecture
	   *
	   * Credit: https://gist.github.com/TooTallNate/4750953
	   */
			value: function systemEndianness() {
				return _systemEndianness;
			}

			//-----------------------------------------------------------------------------
			//
			//  Function and function string validations
			//
			//-----------------------------------------------------------------------------

			/**
	   * @memberOf Utils
	   * @name isFunction
	   * @function
	   * @static
	   *
	   * Return TRUE, on a JS function
	   *
	   * @param {Function} funcObj - Object to validate if its a function
	   *
	   * @returns	{Boolean} TRUE if the object is a JS function
	   *
	   */

		}, {
			key: 'isFunction',
			value: function isFunction(funcObj) {
				return typeof funcObj === 'function';
			}

			/**
	   * @memberOf Utils
	   * @name isFunctionString
	   * @function
	   * @static
	   *
	   * Return TRUE, on a valid JS function string
	   *
	   * Note: This does just a VERY simply sanity check. And may give false positives.
	   *
	   * @param {String} funcStr - String of JS function to validate
	   *
	   * @returns {Boolean} TRUE if the string passes basic validation
	   *
	   */

		}, {
			key: 'isFunctionString',
			value: function isFunctionString(funcStr) {
				if (funcStr !== null) {
					return funcStr.toString().slice(0, 'function'.length).toLowerCase() === 'function';
				}
				return false;
			}

			/**
	   * @memberOf Utils
	   * @name getFunctionName_fromString
	   * @function
	   * @static
	   *
	   * Return the function name from a JS function string
	   *
	   * @param {String} funcStr - String of JS function to validate
	   *
	   * @returns {String} Function name string (if found)
	   *
	   */

		}, {
			key: 'getFunctionNameFromString',
			value: function getFunctionNameFromString(funcStr) {
				return FUNCTION_NAME.exec(funcStr)[1];
			}
		}, {
			key: 'getFunctionBodyFromString',
			value: function getFunctionBodyFromString(funcStr) {
				return funcStr.substring(funcStr.indexOf('{') + 1, funcStr.lastIndexOf('}'));
			}

			/**
	   * @memberOf Utils
	   * @name getParamNames_fromString
	   * @function
	   * @static
	   *
	   * Return list of parameter names extracted from the JS function string
	   *
	   * @param {String} funcStr - String of JS function to validate
	   *
	   * @returns {String[]}  Array representing all the parameter names
	   *
	   */

		}, {
			key: 'getParamNamesFromString',
			value: function getParamNamesFromString(func) {
				var fnStr = func.toString().replace(STRIP_COMMENTS, '');
				var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
				if (result === null) result = [];
				return result;
			}

			//-----------------------------------------------------------------------------
			//
			//  Object / function cloning and manipulation
			//
			//-----------------------------------------------------------------------------

			/**
	   * @memberOf Utils
	   * @name clone
	   * @function
	   * @static
	   *
	   * Returns a clone
	   *
	   * @param {Object} obj - Object to clone
	   *
	   * @returns {Object}  Cloned object
	   *
	   */

		}, {
			key: 'clone',
			value: function clone(obj) {
				if (obj === null || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' || obj.hasOwnProperty('isActiveClone')) return obj;

				var temp = obj.constructor(); // changed

				for (var key in obj) {
					if (Object.prototype.hasOwnProperty.call(obj, key)) {
						obj.isActiveClone = null;
						temp[key] = Utils.clone(obj[key]);
						delete obj.isActiveClone;
					}
				}

				return temp;
			}

			/**
	   * @memberOf Utils
	   * @name newPromise
	   * @function
	   * @static
	   *
	   * Returns a `new Promise` object based on the underlying implmentation
	   *
	   * @param {Function} executor - Promise builder function
	   *
	   * @returns {Promise}  Promise object
	   *
	   */

		}, {
			key: 'newPromise',
			value: function newPromise(executor) {
				var simple = Promise || small_promise;
				if (simple === null) {
					throw TypeError('Browser is missing Promise implementation. Consider adding small_promise.js polyfill');
				}
				return new simple(executor);
			}

			/**
	   * @memberOf Utils
	   * @name functionBinder
	   * @function
	   * @static
	   *
	   * Limited implementation of Function.bind, with fallback
	   *
	   * @param {Function} inFunc - to setup bind on
	   * @param {Object} thisObj - The this parameter to assume inside the binded function
	   *
	   * @returns {Function}  The binded function
	   *
	   */

		}, {
			key: 'functionBinder',
			value: function functionBinder(inFunc, thisObj) {
				if (inFunc.bind) {
					return inFunc.bind(thisObj);
				}

				return function () {
					var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
					return inFunc.apply(thisObj, args);
				};
			}

			/**
	   * @memberOf Utils
	   * @name isArray
	   * @function
	   * @static
	   *
	   * * Checks if is an array or Array-like object
	   *
	   * @param {Object} arg - The argument object to check if is array
	   *
	   * @returns {Boolean}  true if is array or Array-like object
	   *
	   */

		}, {
			key: 'isArray',
			value: function isArray(array) {
				if (isNaN(array.length)) {
					return false;
				}

				return true;
			}

			/**
	   * @memberOf Utils
	   * @name getArgumentType
	   * @function
	   * @static
	   *
	   * Evaluate the argument type, to apply respective logic for it
	   *
	   * @param {Object} arg - The argument object to evaluate type
	   *
	   * @returns {String}  Argument type Array/Number/Texture/Unknown
	   *
	   */

		}, {
			key: 'getArgumentType',
			value: function getArgumentType(arg) {
				if (Utils.isArray(arg)) {
					return 'Array';
				} else if (typeof arg === 'number') {
					return 'Number';
				} else if (arg instanceof Texture) {
					return 'Texture';
				} else if (arg instanceof Input) {
					return 'Input';
				} else {
					return 'Unknown';
				}
			}
			/**
	   * @typedef {Object} gpuJSObject
	   */

			/**
	   * @memberOf Utils
	   * @name isFloatReadPixelsSupported
	   * @function
	   * @static
	   *
	   * Checks if the browser supports readPixels with float type
	   *
	   * @param {gpuJSObject} gpu - the gpu object
	   *
	   * @returns {Boolean} true if browser supports
	   *
	   */

		}, {
			key: 'isFloatReadPixelsSupported',
			value: function isFloatReadPixelsSupported() {
				if (_isFloatReadPixelsSupported !== null) {
					return _isFloatReadPixelsSupported;
				}

				var GPU = __webpack_require__(22);
				var x = new GPU({
					mode: 'webgl-validator'
				}).createKernel(function () {
					return 1;
				}, {
					output: [2],
					floatTextures: true,
					floatOutput: true,
					floatOutputForce: true
				})();

				_isFloatReadPixelsSupported = x[0] === 1;

				return _isFloatReadPixelsSupported;
			}
		}, {
			key: 'dimToTexSize',
			value: function dimToTexSize(opt, dimensions, output) {
				var numTexels = dimensions[0];
				for (var i = 1; i < dimensions.length; i++) {
					numTexels *= dimensions[i];
				}

				if (opt.floatTextures && (!output || opt.floatOutput)) {
					numTexels = Math.ceil(numTexels / 4);
				}

				var w = Math.ceil(Math.sqrt(numTexels));
				return [w, w];
			}

			/**
	   * @memberOf Utils
	   * @name getDimensions
	   * @function
	   * @static
	   *
	   * Return the dimension of an array.
	   * 
	   * @param {Array} x - The array
	   * @param {number} pad - To include padding in the dimension calculation [Optional]
	   *
	   *
	   *
	   */

		}, {
			key: 'getDimensions',
			value: function getDimensions(x, pad) {
				var ret = void 0;
				if (Utils.isArray(x)) {
					var dim = [];
					var temp = x;
					while (Utils.isArray(temp)) {
						dim.push(temp.length);
						temp = temp[0];
					}
					ret = dim.reverse();
				} else if (x instanceof Texture) {
					ret = x.output;
				} else if (x instanceof Input) {
					ret = x.size;
				} else {
					throw 'Unknown dimensions of ' + x;
				}

				if (pad) {
					ret = Utils.clone(ret);
					while (ret.length < 3) {
						ret.push(1);
					}
				}

				return ret;
			}

			/**
	   * @memberOf Utils
	   * @name pad
	   * @function
	   * @static
	   *
	   * Pad an array AND its elements with leading and ending zeros
	   *
	   * @param {Array} arr - the array to pad zeros to
	   * @param {number} padding - amount of padding
	   *
	   * @returns {Array} Array with leading and ending zeros, and all the elements padded by zeros.
	   *
	   */

		}, {
			key: 'pad',
			value: function pad(arr, padding) {
				function zeros(n) {
					return Array.apply(null, new Array(n)).map(Number.prototype.valueOf, 0);
				}

				var len = arr.length + padding * 2;

				var ret = arr.map(function (x) {
					return [].concat(zeros(padding), x, zeros(padding));
				});

				for (var i = 0; i < padding; i++) {
					ret = [].concat([zeros(len)], ret, [zeros(len)]);
				}

				return ret;
			}

			/**
	   * @memberOf Utils
	   * @name flatten2dArrayTo
	   * @function
	   * @static
	   *
	   * Puts a nested 2d array into a one-dimensional target array
	   * @param {Array|*} array
	   * @param {Float32Array|Float64Array} target
	   */

		}, {
			key: 'flatten2dArrayTo',
			value: function flatten2dArrayTo(array, target) {
				var offset = 0;
				for (var y = 0; y < array.length; y++) {
					target.set(array[y], offset);
					offset += array[y].length;
				}
			}

			/**
	   * @memberOf Utils
	   * @name flatten3dArrayTo
	   * @function
	   * @static
	   *
	   * Puts a nested 3d array into a one-dimensional target array
	   * @param {Array|*} array
	   * @param {Float32Array|Float64Array} target
	   */

		}, {
			key: 'flatten3dArrayTo',
			value: function flatten3dArrayTo(array, target) {
				var offset = 0;
				for (var z = 0; z < array.length; z++) {
					for (var y = 0; y < array[z].length; y++) {
						target.set(array[z][y], offset);
						offset += array[z][y].length;
					}
				}
			}

			/**
	   * @memberOf Utils
	   * @name flatten3dArrayTo
	   * @function
	   * @static
	   *
	   * Puts a nested 1d, 2d, or 3d array into a one-dimensional target array
	   * @param {Array|*} array
	   * @param {Float32Array|Float64Array} target
	   */

		}, {
			key: 'flattenTo',
			value: function flattenTo(array, target) {
				if (Utils.isArray(array[0])) {
					if (Utils.isArray(array[0][0])) {
						Utils.flatten3dArrayTo(array, target);
					} else {
						Utils.flatten2dArrayTo(array, target);
					}
				} else {
					target.set(array);
				}
			}

			/**
	   * @memberOf Utils
	   * @name splitArray
	   * @function
	   * @static
	   *
	   * Splits an array into smaller arrays.
	   * Number of elements in one small chunk is given by `part`
	   *
	   * @param {Array} array - The array to split into chunks
	   * @param {Array} part - elements in one chunk
	   *
	  	 * @returns {Array} An array of smaller chunks
	   *
	   */

		}, {
			key: 'splitArray',
			value: function splitArray(array, part) {
				var result = [];
				for (var i = 0; i < array.length; i += part) {
					result.push(Array.prototype.slice.call(array, i, i + part));
				}
				return result;
			}
		}, {
			key: 'getAstString',
			value: function getAstString(source, ast) {
				var lines = Array.isArray(source) ? source : source.split(/\r?\n/g);
				var start = ast.loc.start;
				var end = ast.loc.end;
				var result = [];
				result.push(lines[start.line - 1].slice(start.column));
				for (var i = start.line; i < end.line - 1; i++) {
					result.push(lines[i]);
				}
				result.push(lines[end.line - 1].slice(0, end.column));
				return result.join('\n');
			}
		}, {
			key: 'allPropertiesOf',
			value: function allPropertiesOf(obj) {
				var props = [];

				do {
					props.push.apply(props, Object.getOwnPropertyNames(obj));
				} while (obj = Object.getPrototypeOf(obj));

				return props;
			}
		}]);

		return Utils;
	}(UtilsCore);

	// This ensure static methods are "inherited"
	// See: https://stackoverflow.com/questions/5441508/how-to-inherit-static-methods-from-base-class-in-javascript


	Object.assign(Utils, UtilsCore);

	module.exports = Utils;

/***/ }),
/* 25 */
/***/ (function(module, exports) {

	'use strict';

	/**
	 *
	 * @desc Reduced subset of Utils, used exclusively in gpu-core.js
	 * Various utility functions / snippets of code that GPU.JS uses internally.\
	 * This covers various snippets of code that is not entirely gpu.js specific (ie. may find uses elsewhere)
	 *
	 * Note that all methods in this class is 'static' by nature `UtilsCore.functionName()`
	 *
	 * @class UtilsCore
	 *
	 */

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var UtilsCore = function () {
		function UtilsCore() {
			_classCallCheck(this, UtilsCore);
		}

		_createClass(UtilsCore, null, [{
			key: 'isCanvas',


			/**
	   * @typedef {Object} webGlContext
	   */

			/**
	   * @typedef {Object} CanvasDOMObject
	   */

			//-----------------------------------------------------------------------------
			//
			//  Canvas validation and support
			//
			//-----------------------------------------------------------------------------

			/**
	   * @name isCanvas
	   * @static
	   * @function
	   * @memberOf UtilsCore
	   *
	   *
	   * @desc Return TRUE, on a valid DOM canvas object
	   *
	   * Note: This does just a VERY simply sanity check. And may give false positives.
	   *
	   * @param {CanvasDOMObject} canvasObj - Object to validate
	   *
	   * @returns {Boolean} TRUE if the object is a DOM canvas
	   *
	   */
			value: function isCanvas(canvasObj) {
				return canvasObj !== null && canvasObj.nodeName && canvasObj.getContext && canvasObj.nodeName.toUpperCase() === 'CANVAS';
			}

			/**
	   * @name isCanvasSupported
	   * @function
	   * @static
	   * @memberOf UtilsCore
	   *
	   * @desc Return TRUE, if browser supports canvas
	   *
	   * @returns {Boolean} TRUE if browser supports canvas
	   *
	   */

		}, {
			key: 'isCanvasSupported',
			value: function isCanvasSupported() {
				return _isCanvasSupported;
			}

			/**
	   * @name initCanvas
	   * @function
	   * @static
	   * @memberOf UtilsCore
	   *
	   * @desc Initiate and returns a canvas, for usage in init_webgl.
	   * Returns only if canvas is supported by browser.
	   *
	   * @returns {CanvasDOMObject} CanvasDOMObject if supported by browser, else null
	   *
	   */

		}, {
			key: 'initCanvas',
			value: function initCanvas() {
				// Fail fast if browser previously detected no support
				if (!_isCanvasSupported) {
					return null;
				}

				// Create a new canvas DOM
				var canvas = document.createElement('canvas');

				// Default width and height, to fix webgl issue in safari
				canvas.width = 2;
				canvas.height = 2;

				// Returns the canvas
				return canvas;
			}

			//-----------------------------------------------------------------------------
			//
			//  Webgl validation and support
			//
			//-----------------------------------------------------------------------------


			/**
	   *
	   * @name isWebGl
	   * @function
	   * @static
	   * @memberOf UtilsCore
	   *
	   * @desc Return TRUE, on a valid webGlContext object
	   *
	   * Note: This does just a VERY simply sanity check. And may give false positives.
	   *
	   * @param {webGlContext} webGlObj - Object to validate
	   *
	   * @returns {Boolean} TRUE if the object is a webGlContext object
	   *
	   */

		}, {
			key: 'isWebGl',
			value: function isWebGl(webGlObj) {
				return webGlObj && typeof webGlObj.getExtension === 'function';
			}

			/**
	   * @name isWebGlSupported
	   * @function
	   * @static
	   * @memberOf UtilsCore
	   *
	   * @desc Return TRUE, if browser supports webgl
	   *
	   * @returns {Boolean} TRUE if browser supports webgl
	   *
	   */

		}, {
			key: 'isWebGlSupported',
			value: function isWebGlSupported() {
				return _isWebGlSupported;
			}
		}, {
			key: 'isWebGlDrawBuffersSupported',
			value: function isWebGlDrawBuffersSupported() {
				return _isWebGlDrawBuffersSupported;
			}

			// Default webgl options to use

		}, {
			key: 'initWebGlDefaultOptions',
			value: function initWebGlDefaultOptions() {
				return {
					alpha: false,
					depth: false,
					antialias: false
				};
			}

			/**
	   * @name initWebGl
	   * @function
	   * @static
	   * @memberOf UtilsCore
	   *
	   * @desc Initiate and returns a webGl, from a canvas object
	   * Returns only if webGl is supported by browser.
	   *
	   * @param {CanvasDOMObject} canvasObj - Object to validate
	   *
	   * @returns {CanvasDOMObject} CanvasDOMObject if supported by browser, else null
	   *
	   */

		}, {
			key: 'initWebGl',
			value: function initWebGl(canvasObj) {

				// First time setup, does the browser support check memorizer
				if (typeof _isCanvasSupported !== 'undefined' || canvasObj === null) {
					if (!_isCanvasSupported) {
						return null;
					}
				}

				// Fail fast for invalid canvas object
				if (!UtilsCore.isCanvas(canvasObj)) {
					throw new Error('Invalid canvas object - ' + canvasObj);
				}

				// Create a new canvas DOM
				var webGl = canvasObj.getContext('experimental-webgl', UtilsCore.initWebGlDefaultOptions()) || canvasObj.getContext('webgl', UtilsCore.initWebGlDefaultOptions());

				if (webGl) {
					// Get the extension that is needed
					webGl.OES_texture_float = webGl.getExtension('OES_texture_float');
					webGl.OES_texture_float_linear = webGl.getExtension('OES_texture_float_linear');
					webGl.OES_element_index_uint = webGl.getExtension('OES_element_index_uint');
				}

				// Returns the canvas
				return webGl;
			}
		}]);

		return UtilsCore;
	}();

	//-----------------------------------------------------------------------------
	//
	//  Canvas & Webgl validation and support constants
	//
	//-----------------------------------------------------------------------------

	var _isCanvasSupported = typeof document !== 'undefined' ? UtilsCore.isCanvas(document.createElement('canvas')) : false;
	var _testingWebGl = UtilsCore.initWebGl(UtilsCore.initCanvas());
	var _isWebGlSupported = UtilsCore.isWebGl(_testingWebGl);
	var _isWebGlDrawBuffersSupported = _isWebGlSupported && Boolean(_testingWebGl.getExtension('WEBGL_draw_buffers'));

	if (_isWebGlSupported) {
		UtilsCore.OES_texture_float = _testingWebGl.OES_texture_float;
		UtilsCore.OES_texture_float_linear = _testingWebGl.OES_texture_float_linear;
		UtilsCore.OES_element_index_uint = _testingWebGl.OES_element_index_uint;
	} else {
		UtilsCore.OES_texture_float = false;
		UtilsCore.OES_texture_float_linear = false;
		UtilsCore.OES_element_index_uint = false;
	}

	module.exports = UtilsCore;

/***/ }),
/* 26 */
/***/ (function(module, exports) {

	"use strict";

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	module.exports = function Input(value, size) {
		_classCallCheck(this, Input);

		this.value = value;
		if (Array.isArray(size)) {
			this.size = [];
			for (var i = 0; i < size.length; i++) {
				this.size[i] = size[i];
			}
			while (this.size.length < 3) {
				this.size.push(1);
			}
		} else {
			if (size.z) {
				this.size = [size.x, size.y, size.z];
			} else if (size.y) {
				this.size = [size.x, size.y, 1];
			} else {
				this.size = [size.x, 1, 1];
			}
		}
	};

/***/ }),
/* 27 */
/***/ (function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var gpu = null;

	module.exports = function () {

		/**
	  * @desc WebGl Texture implementation in JS
	  * @constructor Texture
	  * @param {Object} texture 
	  * @param {Array} size 
	  * @param {Array} output
	  * @param {Object} webGl
	  */
		function Texture(texture, size, output, webGl) {
			_classCallCheck(this, Texture);

			this.texture = texture;
			this.size = size;
			this.output = output;
			this.webGl = webGl;
			this.kernel = null;
		}

		/**
	  * @name toArray
	  * @function
	  * @memberOf Texture#
	  *
	  * @desc Converts the Texture into a JavaScript Array.
	  * 
	  * @param {Object} The `gpu` Object
	  *
	  */


		_createClass(Texture, [{
			key: 'toArray',
			value: function toArray(gpu) {
				if (!gpu) throw new Error('You need to pass the GPU object for toArray to work.');
				if (this.kernel) return this.kernel(this);

				this.kernel = gpu.createKernel(function (x) {
					return x[this.thread.z][this.thread.y][this.thread.x];
				}).setOutput(this.output);

				return this.kernel(this);
			}

			/**
	   * @name delete
	   * @desc Deletes the Texture.
	   * @function
	   * @memberOf Texture#
	   *
	   *
	   */

		}, {
			key: 'delete',
			value: function _delete() {
				return this.webGl.deleteTexture(this.texture);
			}
		}]);

		return Texture;
	}();

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var RunnerBase = __webpack_require__(29);
	var WebGLKernel = __webpack_require__(31);
	var utils = __webpack_require__(24);
	var WebGLFunctionBuilder = __webpack_require__(36);

	module.exports = function (_RunnerBase) {
		_inherits(WebGLRunner, _RunnerBase);

		/**
	  * @constructor WebGLRunner
	  *
	 	 * @extends RunnerBase
	  	 * @desc Instantiates a Runner instance for the kernel.
	  * 
	  * @param {Object} settings - Settings to instantiate properties in RunnerBase, with given values
	  *
	  */
		function WebGLRunner(settings) {
			_classCallCheck(this, WebGLRunner);

			var _this = _possibleConstructorReturn(this, (WebGLRunner.__proto__ || Object.getPrototypeOf(WebGLRunner)).call(this, new WebGLFunctionBuilder(), settings));

			_this.Kernel = WebGLKernel;
			_this.kernel = null;
			return _this;
		}

		/**
	  * @memberOf WebGLRunner#
	  * @function
	  * @name getMode
	  *
	  * @desc Return the current mode in which gpu.js is executing.
	  * 
	  * @returns {String} The current mode; "cpu".
	  *
	  */


		_createClass(WebGLRunner, [{
			key: 'getMode',
			value: function getMode() {
				return 'gpu';
			}
		}]);

		return WebGLRunner;
	}(RunnerBase);

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var utils = __webpack_require__(24);
	var kernelRunShortcut = __webpack_require__(30);

	module.exports = function () {

		/**
	  * @constructor BaseRunner
	  *
	  * @desc Represents the 'private/protected' namespace of the GPU class
	  *
	  * <p>I know @private makes more sense, but since the documentation engine state is undetirmined.
	  * (See https://github.com/gpujs/gpu.js/issues/19 regarding documentation engine issue)
	  * File isolation is currently the best way to go. </p>
	  *
	  * *base.js* internal functions namespace <br>
	  * *gpu.js* PUBLIC function namespace <br>
	  *
	  * @prop {Object} settings - Settings object used to set Dimensions, etc.
	  * @prop {String} kernel - Current kernel instance
	  * @prop {Object} canvas - Canvas instance attached to the kernel
	  * @prop {Object} webGl - WebGl instance attached to the kernel
	  * @prop {Function} fn - Kernel function to run
	  * @prop {Object} functionBuilder - FunctionBuilder instance
	  * @prop {String} fnString - Kernel function (as a String)
	  * @prop {String} endianness - endian information like Little-endian, Big-endian.
	  *
	  */

		function BaseRunner(functionBuilder, settings) {
			_classCallCheck(this, BaseRunner);

			settings = settings || {};
			this.kernel = settings.kernel;
			this.canvas = settings.canvas;
			this.webGl = settings.webGl;
			this.fn = null;
			this.functionBuilder = functionBuilder;
			this.fnString = null;
			this.endianness = utils.systemEndianness();
			this.functionBuilder.polyfillStandardFunctions();
		}

		/**
	  * @memberOf BaseRunner#
	  * @function
	  * @name textureToArray
	  *
	  * @desc Converts the provided Texture instance to a JavaScript Array
	  *
	  * @param {Object} texture - Texture Object
	  *
	  */


		_createClass(BaseRunner, [{
			key: 'textureToArray',
			value: function textureToArray(texture) {
				var copy = this.createKernel(function (x) {
					return x[this.thread.z][this.thread.y][this.thread.x];
				});

				return copy(texture);
			}

			/**
	   * @memberOf BaseRunner#
	   * @function
	   *
	   * @name deleteTexture
	   *
	   * @desc Deletes the provided Texture instance
	   *
	   * @param {Object} texture - Texture Object
	   */

		}, {
			key: 'deleteTexture',
			value: function deleteTexture(texture) {
				this.webGl.deleteTexture(texture.texture);
			}

			/**
	   * @memberOf BaseRunner#
	   * @function
	   * @name buildPromiseKernel
	   *
	   * @desc Get and returns the ASYNCHRONOUS executor, of a class and kernel
	   * This returns a Promise object from an argument set.
	   *
	   * Note that there is no current implementation.
	   *
	   */

		}, {
			key: 'buildPromiseKernel',
			value: function buildPromiseKernel() {
				throw new Error('not yet implemented');
			}
		}, {
			key: 'getMode',
			value: function getMode() {
				throw new Error('"mode" not implemented on BaseRunner');
			}

			/**
	   * @memberOf BaseRunner#
	   * @function
	   *
	   * @name buildKernel
	   *
	   * @desc Get and returns the Synchronous executor, of a class and kernel
	   * Which returns the result directly after passing the arguments.
	   *
	   */

		}, {
			key: 'buildKernel',
			value: function buildKernel(fn, settings) {
				settings = Object.assign({}, settings || {});
				var fnString = fn.toString();
				if (!settings.functionBuilder) {
					settings.functionBuilder = this.functionBuilder;
				}

				if (!settings.canvas) {
					settings.canvas = this.canvas;
				}

				if (!settings.webGl) {
					settings.webGl = this.webgl;
				}

				return kernelRunShortcut(new this.Kernel(fnString, settings));
			}
		}]);

		return BaseRunner;
	}();

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(24);

	module.exports = function kernelRunShortcut(kernel) {
		var shortcut = function shortcut() {
			return kernel.run.apply(kernel, arguments);
		};

		utils.allPropertiesOf(kernel).forEach(function (key) {
			if (key[0] === '_' && key[1] === '_') return;
			if (typeof kernel[key] === 'function') {
				if (key.substring(0, 3) === 'add' || key.substring(0, 3) === 'set') {
					shortcut[key] = function () {
						kernel[key].apply(kernel, arguments);
						return shortcut;
					};
				} else {
					shortcut[key] = kernel[key].bind(kernel);
				}
			} else {
				shortcut.__defineGetter__(key, function () {
					return kernel[key];
				});
				shortcut.__defineSetter__(key, function (value) {
					kernel[key] = value;
				});
			}
		});

		shortcut.kernel = kernel;

		return shortcut;
	};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var KernelBase = __webpack_require__(32);
	var utils = __webpack_require__(24);
	var Texture = __webpack_require__(27);
	var fragShaderString = __webpack_require__(33);
	var vertShaderString = __webpack_require__(34);
	var kernelString = __webpack_require__(35);
	var canvases = [];
	var maxTexSizes = {};
	module.exports = function (_KernelBase) {
		_inherits(WebGLKernel, _KernelBase);

		/**
	  * @constructor WebGLKernel
	  *
	  * @desc Kernel Implementation for WebGL.
	  * <p>This builds the shaders and runs them on the GPU,
	  * the outputs the result back as float(enabled by default) and Texture.</p>
	  *
	  * @extends KernelBase
	  *
	  * @prop {Object} textureCache - webGl Texture cache
	  * @prop {Object} threadDim - The thread dimensions, x, y and z
	  * @prop {Object} programUniformLocationCache - Location of program variables in memory
	  * @prop {Object} framebuffer - Webgl frameBuffer
	  * @prop {Object} buffer - WebGL buffer
	  * @prop {Object} program - The webGl Program
	  * @prop {Object} functionBuilder - Function Builder instance bound to this Kernel
	  * @prop {Boolean} outputToTexture - Set output type to Texture, instead of float
	  * @prop {String} endianness - Endian information like Little-endian, Big-endian.
	  * @prop {Array} paramTypes - Types of parameters sent to the Kernel
	  * @prop {number} argumentsLength - Number of parameters sent to the Kernel
	  * @prop {String} compiledFragShaderString - Compiled fragment shader string
	  * @prop {String} compiledVertShaderString - Compiled Vertical shader string
	  */
		function WebGLKernel(fnString, settings) {
			_classCallCheck(this, WebGLKernel);

			var _this = _possibleConstructorReturn(this, (WebGLKernel.__proto__ || Object.getPrototypeOf(WebGLKernel)).call(this, fnString, settings));

			_this.textureCache = {};
			_this.threadDim = {};
			_this.programUniformLocationCache = {};
			_this.framebuffer = null;

			_this.buffer = null;
			_this.program = null;
			_this.outputToTexture = settings.outputToTexture;
			_this.endianness = utils.systemEndianness();
			_this.subKernelOutputTextures = null;
			_this.subKernelOutputVariableNames = null;
			_this.argumentsLength = 0;
			_this.ext = null;
			_this.compiledFragShaderString = null;
			_this.compiledVertShaderString = null;
			_this.extDrawBuffersMap = null;
			_this.outputTexture = null;
			_this.maxTexSize = null;
			if (!_this._webGl) _this._webGl = utils.initWebGl(_this.getCanvas());
			return _this;
		}

		/**
	  * @memberOf WebGLKernel#
	  * @function
	  * @name validateOptions
	  *
	  * @desc Validate options related to Kernel, such as
	  * floatOutputs and Textures, texSize, output,
	  * graphical output.
	  *
	  */


		_createClass(WebGLKernel, [{
			key: 'validateOptions',
			value: function validateOptions() {
				var isReadPixel = utils.isFloatReadPixelsSupported();
				if (this.floatTextures === true && !utils.OES_texture_float) {
					throw 'Float textures are not supported on this browser';
				} else if (this.floatOutput === true && this.floatOutputForce !== true && !isReadPixel) {
					throw 'Float texture outputs are not supported on this browser';
				} else if (this.floatTextures === null && !isReadPixel && !this.graphical) {
					//NOTE: handle
					this.floatTextures = true;
					this.floatOutput = false;
				}

				if (!this.output || this.output.length === 0) {
					if (arguments.length !== 1) {
						throw 'Auto output only supported for kernels with only one input';
					}

					var argType = utils.getArgumentType(arguments[0]);
					if (argType === 'Array') {
						this.output = utils.getDimensions(argType);
					} else if (argType === 'Texture') {
						this.output = arguments[0].output;
					} else {
						throw 'Auto output not supported for input type: ' + argType;
					}
				}

				this.texSize = utils.dimToTexSize({
					floatTextures: this.floatTextures,
					floatOutput: this.floatOutput
				}, this.output, true);

				if (this.graphical) {
					if (this.output.length !== 2) {
						throw 'Output must have 2 dimensions on graphical mode';
					}

					if (this.floatOutput) {
						throw 'Cannot use graphical mode and float output at the same time';
					}

					this.texSize = utils.clone(this.output);
				} else if (this.floatOutput === undefined && utils.OES_texture_float) {
					this.floatOutput = true;
				}
			}
		}, {
			key: 'updateMaxTexSize',
			value: function updateMaxTexSize() {
				var texSize = this.texSize;
				var canvas = this._canvas;
				if (this.maxTexSize === null) {
					var canvasIndex = canvases.indexOf(canvas);
					if (canvasIndex === -1) {
						canvasIndex = canvases.length;
						canvases.push(canvas);
						maxTexSizes[canvasIndex] = [texSize[0], texSize[1]];
					}
					this.maxTexSize = maxTexSizes[canvasIndex];
				}
				if (this.maxTexSize[0] < texSize[0]) {
					this.maxTexSize[0] = texSize[0];
				}
				if (this.maxTexSize[1] < texSize[1]) {
					this.maxTexSize[1] = texSize[1];
				}
			}

			/**
	   * @memberOf WebGLKernel#
	   * @function
	   * @name build
	   *
	   * @desc Builds the Kernel, by compiling Fragment and Vertical Shaders,
	   * and instantiates the program.
	   *
	   */

		}, {
			key: 'build',
			value: function build() {
				this.validateOptions();
				this.setupParams(arguments);
				this.updateMaxTexSize();
				var texSize = this.texSize;
				var gl = this._webGl;
				var canvas = this._canvas;
				gl.enable(gl.SCISSOR_TEST);
				gl.viewport(0, 0, this.maxTexSize[0], this.maxTexSize[1]);
				canvas.width = this.maxTexSize[0];
				canvas.height = this.maxTexSize[1];
				var threadDim = this.threadDim = utils.clone(this.output);
				while (threadDim.length < 3) {
					threadDim.push(1);
				}

				if (this.functionBuilder) this._addKernels();

				var compiledVertShaderString = this._getVertShaderString(arguments);
				var vertShader = gl.createShader(gl.VERTEX_SHADER);
				gl.shaderSource(vertShader, compiledVertShaderString);
				gl.compileShader(vertShader);

				var compiledFragShaderString = this._getFragShaderString(arguments);
				var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
				gl.shaderSource(fragShader, compiledFragShaderString);
				gl.compileShader(fragShader);

				if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
					console.log(compiledVertShaderString);
					console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(vertShader));
					throw 'Error compiling vertex shader';
				}
				if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
					console.log(compiledFragShaderString);
					console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(fragShader));
					throw 'Error compiling fragment shader';
				}

				if (this.debug) {
					console.log('Options:');
					console.dir(this);
					console.log('GLSL Shader Output:');
					console.log(compiledFragShaderString);
				}

				var program = this.program = gl.createProgram();
				gl.attachShader(program, vertShader);
				gl.attachShader(program, fragShader);
				gl.linkProgram(program);
				this.framebuffer = gl.createFramebuffer();
				this.framebuffer.width = texSize[0];
				this.framebuffer.height = texSize[1];

				var vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
				var texCoords = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);

				var texCoordOffset = vertices.byteLength;

				var buffer = this.buffer;
				if (!buffer) {
					buffer = this.buffer = gl.createBuffer();
					gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
					gl.bufferData(gl.ARRAY_BUFFER, vertices.byteLength + texCoords.byteLength, gl.STATIC_DRAW);
				} else {
					gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
				}

				gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
				gl.bufferSubData(gl.ARRAY_BUFFER, texCoordOffset, texCoords);

				var aPosLoc = gl.getAttribLocation(this.program, 'aPos');
				gl.enableVertexAttribArray(aPosLoc);
				gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, gl.FALSE, 0, 0);
				var aTexCoordLoc = gl.getAttribLocation(this.program, 'aTexCoord');
				gl.enableVertexAttribArray(aTexCoordLoc);
				gl.vertexAttribPointer(aTexCoordLoc, 2, gl.FLOAT, gl.FALSE, 0, texCoordOffset);

				this.setupOutputTexture();

				if (this.subKernelOutputTextures !== null) {
					var extDrawBuffersMap = this.extDrawBuffersMap = [gl.COLOR_ATTACHMENT0];
					for (var i = 0; i < this.subKernelOutputTextures.length; i++) {
						var subKernelOutputTexture = this.subKernelOutputTextures[i];
						extDrawBuffersMap.push(gl.COLOR_ATTACHMENT0 + i + 1);
						gl.activeTexture(gl.TEXTURE0 + arguments.length + i);
						gl.bindTexture(gl.TEXTURE_2D, subKernelOutputTexture);
						gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
						gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
						gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
						gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
						if (this.floatOutput) {
							gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize[0], texSize[1], 0, gl.RGBA, gl.FLOAT, null);
						} else {
							gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize[0], texSize[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
						}
					}
				}
			}

			/**
	   * @memberOf WebGLKernel#
	   * @function
	   * @name run
	   *
	   * @desc Run the kernel program, and send the output to renderOutput
	   *
	   * <p> This method calls a helper method *renderOutput* to return the result. </p>
	   *
	   * @returns {Object} Result The final output of the program, as float, and as Textures for reuse.
	   *
	   *
	   */

		}, {
			key: 'run',
			value: function run() {
				if (this.program === null) {
					this.build.apply(this, arguments);
				}
				var paramNames = this.paramNames;
				var paramTypes = this.paramTypes;
				var texSize = this.texSize;
				var gl = this._webGl;

				gl.useProgram(this.program);
				gl.scissor(0, 0, texSize[0], texSize[1]);

				if (!this.hardcodeConstants) {
					var uOutputDimLoc = this.getUniformLocation('uOutputDim');
					gl.uniform3fv(uOutputDimLoc, this.threadDim);
					var uTexSizeLoc = this.getUniformLocation('uTexSize');
					gl.uniform2fv(uTexSizeLoc, texSize);
				}

				var ratioLoc = this.getUniformLocation('ratio');
				gl.uniform2f(ratioLoc, texSize[0] / this.maxTexSize[0], texSize[1] / this.maxTexSize[1]);

				this.argumentsLength = 0;
				for (var texIndex = 0; texIndex < paramNames.length; texIndex++) {
					this._addArgument(arguments[texIndex], paramTypes[texIndex], paramNames[texIndex]);
				}

				if (this.graphical) {
					gl.bindRenderbuffer(gl.RENDERBUFFER, null);
					gl.bindFramebuffer(gl.FRAMEBUFFER, null);
					gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
					return;
				}

				gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
				//the call to this._addArgument may rewrite the outputTexture, keep this here
				var outputTexture = this.outputTexture;
				gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, outputTexture, 0);

				if (this.subKernelOutputTextures !== null) {
					for (var i = 0; i < this.subKernelOutputTextures.length; i++) {
						var subKernelOutputTexture = this.subKernelOutputTextures[i];
						gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i + 1, gl.TEXTURE_2D, subKernelOutputTexture, 0);
					}
					this.ext.drawBuffersWEBGL(this.extDrawBuffersMap);
				}

				gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

				if (this.subKernelOutputTextures !== null) {
					if (this.subKernels !== null) {
						var output = [];
						output.result = this.renderOutput(outputTexture);
						for (var _i = 0; _i < this.subKernels.length; _i++) {
							output.push(new Texture(this.subKernelOutputTextures[_i], texSize, this.output, this._webGl));
						}
						return output;
					} else if (this.subKernelProperties !== null) {
						var _output = {
							result: this.renderOutput(outputTexture)
						};
						var _i2 = 0;
						for (var p in this.subKernelProperties) {
							if (!this.subKernelProperties.hasOwnProperty(p)) continue;
							_output[p] = new Texture(this.subKernelOutputTextures[_i2], texSize, this.output, this._webGl);
							_i2++;
						}
						return _output;
					}
				}

				return this.renderOutput(outputTexture);
			}

			/**
	   * @memberOf WebGLKernel#
	   * @function
	   * @name renderOutput
	   *
	   *
	   * @desc Helper function to return webGl function's output.
	   * Since the program runs on GPU, we need to get the
	   * output of the program back to CPU and then return them.
	   *
	   * *Note*: This should not be called directly.
	   *
	   * @param {Object} outputTexture - Output Texture returned by webGl program
	   *
	   * @returns {Object|Array} result
	   *
	   *
	   */

		}, {
			key: 'renderOutput',
			value: function renderOutput(outputTexture) {
				var texSize = this.texSize;
				var gl = this._webGl;
				var threadDim = this.threadDim;
				var output = this.output;
				if (this.outputToTexture) {
					return new Texture(outputTexture, texSize, output, this._webGl);
				} else {
					var result = void 0;
					if (this.floatOutput) {
						result = new Float32Array(texSize[0] * texSize[1] * 4);
						gl.readPixels(0, 0, texSize[0], texSize[1], gl.RGBA, gl.FLOAT, result);
					} else {
						var bytes = new Uint8Array(texSize[0] * texSize[1] * 4);
						gl.readPixels(0, 0, texSize[0], texSize[1], gl.RGBA, gl.UNSIGNED_BYTE, bytes);
						result = new Float32Array(bytes.buffer);
					}

					result = result.subarray(0, threadDim[0] * threadDim[1] * threadDim[2]);

					if (output.length === 1) {
						return result;
					} else if (output.length === 2) {
						return utils.splitArray(result, output[0]);
					} else if (output.length === 3) {
						var cube = utils.splitArray(result, output[0] * output[1]);
						return cube.map(function (x) {
							return utils.splitArray(x, output[0]);
						});
					}
				}
			}

			/**
	   * @memberOf WebGLKernel#
	   * @function
	   * @name getOutputTexture
	   *
	   * @desc This uses *getTextureCache* to get the Texture Cache of the Output
	   *
	   * @returns {Object} Ouptut Texture Cache
	   *
	   */

		}, {
			key: 'getOutputTexture',
			value: function getOutputTexture() {
				return this.getTextureCache('OUTPUT');
			}

			/**
	   * @memberOf WebGLKernel#
	   * @function
	   * @name detachOutputTexture
	   *
	   * @desc Detaches output texture
	   *
	   *
	   */

		}, {
			key: 'detachOutputTexture',
			value: function detachOutputTexture() {
				this.detachTextureCache('OUTPUT');
			}

			/**
	   * @memberOf WebGLKernel#
	   * @function
	   * @name setupOutputTexture
	   *
	   * @desc Detaches a texture from cache if exists, and sets up output texture
	   */

		}, {
			key: 'setupOutputTexture',
			value: function setupOutputTexture() {
				var gl = this._webGl;
				var texSize = this.texSize;
				this.detachOutputTexture();
				this.outputTexture = this.getOutputTexture();
				gl.activeTexture(gl.TEXTURE0 + this.paramNames.length);
				gl.bindTexture(gl.TEXTURE_2D, this.outputTexture);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
				if (this.floatOutput) {
					gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize[0], texSize[1], 0, gl.RGBA, gl.FLOAT, null);
				} else {
					gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize[0], texSize[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
				}
			}

			/**
	   * @memberOf WebGLKernel#
	   * @function
	   * @name getArgumentTexture
	   *
	   * @desc This uses *getTextureCache** to get the Texture Cache of the argument supplied
	   *
	   * @param {String} name - Name of the argument
	   *
	   * 	Texture cache for the supplied argument
	   *
	   */

		}, {
			key: 'getArgumentTexture',
			value: function getArgumentTexture(name) {
				return this.getTextureCache('ARGUMENT_' + name);
			}

			/**
	   * @memberOf WebGLKernel#
	   * @name getSubKernelTexture
	   * @function
	   *
	   * @desc This uses *getTextureCache* to get the Texture Cache of the sub-kernel
	   *
	   * @param {String} name - Name of the subKernel
	   *
	   * @returns {Object} Texture cache for the subKernel
	   *
	   */

		}, {
			key: 'getSubKernelTexture',
			value: function getSubKernelTexture(name) {
				return this.getTextureCache('SUB_KERNEL_' + name);
			}

			/**
	   * @memberOf WebGLKernel#
	   * @name getTextureCache
	   * @function
	   *
	   * @desc Returns the Texture Cache of the supplied parameter (can be kernel, sub-kernel or argument)
	   *
	   * @param {String} name - Name of the subkernel, argument, or kernel.
	   *
	   * @returns {Object} Texture cache
	   *
	   */

		}, {
			key: 'getTextureCache',
			value: function getTextureCache(name) {
				if (this.outputToTexture) {
					// Don't retain a handle on the output texture, we might need to render on the same texture later
					return this._webGl.createTexture();
				}
				if (this.textureCache.hasOwnProperty(name)) {
					return this.textureCache[name];
				}
				return this.textureCache[name] = this._webGl.createTexture();
			}

			/**
	   * @memberOf WebGLKernel#
	   * @name detachTextureCache
	   * @function
	   * @desc removes a texture from the kernel's cache
	   * @param {String} name - Name of texture
	   */

		}, {
			key: 'detachTextureCache',
			value: function detachTextureCache(name) {
				delete this.textureCache[name];
			}

			/**
	   * @memberOf WebGLKernel#
	   * @function
	   * @name getUniformLocation
	   *
	   * @desc Return WebGlUniformLocation for various variables
	   * related to webGl program, such as user-defiend variables,
	   * as well as, dimension sizes, etc.
	   *
	   */

		}, {
			key: 'getUniformLocation',
			value: function getUniformLocation(name) {
				var location = this.programUniformLocationCache[name];
				if (!location) {
					location = this._webGl.getUniformLocation(this.program, name);
					this.programUniformLocationCache[name] = location;
				}
				return location;
			}

			/**
	   * @memberOf WebGLKernel#
	   * @function
	   * @name _getFragShaderArtifactMap
	   *
	   * @desc Generate Shader artifacts for the kernel program.
	   * The final object contains HEADER, KERNEL, MAIN_RESULT, and others.
	   *
	   * @param {Array} args - The actual parameters sent to the Kernel
	   *
	   * @returns {Object} An object containing the Shader Artifacts(CONSTANTS, HEADER, KERNEL, etc.)
	   *
	   */

		}, {
			key: '_getFragShaderArtifactMap',
			value: function _getFragShaderArtifactMap(args) {
				return {
					HEADER: this._getHeaderString(),
					LOOP_MAX: this._getLoopMaxString(),
					CONSTANTS: this._getConstantsString(),
					DECODE32_ENDIANNESS: this._getDecode32EndiannessString(),
					ENCODE32_ENDIANNESS: this._getEncode32EndiannessString(),
					GET_WRAPAROUND: this._getGetWraparoundString(),
					GET_TEXTURE_CHANNEL: this._getGetTextureChannelString(),
					GET_TEXTURE_INDEX: this._getGetTextureIndexString(),
					GET_RESULT: this._getGetResultString(),
					MAIN_PARAMS: this._getMainParamsString(args),
					MAIN_CONSTANTS: this._getMainConstantsString(),
					KERNEL: this._getKernelString(),
					MAIN_RESULT: this._getMainResultString()
				};
			}

			/**
	   * @memberOf WebGLKernel#
	   * @function
	   * @name _addArgument
	   *
	   * @desc Adds kernel parameters to the Argument Texture,
	   * binding it to the webGl instance, etc.
	   *
	   * @param {Array|Texture|Number} value - The actual argument supplied to the kernel
	   * @param {String} type - Type of the argument
	   * @param {String} name - Name of the argument
	   *
	   */

		}, {
			key: '_addArgument',
			value: function _addArgument(value, type, name) {
				var gl = this._webGl;
				var argumentTexture = this.getArgumentTexture(name);
				if (value instanceof Texture) {
					type = 'Texture';
				}
				switch (type) {
					case 'Array':
						{
							var dim = utils.getDimensions(value, true);
							var size = utils.dimToTexSize({
								floatTextures: this.floatTextures,
								floatOutput: this.floatOutput
							}, dim);
							gl.activeTexture(gl.TEXTURE0 + this.argumentsLength);
							gl.bindTexture(gl.TEXTURE_2D, argumentTexture);
							gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
							gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
							gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
							gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

							var length = size[0] * size[1];
							if (this.floatTextures) {
								length *= 4;
							}

							var valuesFlat = new Float32Array(length);
							utils.flattenTo(value, valuesFlat);

							var buffer = void 0;
							if (this.floatTextures) {
								gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size[0], size[1], 0, gl.RGBA, gl.FLOAT, valuesFlat);
							} else {
								buffer = new Uint8Array(valuesFlat.buffer);
								gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size[0], size[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, buffer);
							}

							var loc = this.getUniformLocation('user_' + name);
							var locSize = this.getUniformLocation('user_' + name + 'Size');
							var dimLoc = this.getUniformLocation('user_' + name + 'Dim');

							if (!this.hardcodeConstants) {
								gl.uniform3fv(dimLoc, dim);
								gl.uniform2fv(locSize, size);
							}
							gl.uniform1i(loc, this.argumentsLength);
							break;
						}
					case 'Number':
						{
							var _loc = this.getUniformLocation('user_' + name);
							gl.uniform1f(_loc, value);
							break;
						}
					case 'Input':
						{
							var input = value;
							var _dim = input.size;
							var _size = utils.dimToTexSize({
								floatTextures: this.floatTextures,
								floatOutput: this.floatOutput
							}, _dim);
							gl.activeTexture(gl.TEXTURE0 + this.argumentsLength);
							gl.bindTexture(gl.TEXTURE_2D, argumentTexture);
							gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
							gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
							gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
							gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

							var _length = _size[0] * _size[1];
							var inputArray = void 0;
							if (this.floatTextures) {
								_length *= 4;
								inputArray = new Float32Array(_length);
								inputArray.set(input.value);
							} else {
								inputArray = input.value;
							}

							if (this.floatTextures) {
								gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _size[0], _size[1], 0, gl.RGBA, gl.FLOAT, inputArray);
							} else {
								var _buffer = new Uint8Array(inputArray.buffer);
								gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _size[0], _size[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, _buffer);
							}

							var _loc2 = this.getUniformLocation('user_' + name);
							var _locSize = this.getUniformLocation('user_' + name + 'Size');
							var _dimLoc = this.getUniformLocation('user_' + name + 'Dim');

							if (!this.hardcodeConstants) {
								gl.uniform3fv(_dimLoc, _dim);
								gl.uniform2fv(_locSize, _size);
							}
							gl.uniform1i(_loc2, this.argumentsLength);
							break;
						}
					case 'Texture':
						{
							var inputTexture = value;
							var _dim2 = utils.getDimensions(inputTexture, true);

							var _size2 = inputTexture.size;

							if (inputTexture.texture === this.outputTexture) {
								this.setupOutputTexture();
							}

							gl.activeTexture(gl.TEXTURE0 + this.argumentsLength);
							gl.bindTexture(gl.TEXTURE_2D, inputTexture.texture);

							var _loc3 = this.getUniformLocation('user_' + name);
							var _locSize2 = this.getUniformLocation('user_' + name + 'Size');
							var _dimLoc2 = this.getUniformLocation('user_' + name + 'Dim');

							gl.uniform3fv(_dimLoc2, _dim2);
							gl.uniform2fv(_locSize2, _size2);
							gl.uniform1i(_loc3, this.argumentsLength);
							break;
						}
					default:
						throw 'Input type not supported (WebGL): ' + value;
				}
				this.argumentsLength++;
			}

			/**
	   * @memberOf WebGLKernel#
	   * @function
	   * @name _getHeaderString
	   *
	   * @desc Get the header string for the program.
	   * This returns an empty string if no sub-kernels are defined.
	   *
	   * @returns {String} result
	   *
	   */

		}, {
			key: '_getHeaderString',
			value: function _getHeaderString() {
				return this.subKernels !== null || this.subKernelProperties !== null ?
				//webgl2 '#version 300 es\n' :
				'#extension GL_EXT_draw_buffers : require\n' : '';
			}

			/**
	   * @memberOf WebGLKernel#
	   * @function
	   * @name _getLoopMaxString
	   *
	   * @desc Get the maximum loop size String.
	   *
	   * @returns {String} result
	   *
	   */

		}, {
			key: '_getLoopMaxString',
			value: function _getLoopMaxString() {
				return this.loopMaxIterations ? ' ' + parseInt(this.loopMaxIterations) + '.0;\n' : ' 1000.0;\n';
			}

			/**
	   * @memberOf WebGLKernel#
	   * @function
	   * @name _getConstantsString
	   *
	   * @desc Generate transpiled glsl Strings for constant parameters sent to a kernel
	   *
	   * They can be defined by *hardcodeConstants*
	   *
	   * @returns {String} result
	   *
	   */

		}, {
			key: '_getConstantsString',
			value: function _getConstantsString() {
				var result = [];
				var threadDim = this.threadDim;
				var texSize = this.texSize;
				if (this.hardcodeConstants) {
					result.push('highp vec3 uOutputDim = vec3(' + threadDim[0] + ',' + threadDim[1] + ', ' + threadDim[2] + ')', 'highp vec2 uTexSize = vec2(' + texSize[0] + ', ' + texSize[1] + ')');
				} else {
					result.push('uniform highp vec3 uOutputDim', 'uniform highp vec2 uTexSize');
				}

				return this._linesToString(result);
			}

			/**
	   * @memberOf WebGLKernel#
	   * @function
	   * @name _getTextureCoordinate
	   *
	   * @desc Get texture coordinate string for the program
	   *
	   * @returns {String} result
	   *
	   */

		}, {
			key: '_getTextureCoordinate',
			value: function _getTextureCoordinate() {
				var names = this.subKernelOutputVariableNames;
				if (names === null || names.length < 1) {
					return 'varying highp vec2 vTexCoord;\n';
				} else {
					return 'out highp vec2 vTexCoord;\n';
				}
			}

			/**
	   * @memberOf WebGLKernel#
	   * @function
	   * @name _getDecode32EndiannessString
	   *
	   * @desc Get Decode32 endianness string for little-endian and big-endian
	   *
	   * @returns {String} result
	   *
	   */

		}, {
			key: '_getDecode32EndiannessString',
			value: function _getDecode32EndiannessString() {
				return this.endianness === 'LE' ? '' : '  rgba.rgba = rgba.abgr;\n';
			}

			/**
	   * @memberOf WebGLKernel#
	   * @function
	   * @name _getEncode32EndiannessString
	   *
	   * @desc Get Encode32 endianness string for little-endian and big-endian
	   *
	   * @returns {String} result
	   *
	   */

		}, {
			key: '_getEncode32EndiannessString',
			value: function _getEncode32EndiannessString() {
				return this.endianness === 'LE' ? '' : '  rgba.rgba = rgba.abgr;\n';
			}

			/**
	   * @function
	   * @memberOf WebGLKernel#
	   * @name _getGetWraparoundString
	   *
	   * @returns {String} wraparound string
	   */

		}, {
			key: '_getGetWraparoundString',
			value: function _getGetWraparoundString() {
				return this.wraparound ? '  xyz = mod(xyz, texDim);\n' : '';
			}

			/**
	   * @memberOf WebGLKernel#
	   * @function
	   * @name _getGetTextureChannelString
	   *
	   */

		}, {
			key: '_getGetTextureChannelString',
			value: function _getGetTextureChannelString() {
				if (!this.floatTextures) return '';

				return this._linesToString(['  int channel = int(integerMod(index, 4.0))', '  index = float(int(index) / 4)']);
			}

			/**
	   * @memberOf WebGLKernel#
	   * @function
	   * @name _getGetTextureIndexString
	   *
	   * @desc Get generic texture index string, if floatTextures flag is true.
	   *
	   * @example
	   * '  index = float(int(index)/4);\n'
	   *
	   */

		}, {
			key: '_getGetTextureIndexString',
			value: function _getGetTextureIndexString() {
				return this.floatTextures ? '  index = float(int(index)/4);\n' : '';
			}

			/**
	   * @memberOf WebGLKernel#
	   * @function
	   * @name _getGetResultString
	   *
	   */

		}, {
			key: '_getGetResultString',
			value: function _getGetResultString() {
				if (!this.floatTextures) return '  return decode32(texel);\n';
				return this._linesToString(['  if (channel == 0) return texel.r', '  if (channel == 1) return texel.g', '  if (channel == 2) return texel.b', '  if (channel == 3) return texel.a']);
			}

			/**
	   * @memberOf WebGLKernel#
	   * @function
	   * @name _getMainParamsString
	   *
	   * @desc Generate transpiled glsl Strings for user-defined parameters sent to a kernel
	   *
	   * @param {Array} args - The actual parameters sent to the Kernel
	   *
	   * @returns {String} result
	   *
	   */

		}, {
			key: '_getMainParamsString',
			value: function _getMainParamsString(args) {
				var result = [];
				var paramTypes = this.paramTypes;
				var paramNames = this.paramNames;
				for (var i = 0; i < paramNames.length; i++) {
					var param = args[i];
					var paramName = paramNames[i];
					var paramType = paramTypes[i];
					if (this.hardcodeConstants) {
						if (paramType === 'Array' || paramType === 'Texture') {
							var paramDim = utils.getDimensions(param, true);
							var paramSize = utils.dimToTexSize({
								floatTextures: this.floatTextures,
								floatOutput: this.floatOutput
							}, paramDim);

							result.push('uniform highp sampler2D user_' + paramName, 'highp vec2 user_' + paramName + 'Size = vec2(' + paramSize[0] + '.0, ' + paramSize[1] + '.0)', 'highp vec3 user_' + paramName + 'Dim = vec3(' + paramDim[0] + '.0, ' + paramDim[1] + '.0, ' + paramDim[2] + '.0)');
						} else if (paramType === 'Number' && Number.isInteger(param)) {
							result.push('highp float user_' + paramName + ' = ' + param + '.0');
						} else if (paramType === 'Number') {
							result.push('highp float user_' + paramName + ' = ' + param);
						}
					} else {
						if (paramType === 'Array' || paramType === 'Texture' || paramType === 'Input') {
							result.push('uniform highp sampler2D user_' + paramName, 'uniform highp vec2 user_' + paramName + 'Size', 'uniform highp vec3 user_' + paramName + 'Dim');
						} else if (paramType === 'Number') {
							result.push('uniform highp float user_' + paramName);
						}
					}
				}
				return this._linesToString(result);
			}

			/**
	   * @memberOf WebGLKernel#
	   * @function
	   * @name _getMainConstantsString
	   *
	   */

		}, {
			key: '_getMainConstantsString',
			value: function _getMainConstantsString() {
				var result = [];
				if (this.constants) {
					for (var name in this.constants) {
						if (!this.constants.hasOwnProperty(name)) continue;
						var value = parseFloat(this.constants[name]);

						if (Number.isInteger(value)) {
							result.push('const float constants_' + name + ' = ' + parseInt(value) + '.0');
						} else {
							result.push('const float constants_' + name + ' = ' + parseFloat(value));
						}
					}
				}
				return this._linesToString(result);
			}

			/**
	   * @memberOf WebGLKernel#
	   * @function
	   * @name _getKernelString
	   *
	   * @desc Get Kernel program string (in *glsl*) for a kernel.
	   *
	   * @returns {String} result
	   *
	   */

		}, {
			key: '_getKernelString',
			value: function _getKernelString() {
				var result = [];
				var names = this.subKernelOutputVariableNames;
				if (names !== null) {
					result.push('highp float kernelResult = 0.0');
					for (var i = 0; i < names.length; i++) {
						result.push('highp float ' + names[i] + ' = 0.0');
					}

					/* this is v2 prep
	       result.push('highp float kernelResult = 0.0');
	    result.push('layout(location = 0) out highp float fradData0 = 0.0');
	    for (let i = 0; i < names.length; i++) {
	    	result.push(
	           `highp float ${ names[i] } = 0.0`,
	    	  `layout(location = ${ i + 1 }) out highp float fragData${ i + 1 } = 0.0`
	         );
	    }*/
				} else {
					result.push('highp float kernelResult = 0.0');
				}

				return this._linesToString(result) + this.functionBuilder.getPrototypeString('kernel');
			}

			/**
	   *
	   * @memberOf WebGLKernel#
	   * @function
	   * @name _getMainResultString
	   *
	   * @desc Get main result string with checks for floatOutput, graphical, subKernelsOutputs, etc.
	   *
	   * @returns {String} result
	   *
	   */

		}, {
			key: '_getMainResultString',
			value: function _getMainResultString() {
				var names = this.subKernelOutputVariableNames;
				var result = [];
				if (this.floatOutput) {
					result.push('  index *= 4.0');
				}

				if (this.graphical) {
					result.push('  threadId = indexTo3D(index, uOutputDim)', '  kernel()', '  gl_FragColor = actualColor');
				} else if (this.floatOutput) {
					result.push('  threadId = indexTo3D(index, uOutputDim)', '  kernel()', '  gl_FragColor.r = kernelResult', '  index += 1.0', '  threadId = indexTo3D(index, uOutputDim)', '  kernel()', '  gl_FragColor.g = kernelResult', '  index += 1.0', '  threadId = indexTo3D(index, uOutputDim)', '  kernel()', '  gl_FragColor.b = kernelResult', '  index += 1.0', '  threadId = indexTo3D(index, uOutputDim)', '  kernel()', '  gl_FragColor.a = kernelResult');
				} else if (names !== null) {
					result.push('  threadId = indexTo3D(index, uOutputDim)');
					result.push('  kernel()');
					result.push('  gl_FragData[0] = encode32(kernelResult)');
					for (var i = 0; i < names.length; i++) {
						result.push('  gl_FragData[' + (i + 1) + '] = encode32(' + names[i] + ')');
					}
					/* this is v2 prep
	        * result.push('  kernel()');
	    result.push('  fragData0 = encode32(kernelResult)');
	    for (let i = 0; i < names.length; i++) {
	    	result.push(`  fragData${ i + 1 } = encode32(${ names[i] })`);
	    }*/
				} else {
					result.push('  threadId = indexTo3D(index, uOutputDim)', '  kernel()', '  gl_FragColor = encode32(kernelResult)');
				}

				return this._linesToString(result);
			}

			/**
	   * @memberOf WebGLKernel#
	   * @function
	   * @name _linesToString
	   *
	   * @param {Array} lines - An Array of strings
	   *
	   * @returns {String} Single combined String, seperated by *\n*
	   *
	   */

		}, {
			key: '_linesToString',
			value: function _linesToString(lines) {
				if (lines.length > 0) {
					return lines.join(';\n') + ';\n';
				} else {
					return '\n';
				}
			}

			/**
	   * @memberOf WebGLKernel#
	   * @function
	   * @name _replaceArtifacts
	   *
	   * @param {String} src - Shader string
	   * @param {Array} map - Variables/Constants associated with shader
	   *
	   */

		}, {
			key: '_replaceArtifacts',
			value: function _replaceArtifacts(src, map) {
				return src.replace(/[ ]*__([A-Z]+[0-9]*([_]?[A-Z])*)__;\n/g, function (match, artifact) {
					if (map.hasOwnProperty(artifact)) {
						return map[artifact];
					}
					throw 'unhandled artifact ' + artifact;
				});
			}

			/**
	   * @memberOf WebGLKernel#
	   * @function
	   * @name _addKernels
	   *
	   * @desc Adds all the sub-kernels supplied with this Kernel instance.
	   *
	   */

		}, {
			key: '_addKernels',
			value: function _addKernels() {
				var builder = this.functionBuilder;
				var gl = this._webGl;

				builder.addFunctions(this.functions, {
					constants: this.constants,
					output: this.output
				});
				builder.addNativeFunctions(this.nativeFunctions);

				builder.addKernel(this.fnString, {
					prototypeOnly: false,
					constants: this.constants,
					output: this.output,
					debug: this.debug,
					loopMaxIterations: this.loopMaxIterations
				}, this.paramNames, this.paramTypes);

				if (this.subKernels !== null) {
					var ext = this.ext = gl.getExtension('WEBGL_draw_buffers');
					if (!ext) throw new Error('could not instantiate draw buffers extension');
					this.subKernelOutputTextures = [];
					this.subKernelOutputVariableNames = [];
					for (var i = 0; i < this.subKernels.length; i++) {
						var subKernel = this.subKernels[i];
						builder.addSubKernel(subKernel, {
							prototypeOnly: false,
							constants: this.constants,
							output: this.output,
							debug: this.debug,
							loopMaxIterations: this.loopMaxIterations
						});
						this.subKernelOutputTextures.push(this.getSubKernelTexture(i));
						this.subKernelOutputVariableNames.push(subKernel.name + 'Result');
					}
				} else if (this.subKernelProperties !== null) {
					var _ext = this.ext = gl.getExtension('WEBGL_draw_buffers');
					if (!_ext) throw new Error('could not instantiate draw buffers extension');
					this.subKernelOutputTextures = [];
					this.subKernelOutputVariableNames = [];
					var _i3 = 0;
					for (var p in this.subKernelProperties) {
						if (!this.subKernelProperties.hasOwnProperty(p)) continue;
						var _subKernel = this.subKernelProperties[p];
						builder.addSubKernel(_subKernel, {
							prototypeOnly: false,
							constants: this.constants,
							output: this.output,
							debug: this.debug,
							loopMaxIterations: this.loopMaxIterations
						});
						this.subKernelOutputTextures.push(this.getSubKernelTexture(p));
						this.subKernelOutputVariableNames.push(_subKernel.name + 'Result');
						_i3++;
					}
				}
			}

			/**
	   * @memberOf WebGLKernel#
	   * @function
	   * @name _getFragShaderString
	   *
	   * @desc Get the fragment shader String.
	   * If the String hasn't been compiled yet,
	   * then this method compiles it as well
	   *
	   * @param {Array} args - The actual parameters sent to the Kernel
	   *
	   * @returns {String} Fragment Shader string
	   *
	   */

		}, {
			key: '_getFragShaderString',
			value: function _getFragShaderString(args) {
				if (this.compiledFragShaderString !== null) {
					return this.compiledFragShaderString;
				}
				return this.compiledFragShaderString = this._replaceArtifacts(fragShaderString, this._getFragShaderArtifactMap(args));
			}

			/**
	   * @memberOf WebGLKernel#
	   * @function
	   * @name _getVertShaderString
	   *
	   * @desc Get the vertical shader String
	   *
	   * @param {Array} args - The actual parameters sent to the Kernel
	   *
	   * @returns {String} Vertical Shader string
	   *
	   */

		}, {
			key: '_getVertShaderString',
			value: function _getVertShaderString(args) {
				if (this.compiledVertShaderString !== null) {
					return this.compiledVertShaderString;
				}
				//TODO: webgl2 compile like frag shader
				return this.compiledVertShaderString = vertShaderString;
			}

			/**
	   * @memberOf WebGLKernel#
	   * @function
	   * @name toString
	   *
	   * @desc Returns the *pre-compiled* Kernel as a JS Object String, that can be reused.
	   *
	   */

		}, {
			key: 'toString',
			value: function toString() {
				return kernelString(this);
			}
		}, {
			key: 'addFunction',
			value: function addFunction(fn) {
				this.functionBuilder.addFunction(null, fn);
			}
		}]);

		return WebGLKernel;
	}(KernelBase);

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var utils = __webpack_require__(24);

	module.exports = function () {

		/**
	  * @constructor BaseKernel
	  * 
	  * @desc Implements the base class for Kernels, and is used as a 
	  * parent class for all Kernel implementations.
	  *
	  * This contains the basic methods needed by all Kernel implementations, 
	  * like setDimensions, addSubKernel, etc.
	  * 
	  * @prop {Array} paramNames - Name of the parameters of the kernel function
	  * @prop {String} fnString - Kernel function as a String
	  * @prop {Array} dimensions - Dimensions of the kernel function, this.thread.x, etc.
	  * @prop {Boolean} debug - Toggle debug mode
	  * @prop {String} graphical - Toggle graphical mode
	  * @prop {number} loopMaxIterations - Maximum number of loop iterations
	  * @prop {Object} constants - Global constants
	  * @prop {Array} subKernels - Sub kernels bound to this kernel instance
	  * @prop {Object} subKernelProperties - Sub kernels bound to this kernel instance as key/value pairs
	  * @prop {Array} subKernelOutputVariableNames - Names of the variables outputted by the subkerls
	  *
	  */
		function BaseKernel(fnString, settings) {
			_classCallCheck(this, BaseKernel);

			this.paramNames = utils.getParamNamesFromString(fnString);
			this.fnString = fnString;
			this.output = null;
			this.debug = false;
			this.graphical = false;
			this.loopMaxIterations = 0;
			this.constants = null;
			this.wraparound = null;
			this.hardcodeConstants = null;
			this.outputToTexture = null;
			this.texSize = null;
			this._canvas = null;
			this._webGl = null;
			this.threadDim = null;
			this.floatTextures = null;
			this.floatOutput = null;
			this.floatOutputForce = null;
			this.addFunction = null;
			this.functions = null;
			this.nativeFunctions = null;
			this.copyData = true;
			this.subKernels = null;
			this.subKernelProperties = null;
			this.subKernelNames = null;
			this.subKernelOutputVariableNames = null;
			this.functionBuilder = null;
			this.paramTypes = null;

			for (var p in settings) {
				if (!settings.hasOwnProperty(p) || !this.hasOwnProperty(p)) continue;
				this[p] = settings[p];
			}
			if (settings.hasOwnProperty('canvas')) {
				this._canvas = settings.canvas;
			}
			if (settings.hasOwnProperty('output')) {
				this.setOutput(settings.output); // Flatten output object
			}

			if (!this._canvas) this._canvas = utils.initCanvas();
		}

		_createClass(BaseKernel, [{
			key: 'build',
			value: function build() {
				throw new Error('"build" not defined on Base');
			}

			/**
	   * @memberOf KernelBase#
	   * @function
	   * @name setupParams
	   *
	   * @desc Setup the parameter types for the parameters
	   * supplied to the Kernel function
	   *
	   * @param {Array} args - The actual parameters sent to the Kernel
	   *
	   */

		}, {
			key: 'setupParams',
			value: function setupParams(args) {
				var paramTypes = this.paramTypes = [];
				for (var i = 0; i < args.length; i++) {
					var param = args[i];
					var paramType = utils.getArgumentType(param);
					paramTypes.push(paramType);
				}
			}
		}, {
			key: 'setAddFunction',
			value: function setAddFunction(cb) {
				this.addFunction = cb;
				return this;
			}
		}, {
			key: 'setFunctions',
			value: function setFunctions(functions) {
				this.functions = functions;
				return this;
			}

			/**
	   * @memberOf BaseKernel#
	   * @function
	   * @name setOutput
	   *
	   * @desc Set dimensions of the kernel function
	   *
	   * @param {Array|Object} output - The output array to set the kernel output size to
	   *
	   */

		}, {
			key: 'setOutput',
			value: function setOutput(output) {
				if (output.hasOwnProperty('x')) {
					if (output.hasOwnProperty('y')) {
						if (output.hasOwnProperty('z')) {
							this.output = [output.x, output.y, output.z];
						} else {
							this.output = [output.x, output.y];
						}
					} else {
						this.output = [output.x];
					}
				} else {
					this.output = output;
				}
				return this;
			}

			/**
	   * @memberOf BaseKernel# 
	   * @function
	   * @name setDebug
	   *
	   * @desc Toggle debug mode
	   *
	   * @param {Boolean} flag - true to enable debug
	   *
	   */

		}, {
			key: 'setDebug',
			value: function setDebug(flag) {
				this.debug = flag;
				return this;
			}

			/**
	   * @memberOf BaseKernel#
	   * @function
	   * @name setGraphical
	   *
	   * @desc Toggle graphical output mode
	   *
	   * @param {Boolean} flag - true to enable graphical output
	   *
	   */

		}, {
			key: 'setGraphical',
			value: function setGraphical(flag) {
				this.graphical = flag;
				return this;
			}

			/**
	   * @memberOf BaseKernel#
	   * @function
	   * @name setLoopMaxIterations
	   *
	   * @desc Set the maximum number of loop iterations
	   *
	   * @param {number} max - iterations count
	   *
	   */

		}, {
			key: 'setLoopMaxIterations',
			value: function setLoopMaxIterations(max) {
				this.loopMaxIterations = max;
				return this;
			}

			/**
	   * @memberOf BaseKernel#
	   * @function
	   * @name setConstants
	   * @desc Set Constants
	   */

		}, {
			key: 'setConstants',
			value: function setConstants(constants) {
				this.constants = constants;
				return this;
			}
		}, {
			key: 'setWraparound',
			value: function setWraparound(flag) {
				console.warn('Wraparound mode is not supported and undocumented.');
				this.wraparound = flag;
				return this;
			}
		}, {
			key: 'setHardcodeConstants',
			value: function setHardcodeConstants(flag) {
				this.hardcodeConstants = flag;
				return this;
			}
		}, {
			key: 'setOutputToTexture',
			value: function setOutputToTexture(flag) {
				this.outputToTexture = flag;
				return this;
			}

			/**
	   * @memberOf BaseKernel#
	   * @function
	   * @name setFloatTextures
	   *
	   * @desc Toggle texture output mode
	   *
	   * @param {Boolean} flag - true to enable floatTextures
	   *
	   */

		}, {
			key: 'setFloatTextures',
			value: function setFloatTextures(flag) {
				this.floatTextures = flag;
				return this;
			}

			/**
	   * @memberOf BaseKernel#
	   * @function
	   * @name setFloatOutput
	   *
	   * @desc Toggle output mode
	   *
	   * @param {Boolean} flag - true to enable float
	   *
	   */

		}, {
			key: 'setFloatOutput',
			value: function setFloatOutput(flag) {
				this.floatOutput = flag;
				return this;
			}
		}, {
			key: 'setFloatOutputForce',
			value: function setFloatOutputForce(flag) {
				this.floatOutputForce = flag;
				return this;
			}

			/**
	   * @memberOf BaseKernel#
	   * @function
	   * @name setCanvas
	   *
	   * @desc Bind the canvas to kernel
	   * 
	   * @param {Canvas} canvas - Canvas to bind
	   *
	   */

		}, {
			key: 'setCanvas',
			value: function setCanvas(canvas) {
				this._canvas = canvas;
				return this;
			}

			/**
	   * @memberOf BaseKernel#
	   * @function
	   * @name setCanvas
	   *
	   * @desc Bind the webGL instance to kernel
	   * 
	   * @param {Canvas} webGL - webGL instance to bind
	   *
	   */

		}, {
			key: 'setWebGl',
			value: function setWebGl(webGl) {
				this._webGl = webGl;
				return this;
			}
		}, {
			key: 'setCopyData',
			value: function setCopyData(copyData) {
				this.copyData = copyData;
				return this;
			}

			/**
	   * @memberOf BaseKernel#
	   * @function
	   * @name getCanvas()
	   *
	   * @desc Returns the current canvas instance bound to the kernel
	   *
	   */

		}, {
			key: 'getCanvas',
			value: function getCanvas() {
				return this._canvas;
			}

			/**
	   * @memberOf BaseKernel#
	   * @function
	   * @name getWebGl()
	   *
	   * @desc Returns the current webGl instance bound to the kernel
	   *
	   */

		}, {
			key: 'getWebGl',
			value: function getWebGl() {
				return this._webGl;
			}
		}, {
			key: 'validateOptions',
			value: function validateOptions() {
				throw new Error('validateOptions not defined');
			}
		}, {
			key: 'exec',
			value: function exec() {
				return this.execute.apply(this, arguments);
			}
		}, {
			key: 'execute',
			value: function execute() {
				var _this = this;

				//
				// Prepare the required objects
				//
				var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);

				//
				// Setup and return the promise, and execute the function, in synchronous mode
				//
				return utils.newPromise(function (accept, reject) {
					try {
						accept(_this.run.apply(_this, args));
					} catch (e) {
						//
						// Error : throw rejection
						//
						reject(e);
					}
				});
			}

			/** 
	   * @memberOf BaseKernel#
	   * @function
	   * @name addSubKernel
	   *
	   * @desc Add a sub kernel to the root kernel instance.
	   * This is what `createKernelMap` uses.
	   *
	   * @param {String} fnString - function (as a String) of the subKernel to add
	   *
	   */

		}, {
			key: 'addSubKernel',
			value: function addSubKernel(fnString) {
				if (this.subKernels === null) {
					this.subKernels = [];
					this.subKernelNames = [];
				}
				this.subKernels.push(fnString);
				this.subKernelNames.push(utils.getFunctionNameFromString(fnString));
				return this;
			}

			/** 
	   * @memberOf BaseKernel#
	   * @function
	   * @name addSubKernelProperty
	   *
	   * @desc Add a sub kernel to the root kernel instance, indexed by a property name
	   * This is what `createKernelMap` uses.
	   *
	   * @param {String} property - property key for the subKernel
	   * @param {String} fnString - function (as a String) of the subKernel to add
	   *
	   */

		}, {
			key: 'addSubKernelProperty',
			value: function addSubKernelProperty(property, fnString) {
				if (this.subKernelProperties === null) {
					this.subKernelProperties = {};
					this.subKernelNames = [];
				}
				if (this.subKernelProperties.hasOwnProperty(property)) {
					throw new Error('cannot add sub kernel ' + property + ', already defined');
				}
				this.subKernelProperties[property] = fnString;
				this.subKernelNames.push(utils.getFunctionNameFromString(fnString));
				return this;
			}
		}, {
			key: 'addNativeFunction',
			value: function addNativeFunction(name, source) {
				this.functionBuilder.addNativeFunction(name, source);
			}
		}]);

		return BaseKernel;
	}();

/***/ }),
/* 33 */
/***/ (function(module, exports) {

	"use strict";

	module.exports = "__HEADER__;\nprecision highp float;\nprecision highp int;\nprecision highp sampler2D;\n\nconst float LOOP_MAX = __LOOP_MAX__;\n#define EPSILON 0.0000001;\n\n__CONSTANTS__;\n\nvarying highp vec2 vTexCoord;\n\nvec4 round(vec4 x) {\n  return floor(x + 0.5);\n}\n\nhighp float round(highp float x) {\n  return floor(x + 0.5);\n}\n\nvec2 integerMod(vec2 x, float y) {\n  vec2 res = floor(mod(x, y));\n  return res * step(1.0 - floor(y), -res);\n}\n\nvec3 integerMod(vec3 x, float y) {\n  vec3 res = floor(mod(x, y));\n  return res * step(1.0 - floor(y), -res);\n}\n\nvec4 integerMod(vec4 x, vec4 y) {\n  vec4 res = floor(mod(x, y));\n  return res * step(1.0 - floor(y), -res);\n}\n\nhighp float integerMod(highp float x, highp float y) {\n  highp float res = floor(mod(x, y));\n  return res * (res > floor(y) - 1.0 ? 0.0 : 1.0);\n}\n\nhighp int integerMod(highp int x, highp int y) {\n  return int(integerMod(float(x), float(y)));\n}\n\n// Here be dragons!\n// DO NOT OPTIMIZE THIS CODE\n// YOU WILL BREAK SOMETHING ON SOMEBODY'S MACHINE\n// LEAVE IT AS IT IS, LEST YOU WASTE YOUR OWN TIME\nconst vec2 MAGIC_VEC = vec2(1.0, -256.0);\nconst vec4 SCALE_FACTOR = vec4(1.0, 256.0, 65536.0, 0.0);\nconst vec4 SCALE_FACTOR_INV = vec4(1.0, 0.00390625, 0.0000152587890625, 0.0); // 1, 1/256, 1/65536\nhighp float decode32(highp vec4 rgba) {\n  __DECODE32_ENDIANNESS__;\n  rgba *= 255.0;\n  vec2 gte128;\n  gte128.x = rgba.b >= 128.0 ? 1.0 : 0.0;\n  gte128.y = rgba.a >= 128.0 ? 1.0 : 0.0;\n  float exponent = 2.0 * rgba.a - 127.0 + dot(gte128, MAGIC_VEC);\n  float res = exp2(round(exponent));\n  rgba.b = rgba.b - 128.0 * gte128.x;\n  res = dot(rgba, SCALE_FACTOR) * exp2(round(exponent-23.0)) + res;\n  res *= gte128.y * -2.0 + 1.0;\n  return res;\n}\n\nhighp vec4 encode32(highp float f) {\n  highp float F = abs(f);\n  highp float sign = f < 0.0 ? 1.0 : 0.0;\n  highp float exponent = floor(log2(F));\n  highp float mantissa = (exp2(-exponent) * F);\n  // exponent += floor(log2(mantissa));\n  vec4 rgba = vec4(F * exp2(23.0-exponent)) * SCALE_FACTOR_INV;\n  rgba.rg = integerMod(rgba.rg, 256.0);\n  rgba.b = integerMod(rgba.b, 128.0);\n  rgba.a = exponent*0.5 + 63.5;\n  rgba.ba += vec2(integerMod(exponent+127.0, 2.0), sign) * 128.0;\n  rgba = floor(rgba);\n  rgba *= 0.003921569; // 1/255\n  __ENCODE32_ENDIANNESS__;\n  return rgba;\n}\n// Dragons end here\n\nhighp float index;\nhighp vec3 threadId;\n\nhighp vec3 indexTo3D(highp float idx, highp vec3 texDim) {\n  highp float z = floor(idx / (texDim.x * texDim.y));\n  idx -= z * texDim.x * texDim.y;\n  highp float y = floor(idx / texDim.x);\n  highp float x = integerMod(idx, texDim.x);\n  return vec3(x, y, z);\n}\n\nhighp float get(highp sampler2D tex, highp vec2 texSize, highp vec3 texDim, highp float z, highp float y, highp float x) {\n  highp vec3 xyz = vec3(x, y, z);\n  xyz = floor(xyz + 0.5);\n  __GET_WRAPAROUND__;\n  highp float index = round(xyz.x + texDim.x * (xyz.y + texDim.y * xyz.z));\n  __GET_TEXTURE_CHANNEL__;\n  highp float w = round(texSize.x);\n  vec2 st = vec2(integerMod(index, w), float(int(index) / int(w))) + 0.5;\n  __GET_TEXTURE_INDEX__;\n  highp vec4 texel = texture2D(tex, st / texSize);\n  __GET_RESULT__;\n}\n\nhighp float get(highp sampler2D tex, highp vec2 texSize, highp vec3 texDim, highp float y, highp float x) {\n  return get(tex, texSize, texDim, 0.0, y, x);\n}\n\nhighp float get(highp sampler2D tex, highp vec2 texSize, highp vec3 texDim, highp float x) {\n  return get(tex, texSize, texDim, 0.0, 0.0, x);\n}\n\nhighp vec4 actualColor;\nvoid color(float r, float g, float b, float a) {\n  actualColor = vec4(r,g,b,a);\n}\n\nvoid color(float r, float g, float b) {\n  color(r,g,b,1.0);\n}\n\n__MAIN_PARAMS__;\n__MAIN_CONSTANTS__;\n__KERNEL__;\n\nvoid main(void) {\n  index = floor(vTexCoord.s * float(uTexSize.x)) + floor(vTexCoord.t * float(uTexSize.y)) * uTexSize.x;\n  __MAIN_RESULT__;\n}";

/***/ }),
/* 34 */
/***/ (function(module, exports) {

	"use strict";

	module.exports = "precision highp float;\nprecision highp int;\nprecision highp sampler2D;\n\nattribute highp vec2 aPos;\nattribute highp vec2 aTexCoord;\n\nvarying highp vec2 vTexCoord;\nuniform vec2 ratio;\n\nvoid main(void) {\n  gl_Position = vec4((aPos + vec2(1)) * ratio + vec2(-1), 0, 1);\n  vTexCoord = aTexCoord;\n}";

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(24);
	var kernelRunShortcut = __webpack_require__(30);

	module.exports = function (gpuKernel, name) {
	  return '() => {\n    ' + kernelRunShortcut.toString() + ';\n    const utils = {\n      allPropertiesOf: function ' + utils.allPropertiesOf.toString() + ',\n      clone: function ' + utils.clone.toString() + ',\n      splitArray: function ' + utils.splitArray.toString() + ',\n      getArgumentType: function ' + utils.getArgumentType.toString() + ',\n      getDimensions: function ' + utils.getDimensions.toString() + ',\n      dimToTexSize: function ' + utils.dimToTexSize.toString() + ',\n      copyFlatten: function ' + utils.copyFlatten.toString() + ',\n      flatten: function ' + utils.flatten.toString() + ',\n      systemEndianness: \'' + utils.systemEndianness() + '\',\n      initWebGl: function ' + utils.initWebGl.toString() + ',\n      isArray: function ' + utils.isArray.toString() + '\n    };\n    class ' + (name || 'Kernel') + ' {\n      constructor() {\n        this.argumentsLength = 0;\n        this._canvas = null;\n        this._webGl = null;\n        this.built = false;\n        this.program = null;\n        this.paramNames = ' + JSON.stringify(gpuKernel.paramNames) + ';\n        this.paramTypes = ' + JSON.stringify(gpuKernel.paramTypes) + ';\n        this.texSize = ' + JSON.stringify(gpuKernel.texSize) + ';\n        this.output = ' + JSON.stringify(gpuKernel.output) + ';\n        this.compiledFragShaderString = `' + gpuKernel.compiledFragShaderString + '`;\n\t\t    this.compiledVertShaderString = `' + gpuKernel.compiledVertShaderString + '`;\n\t\t    this.programUniformLocationCache = {};\n\t\t    this.textureCache = {};\n\t\t    this.subKernelOutputTextures = null;\n      }\n      ' + gpuKernel._getFragShaderString.toString() + '\n      ' + gpuKernel._getVertShaderString.toString() + '\n      validateOptions() {}\n      setupParams() {}\n      setCanvas(canvas) { this._canvas = canvas; return this; }\n      setWebGl(webGl) { this._webGl = webGl; return this; }\n      ' + gpuKernel.getUniformLocation.toString() + '\n      ' + gpuKernel.setupParams.toString() + '\n      ' + gpuKernel.build.toString() + '\n\t\t  ' + gpuKernel.run.toString() + '\n\t\t  ' + gpuKernel._addArgument.toString() + '\n\t\t  ' + gpuKernel.getArgumentTexture.toString() + '\n\t\t  ' + gpuKernel.getTextureCache.toString() + '\n\t\t  ' + gpuKernel.getOutputTexture.toString() + '\n\t\t  ' + gpuKernel.renderOutput.toString() + '\n    };\n    return kernelRunShortcut(new Kernel());\n  };';
	};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var FunctionBuilderBase = __webpack_require__(37);
	var WebGLFunctionNode = __webpack_require__(38);

	/**
	 * @class WebGLFunctionBuilder
	 *
	 * @extends FunctionBuilderBase
	 *
	 * @desc Builds webGl functions (shaders) from JavaScript function Strings
	 *
	 */
	module.exports = function (_FunctionBuilderBase) {
		_inherits(WebGLFunctionBuilder, _FunctionBuilderBase);

		function WebGLFunctionBuilder() {
			_classCallCheck(this, WebGLFunctionBuilder);

			var _this = _possibleConstructorReturn(this, (WebGLFunctionBuilder.__proto__ || Object.getPrototypeOf(WebGLFunctionBuilder)).call(this));

			_this.Node = WebGLFunctionNode;
			return _this;
		}

		//---------------------------------------------------------
		//
		//  Polyfill stuff
		//
		//---------------------------------------------------------

		// Round function used in polyfill


		_createClass(WebGLFunctionBuilder, [{
			key: 'polyfillStandardFunctions',


			/**
	   * @memberOf FunctionBuilderBase#
	   * @function
	   * @name polyfillStandardFunctions
	   *
	   * @desc Polyfill in the missing Math functions (round)
	   *
	   */
			value: function polyfillStandardFunctions() {
				this.addFunction('round', _round);
			}
		}], [{
			key: 'round',
			value: function round(a) {
				return _round(a);
			}
		}]);

		return WebGLFunctionBuilder;
	}(FunctionBuilderBase);

	function _round(a) {
		return Math.floor(a + 0.5);
	}

/***/ }),
/* 37 */
/***/ (function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	module.exports = function () {

		/**
	  * @constructor FunctionBuilderBase
	  *
	  * @desc This handles all the raw state, converted state, etc. of a single function.
	  * [INTERNAL] A collection of functionNodes.
	  * 
	  * @prop {Object} nodeMap - Object map, where nodeMap[function] = new FunctionNode;
	  * @prop {Object} gpu - The current gpu instance bound to this builder
	  * @prop {Object} rootKernel - The root kernel object, contains the paramNames, dimensions etc.
	  * 
	  */
		function FunctionBuilderBase(gpu) {
			_classCallCheck(this, FunctionBuilderBase);

			this.nodeMap = {};
			this.nativeFunctions = {};
			this.gpu = gpu;
			this.rootKernel = null;
			this.Node = null;
		}

		_createClass(FunctionBuilderBase, [{
			key: 'addNativeFunction',
			value: function addNativeFunction(functionName, glslFunctionString) {
				this.nativeFunctions[functionName] = glslFunctionString;
			}

			/**
	   * @memberOf FunctionBuilderBase#
	   * @function
	   * @name addFunction
	   *
	   * @desc Instantiates a FunctionNode, and add it to the nodeMap
	   *
	   * @param {String} functionName - Function name to assume, if its null, it attempts to extract from the function
	   * @param {Function} jsFunction - JS Function to do conversion
	   * @param {Object} [options]
	   * @param {String[]|Object} [paramTypes] - Parameter type array, assumes all parameters are 'float' if falsey
	   * @param {String} [returnType] - The return type, assumes 'float' if falsey
	   *
	   */

		}, {
			key: 'addFunction',
			value: function addFunction(functionName, jsFunction, options, paramTypes, returnType) {
				this.addFunctionNode(new this.Node(functionName, jsFunction, options, paramTypes, returnType).setAddFunction(this.addFunction.bind(this)));
			}
		}, {
			key: 'addFunctions',
			value: function addFunctions(functions, options) {
				if (functions) {
					if (Array.isArray(functions)) {
						for (var i = 0; i < functions.length; i++) {
							this.addFunction(null, functions[i], options);
						}
					} else {
						for (var p in functions) {
							this.addFunction(p, functions[p], options);
						}
					}
				}
			}
		}, {
			key: 'addNativeFunctions',
			value: function addNativeFunctions(nativeFunctions) {
				for (var functionName in nativeFunctions) {
					if (!nativeFunctions.hasOwnProperty(functionName)) continue;
					this.addNativeFunction(functionName, nativeFunctions[functionName]);
				}
			}

			/**
	   * @memberOf FunctionBuilderBase#
	   * @function
	   * @name addFunctionNode
	   *
	   * @desc Add the function node directly
	   *
	   * @param {functionNode} inNode - functionNode to add
	   *
	   */

		}, {
			key: 'addFunctionNode',
			value: function addFunctionNode(inNode) {
				this.nodeMap[inNode.functionName] = inNode;
				if (inNode.isRootKernel) {
					this.rootKernel = inNode;
				}
			}

			/**
	   * @memberOf FunctionBuilderBase#
	   * @function
	   * @name traceFunctionCalls
	   *
	   * @desc Trace all the depending functions being called, from a single function
	   *
	   * This allow for 'unneeded' functions to be automatically optimized out.
	   * Note that the 0-index, is the starting function trace.
	   *
	   * @param {String} functionName - Function name to trace from, default to 'kernel'
	   * @param {String[]} retList - Returning list of function names that is traced. Including itself.
	   * @param {Object} [parent] - Parent node
	   *
	   * @returns {String[]}  Returning list of function names that is traced. Including itself.
	   */

		}, {
			key: 'traceFunctionCalls',
			value: function traceFunctionCalls(functionName, retList, parent) {
				functionName = functionName || 'kernel';
				retList = retList || [];

				var fNode = this.nodeMap[functionName];
				if (fNode) {
					// Check if function already exists
					var functionIndex = retList.indexOf(functionName);
					if (functionIndex === -1) {
						retList.push(functionName);
						if (parent) {
							fNode.parent = parent;
						}
						fNode.getFunctionString(); //ensure JS trace is done
						for (var i = 0; i < fNode.calledFunctions.length; ++i) {
							this.traceFunctionCalls(fNode.calledFunctions[i], retList, fNode);
						}
					} else {
						/**
	      * https://github.com/gpujs/gpu.js/issues/207
	      * if dependent function is already in the list, because a function depends on it, and because it has
	      * already been traced, we know that we must move the dependent function to the end of the the retList.
	      * */
						var dependantFunctionName = retList.splice(functionIndex, 1)[0];
						retList.push(dependantFunctionName);
					}
				}

				if (this.nativeFunctions[functionName]) {
					if (retList.indexOf(functionName) >= 0) {
						// Does nothing if already traced
					} else {
						retList.push(functionName);
					}
				}

				return retList;
			}

			/**
	   * @memberOf FunctionBuilderBase#
	   * @function
	   * @name addKernel
	   *
	   * @desc Add a new kernel to this instance
	   *
	   * @param {String} fnString - Kernel function as a String
	   * @param {Object} options - Settings object to set constants, debug mode, etc.
	   * @param {Array} paramNames - Parameters of the kernel
	   * @param {Array} paramTypes - Types of the parameters
	   *
	   *
	   * @returns {Object} The inserted kernel as a Kernel Node
	   *
	   */

		}, {
			key: 'addKernel',
			value: function addKernel(fnString, options, paramNames, paramTypes) {
				var kernelNode = new this.Node('kernel', fnString, options, paramTypes);
				kernelNode.setAddFunction(this.addFunction.bind(this));
				kernelNode.paramNames = paramNames;
				kernelNode.paramTypes = paramTypes;
				kernelNode.isRootKernel = true;
				this.addFunctionNode(kernelNode);
				return kernelNode;
			}

			/**
	   * @memberOf FunctionBuilderBase#
	   * @function
	   * @name addSubKernel
	   *
	   * @desc Add a new sub-kernel to the current kernel instance
	   *
	   * @param {Function} jsFunction - Sub-kernel function (JavaScript)
	   * @param {Object} options - Settings object to set constants, debug mode, etc.
	   * @param {Array} paramNames - Parameters of the sub-kernel
	   * @param {Array} returnType - Return type of the subKernel
	   *
	   * @returns {Object} The inserted sub-kernel as a Kernel Node
	   *
	   */

		}, {
			key: 'addSubKernel',
			value: function addSubKernel(jsFunction, options, paramTypes, returnType) {
				var kernelNode = new this.Node(null, jsFunction, options, paramTypes, returnType);
				kernelNode.setAddFunction(this.addFunction.bind(this));
				kernelNode.isSubKernel = true;
				this.addFunctionNode(kernelNode);
				return kernelNode;
			}

			/**
	   * @memberOf CPUFunctionBuilder#
	   * @name getPrototypeString
	   * @function
	   *
	   * @desc Return the string for a function
	   *
	   * @param {String} functionName - Function name to trace from. If null, it returns the WHOLE builder stack
	   *
	   * @returns {String} The full string, of all the various functions. Trace optimized if functionName given
	   *
	   */

		}, {
			key: 'getPrototypeString',
			value: function getPrototypeString(functionName) {
				return this.getPrototypes(functionName).join('\n');
			}

			/**
	   * @memberOf CPUFunctionBuilder#
	   * @name getPrototypeString
	   * @function
	   *
	   * @desc Return the string for a function
	   *
	   * @param {String} [functionName] - Function name to trace from. If null, it returns the WHOLE builder stack
	   *
	   * @returns {Array} The full string, of all the various functions. Trace optimized if functionName given
	   *
	   */

		}, {
			key: 'getPrototypes',
			value: function getPrototypes(functionName) {
				this.rootKernel.generate();
				if (functionName) {
					return this.getPrototypesFromFunctionNames(this.traceFunctionCalls(functionName, []).reverse());
				}
				return this.getPrototypesFromFunctionNames(Object.keys(this.nodeMap));
			}

			/**
	   * @memberOf FunctionBuilderBase#
	   * @function
	   * @name getStringFromFunctionNames
	   *
	   * @desc Get string from function names
	   *
	   * @param {String[]} functionList - List of function to build string
	   *
	   * @returns {String} The string, of all the various functions. Trace optimized if functionName given
	   *
	   */

		}, {
			key: 'getStringFromFunctionNames',
			value: function getStringFromFunctionNames(functionList) {
				var ret = [];
				for (var i = 0; i < functionList.length; ++i) {
					var node = this.nodeMap[functionList[i]];
					if (node) {
						ret.push(this.nodeMap[functionList[i]].getFunctionString());
					}
				}
				return ret.join('\n');
			}

			/**
	   * @memberOf FunctionBuilderBase#
	   * @function
	   * @name getPrototypeStringFromFunctionNames
	   *
	   * @desc Return string of all functions converted
	   *
	   * @param {String[]} functionList - List of function names to build the string.
	   * @param {Object} [opt - Settings object passed to functionNode. See functionNode for more details.
	   *
	   * @returns {Array} Prototypes of all functions converted
	   *
	   */

		}, {
			key: 'getPrototypesFromFunctionNames',
			value: function getPrototypesFromFunctionNames(functionList, opt) {
				var ret = [];
				for (var i = 0; i < functionList.length; ++i) {
					var functionName = functionList[i];
					var node = this.nodeMap[functionName];
					if (node) {
						ret.push(node.getFunctionPrototypeString(opt));
					} else if (this.nativeFunctions[functionName]) {
						ret.push(this.nativeFunctions[functionName]);
					}
				}
				return ret;
			}

			/**
	   * @memberOf FunctionBuilderBase#
	   * @function
	   * @name getPrototypeStringFromFunctionNames
	   *
	   * @desc Return string of all functions converted
	   *
	   * @param {String[]} functionList - List of function names to build the string.
	   * @param {Object} opt - Settings object passed to functionNode. See functionNode for more details.
	   *
	   * @returns {String} Prototype string of all functions converted
	   *
	   */

		}, {
			key: 'getPrototypeStringFromFunctionNames',
			value: function getPrototypeStringFromFunctionNames(functionList, opt) {
				return this.getPrototypesFromFunctionNames(functionList, opt).toString();
			}

			/**
	   * @memberOf FunctionBuilderBase#
	   * @function
	   * @name getString
	   *
	   * Get string for a particular function name
	   *
	   * @param {String} functionName - Function name to trace from. If null, it returns the WHOLE builder stack
	   *
	   * @returns {String} The string, of all the various functions. Trace optimized if functionName given
	   *
	   */

		}, {
			key: 'getString',
			value: function getString(functionName, opt) {
				if (opt === undefined) {
					opt = {};
				}

				if (functionName) {
					return this.getStringFromFunctionNames(this.traceFunctionCalls(functionName, [], opt).reverse(), opt);
				}
				return this.getStringFromFunctionNames(Object.keys(this.nodeMap), opt);
			}
		}, {
			key: 'polyfillStandardFunctions',
			value: function polyfillStandardFunctions() {
				throw new Error('polyfillStandardFunctions not defined on base function builder');
			}
		}]);

		return FunctionBuilderBase;
	}();

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var FunctionNodeBase = __webpack_require__(39);
	var utils = __webpack_require__(24);
	// Closure capture for the ast function, prevent collision with existing AST functions
	// The prefixes to use
	var jsMathPrefix = 'Math.';
	var localPrefix = 'this.';
	var constantsPrefix = 'this.constants.';

	var DECODE32_ENCODE32 = /decode32\(\s+encode32\(/g;
	var ENCODE32_DECODE32 = /encode32\(\s+decode32\(/g;

	/** 
	 * @class WebGLFunctionNode
	 *
	 * @desc [INTERNAL] Takes in a function node, and does all the AST voodoo required to generate its respective webGL code.
	 *
	 * @extends FunctionNodeBase
	 *
	 * @param {functionNode} inNode - The function node object
	 *
	 * @returns the converted webGL function string
	 *
	 */
	module.exports = function (_FunctionNodeBase) {
		_inherits(WebGLFunctionNode, _FunctionNodeBase);

		function WebGLFunctionNode() {
			_classCallCheck(this, WebGLFunctionNode);

			return _possibleConstructorReturn(this, (WebGLFunctionNode.__proto__ || Object.getPrototypeOf(WebGLFunctionNode)).apply(this, arguments));
		}

		_createClass(WebGLFunctionNode, [{
			key: 'generate',
			value: function generate() {
				if (this.debug) {
					console.log(this);
				}
				if (this.prototypeOnly) {
					return WebGLFunctionNode.astFunctionPrototype(this.getJsAST(), [], this).join('').trim();
				} else {
					this.functionStringArray = this.astGeneric(this.getJsAST(), [], this);
				}
				this.functionString = webGlRegexOptimize(this.functionStringArray.join('').trim());
				return this.functionString;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astGeneric
	   *
	   * @desc Parses the abstract syntax tree for generically to its respective function
	   *
	   * @param {Object} ast - the AST object to parse
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the parsed webgl string array
	   */

		}, {
			key: 'astGeneric',
			value: function astGeneric(ast, retArr, funcParam) {
				if (ast === null) {
					throw this.astErrorOutput('NULL ast', ast, funcParam);
				} else {
					if (Array.isArray(ast)) {
						for (var i = 0; i < ast.length; i++) {
							this.astGeneric(ast[i], retArr, funcParam);
						}
						return retArr;
					}

					switch (ast.type) {
						case 'FunctionDeclaration':
							return this.astFunctionDeclaration(ast, retArr, funcParam);
						case 'FunctionExpression':
							return this.astFunctionExpression(ast, retArr, funcParam);
						case 'ReturnStatement':
							return this.astReturnStatement(ast, retArr, funcParam);
						case 'Literal':
							return this.astLiteral(ast, retArr, funcParam);
						case 'BinaryExpression':
							return this.astBinaryExpression(ast, retArr, funcParam);
						case 'Identifier':
							return this.astIdentifierExpression(ast, retArr, funcParam);
						case 'AssignmentExpression':
							return this.astAssignmentExpression(ast, retArr, funcParam);
						case 'ExpressionStatement':
							return this.astExpressionStatement(ast, retArr, funcParam);
						case 'EmptyStatement':
							return this.astEmptyStatement(ast, retArr, funcParam);
						case 'BlockStatement':
							return this.astBlockStatement(ast, retArr, funcParam);
						case 'IfStatement':
							return this.astIfStatement(ast, retArr, funcParam);
						case 'BreakStatement':
							return this.astBreakStatement(ast, retArr, funcParam);
						case 'ContinueStatement':
							return this.astContinueStatement(ast, retArr, funcParam);
						case 'ForStatement':
							return this.astForStatement(ast, retArr, funcParam);
						case 'WhileStatement':
							return this.astWhileStatement(ast, retArr, funcParam);
						case 'VariableDeclaration':
							return this.astVariableDeclaration(ast, retArr, funcParam);
						case 'VariableDeclarator':
							return this.astVariableDeclarator(ast, retArr, funcParam);
						case 'ThisExpression':
							return this.astThisExpression(ast, retArr, funcParam);
						case 'SequenceExpression':
							return this.astSequenceExpression(ast, retArr, funcParam);
						case 'UnaryExpression':
							return this.astUnaryExpression(ast, retArr, funcParam);
						case 'UpdateExpression':
							return this.astUpdateExpression(ast, retArr, funcParam);
						case 'LogicalExpression':
							return this.astLogicalExpression(ast, retArr, funcParam);
						case 'MemberExpression':
							return this.astMemberExpression(ast, retArr, funcParam);
						case 'CallExpression':
							return this.astCallExpression(ast, retArr, funcParam);
						case 'ArrayExpression':
							return this.astArrayExpression(ast, retArr, funcParam);
						case 'DebuggerStatement':
							return this.astDebuggerStatement(ast, retArr, funcParam);
					}

					throw this.astErrorOutput('Unknown ast type : ' + ast.type, ast, funcParam);
				}
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astFunctionDeclaration
	   *
	   * @desc Parses the abstract syntax tree for to its *named function declaration*
	   *
	   * @param {Object} ast - the AST object to parse
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astFunctionDeclaration',
			value: function astFunctionDeclaration(ast, retArr, funcParam) {
				if (this.addFunction) {
					this.addFunction(null, utils.getAstString(this.jsFunctionString, ast));
				}
				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astFunctionPrototype
	   * @static
	   *
	   * @desc Parses the abstract syntax tree for to its *named function prototype*
	   *
	   * @param {Object} ast - the AST object to parse
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astFunctionExpression',


			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astFunctionExpression
	   *
	   * @desc Parses the abstract syntax tree for to its *named function*
	   *
	   * @param {Object} ast - the AST object to parse
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */
			value: function astFunctionExpression(ast, retArr, funcParam) {

				// Setup function return type and name
				if (funcParam.isRootKernel) {
					retArr.push('void');
					funcParam.kernalAst = ast;
				} else {
					retArr.push(funcParam.returnType);
				}
				retArr.push(' ');
				retArr.push(funcParam.functionName);
				retArr.push('(');

				if (!funcParam.isRootKernel) {
					// Arguments handling
					for (var i = 0; i < funcParam.paramNames.length; ++i) {
						var paramName = funcParam.paramNames[i];

						if (i > 0) {
							retArr.push(', ');
						}
						var type = funcParam.getParamType(paramName);
						switch (type) {
							case 'Texture':
							case 'Input':
							case 'Array':
								retArr.push('sampler2D');
								break;
							default:
								retArr.push('float');
						}

						retArr.push(' ');
						retArr.push('user_');
						retArr.push(paramName);
					}
				}

				// Function opening
				retArr.push(') {\n');

				// Body statement iteration
				for (var _i = 0; _i < ast.body.body.length; ++_i) {
					this.astGeneric(ast.body.body[_i], retArr, funcParam);
					retArr.push('\n');
				}

				// Function closing
				retArr.push('}\n');
				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astReturnStatement
	   *
	   * @desc Parses the abstract syntax tree for to *return* statement
	   *
	   * @param {Object} ast - the AST object to parse
	   * @param {Array} retArr - return array string
	   * @param {Object} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astReturnStatement',
			value: function astReturnStatement(ast, retArr, funcParam) {
				if (funcParam.isRootKernel) {
					retArr.push('kernelResult = ');
					this.astGeneric(ast.argument, retArr, funcParam);
					retArr.push(';');
					retArr.push('return;');
				} else if (funcParam.isSubKernel) {
					retArr.push(funcParam.functionName + 'Result = ');
					this.astGeneric(ast.argument, retArr, funcParam);
					retArr.push(';');
					retArr.push('return ' + funcParam.functionName + 'Result;');
				} else {
					retArr.push('return ');
					this.astGeneric(ast.argument, retArr, funcParam);
					retArr.push(';');
				}

				//throw this.astErrorOutput(
				//	'Non main function return, is not supported : '+funcParam.currentFunctionNamespace,
				//	ast, funcParam
				//);

				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astLiteral
	   *
	   * @desc Parses the abstract syntax tree for *literal value*
	   *
	   * @param {Object} ast - the AST object to parse
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astLiteral',
			value: function astLiteral(ast, retArr, funcParam) {

				// Reject non numeric literals
				if (isNaN(ast.value)) {
					throw this.astErrorOutput('Non-numeric literal not supported : ' + ast.value, ast, funcParam);
				}

				// Push the literal value as a float/int
				retArr.push(ast.value);

				// If it was an int, node made a float
				if (Number.isInteger(ast.value)) {
					retArr.push('.0');
				}

				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astBinaryExpression
	   *
	   * @desc Parses the abstract syntax tree for *binary* expression
	   *
	   * @param {Object} ast - the AST object to parse
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astBinaryExpression',
			value: function astBinaryExpression(ast, retArr, funcParam) {
				retArr.push('(');

				if (ast.operator === '%') {
					retArr.push('mod(');
					this.astGeneric(ast.left, retArr, funcParam);
					retArr.push(',');
					this.astGeneric(ast.right, retArr, funcParam);
					retArr.push(')');
				} else if (ast.operator === '===') {
					this.astGeneric(ast.left, retArr, funcParam);
					retArr.push('==');
					this.astGeneric(ast.right, retArr, funcParam);
				} else if (ast.operator === '!==') {
					this.astGeneric(ast.left, retArr, funcParam);
					retArr.push('!=');
					this.astGeneric(ast.right, retArr, funcParam);
				} else {
					this.astGeneric(ast.left, retArr, funcParam);
					retArr.push(ast.operator);
					this.astGeneric(ast.right, retArr, funcParam);
				}

				retArr.push(')');

				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astIdentifierExpression
	   *
	   * @desc Parses the abstract syntax tree for *identifier* expression
	   *
	   * @param {Object} idtNode - An ast Node
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astIdentifierExpression',
			value: function astIdentifierExpression(idtNode, retArr, funcParam) {
				if (idtNode.type !== 'Identifier') {
					throw this.astErrorOutput('IdentifierExpression - not an Identifier', ast, funcParam);
				}

				switch (idtNode.name) {
					case 'gpu_threadX':
						retArr.push('threadId.x');
						break;
					case 'gpu_threadY':
						retArr.push('threadId.y');
						break;
					case 'gpu_threadZ':
						retArr.push('threadId.z');
						break;
					case 'gpu_outputX':
						retArr.push('uOutputDim.x');
						break;
					case 'gpu_outputY':
						retArr.push('uOutputDim.y');
						break;
					case 'gpu_outputZ':
						retArr.push('uOutputDim.z');
						break;
					default:
						if (this.constants && this.constants.hasOwnProperty(idtNode.name)) {
							retArr.push('constants_' + idtNode.name);
						} else {
							var userParamName = funcParam.getUserParamName(idtNode.name);
							if (userParamName !== null) {
								retArr.push('user_' + userParamName);
							} else {
								retArr.push('user_' + idtNode.name);
							}
						}
				}

				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astForStatement
	   *
	   * @desc Parses the abstract syntax tree forfor *for-loop* expression
	   *
	   * @param {Object} forNode - An ast Node
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the parsed webgl string
	   */

		}, {
			key: 'astForStatement',
			value: function astForStatement(forNode, retArr, funcParam) {
				if (forNode.type !== 'ForStatement') {
					throw this.astErrorOutput('Invalid for statment', forNode, funcParam);
				}

				if (forNode.test && forNode.test.type === 'BinaryExpression') {
					if (forNode.test.right.type === 'Identifier' && forNode.test.operator === '<' && this.isIdentifierConstant(forNode.test.right.name) === false) {

						if (!this.loopMaxIterations) {
							console.warn('Warning: loopMaxIterations is not set! Using default of 1000 which may result in unintended behavior.');
							console.warn('Set loopMaxIterations or use a for loop of fixed length to silence this message.');
						}

						retArr.push('for (');
						this.astGeneric(forNode.init, retArr, funcParam);
						this.astGeneric(forNode.test.left, retArr, funcParam);
						retArr.push(forNode.test.operator);
						retArr.push('LOOP_MAX');
						retArr.push(';');
						this.astGeneric(forNode.update, retArr, funcParam);
						retArr.push(')');

						retArr.push('{\n');
						retArr.push('if (');
						this.astGeneric(forNode.test.left, retArr, funcParam);
						retArr.push(forNode.test.operator);
						this.astGeneric(forNode.test.right, retArr, funcParam);
						retArr.push(') {\n');
						if (forNode.body.type === 'BlockStatement') {
							for (var i = 0; i < forNode.body.body.length; i++) {
								this.astGeneric(forNode.body.body[i], retArr, funcParam);
							}
						} else {
							this.astGeneric(forNode.body, retArr, funcParam);
						}
						retArr.push('} else {\n');
						retArr.push('break;\n');
						retArr.push('}\n');
						retArr.push('}\n');

						return retArr;
					} else {
						var declarations = JSON.parse(JSON.stringify(forNode.init.declarations));
						var updateArgument = forNode.update.argument;
						if (!Array.isArray(declarations) || declarations.length < 1) {
							console.log(this.jsFunctionString);
							throw new Error('Error: Incompatible for loop declaration');
						}

						if (declarations.length > 1) {
							var initArgument = null;
							for (var _i2 = 0; _i2 < declarations.length; _i2++) {
								var declaration = declarations[_i2];
								if (declaration.id.name === updateArgument.name) {
									initArgument = declaration;
									declarations.splice(_i2, 1);
								} else {
									retArr.push('float ');
									this.astGeneric(declaration, retArr, funcParam);
									retArr.push(';');
								}
							}

							retArr.push('for (float ');
							this.astGeneric(initArgument, retArr, funcParam);
							retArr.push(';');
						} else {
							retArr.push('for (');
							this.astGeneric(forNode.init, retArr, funcParam);
						}

						this.astGeneric(forNode.test, retArr, funcParam);
						retArr.push(';');
						this.astGeneric(forNode.update, retArr, funcParam);
						retArr.push(')');
						this.astGeneric(forNode.body, retArr, funcParam);
						return retArr;
					}
				}

				throw this.astErrorOutput('Invalid for statement', ast, funcParam);
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astWhileStatement
	   *
	   * @desc Parses the abstract syntax tree for *while* loop
	   *
	   *
	   * @param {Object} whileNode - An ast Node
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the parsed webgl string
	   */

		}, {
			key: 'astWhileStatement',
			value: function astWhileStatement(whileNode, retArr, funcParam) {
				if (whileNode.type !== 'WhileStatement') {
					throw this.astErrorOutput('Invalid while statment', whileNode, funcParam);
				}

				retArr.push('for (float i = 0.0; i < LOOP_MAX; i++) {');
				retArr.push('if (');
				this.astGeneric(whileNode.test, retArr, funcParam);
				retArr.push(') {\n');
				this.astGeneric(whileNode.body, retArr, funcParam);
				retArr.push('} else {\n');
				retArr.push('break;\n');
				retArr.push('}\n');
				retArr.push('}\n');

				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astAssignmentExpression
	   *
	   * @desc Parses the abstract syntax tree for *Assignment* Expression
	   *
	   * @param {Object} assNode - An ast Node
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astAssignmentExpression',
			value: function astAssignmentExpression(assNode, retArr, funcParam) {
				if (assNode.operator === '%=') {
					this.astGeneric(assNode.left, retArr, funcParam);
					retArr.push('=');
					retArr.push('mod(');
					this.astGeneric(assNode.left, retArr, funcParam);
					retArr.push(',');
					this.astGeneric(assNode.right, retArr, funcParam);
					retArr.push(')');
				} else {
					this.astGeneric(assNode.left, retArr, funcParam);
					retArr.push(assNode.operator);
					this.astGeneric(assNode.right, retArr, funcParam);
					return retArr;
				}
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astEmptyStatement
	   *
	   * @desc Parses the abstract syntax tree for an *Empty* Statement
	   *
	   * @param {Object} eNode - An ast Node
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astEmptyStatement',
			value: function astEmptyStatement(eNode, retArr, funcParam) {
				//retArr.push(';\n');
				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astBlockStatement
	   *
	   * @desc Parses the abstract syntax tree for *Block* statement
	   *
	   * @param {Object} bnode - the AST object to parse
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astBlockStatement',
			value: function astBlockStatement(bNode, retArr, funcParam) {
				retArr.push('{\n');
				for (var i = 0; i < bNode.body.length; i++) {
					this.astGeneric(bNode.body[i], retArr, funcParam);
				}
				retArr.push('}\n');
				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astExpressionStatement
	   *
	   * @desc Parses the abstract syntax tree for *generic expression* statement
	   *
	   * @param {Object} esNode - An ast Node
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astExpressionStatement',
			value: function astExpressionStatement(esNode, retArr, funcParam) {
				this.astGeneric(esNode.expression, retArr, funcParam);
				retArr.push(';\n');
				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astVariableDeclaration
	   *
	   * @desc Parses the abstract syntax tree for *Variable Declaration*
	   *
	   * @param {Object} vardecNode - An ast Node
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astVariableDeclaration',
			value: function astVariableDeclaration(vardecNode, retArr, funcParam) {
				retArr.push('float ');
				for (var i = 0; i < vardecNode.declarations.length; i++) {
					if (i > 0) {
						retArr.push(',');
					}
					this.astGeneric(vardecNode.declarations[i], retArr, funcParam);
				}
				retArr.push(';');
				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astVariableDeclarator
	   *
	   * @desc Parses the abstract syntax tree for *Variable Declarator*
	   *
	   * @param {Object} ivardecNode - An ast Node
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astVariableDeclarator',
			value: function astVariableDeclarator(ivardecNode, retArr, funcParam) {
				this.astGeneric(ivardecNode.id, retArr, funcParam);
				if (ivardecNode.init !== null) {
					retArr.push('=');
					this.astGeneric(ivardecNode.init, retArr, funcParam);
				}
				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astIfStatement
	   *
	   * @desc Parses the abstract syntax tree for *If* Statement
	   *
	   * @param {Object} ifNode - An ast Node
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astIfStatement',
			value: function astIfStatement(ifNode, retArr, funcParam) {
				retArr.push('if (');
				this.astGeneric(ifNode.test, retArr, funcParam);
				retArr.push(')');
				if (ifNode.consequent.type === 'BlockStatement') {
					this.astGeneric(ifNode.consequent, retArr, funcParam);
				} else {
					retArr.push(' {\n');
					this.astGeneric(ifNode.consequent, retArr, funcParam);
					retArr.push('\n}\n');
				}

				if (ifNode.alternate) {
					retArr.push('else ');
					if (ifNode.alternate.type === 'BlockStatement') {
						this.astGeneric(ifNode.alternate, retArr, funcParam);
					} else {
						retArr.push(' {\n');
						this.astGeneric(ifNode.alternate, retArr, funcParam);
						retArr.push('\n}\n');
					}
				}
				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astBreakStatement
	   *
	   * @desc Parses the abstract syntax tree for *Break* Statement
	   *
	   * @param {Object} brNode - An ast Node
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astBreakStatement',
			value: function astBreakStatement(brNode, retArr, funcParam) {
				retArr.push('break;\n');
				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astContinueStatement
	   *
	   * @desc Parses the abstract syntax tree for *Continue* Statement
	   *
	   * @param {Object} crNode - An ast Node
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astContinueStatement',
			value: function astContinueStatement(crNode, retArr, funcParam) {
				retArr.push('continue;\n');
				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astLogicalExpression
	   *
	   * @desc Parses the abstract syntax tree for *Logical* Expression
	   *
	   * @param {Object} logNode - An ast Node
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astLogicalExpression',
			value: function astLogicalExpression(logNode, retArr, funcParam) {
				retArr.push('(');
				this.astGeneric(logNode.left, retArr, funcParam);
				retArr.push(logNode.operator);
				this.astGeneric(logNode.right, retArr, funcParam);
				retArr.push(')');
				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astUpdateExpression
	   *
	   * @desc Parses the abstract syntax tree for *Update* Expression
	   *
	   * @param {Object} uNode - An ast Node
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astUpdateExpression',
			value: function astUpdateExpression(uNode, retArr, funcParam) {
				if (uNode.prefix) {
					retArr.push(uNode.operator);
					this.astGeneric(uNode.argument, retArr, funcParam);
				} else {
					this.astGeneric(uNode.argument, retArr, funcParam);
					retArr.push(uNode.operator);
				}

				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astUnaryExpression
	   *
	   * @desc Parses the abstract syntax tree for *Unary* Expression
	   *
	   * @param {Object} uNode - An ast Node
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astUnaryExpression',
			value: function astUnaryExpression(uNode, retArr, funcParam) {
				if (uNode.prefix) {
					retArr.push(uNode.operator);
					this.astGeneric(uNode.argument, retArr, funcParam);
				} else {
					this.astGeneric(uNode.argument, retArr, funcParam);
					retArr.push(uNode.operator);
				}

				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astThisExpression
	   *
	   * @desc Parses the abstract syntax tree for *This* expression
	   *
	   * @param {Object} tNode - An ast Node
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astThisExpression',
			value: function astThisExpression(tNode, retArr, funcParam) {
				retArr.push('this');
				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astMemberExpression
	   *
	   * @desc Parses the abstract syntax tree for *Member* Expression
	   *
	   * @param {Object} mNode - An ast Node
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astMemberExpression',
			value: function astMemberExpression(mNode, retArr, funcParam) {
				if (mNode.computed) {
					if (mNode.object.type === 'Identifier') {
						// Working logger
						var reqName = mNode.object.name;
						var funcName = funcParam.functionName || 'kernel';
						var assumeNotTexture = false;

						// Possibly an array request - handle it as such
						if (funcParam.paramNames) {
							var idx = funcParam.paramNames.indexOf(reqName);
							if (idx >= 0 && funcParam.paramTypes[idx] === 'float') {
								assumeNotTexture = true;
							}
						}

						if (assumeNotTexture) {
							// Get from array
							this.astGeneric(mNode.object, retArr, funcParam);
							retArr.push('[int(');
							this.astGeneric(mNode.property, retArr, funcParam);
							retArr.push(')]');
						} else {
							// Get from texture
							// This normally refers to the global read only input vars
							retArr.push('get(');
							this.astGeneric(mNode.object, retArr, funcParam);
							retArr.push(', vec2(');
							this.astGeneric(mNode.object, retArr, funcParam);
							retArr.push('Size[0],');
							this.astGeneric(mNode.object, retArr, funcParam);
							retArr.push('Size[1]), vec3(');
							this.astGeneric(mNode.object, retArr, funcParam);
							retArr.push('Dim[0],');
							this.astGeneric(mNode.object, retArr, funcParam);
							retArr.push('Dim[1],');
							this.astGeneric(mNode.object, retArr, funcParam);
							retArr.push('Dim[2]');
							retArr.push('), ');
							this.astGeneric(mNode.property, retArr, funcParam);
							retArr.push(')');
						}
					} else {
						this.astGeneric(mNode.object, retArr, funcParam);
						var last = retArr.pop();
						retArr.push(',');
						this.astGeneric(mNode.property, retArr, funcParam);
						retArr.push(last);
					}
				} else {

					// Unroll the member expression
					var unrolled = this.astMemberExpressionUnroll(mNode);
					var unrolled_lc = unrolled.toLowerCase();

					// Its a constant, remove this.constants.
					if (unrolled.indexOf(constantsPrefix) === 0) {
						unrolled = 'constants_' + unrolled.slice(constantsPrefix.length);
					}

					switch (unrolled_lc) {
						case 'this.thread.x':
							retArr.push('threadId.x');
							break;
						case 'this.thread.y':
							retArr.push('threadId.y');
							break;
						case 'this.thread.z':
							retArr.push('threadId.z');
							break;
						case 'this.output.x':
							retArr.push(this.output[0] + '.0');
							break;
						case 'this.output.y':
							retArr.push(this.output[1] + '.0');
							break;
						case 'this.output.z':
							retArr.push(this.output[2] + '.0');
							break;
						default:
							retArr.push(unrolled);
					}
				}
				return retArr;
			}
		}, {
			key: 'astSequenceExpression',
			value: function astSequenceExpression(sNode, retArr, funcParam) {
				for (var i = 0; i < sNode.expressions.length; i++) {
					if (i > 0) {
						retArr.push(',');
					}
					this.astGeneric(sNode.expressions, retArr, funcParam);
				}
				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astCallExpression
	   *
	   * @desc Parses the abstract syntax tree for *call* expression
	   *
	   * @param {Object} ast - the AST object to parse
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns  {Array} the append retArr
	   */

		}, {
			key: 'astCallExpression',
			value: function astCallExpression(ast, retArr, funcParam) {
				if (ast.callee) {
					// Get the full function call, unrolled
					var funcName = this.astMemberExpressionUnroll(ast.callee);

					// Its a math operator, remove the prefix
					if (funcName.indexOf(jsMathPrefix) === 0) {
						funcName = funcName.slice(jsMathPrefix.length);
					}

					// Its a local function, remove this
					if (funcName.indexOf(localPrefix) === 0) {
						funcName = funcName.slice(localPrefix.length);
					}

					// Register the function into the called registry
					if (funcParam.calledFunctions.indexOf(funcName) < 0) {
						funcParam.calledFunctions.push(funcName);
					}
					if (!funcParam.hasOwnProperty('funcName')) {
						funcParam.calledFunctionsArguments[funcName] = [];
					}

					var functionArguments = [];
					funcParam.calledFunctionsArguments[funcName].push(functionArguments);

					// Call the function
					retArr.push(funcName);

					// Open arguments space
					retArr.push('(');

					// Add the vars
					for (var i = 0; i < ast.arguments.length; ++i) {
						var argument = ast.arguments[i];
						if (i > 0) {
							retArr.push(', ');
						}
						this.astGeneric(argument, retArr, funcParam);
						if (argument.type === 'Identifier') {
							var paramIndex = funcParam.paramNames.indexOf(argument.name);
							if (paramIndex === -1) {
								functionArguments.push(null);
							} else {
								functionArguments.push({
									name: argument.name,
									type: funcParam.paramTypes[paramIndex]
								});
							}
						} else {
							functionArguments.push(null);
						}
					}

					// Close arguments space
					retArr.push(')');

					return retArr;
				}

				// Failure, unknown expression
				throw this.astErrorOutput('Unknown CallExpression', ast, funcParam);

				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astArrayExpression
	   *
	   * @desc Parses the abstract syntax tree for *Array* Expression
	   *
	   * @param {Object} ast - the AST object to parse
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astArrayExpression',
			value: function astArrayExpression(arrNode, retArr, funcParam) {
				var arrLen = arrNode.elements.length;

				retArr.push('float[' + arrLen + '](');
				for (var i = 0; i < arrLen; ++i) {
					if (i > 0) {
						retArr.push(', ');
					}
					var subNode = arrNode.elements[i];
					this.astGeneric(subNode, retArr, funcParam);
				}
				retArr.push(')');

				return retArr;

				// // Failure, unknown expression
				// throw this.astErrorOutput(
				// 	'Unknown  ArrayExpression',
				// 	arrNode, funcParam
				//);
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name getFunctionPrototypeString
	   *
	   * @desc Returns the converted webgl shader function equivalent of the JS function
	   *
	   * @returns {String} webgl function string, result is cached under this.getFunctionPrototypeString
	   *
	   */

		}, {
			key: 'getFunctionPrototypeString',
			value: function getFunctionPrototypeString() {
				if (this.webGlFunctionPrototypeString) {
					return this.webGlFunctionPrototypeString;
				}
				return this.webGlFunctionPrototypeString = this.generate();
			}
		}, {
			key: 'build',
			value: function build() {
				return this.getFunctionPrototypeString().length > 0;
			}
		}], [{
			key: 'astFunctionPrototype',
			value: function astFunctionPrototype(ast, retArr, funcParam) {
				// Setup function return type and name
				if (funcParam.isRootKernel || funcParam.isSubKernel) {
					return retArr;
				}

				retArr.push(funcParam.returnType);
				retArr.push(' ');
				retArr.push(funcParam.functionName);
				retArr.push('(');

				// Arguments handling
				for (var i = 0; i < funcParam.paramNames.length; ++i) {
					if (i > 0) {
						retArr.push(', ');
					}

					retArr.push(funcParam.paramTypes[i]);
					retArr.push(' ');
					retArr.push('user_');
					retArr.push(funcParam.paramNames[i]);
				}

				retArr.push(');\n');

				return retArr;
			}
		}]);

		return WebGLFunctionNode;
	}(FunctionNodeBase);

	function isIdentifierKernelParam(paramName, ast, funcParam) {
		return funcParam.paramNames.indexOf(paramName) !== -1;
	}

	function ensureIndentifierType(paramName, expectedType, ast, funcParam) {
		var start = ast.loc.start;

		if (!isIdentifierKernelParam(paramName, funcParam) && expectedType !== 'float') {
			throw 'Error unexpected identifier ' + paramName + ' on line ' + start.line;
		} else {
			var actualType = funcParam.paramTypes[funcParam.paramNames.indexOf(paramName)];
			if (actualType !== expectedType) {
				throw 'Error unexpected identifier ' + paramName + ' on line ' + start.line;
			}
		}
	}

	/**
	 * @ignore
	 * @function
	 * @name webgl_regex_optimize
	 *
	 * @desc [INTERNAL] Takes the near final webgl function string, and do regex search and replacments.
	 * For voodoo optimize out the following: 
	 *
	 * - decode32(encode32( <br>
	 * - encode32(decode32( <br>
	 *
	 * @param {String} inStr - The webGl function String
	 *
	 */
	function webGlRegexOptimize(inStr) {
		return inStr.replace(DECODE32_ENCODE32, '((').replace(ENCODE32_DECODE32, '((');
	}

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var utils = __webpack_require__(24);
	var acorn = __webpack_require__(40);

	module.exports = function () {

		/**
	  * @constructor FunctionNodeBase
	  * 
	  * @desc Represents a single function, inside JS, webGL, or openGL.
	  * 
	  * <p>This handles all the raw state, converted state, etc. Of a single function.</p>
	  * 
	  * @prop {String} functionName - Name of the function
	  * @prop {Function} jsFunction - The JS Function the node represents
	  * @prop {String} jsFunctionString - jsFunction.toString()
	  * @prop {String[]} paramNames - Parameter names of the function
	  * @prop {String[]} paramTypes - Shader land parameters type assumption
	  * @prop {Boolean} isRootKernel - Special indicator, for kernel function
	  * @prop {String} webglFunctionString - webgl converted function string
	  * @prop {String} openglFunctionString - opengl converted function string
	  * @prop {String[]} calledFunctions - List of all the functions called
	  * @prop {String[]} initVariables - List of variables initialized in the function
	  * @prop {String[]} readVariables - List of variables read operations occur
	  * @prop {String[]} writeVariables - List of variables write operations occur
	  * 
	  * @param {GPU} gpu - The GPU instance
	  * @param {String} functionName - Function name to assume, if its null, it attempts to extract from the function
	  * @param {Function|String} jsFunction - JS Function to do conversion
	  * @param {String[]|Object} paramTypes - Parameter type array, assumes all parameters are 'float' if null
	  * @param {String} returnType - The return type, assumes 'float' if null
	  *
	  */
		function BaseFunctionNode(functionName, jsFunction, options, paramTypes, returnType) {
			_classCallCheck(this, BaseFunctionNode);

			//
			// Internal vars setup
			//
			this.calledFunctions = [];
			this.calledFunctionsArguments = {};
			this.initVariables = [];
			this.readVariables = [];
			this.writeVariables = [];
			this.addFunction = null;
			this.isRootKernel = false;
			this.isSubKernel = false;
			this.parent = null;
			this.debug = null;
			this.prototypeOnly = null;
			this.constants = null;
			this.output = null;

			if (options) {
				if (options.hasOwnProperty('debug')) {
					this.debug = options.debug;
				}
				if (options.hasOwnProperty('prototypeOnly')) {
					this.prototypeOnly = options.prototypeOnly;
				}
				if (options.hasOwnProperty('constants')) {
					this.constants = options.constants;
				}
				if (options.hasOwnProperty('output')) {
					this.output = options.output;
				}
				if (options.hasOwnProperty('loopMaxIterations')) {
					this.loopMaxIterations = options.loopMaxIterations;
				}
			}

			//
			// Missing jsFunction object exception
			//
			if (!jsFunction) {
				throw 'jsFunction, parameter is missing';
			}

			//
			// Setup jsFunction and its string property + validate them
			//
			this.jsFunctionString = jsFunction.toString();
			if (!utils.isFunctionString(this.jsFunctionString)) {
				console.error('jsFunction, to string conversion check failed: not a function?', this.jsFunctionString);
				throw 'jsFunction, to string conversion check failed: not a function?';
			}

			if (!utils.isFunction(jsFunction)) {
				//throw 'jsFunction, is not a valid JS Function';
				this.jsFunction = null;
			} else {
				this.jsFunction = jsFunction;
			}

			//
			// Setup the function name property
			//
			this.functionName = functionName || jsFunction && jsFunction.name || utils.getFunctionNameFromString(this.jsFunctionString);

			if (!this.functionName) {
				throw 'jsFunction, missing name argument or value';
			}

			//
			// Extract parameter name, and its argument types
			//
			this.paramNames = utils.getParamNamesFromString(this.jsFunctionString);
			if (paramTypes) {
				if (Array.isArray(paramTypes)) {
					if (paramTypes.length !== this.paramNames.length) {
						throw 'Invalid argument type array length, against function length -> (' + paramTypes.length + ',' + this.paramNames.length + ')';
					}
					this.paramTypes = paramTypes;
				} else if ((typeof paramTypes === 'undefined' ? 'undefined' : _typeof(paramTypes)) === 'object') {
					var paramVariableNames = Object.keys(paramTypes);
					if (paramTypes.hasOwnProperty('returns')) {
						this.returnType = paramTypes.returns;
						paramVariableNames.splice(paramVariableNames.indexOf('returns'), 1);
					}
					if (paramVariableNames.length > 0 && paramVariableNames.length !== this.paramNames.length) {
						throw 'Invalid argument type array length, against function length -> (' + paramVariableNames.length + ',' + this.paramNames.length + ')';
					} else {
						this.paramTypes = this.paramNames.map(function (key) {
							if (paramTypes.hasOwnProperty(key)) {
								return paramTypes[key];
							} else {
								return 'float';
							}
						});
					}
				}
			} else {
				this.paramTypes = [];
				//TODO: Remove when we have proper type detection
				// for (let a = 0; a < this.paramNames.length; ++a) {
				// 	this.paramTypes.push();
				// }
			}

			//
			// Return type handling
			//
			if (!this.returnType) {
				this.returnType = returnType || 'float';
			}
		}

		_createClass(BaseFunctionNode, [{
			key: 'isIdentifierConstant',
			value: function isIdentifierConstant(paramName) {
				if (!this.constants) return false;
				return this.constants.hasOwnProperty(paramName);
			}
		}, {
			key: 'setAddFunction',
			value: function setAddFunction(fn) {
				this.addFunction = fn;
				return this;
			}
			/**
	   * 
	   * Core Functions
	   * 
	   */

			/**
	   * @memberOf FunctionNodeBase#
	   * @function
	   * @name getJSFunction
	   *
	   * @desc Gets and return the stored JS Function.
	   * Note: that this internally eval the function, if only the string was provided on construction
	   *
	   * @returns {Function} The function object
	   *
	   */

		}, {
			key: 'getJsFunction',
			value: function getJsFunction() {
				if (this.jsFunction) {
					return this.jsFunction;
				}

				if (this.jsFunctionString) {
					this.jsFunction = eval(this.jsFunctionString);
					return this.jsFunction;
				}

				throw 'Missing jsFunction, and jsFunctionString parameter';
			}

			/**
	   * @memberOf FunctionNodeBase#
	   * @function
	   * @name astMemberExpressionUnroll
	   * @desc Parses the abstract syntax tree for binary expression.
	   *
	   * <p>Utility function for astCallExpression.</p>
	   *
	   * @param {Object} ast - the AST object to parse
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {String} the function namespace call, unrolled
	   */

		}, {
			key: 'astMemberExpressionUnroll',
			value: function astMemberExpressionUnroll(ast, funcParam) {
				if (ast.type === 'Identifier') {
					return ast.name;
				} else if (ast.type === 'ThisExpression') {
					return 'this';
				}

				if (ast.type === 'MemberExpression') {
					if (ast.object && ast.property) {
						//babel sniffing
						if (ast.object.hasOwnProperty('name') && ast.object.name[0] === '_') {
							return this.astMemberExpressionUnroll(ast.property, funcParam);
						}

						return this.astMemberExpressionUnroll(ast.object, funcParam) + '.' + this.astMemberExpressionUnroll(ast.property, funcParam);
					}
				}

				//babel sniffing
				if (ast.hasOwnProperty('expressions')) {
					var firstExpression = ast.expressions[0];
					if (firstExpression.type === 'Literal' && firstExpression.value === 0 && ast.expressions.length === 2) {
						return this.astMemberExpressionUnroll(ast.expressions[1]);
					}
				}

				// Failure, unknown expression
				throw this.astErrorOutput('Unknown CallExpression_unroll', ast, funcParam);
			}

			/**
	   * @memberOf FunctionNodeBase#
	   * @function
	   * @name getJsAST
	   *
	   * @desc Parses the class function JS, and returns its Abstract Syntax Tree object.
	   *
	   * This is used internally to convert to shader code
	   *
	   * @param {JISONParser} inParser - Parser to use, assumes in scope 'parser' if null
	   *
	   * @returns {ASTObject} The function AST Object, note that result is cached under this.jsFunctionAST;
	   *
	   */

		}, {
			key: 'getJsAST',
			value: function getJsAST(inParser) {
				if (this.jsFunctionAST) {
					return this.jsFunctionAST;
				}

				inParser = inParser || acorn;
				if (inParser === null) {
					throw 'Missing JS to AST parser';
				}

				var ast = inParser.parse('var ' + this.functionName + ' = ' + this.jsFunctionString + ';', {
					locations: true
				});
				if (ast === null) {
					throw 'Failed to parse JS code';
				}

				// take out the function object, outside the var declarations
				var funcAST = ast.body[0].declarations[0].init;
				this.jsFunctionAST = funcAST;

				return funcAST;
			}

			/**
	   * @memberOf FunctionNodeBase#
	   * @function
	   * @name getFunctionString
	   *
	   * @desc Returns the converted webgl shader function equivalent of the JS function
	   *
	   * @returns {String} webgl function string, result is cached under this.webGlFunctionString
	   *
	   */

		}, {
			key: 'getFunctionString',
			value: function getFunctionString() {
				this.generate();
				return this.functionString;
			}

			/**
	   * @memberOf FunctionNodeBase#
	   * @function
	   * @name setFunctionString
	   *
	   * @desc Set the functionString value, overwriting it
	   *
	   * @param {String} functionString - Shader code string, representing the function
	   *
	   */

		}, {
			key: 'setFunctionString',
			value: function setFunctionString(functionString) {
				this.functionString = functionString;
			}

			/**
	   * @memberOf FunctionNodeBase#
	   * @function
	   * @name getParamType
	   *
	   * @desc Return the type of parameter sent to subKernel/Kernel.
	   *
	   * @param {String} paramName - Name of the parameter
	   *
	   * @returns {String} Type of the parameter
	   *
	   */

		}, {
			key: 'getParamType',
			value: function getParamType(paramName) {
				var paramIndex = this.paramNames.indexOf(paramName);
				if (paramIndex === -1) return null;
				if (!this.parent) return null;
				if (this.paramTypes[paramIndex]) return this.paramTypes[paramIndex];
				var calledFunctionArguments = this.parent.calledFunctionsArguments[this.functionName];
				for (var i = 0; i < calledFunctionArguments.length; i++) {
					var calledFunctionArgument = calledFunctionArguments[i];
					if (calledFunctionArgument[paramIndex] !== null) {
						return this.paramTypes[paramIndex] = calledFunctionArgument[paramIndex].type;
					}
				}
				return null;
			}

			/**
	   * @memberOf FunctionNodeBase#
	   * @function
	   * @name getUserParamName
	   *
	   * @desc Return the name of the *user parameter*(subKernel parameter) corresponding 
	   * to the parameter supplied to the kernel
	   *
	   * @param {String} paramName - Name of the parameter
	   *
	   * @returns {String} Name of the parameter
	   *
	   */

		}, {
			key: 'getUserParamName',
			value: function getUserParamName(paramName) {
				var paramIndex = this.paramNames.indexOf(paramName);
				if (paramIndex === -1) return null;
				if (!this.parent) return null;
				var calledFunctionArguments = this.parent.calledFunctionsArguments[this.functionName];
				for (var i = 0; i < calledFunctionArguments.length; i++) {
					var calledFunctionArgument = calledFunctionArguments[i];
					if (calledFunctionArgument[paramIndex] !== null) {
						return calledFunctionArgument[paramIndex].name;
					}
				}
				return null;
			}
		}, {
			key: 'generate',
			value: function generate(options) {
				throw new Error('generate not defined on BaseFunctionNode');
			}

			/**
	   * @function
	   * @name astErrorOutput
	   * @ignore
	   * @desc To throw the AST error, with its location.
	   *
	   * @todo add location support fpr the AST error
	   *
	   * @param {Object} error - the error message output
	   * @param {Object} ast - the AST object where the error is
	   * @param {Object} funcParam - FunctionNode, that tracks compilation state
	   */

		}, {
			key: 'astErrorOutput',
			value: function astErrorOutput(error, ast, funcParam) {
				console.error(utils.getAstString(this.jsFunctionString, ast));
				console.error(error, ast, funcParam);
				return error;
			}
		}, {
			key: 'astDebuggerStatement',
			value: function astDebuggerStatement(arrNode, retArr, funcParam) {
				return retArr;
			}
		}]);

		return BaseFunctionNode;
	}();

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	var require;var require;(function(f){if(true){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.acorn = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return require(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
	// A recursive descent parser operates by defining functions for all
	// syntactic elements, and recursively calling those, each function
	// advancing the input stream and returning an AST node. Precedence
	// of constructs (for example, the fact that `!x[1]` means `!(x[1])`
	// instead of `(!x)[1]` is handled by the fact that the parser
	// function that parses unary prefix operators is called first, and
	// in turn calls the function that parses `[]` subscripts — that
	// way, it'll receive the node for `x[1]` already parsed, and wraps
	// *that* in the unary operator node.
	//
	// Acorn uses an [operator precedence parser][opp] to handle binary
	// operator precedence, because it is much more compact than using
	// the technique outlined above, which uses different, nesting
	// functions to specify precedence, for all of the ten binary
	// precedence levels that JavaScript defines.
	//
	// [opp]: http://en.wikipedia.org/wiki/Operator-precedence_parser

	"use strict";

	var _tokentype = _dereq_("./tokentype");

	var _state = _dereq_("./state");

	var pp = _state.Parser.prototype;

	// Check if property name clashes with already added.
	// Object/class getters and setters are not allowed to clash —
	// either with each other or with an init property — and in
	// strict mode, init properties are also not allowed to be repeated.

	pp.checkPropClash = function (prop, propHash) {
	  if (this.options.ecmaVersion >= 6 && (prop.computed || prop.method || prop.shorthand)) return;
	  var key = prop.key;var name = undefined;
	  switch (key.type) {
	    case "Identifier":
	      name = key.name;break;
	    case "Literal":
	      name = String(key.value);break;
	    default:
	      return;
	  }
	  var kind = prop.kind;

	  if (this.options.ecmaVersion >= 6) {
	    if (name === "__proto__" && kind === "init") {
	      if (propHash.proto) this.raise(key.start, "Redefinition of __proto__ property");
	      propHash.proto = true;
	    }
	    return;
	  }
	  name = "$" + name;
	  var other = propHash[name];
	  if (other) {
	    var isGetSet = kind !== "init";
	    if ((this.strict || isGetSet) && other[kind] || !(isGetSet ^ other.init)) this.raise(key.start, "Redefinition of property");
	  } else {
	    other = propHash[name] = {
	      init: false,
	      get: false,
	      set: false
	    };
	  }
	  other[kind] = true;
	};

	// ### Expression parsing

	// These nest, from the most general expression type at the top to
	// 'atomic', nondivisible expression types at the bottom. Most of
	// the functions will simply let the function(s) below them parse,
	// and, *if* the syntactic construct they handle is present, wrap
	// the AST node that the inner parser gave them in another node.

	// Parse a full expression. The optional arguments are used to
	// forbid the `in` operator (in for loops initalization expressions)
	// and provide reference for storing '=' operator inside shorthand
	// property assignment in contexts where both object expression
	// and object pattern might appear (so it's possible to raise
	// delayed syntax error at correct position).

	pp.parseExpression = function (noIn, refDestructuringErrors) {
	  var startPos = this.start,
	      startLoc = this.startLoc;
	  var expr = this.parseMaybeAssign(noIn, refDestructuringErrors);
	  if (this.type === _tokentype.types.comma) {
	    var node = this.startNodeAt(startPos, startLoc);
	    node.expressions = [expr];
	    while (this.eat(_tokentype.types.comma)) node.expressions.push(this.parseMaybeAssign(noIn, refDestructuringErrors));
	    return this.finishNode(node, "SequenceExpression");
	  }
	  return expr;
	};

	// Parse an assignment expression. This includes applications of
	// operators like `+=`.

	pp.parseMaybeAssign = function (noIn, refDestructuringErrors, afterLeftParse) {
	  if (this.type == _tokentype.types._yield && this.inGenerator) return this.parseYield();

	  var validateDestructuring = false;
	  if (!refDestructuringErrors) {
	    refDestructuringErrors = { shorthandAssign: 0, trailingComma: 0 };
	    validateDestructuring = true;
	  }
	  var startPos = this.start,
	      startLoc = this.startLoc;
	  if (this.type == _tokentype.types.parenL || this.type == _tokentype.types.name) this.potentialArrowAt = this.start;
	  var left = this.parseMaybeConditional(noIn, refDestructuringErrors);
	  if (afterLeftParse) left = afterLeftParse.call(this, left, startPos, startLoc);
	  if (this.type.isAssign) {
	    if (validateDestructuring) this.checkPatternErrors(refDestructuringErrors, true);
	    var node = this.startNodeAt(startPos, startLoc);
	    node.operator = this.value;
	    node.left = this.type === _tokentype.types.eq ? this.toAssignable(left) : left;
	    refDestructuringErrors.shorthandAssign = 0; // reset because shorthand default was used correctly
	    this.checkLVal(left);
	    this.next();
	    node.right = this.parseMaybeAssign(noIn);
	    return this.finishNode(node, "AssignmentExpression");
	  } else {
	    if (validateDestructuring) this.checkExpressionErrors(refDestructuringErrors, true);
	  }
	  return left;
	};

	// Parse a ternary conditional (`?:`) operator.

	pp.parseMaybeConditional = function (noIn, refDestructuringErrors) {
	  var startPos = this.start,
	      startLoc = this.startLoc;
	  var expr = this.parseExprOps(noIn, refDestructuringErrors);
	  if (this.checkExpressionErrors(refDestructuringErrors)) return expr;
	  if (this.eat(_tokentype.types.question)) {
	    var node = this.startNodeAt(startPos, startLoc);
	    node.test = expr;
	    node.consequent = this.parseMaybeAssign();
	    this.expect(_tokentype.types.colon);
	    node.alternate = this.parseMaybeAssign(noIn);
	    return this.finishNode(node, "ConditionalExpression");
	  }
	  return expr;
	};

	// Start the precedence parser.

	pp.parseExprOps = function (noIn, refDestructuringErrors) {
	  var startPos = this.start,
	      startLoc = this.startLoc;
	  var expr = this.parseMaybeUnary(refDestructuringErrors);
	  if (this.checkExpressionErrors(refDestructuringErrors)) return expr;
	  return this.parseExprOp(expr, startPos, startLoc, -1, noIn);
	};

	// Parse binary operators with the operator precedence parsing
	// algorithm. `left` is the left-hand side of the operator.
	// `minPrec` provides context that allows the function to stop and
	// defer further parser to one of its callers when it encounters an
	// operator that has a lower precedence than the set it is parsing.

	pp.parseExprOp = function (left, leftStartPos, leftStartLoc, minPrec, noIn) {
	  var prec = this.type.binop;
	  if (prec != null && (!noIn || this.type !== _tokentype.types._in)) {
	    if (prec > minPrec) {
	      var node = this.startNodeAt(leftStartPos, leftStartLoc);
	      node.left = left;
	      node.operator = this.value;
	      var op = this.type;
	      this.next();
	      var startPos = this.start,
	          startLoc = this.startLoc;
	      node.right = this.parseExprOp(this.parseMaybeUnary(), startPos, startLoc, prec, noIn);
	      this.finishNode(node, op === _tokentype.types.logicalOR || op === _tokentype.types.logicalAND ? "LogicalExpression" : "BinaryExpression");
	      return this.parseExprOp(node, leftStartPos, leftStartLoc, minPrec, noIn);
	    }
	  }
	  return left;
	};

	// Parse unary operators, both prefix and postfix.

	pp.parseMaybeUnary = function (refDestructuringErrors) {
	  if (this.type.prefix) {
	    var node = this.startNode(),
	        update = this.type === _tokentype.types.incDec;
	    node.operator = this.value;
	    node.prefix = true;
	    this.next();
	    node.argument = this.parseMaybeUnary();
	    this.checkExpressionErrors(refDestructuringErrors, true);
	    if (update) this.checkLVal(node.argument);else if (this.strict && node.operator === "delete" && node.argument.type === "Identifier") this.raise(node.start, "Deleting local variable in strict mode");
	    return this.finishNode(node, update ? "UpdateExpression" : "UnaryExpression");
	  }
	  var startPos = this.start,
	      startLoc = this.startLoc;
	  var expr = this.parseExprSubscripts(refDestructuringErrors);
	  if (this.checkExpressionErrors(refDestructuringErrors)) return expr;
	  while (this.type.postfix && !this.canInsertSemicolon()) {
	    var node = this.startNodeAt(startPos, startLoc);
	    node.operator = this.value;
	    node.prefix = false;
	    node.argument = expr;
	    this.checkLVal(expr);
	    this.next();
	    expr = this.finishNode(node, "UpdateExpression");
	  }
	  return expr;
	};

	// Parse call, dot, and `[]`-subscript expressions.

	pp.parseExprSubscripts = function (refDestructuringErrors) {
	  var startPos = this.start,
	      startLoc = this.startLoc;
	  var expr = this.parseExprAtom(refDestructuringErrors);
	  var skipArrowSubscripts = expr.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")";
	  if (this.checkExpressionErrors(refDestructuringErrors) || skipArrowSubscripts) return expr;
	  return this.parseSubscripts(expr, startPos, startLoc);
	};

	pp.parseSubscripts = function (base, startPos, startLoc, noCalls) {
	  for (;;) {
	    if (this.eat(_tokentype.types.dot)) {
	      var node = this.startNodeAt(startPos, startLoc);
	      node.object = base;
	      node.property = this.parseIdent(true);
	      node.computed = false;
	      base = this.finishNode(node, "MemberExpression");
	    } else if (this.eat(_tokentype.types.bracketL)) {
	      var node = this.startNodeAt(startPos, startLoc);
	      node.object = base;
	      node.property = this.parseExpression();
	      node.computed = true;
	      this.expect(_tokentype.types.bracketR);
	      base = this.finishNode(node, "MemberExpression");
	    } else if (!noCalls && this.eat(_tokentype.types.parenL)) {
	      var node = this.startNodeAt(startPos, startLoc);
	      node.callee = base;
	      node.arguments = this.parseExprList(_tokentype.types.parenR, false);
	      base = this.finishNode(node, "CallExpression");
	    } else if (this.type === _tokentype.types.backQuote) {
	      var node = this.startNodeAt(startPos, startLoc);
	      node.tag = base;
	      node.quasi = this.parseTemplate();
	      base = this.finishNode(node, "TaggedTemplateExpression");
	    } else {
	      return base;
	    }
	  }
	};

	// Parse an atomic expression — either a single token that is an
	// expression, an expression started by a keyword like `function` or
	// `new`, or an expression wrapped in punctuation like `()`, `[]`,
	// or `{}`.

	pp.parseExprAtom = function (refDestructuringErrors) {
	  var node = undefined,
	      canBeArrow = this.potentialArrowAt == this.start;
	  switch (this.type) {
	    case _tokentype.types._super:
	      if (!this.inFunction) this.raise(this.start, "'super' outside of function or class");
	    case _tokentype.types._this:
	      var type = this.type === _tokentype.types._this ? "ThisExpression" : "Super";
	      node = this.startNode();
	      this.next();
	      return this.finishNode(node, type);

	    case _tokentype.types._yield:
	      if (this.inGenerator) this.unexpected();

	    case _tokentype.types.name:
	      var startPos = this.start,
	          startLoc = this.startLoc;
	      var id = this.parseIdent(this.type !== _tokentype.types.name);
	      if (canBeArrow && !this.canInsertSemicolon() && this.eat(_tokentype.types.arrow)) return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id]);
	      return id;

	    case _tokentype.types.regexp:
	      var value = this.value;
	      node = this.parseLiteral(value.value);
	      node.regex = { pattern: value.pattern, flags: value.flags };
	      return node;

	    case _tokentype.types.num:case _tokentype.types.string:
	      return this.parseLiteral(this.value);

	    case _tokentype.types._null:case _tokentype.types._true:case _tokentype.types._false:
	      node = this.startNode();
	      node.value = this.type === _tokentype.types._null ? null : this.type === _tokentype.types._true;
	      node.raw = this.type.keyword;
	      this.next();
	      return this.finishNode(node, "Literal");

	    case _tokentype.types.parenL:
	      return this.parseParenAndDistinguishExpression(canBeArrow);

	    case _tokentype.types.bracketL:
	      node = this.startNode();
	      this.next();
	      // check whether this is array comprehension or regular array
	      if (this.options.ecmaVersion >= 7 && this.type === _tokentype.types._for) {
	        return this.parseComprehension(node, false);
	      }
	      node.elements = this.parseExprList(_tokentype.types.bracketR, true, true, refDestructuringErrors);
	      return this.finishNode(node, "ArrayExpression");

	    case _tokentype.types.braceL:
	      return this.parseObj(false, refDestructuringErrors);

	    case _tokentype.types._function:
	      node = this.startNode();
	      this.next();
	      return this.parseFunction(node, false);

	    case _tokentype.types._class:
	      return this.parseClass(this.startNode(), false);

	    case _tokentype.types._new:
	      return this.parseNew();

	    case _tokentype.types.backQuote:
	      return this.parseTemplate();

	    default:
	      this.unexpected();
	  }
	};

	pp.parseLiteral = function (value) {
	  var node = this.startNode();
	  node.value = value;
	  node.raw = this.input.slice(this.start, this.end);
	  this.next();
	  return this.finishNode(node, "Literal");
	};

	pp.parseParenExpression = function () {
	  this.expect(_tokentype.types.parenL);
	  var val = this.parseExpression();
	  this.expect(_tokentype.types.parenR);
	  return val;
	};

	pp.parseParenAndDistinguishExpression = function (canBeArrow) {
	  var startPos = this.start,
	      startLoc = this.startLoc,
	      val = undefined;
	  if (this.options.ecmaVersion >= 6) {
	    this.next();

	    if (this.options.ecmaVersion >= 7 && this.type === _tokentype.types._for) {
	      return this.parseComprehension(this.startNodeAt(startPos, startLoc), true);
	    }

	    var innerStartPos = this.start,
	        innerStartLoc = this.startLoc;
	    var exprList = [],
	        first = true;
	    var refDestructuringErrors = { shorthandAssign: 0, trailingComma: 0 },
	        spreadStart = undefined,
	        innerParenStart = undefined;
	    while (this.type !== _tokentype.types.parenR) {
	      first ? first = false : this.expect(_tokentype.types.comma);
	      if (this.type === _tokentype.types.ellipsis) {
	        spreadStart = this.start;
	        exprList.push(this.parseParenItem(this.parseRest()));
	        break;
	      } else {
	        if (this.type === _tokentype.types.parenL && !innerParenStart) {
	          innerParenStart = this.start;
	        }
	        exprList.push(this.parseMaybeAssign(false, refDestructuringErrors, this.parseParenItem));
	      }
	    }
	    var innerEndPos = this.start,
	        innerEndLoc = this.startLoc;
	    this.expect(_tokentype.types.parenR);

	    if (canBeArrow && !this.canInsertSemicolon() && this.eat(_tokentype.types.arrow)) {
	      this.checkPatternErrors(refDestructuringErrors, true);
	      if (innerParenStart) this.unexpected(innerParenStart);
	      return this.parseParenArrowList(startPos, startLoc, exprList);
	    }

	    if (!exprList.length) this.unexpected(this.lastTokStart);
	    if (spreadStart) this.unexpected(spreadStart);
	    this.checkExpressionErrors(refDestructuringErrors, true);

	    if (exprList.length > 1) {
	      val = this.startNodeAt(innerStartPos, innerStartLoc);
	      val.expressions = exprList;
	      this.finishNodeAt(val, "SequenceExpression", innerEndPos, innerEndLoc);
	    } else {
	      val = exprList[0];
	    }
	  } else {
	    val = this.parseParenExpression();
	  }

	  if (this.options.preserveParens) {
	    var par = this.startNodeAt(startPos, startLoc);
	    par.expression = val;
	    return this.finishNode(par, "ParenthesizedExpression");
	  } else {
	    return val;
	  }
	};

	pp.parseParenItem = function (item) {
	  return item;
	};

	pp.parseParenArrowList = function (startPos, startLoc, exprList) {
	  return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList);
	};

	// New's precedence is slightly tricky. It must allow its argument to
	// be a `[]` or dot subscript expression, but not a call — at least,
	// not without wrapping it in parentheses. Thus, it uses the noCalls
	// argument to parseSubscripts to prevent it from consuming the
	// argument list.

	var empty = [];

	pp.parseNew = function () {
	  var node = this.startNode();
	  var meta = this.parseIdent(true);
	  if (this.options.ecmaVersion >= 6 && this.eat(_tokentype.types.dot)) {
	    node.meta = meta;
	    node.property = this.parseIdent(true);
	    if (node.property.name !== "target") this.raise(node.property.start, "The only valid meta property for new is new.target");
	    if (!this.inFunction) this.raise(node.start, "new.target can only be used in functions");
	    return this.finishNode(node, "MetaProperty");
	  }
	  var startPos = this.start,
	      startLoc = this.startLoc;
	  node.callee = this.parseSubscripts(this.parseExprAtom(), startPos, startLoc, true);
	  if (this.eat(_tokentype.types.parenL)) node.arguments = this.parseExprList(_tokentype.types.parenR, false);else node.arguments = empty;
	  return this.finishNode(node, "NewExpression");
	};

	// Parse template expression.

	pp.parseTemplateElement = function () {
	  var elem = this.startNode();
	  elem.value = {
	    raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, '\n'),
	    cooked: this.value
	  };
	  this.next();
	  elem.tail = this.type === _tokentype.types.backQuote;
	  return this.finishNode(elem, "TemplateElement");
	};

	pp.parseTemplate = function () {
	  var node = this.startNode();
	  this.next();
	  node.expressions = [];
	  var curElt = this.parseTemplateElement();
	  node.quasis = [curElt];
	  while (!curElt.tail) {
	    this.expect(_tokentype.types.dollarBraceL);
	    node.expressions.push(this.parseExpression());
	    this.expect(_tokentype.types.braceR);
	    node.quasis.push(curElt = this.parseTemplateElement());
	  }
	  this.next();
	  return this.finishNode(node, "TemplateLiteral");
	};

	// Parse an object literal or binding pattern.

	pp.parseObj = function (isPattern, refDestructuringErrors) {
	  var node = this.startNode(),
	      first = true,
	      propHash = {};
	  node.properties = [];
	  this.next();
	  while (!this.eat(_tokentype.types.braceR)) {
	    if (!first) {
	      this.expect(_tokentype.types.comma);
	      if (this.afterTrailingComma(_tokentype.types.braceR)) break;
	    } else first = false;

	    var prop = this.startNode(),
	        isGenerator = undefined,
	        startPos = undefined,
	        startLoc = undefined;
	    if (this.options.ecmaVersion >= 6) {
	      prop.method = false;
	      prop.shorthand = false;
	      if (isPattern || refDestructuringErrors) {
	        startPos = this.start;
	        startLoc = this.startLoc;
	      }
	      if (!isPattern) isGenerator = this.eat(_tokentype.types.star);
	    }
	    this.parsePropertyName(prop);
	    this.parsePropertyValue(prop, isPattern, isGenerator, startPos, startLoc, refDestructuringErrors);
	    this.checkPropClash(prop, propHash);
	    node.properties.push(this.finishNode(prop, "Property"));
	  }
	  return this.finishNode(node, isPattern ? "ObjectPattern" : "ObjectExpression");
	};

	pp.parsePropertyValue = function (prop, isPattern, isGenerator, startPos, startLoc, refDestructuringErrors) {
	  if (this.eat(_tokentype.types.colon)) {
	    prop.value = isPattern ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(false, refDestructuringErrors);
	    prop.kind = "init";
	  } else if (this.options.ecmaVersion >= 6 && this.type === _tokentype.types.parenL) {
	    if (isPattern) this.unexpected();
	    prop.kind = "init";
	    prop.method = true;
	    prop.value = this.parseMethod(isGenerator);
	  } else if (this.options.ecmaVersion >= 5 && !prop.computed && prop.key.type === "Identifier" && (prop.key.name === "get" || prop.key.name === "set") && (this.type != _tokentype.types.comma && this.type != _tokentype.types.braceR)) {
	    if (isGenerator || isPattern) this.unexpected();
	    prop.kind = prop.key.name;
	    this.parsePropertyName(prop);
	    prop.value = this.parseMethod(false);
	    var paramCount = prop.kind === "get" ? 0 : 1;
	    if (prop.value.params.length !== paramCount) {
	      var start = prop.value.start;
	      if (prop.kind === "get") this.raise(start, "getter should have no params");else this.raise(start, "setter should have exactly one param");
	    }
	    if (prop.kind === "set" && prop.value.params[0].type === "RestElement") this.raise(prop.value.params[0].start, "Setter cannot use rest params");
	  } else if (this.options.ecmaVersion >= 6 && !prop.computed && prop.key.type === "Identifier") {
	    prop.kind = "init";
	    if (isPattern) {
	      if (this.keywords.test(prop.key.name) || (this.strict ? this.reservedWordsStrictBind : this.reservedWords).test(prop.key.name)) this.raise(prop.key.start, "Binding " + prop.key.name);
	      prop.value = this.parseMaybeDefault(startPos, startLoc, prop.key);
	    } else if (this.type === _tokentype.types.eq && refDestructuringErrors) {
	      if (!refDestructuringErrors.shorthandAssign) refDestructuringErrors.shorthandAssign = this.start;
	      prop.value = this.parseMaybeDefault(startPos, startLoc, prop.key);
	    } else {
	      prop.value = prop.key;
	    }
	    prop.shorthand = true;
	  } else this.unexpected();
	};

	pp.parsePropertyName = function (prop) {
	  if (this.options.ecmaVersion >= 6) {
	    if (this.eat(_tokentype.types.bracketL)) {
	      prop.computed = true;
	      prop.key = this.parseMaybeAssign();
	      this.expect(_tokentype.types.bracketR);
	      return prop.key;
	    } else {
	      prop.computed = false;
	    }
	  }
	  return prop.key = this.type === _tokentype.types.num || this.type === _tokentype.types.string ? this.parseExprAtom() : this.parseIdent(true);
	};

	// Initialize empty function node.

	pp.initFunction = function (node) {
	  node.id = null;
	  if (this.options.ecmaVersion >= 6) {
	    node.generator = false;
	    node.expression = false;
	  }
	};

	// Parse object or class method.

	pp.parseMethod = function (isGenerator) {
	  var node = this.startNode();
	  this.initFunction(node);
	  this.expect(_tokentype.types.parenL);
	  node.params = this.parseBindingList(_tokentype.types.parenR, false, false);
	  if (this.options.ecmaVersion >= 6) node.generator = isGenerator;
	  this.parseFunctionBody(node, false);
	  return this.finishNode(node, "FunctionExpression");
	};

	// Parse arrow function expression with given parameters.

	pp.parseArrowExpression = function (node, params) {
	  this.initFunction(node);
	  node.params = this.toAssignableList(params, true);
	  this.parseFunctionBody(node, true);
	  return this.finishNode(node, "ArrowFunctionExpression");
	};

	// Parse function body and check parameters.

	pp.parseFunctionBody = function (node, isArrowFunction) {
	  var isExpression = isArrowFunction && this.type !== _tokentype.types.braceL;

	  if (isExpression) {
	    node.body = this.parseMaybeAssign();
	    node.expression = true;
	  } else {
	    // Start a new scope with regard to labels and the `inFunction`
	    // flag (restore them to their old value afterwards).
	    var oldInFunc = this.inFunction,
	        oldInGen = this.inGenerator,
	        oldLabels = this.labels;
	    this.inFunction = true;this.inGenerator = node.generator;this.labels = [];
	    node.body = this.parseBlock(true);
	    node.expression = false;
	    this.inFunction = oldInFunc;this.inGenerator = oldInGen;this.labels = oldLabels;
	  }

	  // If this is a strict mode function, verify that argument names
	  // are not repeated, and it does not try to bind the words `eval`
	  // or `arguments`.
	  if (this.strict || !isExpression && node.body.body.length && this.isUseStrict(node.body.body[0])) {
	    var oldStrict = this.strict;
	    this.strict = true;
	    if (node.id) this.checkLVal(node.id, true);
	    this.checkParams(node);
	    this.strict = oldStrict;
	  } else if (isArrowFunction) {
	    this.checkParams(node);
	  }
	};

	// Checks function params for various disallowed patterns such as using "eval"
	// or "arguments" and duplicate parameters.

	pp.checkParams = function (node) {
	  var nameHash = {};
	  for (var i = 0; i < node.params.length; i++) {
	    this.checkLVal(node.params[i], true, nameHash);
	  }
	};

	// Parses a comma-separated list of expressions, and returns them as
	// an array. `close` is the token type that ends the list, and
	// `allowEmpty` can be turned on to allow subsequent commas with
	// nothing in between them to be parsed as `null` (which is needed
	// for array literals).

	pp.parseExprList = function (close, allowTrailingComma, allowEmpty, refDestructuringErrors) {
	  var elts = [],
	      first = true;
	  while (!this.eat(close)) {
	    if (!first) {
	      this.expect(_tokentype.types.comma);
	      if (this.type === close && refDestructuringErrors && !refDestructuringErrors.trailingComma) {
	        refDestructuringErrors.trailingComma = this.lastTokStart;
	      }
	      if (allowTrailingComma && this.afterTrailingComma(close)) break;
	    } else first = false;

	    var elt = undefined;
	    if (allowEmpty && this.type === _tokentype.types.comma) elt = null;else if (this.type === _tokentype.types.ellipsis) elt = this.parseSpread(refDestructuringErrors);else elt = this.parseMaybeAssign(false, refDestructuringErrors);
	    elts.push(elt);
	  }
	  return elts;
	};

	// Parse the next token as an identifier. If `liberal` is true (used
	// when parsing properties), it will also convert keywords into
	// identifiers.

	pp.parseIdent = function (liberal) {
	  var node = this.startNode();
	  if (liberal && this.options.allowReserved == "never") liberal = false;
	  if (this.type === _tokentype.types.name) {
	    if (!liberal && (this.strict ? this.reservedWordsStrict : this.reservedWords).test(this.value) && (this.options.ecmaVersion >= 6 || this.input.slice(this.start, this.end).indexOf("\\") == -1)) this.raise(this.start, "The keyword '" + this.value + "' is reserved");
	    node.name = this.value;
	  } else if (liberal && this.type.keyword) {
	    node.name = this.type.keyword;
	  } else {
	    this.unexpected();
	  }
	  this.next();
	  return this.finishNode(node, "Identifier");
	};

	// Parses yield expression inside generator.

	pp.parseYield = function () {
	  var node = this.startNode();
	  this.next();
	  if (this.type == _tokentype.types.semi || this.canInsertSemicolon() || this.type != _tokentype.types.star && !this.type.startsExpr) {
	    node.delegate = false;
	    node.argument = null;
	  } else {
	    node.delegate = this.eat(_tokentype.types.star);
	    node.argument = this.parseMaybeAssign();
	  }
	  return this.finishNode(node, "YieldExpression");
	};

	// Parses array and generator comprehensions.

	pp.parseComprehension = function (node, isGenerator) {
	  node.blocks = [];
	  while (this.type === _tokentype.types._for) {
	    var block = this.startNode();
	    this.next();
	    this.expect(_tokentype.types.parenL);
	    block.left = this.parseBindingAtom();
	    this.checkLVal(block.left, true);
	    this.expectContextual("of");
	    block.right = this.parseExpression();
	    this.expect(_tokentype.types.parenR);
	    node.blocks.push(this.finishNode(block, "ComprehensionBlock"));
	  }
	  node.filter = this.eat(_tokentype.types._if) ? this.parseParenExpression() : null;
	  node.body = this.parseExpression();
	  this.expect(isGenerator ? _tokentype.types.parenR : _tokentype.types.bracketR);
	  node.generator = isGenerator;
	  return this.finishNode(node, "ComprehensionExpression");
	};

	},{"./state":10,"./tokentype":14}],2:[function(_dereq_,module,exports){
	// This is a trick taken from Esprima. It turns out that, on
	// non-Chrome browsers, to check whether a string is in a set, a
	// predicate containing a big ugly `switch` statement is faster than
	// a regular expression, and on Chrome the two are about on par.
	// This function uses `eval` (non-lexical) to produce such a
	// predicate from a space-separated string of words.
	//
	// It starts by sorting the words by length.

	// Reserved word lists for various dialects of the language

	"use strict";

	exports.__esModule = true;
	exports.isIdentifierStart = isIdentifierStart;
	exports.isIdentifierChar = isIdentifierChar;
	var reservedWords = {
	  3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
	  5: "class enum extends super const export import",
	  6: "enum",
	  strict: "implements interface let package private protected public static yield",
	  strictBind: "eval arguments"
	};

	exports.reservedWords = reservedWords;
	// And the keywords

	var ecma5AndLessKeywords = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this";

	var keywords = {
	  5: ecma5AndLessKeywords,
	  6: ecma5AndLessKeywords + " let const class extends export import yield super"
	};

	exports.keywords = keywords;
	// ## Character categories

	// Big ugly regular expressions that match characters in the
	// whitespace, identifier, and identifier-start categories. These
	// are only applied when a character is found to actually have a
	// code point above 128.
	// Generated by `bin/generate-identifier-regex.js`.

	var nonASCIIidentifierStartChars = "ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙա-ևא-תװ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࢠ-ࢲऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘౙౠౡಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೞೠೡೱೲഅ-ഌഎ-ഐഒ-ഺഽൎൠൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄງຈຊຍດ-ທນ-ຟມ-ຣລວສຫອ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏼᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜌᜎ-ᜑᜠ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡷᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᧁ-ᧇᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭋᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᳩ-ᳬᳮ-ᳱᳵᳶᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕ℘-ℝℤΩℨK-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〇〡-〩〱-〵〸-〼ぁ-ゖ゛-ゟァ-ヺー-ヿㄅ-ㄭㄱ-ㆎㆠ-ㆺㇰ-ㇿ㐀-䶵一-鿌ꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-ꞎꞐ-ꞭꞰꞱꟷ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭟꭤꭥꯀ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ";
	var nonASCIIidentifierChars = "‌‍·̀-ͯ·҃-֑҇-ׇֽֿׁׂׅׄؐ-ًؚ-٩ٰۖ-ۜ۟-۪ۤۧۨ-ۭ۰-۹ܑܰ-݊ަ-ް߀-߉߫-߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛ࣤ-ःऺ-़ा-ॏ॑-ॗॢॣ०-९ঁ-ঃ়া-ৄেৈো-্ৗৢৣ০-৯ਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣ૦-૯ଁ-ଃ଼ା-ୄେୈୋ-୍ୖୗୢୣ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఀ-ఃా-ౄె-ైొ-్ౕౖౢౣ౦-౯ಁ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣ೦-೯ഁ-ഃാ-ൄെ-ൈൊ-്ൗൢൣ൦-൯ංඃ්ා-ුූෘ-ෟ෦-෯ෲෳัิ-ฺ็-๎๐-๙ັິ-ູົຼ່-ໍ໐-໙༘༙༠-༩༹༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှ၀-၉ၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟፩-፱ᜒ-᜔ᜲ-᜴ᝒᝓᝲᝳ឴-៓៝០-៩᠋-᠍᠐-᠙ᢩᤠ-ᤫᤰ-᤻᥆-᥏ᦰ-ᧀᧈᧉ᧐-᧚ᨗ-ᨛᩕ-ᩞ᩠-᩿᩼-᪉᪐-᪙᪰-᪽ᬀ-ᬄ᬴-᭄᭐-᭙᭫-᭳ᮀ-ᮂᮡ-ᮭ᮰-᮹᯦-᯳ᰤ-᰷᱀-᱉᱐-᱙᳐-᳔᳒-᳨᳭ᳲ-᳴᳸᳹᷀-᷵᷼-᷿‿⁀⁔⃐-⃥⃜⃡-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯꘠-꘩꙯ꙴ-꙽ꚟ꛰꛱ꠂ꠆ꠋꠣ-ꠧꢀꢁꢴ-꣄꣐-꣙꣠-꣱꤀-꤉ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀꧐-꧙ꧥ꧰-꧹ꨩ-ꨶꩃꩌꩍ꩐-꩙ꩻ-ꩽꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꫫ-ꫯꫵ꫶ꯣ-ꯪ꯬꯭꯰-꯹ﬞ︀-️︠-︭︳︴﹍-﹏０-９＿";

	var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
	var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");

	nonASCIIidentifierStartChars = nonASCIIidentifierChars = null;

	// These are a run-length and offset encoded representation of the
	// >0xffff code points that are a valid part of identifiers. The
	// offset starts at 0x10000, and each pair of numbers represents an
	// offset to the next range, and then a size of the range. They were
	// generated by tools/generate-identifier-regex.js
	var astralIdentifierStartCodes = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 17, 26, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 99, 39, 9, 51, 157, 310, 10, 21, 11, 7, 153, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 98, 21, 11, 25, 71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 26, 45, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 955, 52, 76, 44, 33, 24, 27, 35, 42, 34, 4, 0, 13, 47, 15, 3, 22, 0, 38, 17, 2, 24, 133, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 32, 4, 287, 47, 21, 1, 2, 0, 185, 46, 82, 47, 21, 0, 60, 42, 502, 63, 32, 0, 449, 56, 1288, 920, 104, 110, 2962, 1070, 13266, 568, 8, 30, 114, 29, 19, 47, 17, 3, 32, 20, 6, 18, 881, 68, 12, 0, 67, 12, 16481, 1, 3071, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 4149, 196, 1340, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42710, 42, 4148, 12, 221, 16355, 541];
	var astralIdentifierCodes = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 1306, 2, 54, 14, 32, 9, 16, 3, 46, 10, 54, 9, 7, 2, 37, 13, 2, 9, 52, 0, 13, 2, 49, 13, 16, 9, 83, 11, 168, 11, 6, 9, 8, 2, 57, 0, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 316, 19, 13, 9, 214, 6, 3, 8, 112, 16, 16, 9, 82, 12, 9, 9, 535, 9, 20855, 9, 135, 4, 60, 6, 26, 9, 1016, 45, 17, 3, 19723, 1, 5319, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 4305, 6, 792618, 239];

	// This has a complexity linear to the value of the code. The
	// assumption is that looking up astral identifier characters is
	// rare.
	function isInAstralSet(code, set) {
	  var pos = 0x10000;
	  for (var i = 0; i < set.length; i += 2) {
	    pos += set[i];
	    if (pos > code) return false;
	    pos += set[i + 1];
	    if (pos >= code) return true;
	  }
	}

	// Test whether a given character code starts an identifier.

	function isIdentifierStart(code, astral) {
	  if (code < 65) return code === 36;
	  if (code < 91) return true;
	  if (code < 97) return code === 95;
	  if (code < 123) return true;
	  if (code <= 0xffff) return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code));
	  if (astral === false) return false;
	  return isInAstralSet(code, astralIdentifierStartCodes);
	}

	// Test whether a given character is part of an identifier.

	function isIdentifierChar(code, astral) {
	  if (code < 48) return code === 36;
	  if (code < 58) return true;
	  if (code < 65) return false;
	  if (code < 91) return true;
	  if (code < 97) return code === 95;
	  if (code < 123) return true;
	  if (code <= 0xffff) return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code));
	  if (astral === false) return false;
	  return isInAstralSet(code, astralIdentifierStartCodes) || isInAstralSet(code, astralIdentifierCodes);
	}

	},{}],3:[function(_dereq_,module,exports){
	// Acorn is a tiny, fast JavaScript parser written in JavaScript.
	//
	// Acorn was written by Marijn Haverbeke, Ingvar Stepanyan, and
	// various contributors and released under an MIT license.
	//
	// Git repositories for Acorn are available at
	//
	//     http://marijnhaverbeke.nl/git/acorn
	//     https://github.com/ternjs/acorn.git
	//
	// Please use the [github bug tracker][ghbt] to report issues.
	//
	// [ghbt]: https://github.com/ternjs/acorn/issues
	//
	// This file defines the main parser interface. The library also comes
	// with a [error-tolerant parser][dammit] and an
	// [abstract syntax tree walker][walk], defined in other files.
	//
	// [dammit]: acorn_loose.js
	// [walk]: util/walk.js

	"use strict";

	exports.__esModule = true;
	exports.parse = parse;
	exports.parseExpressionAt = parseExpressionAt;
	exports.tokenizer = tokenizer;

	var _state = _dereq_("./state");

	_dereq_("./parseutil");

	_dereq_("./statement");

	_dereq_("./lval");

	_dereq_("./expression");

	_dereq_("./location");

	exports.Parser = _state.Parser;
	exports.plugins = _state.plugins;

	var _options = _dereq_("./options");

	exports.defaultOptions = _options.defaultOptions;

	var _locutil = _dereq_("./locutil");

	exports.Position = _locutil.Position;
	exports.SourceLocation = _locutil.SourceLocation;
	exports.getLineInfo = _locutil.getLineInfo;

	var _node = _dereq_("./node");

	exports.Node = _node.Node;

	var _tokentype = _dereq_("./tokentype");

	exports.TokenType = _tokentype.TokenType;
	exports.tokTypes = _tokentype.types;

	var _tokencontext = _dereq_("./tokencontext");

	exports.TokContext = _tokencontext.TokContext;
	exports.tokContexts = _tokencontext.types;

	var _identifier = _dereq_("./identifier");

	exports.isIdentifierChar = _identifier.isIdentifierChar;
	exports.isIdentifierStart = _identifier.isIdentifierStart;

	var _tokenize = _dereq_("./tokenize");

	exports.Token = _tokenize.Token;

	var _whitespace = _dereq_("./whitespace");

	exports.isNewLine = _whitespace.isNewLine;
	exports.lineBreak = _whitespace.lineBreak;
	exports.lineBreakG = _whitespace.lineBreakG;
	var version = "2.7.0";

	exports.version = version;
	// The main exported interface (under `self.acorn` when in the
	// browser) is a `parse` function that takes a code string and
	// returns an abstract syntax tree as specified by [Mozilla parser
	// API][api].
	//
	// [api]: https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API

	function parse(input, options) {
	  return new _state.Parser(options, input).parse();
	}

	// This function tries to parse a single expression at a given
	// offset in a string. Useful for parsing mixed-language formats
	// that embed JavaScript expressions.

	function parseExpressionAt(input, pos, options) {
	  var p = new _state.Parser(options, input, pos);
	  p.nextToken();
	  return p.parseExpression();
	}

	// Acorn is organized as a tokenizer and a recursive-descent parser.
	// The `tokenizer` export provides an interface to the tokenizer.

	function tokenizer(input, options) {
	  return new _state.Parser(options, input);
	}

	},{"./expression":1,"./identifier":2,"./location":4,"./locutil":5,"./lval":6,"./node":7,"./options":8,"./parseutil":9,"./state":10,"./statement":11,"./tokencontext":12,"./tokenize":13,"./tokentype":14,"./whitespace":16}],4:[function(_dereq_,module,exports){
	"use strict";

	var _state = _dereq_("./state");

	var _locutil = _dereq_("./locutil");

	var pp = _state.Parser.prototype;

	// This function is used to raise exceptions on parse errors. It
	// takes an offset integer (into the current `input`) to indicate
	// the location of the error, attaches the position to the end
	// of the error message, and then raises a `SyntaxError` with that
	// message.

	pp.raise = function (pos, message) {
	  var loc = _locutil.getLineInfo(this.input, pos);
	  message += " (" + loc.line + ":" + loc.column + ")";
	  var err = new SyntaxError(message);
	  err.pos = pos;err.loc = loc;err.raisedAt = this.pos;
	  throw err;
	};

	pp.curPosition = function () {
	  if (this.options.locations) {
	    return new _locutil.Position(this.curLine, this.pos - this.lineStart);
	  }
	};

	},{"./locutil":5,"./state":10}],5:[function(_dereq_,module,exports){
	"use strict";

	exports.__esModule = true;
	exports.getLineInfo = getLineInfo;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _whitespace = _dereq_("./whitespace");

	// These are used when `options.locations` is on, for the
	// `startLoc` and `endLoc` properties.

	var Position = (function () {
	  function Position(line, col) {
	    _classCallCheck(this, Position);

	    this.line = line;
	    this.column = col;
	  }

	  Position.prototype.offset = function offset(n) {
	    return new Position(this.line, this.column + n);
	  };

	  return Position;
	})();

	exports.Position = Position;

	var SourceLocation = function SourceLocation(p, start, end) {
	  _classCallCheck(this, SourceLocation);

	  this.start = start;
	  this.end = end;
	  if (p.sourceFile !== null) this.source = p.sourceFile;
	}

	// The `getLineInfo` function is mostly useful when the
	// `locations` option is off (for performance reasons) and you
	// want to find the line/column position for a given character
	// offset. `input` should be the code string that the offset refers
	// into.

	;

	exports.SourceLocation = SourceLocation;

	function getLineInfo(input, offset) {
	  for (var line = 1, cur = 0;;) {
	    _whitespace.lineBreakG.lastIndex = cur;
	    var match = _whitespace.lineBreakG.exec(input);
	    if (match && match.index < offset) {
	      ++line;
	      cur = match.index + match[0].length;
	    } else {
	      return new Position(line, offset - cur);
	    }
	  }
	}

	},{"./whitespace":16}],6:[function(_dereq_,module,exports){
	"use strict";

	var _tokentype = _dereq_("./tokentype");

	var _state = _dereq_("./state");

	var _util = _dereq_("./util");

	var pp = _state.Parser.prototype;

	// Convert existing expression atom to assignable pattern
	// if possible.

	pp.toAssignable = function (node, isBinding) {
	  if (this.options.ecmaVersion >= 6 && node) {
	    switch (node.type) {
	      case "Identifier":
	      case "ObjectPattern":
	      case "ArrayPattern":
	        break;

	      case "ObjectExpression":
	        node.type = "ObjectPattern";
	        for (var i = 0; i < node.properties.length; i++) {
	          var prop = node.properties[i];
	          if (prop.kind !== "init") this.raise(prop.key.start, "Object pattern can't contain getter or setter");
	          this.toAssignable(prop.value, isBinding);
	        }
	        break;

	      case "ArrayExpression":
	        node.type = "ArrayPattern";
	        this.toAssignableList(node.elements, isBinding);
	        break;

	      case "AssignmentExpression":
	        if (node.operator === "=") {
	          node.type = "AssignmentPattern";
	          delete node.operator;
	          // falls through to AssignmentPattern
	        } else {
	            this.raise(node.left.end, "Only '=' operator can be used for specifying default value.");
	            break;
	          }

	      case "AssignmentPattern":
	        if (node.right.type === "YieldExpression") this.raise(node.right.start, "Yield expression cannot be a default value");
	        break;

	      case "ParenthesizedExpression":
	        node.expression = this.toAssignable(node.expression, isBinding);
	        break;

	      case "MemberExpression":
	        if (!isBinding) break;

	      default:
	        this.raise(node.start, "Assigning to rvalue");
	    }
	  }
	  return node;
	};

	// Convert list of expression atoms to binding list.

	pp.toAssignableList = function (exprList, isBinding) {
	  var end = exprList.length;
	  if (end) {
	    var last = exprList[end - 1];
	    if (last && last.type == "RestElement") {
	      --end;
	    } else if (last && last.type == "SpreadElement") {
	      last.type = "RestElement";
	      var arg = last.argument;
	      this.toAssignable(arg, isBinding);
	      if (arg.type !== "Identifier" && arg.type !== "MemberExpression" && arg.type !== "ArrayPattern") this.unexpected(arg.start);
	      --end;
	    }

	    if (isBinding && last.type === "RestElement" && last.argument.type !== "Identifier") this.unexpected(last.argument.start);
	  }
	  for (var i = 0; i < end; i++) {
	    var elt = exprList[i];
	    if (elt) this.toAssignable(elt, isBinding);
	  }
	  return exprList;
	};

	// Parses spread element.

	pp.parseSpread = function (refDestructuringErrors) {
	  var node = this.startNode();
	  this.next();
	  node.argument = this.parseMaybeAssign(refDestructuringErrors);
	  return this.finishNode(node, "SpreadElement");
	};

	pp.parseRest = function (allowNonIdent) {
	  var node = this.startNode();
	  this.next();

	  // RestElement inside of a function parameter must be an identifier
	  if (allowNonIdent) node.argument = this.type === _tokentype.types.name ? this.parseIdent() : this.unexpected();else node.argument = this.type === _tokentype.types.name || this.type === _tokentype.types.bracketL ? this.parseBindingAtom() : this.unexpected();

	  return this.finishNode(node, "RestElement");
	};

	// Parses lvalue (assignable) atom.

	pp.parseBindingAtom = function () {
	  if (this.options.ecmaVersion < 6) return this.parseIdent();
	  switch (this.type) {
	    case _tokentype.types.name:
	      return this.parseIdent();

	    case _tokentype.types.bracketL:
	      var node = this.startNode();
	      this.next();
	      node.elements = this.parseBindingList(_tokentype.types.bracketR, true, true);
	      return this.finishNode(node, "ArrayPattern");

	    case _tokentype.types.braceL:
	      return this.parseObj(true);

	    default:
	      this.unexpected();
	  }
	};

	pp.parseBindingList = function (close, allowEmpty, allowTrailingComma, allowNonIdent) {
	  var elts = [],
	      first = true;
	  while (!this.eat(close)) {
	    if (first) first = false;else this.expect(_tokentype.types.comma);
	    if (allowEmpty && this.type === _tokentype.types.comma) {
	      elts.push(null);
	    } else if (allowTrailingComma && this.afterTrailingComma(close)) {
	      break;
	    } else if (this.type === _tokentype.types.ellipsis) {
	      var rest = this.parseRest(allowNonIdent);
	      this.parseBindingListItem(rest);
	      elts.push(rest);
	      this.expect(close);
	      break;
	    } else {
	      var elem = this.parseMaybeDefault(this.start, this.startLoc);
	      this.parseBindingListItem(elem);
	      elts.push(elem);
	    }
	  }
	  return elts;
	};

	pp.parseBindingListItem = function (param) {
	  return param;
	};

	// Parses assignment pattern around given atom if possible.

	pp.parseMaybeDefault = function (startPos, startLoc, left) {
	  left = left || this.parseBindingAtom();
	  if (this.options.ecmaVersion < 6 || !this.eat(_tokentype.types.eq)) return left;
	  var node = this.startNodeAt(startPos, startLoc);
	  node.left = left;
	  node.right = this.parseMaybeAssign();
	  return this.finishNode(node, "AssignmentPattern");
	};

	// Verify that a node is an lval — something that can be assigned
	// to.

	pp.checkLVal = function (expr, isBinding, checkClashes) {
	  switch (expr.type) {
	    case "Identifier":
	      if (this.strict && this.reservedWordsStrictBind.test(expr.name)) this.raise(expr.start, (isBinding ? "Binding " : "Assigning to ") + expr.name + " in strict mode");
	      if (checkClashes) {
	        if (_util.has(checkClashes, expr.name)) this.raise(expr.start, "Argument name clash");
	        checkClashes[expr.name] = true;
	      }
	      break;

	    case "MemberExpression":
	      if (isBinding) this.raise(expr.start, (isBinding ? "Binding" : "Assigning to") + " member expression");
	      break;

	    case "ObjectPattern":
	      for (var i = 0; i < expr.properties.length; i++) {
	        this.checkLVal(expr.properties[i].value, isBinding, checkClashes);
	      }break;

	    case "ArrayPattern":
	      for (var i = 0; i < expr.elements.length; i++) {
	        var elem = expr.elements[i];
	        if (elem) this.checkLVal(elem, isBinding, checkClashes);
	      }
	      break;

	    case "AssignmentPattern":
	      this.checkLVal(expr.left, isBinding, checkClashes);
	      break;

	    case "RestElement":
	      this.checkLVal(expr.argument, isBinding, checkClashes);
	      break;

	    case "ParenthesizedExpression":
	      this.checkLVal(expr.expression, isBinding, checkClashes);
	      break;

	    default:
	      this.raise(expr.start, (isBinding ? "Binding" : "Assigning to") + " rvalue");
	  }
	};

	},{"./state":10,"./tokentype":14,"./util":15}],7:[function(_dereq_,module,exports){
	"use strict";

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _state = _dereq_("./state");

	var _locutil = _dereq_("./locutil");

	var Node = function Node(parser, pos, loc) {
	  _classCallCheck(this, Node);

	  this.type = "";
	  this.start = pos;
	  this.end = 0;
	  if (parser.options.locations) this.loc = new _locutil.SourceLocation(parser, loc);
	  if (parser.options.directSourceFile) this.sourceFile = parser.options.directSourceFile;
	  if (parser.options.ranges) this.range = [pos, 0];
	}

	// Start an AST node, attaching a start offset.

	;

	exports.Node = Node;
	var pp = _state.Parser.prototype;

	pp.startNode = function () {
	  return new Node(this, this.start, this.startLoc);
	};

	pp.startNodeAt = function (pos, loc) {
	  return new Node(this, pos, loc);
	};

	// Finish an AST node, adding `type` and `end` properties.

	function finishNodeAt(node, type, pos, loc) {
	  node.type = type;
	  node.end = pos;
	  if (this.options.locations) node.loc.end = loc;
	  if (this.options.ranges) node.range[1] = pos;
	  return node;
	}

	pp.finishNode = function (node, type) {
	  return finishNodeAt.call(this, node, type, this.lastTokEnd, this.lastTokEndLoc);
	};

	// Finish node at given position

	pp.finishNodeAt = function (node, type, pos, loc) {
	  return finishNodeAt.call(this, node, type, pos, loc);
	};

	},{"./locutil":5,"./state":10}],8:[function(_dereq_,module,exports){
	"use strict";

	exports.__esModule = true;
	exports.getOptions = getOptions;

	var _util = _dereq_("./util");

	var _locutil = _dereq_("./locutil");

	// A second optional argument can be given to further configure
	// the parser process. These options are recognized:

	var defaultOptions = {
	  // `ecmaVersion` indicates the ECMAScript version to parse. Must
	  // be either 3, or 5, or 6. This influences support for strict
	  // mode, the set of reserved words, support for getters and
	  // setters and other features.
	  ecmaVersion: 5,
	  // Source type ("script" or "module") for different semantics
	  sourceType: "script",
	  // `onInsertedSemicolon` can be a callback that will be called
	  // when a semicolon is automatically inserted. It will be passed
	  // th position of the comma as an offset, and if `locations` is
	  // enabled, it is given the location as a `{line, column}` object
	  // as second argument.
	  onInsertedSemicolon: null,
	  // `onTrailingComma` is similar to `onInsertedSemicolon`, but for
	  // trailing commas.
	  onTrailingComma: null,
	  // By default, reserved words are only enforced if ecmaVersion >= 5.
	  // Set `allowReserved` to a boolean value to explicitly turn this on
	  // an off. When this option has the value "never", reserved words
	  // and keywords can also not be used as property names.
	  allowReserved: null,
	  // When enabled, a return at the top level is not considered an
	  // error.
	  allowReturnOutsideFunction: false,
	  // When enabled, import/export statements are not constrained to
	  // appearing at the top of the program.
	  allowImportExportEverywhere: false,
	  // When enabled, hashbang directive in the beginning of file
	  // is allowed and treated as a line comment.
	  allowHashBang: false,
	  // When `locations` is on, `loc` properties holding objects with
	  // `start` and `end` properties in `{line, column}` form (with
	  // line being 1-based and column 0-based) will be attached to the
	  // nodes.
	  locations: false,
	  // A function can be passed as `onToken` option, which will
	  // cause Acorn to call that function with object in the same
	  // format as tokens returned from `tokenizer().getToken()`. Note
	  // that you are not allowed to call the parser from the
	  // callback—that will corrupt its internal state.
	  onToken: null,
	  // A function can be passed as `onComment` option, which will
	  // cause Acorn to call that function with `(block, text, start,
	  // end)` parameters whenever a comment is skipped. `block` is a
	  // boolean indicating whether this is a block (`/* */`) comment,
	  // `text` is the content of the comment, and `start` and `end` are
	  // character offsets that denote the start and end of the comment.
	  // When the `locations` option is on, two more parameters are
	  // passed, the full `{line, column}` locations of the start and
	  // end of the comments. Note that you are not allowed to call the
	  // parser from the callback—that will corrupt its internal state.
	  onComment: null,
	  // Nodes have their start and end characters offsets recorded in
	  // `start` and `end` properties (directly on the node, rather than
	  // the `loc` object, which holds line/column data. To also add a
	  // [semi-standardized][range] `range` property holding a `[start,
	  // end]` array with the same numbers, set the `ranges` option to
	  // `true`.
	  //
	  // [range]: https://bugzilla.mozilla.org/show_bug.cgi?id=745678
	  ranges: false,
	  // It is possible to parse multiple files into a single AST by
	  // passing the tree produced by parsing the first file as
	  // `program` option in subsequent parses. This will add the
	  // toplevel forms of the parsed file to the `Program` (top) node
	  // of an existing parse tree.
	  program: null,
	  // When `locations` is on, you can pass this to record the source
	  // file in every node's `loc` object.
	  sourceFile: null,
	  // This value, if given, is stored in every node, whether
	  // `locations` is on or off.
	  directSourceFile: null,
	  // When enabled, parenthesized expressions are represented by
	  // (non-standard) ParenthesizedExpression nodes
	  preserveParens: false,
	  plugins: {}
	};

	exports.defaultOptions = defaultOptions;
	// Interpret and default an options object

	function getOptions(opts) {
	  var options = {};
	  for (var opt in defaultOptions) {
	    options[opt] = opts && _util.has(opts, opt) ? opts[opt] : defaultOptions[opt];
	  }if (options.allowReserved == null) options.allowReserved = options.ecmaVersion < 5;

	  if (_util.isArray(options.onToken)) {
	    (function () {
	      var tokens = options.onToken;
	      options.onToken = function (token) {
	        return tokens.push(token);
	      };
	    })();
	  }
	  if (_util.isArray(options.onComment)) options.onComment = pushComment(options, options.onComment);

	  return options;
	}

	function pushComment(options, array) {
	  return function (block, text, start, end, startLoc, endLoc) {
	    var comment = {
	      type: block ? 'Block' : 'Line',
	      value: text,
	      start: start,
	      end: end
	    };
	    if (options.locations) comment.loc = new _locutil.SourceLocation(this, startLoc, endLoc);
	    if (options.ranges) comment.range = [start, end];
	    array.push(comment);
	  };
	}

	},{"./locutil":5,"./util":15}],9:[function(_dereq_,module,exports){
	"use strict";

	var _tokentype = _dereq_("./tokentype");

	var _state = _dereq_("./state");

	var _whitespace = _dereq_("./whitespace");

	var pp = _state.Parser.prototype;

	// ## Parser utilities

	// Test whether a statement node is the string literal `"use strict"`.

	pp.isUseStrict = function (stmt) {
	  return this.options.ecmaVersion >= 5 && stmt.type === "ExpressionStatement" && stmt.expression.type === "Literal" && stmt.expression.raw.slice(1, -1) === "use strict";
	};

	// Predicate that tests whether the next token is of the given
	// type, and if yes, consumes it as a side effect.

	pp.eat = function (type) {
	  if (this.type === type) {
	    this.next();
	    return true;
	  } else {
	    return false;
	  }
	};

	// Tests whether parsed token is a contextual keyword.

	pp.isContextual = function (name) {
	  return this.type === _tokentype.types.name && this.value === name;
	};

	// Consumes contextual keyword if possible.

	pp.eatContextual = function (name) {
	  return this.value === name && this.eat(_tokentype.types.name);
	};

	// Asserts that following token is given contextual keyword.

	pp.expectContextual = function (name) {
	  if (!this.eatContextual(name)) this.unexpected();
	};

	// Test whether a semicolon can be inserted at the current position.

	pp.canInsertSemicolon = function () {
	  return this.type === _tokentype.types.eof || this.type === _tokentype.types.braceR || _whitespace.lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
	};

	pp.insertSemicolon = function () {
	  if (this.canInsertSemicolon()) {
	    if (this.options.onInsertedSemicolon) this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc);
	    return true;
	  }
	};

	// Consume a semicolon, or, failing that, see if we are allowed to
	// pretend that there is a semicolon at this position.

	pp.semicolon = function () {
	  if (!this.eat(_tokentype.types.semi) && !this.insertSemicolon()) this.unexpected();
	};

	pp.afterTrailingComma = function (tokType) {
	  if (this.type == tokType) {
	    if (this.options.onTrailingComma) this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc);
	    this.next();
	    return true;
	  }
	};

	// Expect a token of a given type. If found, consume it, otherwise,
	// raise an unexpected token error.

	pp.expect = function (type) {
	  this.eat(type) || this.unexpected();
	};

	// Raise an unexpected token error.

	pp.unexpected = function (pos) {
	  this.raise(pos != null ? pos : this.start, "Unexpected token");
	};

	pp.checkPatternErrors = function (refDestructuringErrors, andThrow) {
	  var pos = refDestructuringErrors && refDestructuringErrors.trailingComma;
	  if (!andThrow) return !!pos;
	  if (pos) this.raise(pos, "Trailing comma is not permitted in destructuring patterns");
	};

	pp.checkExpressionErrors = function (refDestructuringErrors, andThrow) {
	  var pos = refDestructuringErrors && refDestructuringErrors.shorthandAssign;
	  if (!andThrow) return !!pos;
	  if (pos) this.raise(pos, "Shorthand property assignments are valid only in destructuring patterns");
	};

	},{"./state":10,"./tokentype":14,"./whitespace":16}],10:[function(_dereq_,module,exports){
	"use strict";

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _identifier = _dereq_("./identifier");

	var _tokentype = _dereq_("./tokentype");

	var _whitespace = _dereq_("./whitespace");

	var _options = _dereq_("./options");

	// Registered plugins
	var plugins = {};

	exports.plugins = plugins;
	function keywordRegexp(words) {
	  return new RegExp("^(" + words.replace(/ /g, "|") + ")$");
	}

	var Parser = (function () {
	  function Parser(options, input, startPos) {
	    _classCallCheck(this, Parser);

	    this.options = options = _options.getOptions(options);
	    this.sourceFile = options.sourceFile;
	    this.keywords = keywordRegexp(_identifier.keywords[options.ecmaVersion >= 6 ? 6 : 5]);
	    var reserved = options.allowReserved ? "" : _identifier.reservedWords[options.ecmaVersion] + (options.sourceType == "module" ? " await" : "");
	    this.reservedWords = keywordRegexp(reserved);
	    var reservedStrict = (reserved ? reserved + " " : "") + _identifier.reservedWords.strict;
	    this.reservedWordsStrict = keywordRegexp(reservedStrict);
	    this.reservedWordsStrictBind = keywordRegexp(reservedStrict + " " + _identifier.reservedWords.strictBind);
	    this.input = String(input);

	    // Used to signal to callers of `readWord1` whether the word
	    // contained any escape sequences. This is needed because words with
	    // escape sequences must not be interpreted as keywords.
	    this.containsEsc = false;

	    // Load plugins
	    this.loadPlugins(options.plugins);

	    // Set up token state

	    // The current position of the tokenizer in the input.
	    if (startPos) {
	      this.pos = startPos;
	      this.lineStart = Math.max(0, this.input.lastIndexOf("\n", startPos));
	      this.curLine = this.input.slice(0, this.lineStart).split(_whitespace.lineBreak).length;
	    } else {
	      this.pos = this.lineStart = 0;
	      this.curLine = 1;
	    }

	    // Properties of the current token:
	    // Its type
	    this.type = _tokentype.types.eof;
	    // For tokens that include more information than their type, the value
	    this.value = null;
	    // Its start and end offset
	    this.start = this.end = this.pos;
	    // And, if locations are used, the {line, column} object
	    // corresponding to those offsets
	    this.startLoc = this.endLoc = this.curPosition();

	    // Position information for the previous token
	    this.lastTokEndLoc = this.lastTokStartLoc = null;
	    this.lastTokStart = this.lastTokEnd = this.pos;

	    // The context stack is used to superficially track syntactic
	    // context to predict whether a regular expression is allowed in a
	    // given position.
	    this.context = this.initialContext();
	    this.exprAllowed = true;

	    // Figure out if it's a module code.
	    this.strict = this.inModule = options.sourceType === "module";

	    // Used to signify the start of a potential arrow function
	    this.potentialArrowAt = -1;

	    // Flags to track whether we are in a function, a generator.
	    this.inFunction = this.inGenerator = false;
	    // Labels in scope.
	    this.labels = [];

	    // If enabled, skip leading hashbang line.
	    if (this.pos === 0 && options.allowHashBang && this.input.slice(0, 2) === '#!') this.skipLineComment(2);
	  }

	  // DEPRECATED Kept for backwards compatibility until 3.0 in case a plugin uses them

	  Parser.prototype.isKeyword = function isKeyword(word) {
	    return this.keywords.test(word);
	  };

	  Parser.prototype.isReservedWord = function isReservedWord(word) {
	    return this.reservedWords.test(word);
	  };

	  Parser.prototype.extend = function extend(name, f) {
	    this[name] = f(this[name]);
	  };

	  Parser.prototype.loadPlugins = function loadPlugins(pluginConfigs) {
	    for (var _name in pluginConfigs) {
	      var plugin = plugins[_name];
	      if (!plugin) throw new Error("Plugin '" + _name + "' not found");
	      plugin(this, pluginConfigs[_name]);
	    }
	  };

	  Parser.prototype.parse = function parse() {
	    var node = this.options.program || this.startNode();
	    this.nextToken();
	    return this.parseTopLevel(node);
	  };

	  return Parser;
	})();

	exports.Parser = Parser;

	},{"./identifier":2,"./options":8,"./tokentype":14,"./whitespace":16}],11:[function(_dereq_,module,exports){
	"use strict";

	var _tokentype = _dereq_("./tokentype");

	var _state = _dereq_("./state");

	var _whitespace = _dereq_("./whitespace");

	var pp = _state.Parser.prototype;

	// ### Statement parsing

	// Parse a program. Initializes the parser, reads any number of
	// statements, and wraps them in a Program node.  Optionally takes a
	// `program` argument.  If present, the statements will be appended
	// to its body instead of creating a new node.

	pp.parseTopLevel = function (node) {
	  var first = true;
	  if (!node.body) node.body = [];
	  while (this.type !== _tokentype.types.eof) {
	    var stmt = this.parseStatement(true, true);
	    node.body.push(stmt);
	    if (first) {
	      if (this.isUseStrict(stmt)) this.setStrict(true);
	      first = false;
	    }
	  }
	  this.next();
	  if (this.options.ecmaVersion >= 6) {
	    node.sourceType = this.options.sourceType;
	  }
	  return this.finishNode(node, "Program");
	};

	var loopLabel = { kind: "loop" },
	    switchLabel = { kind: "switch" };

	// Parse a single statement.
	//
	// If expecting a statement and finding a slash operator, parse a
	// regular expression literal. This is to handle cases like
	// `if (foo) /blah/.exec(foo)`, where looking at the previous token
	// does not help.

	pp.parseStatement = function (declaration, topLevel) {
	  var starttype = this.type,
	      node = this.startNode();

	  // Most types of statements are recognized by the keyword they
	  // start with. Many are trivial to parse, some require a bit of
	  // complexity.

	  switch (starttype) {
	    case _tokentype.types._break:case _tokentype.types._continue:
	      return this.parseBreakContinueStatement(node, starttype.keyword);
	    case _tokentype.types._debugger:
	      return this.parseDebuggerStatement(node);
	    case _tokentype.types._do:
	      return this.parseDoStatement(node);
	    case _tokentype.types._for:
	      return this.parseForStatement(node);
	    case _tokentype.types._function:
	      if (!declaration && this.options.ecmaVersion >= 6) this.unexpected();
	      return this.parseFunctionStatement(node);
	    case _tokentype.types._class:
	      if (!declaration) this.unexpected();
	      return this.parseClass(node, true);
	    case _tokentype.types._if:
	      return this.parseIfStatement(node);
	    case _tokentype.types._return:
	      return this.parseReturnStatement(node);
	    case _tokentype.types._switch:
	      return this.parseSwitchStatement(node);
	    case _tokentype.types._throw:
	      return this.parseThrowStatement(node);
	    case _tokentype.types._try:
	      return this.parseTryStatement(node);
	    case _tokentype.types._let:case _tokentype.types._const:
	      if (!declaration) this.unexpected(); // NOTE: falls through to _var
	    case _tokentype.types._var:
	      return this.parseVarStatement(node, starttype);
	    case _tokentype.types._while:
	      return this.parseWhileStatement(node);
	    case _tokentype.types._with:
	      return this.parseWithStatement(node);
	    case _tokentype.types.braceL:
	      return this.parseBlock();
	    case _tokentype.types.semi:
	      return this.parseEmptyStatement(node);
	    case _tokentype.types._export:
	    case _tokentype.types._import:
	      if (!this.options.allowImportExportEverywhere) {
	        if (!topLevel) this.raise(this.start, "'import' and 'export' may only appear at the top level");
	        if (!this.inModule) this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'");
	      }
	      return starttype === _tokentype.types._import ? this.parseImport(node) : this.parseExport(node);

	    // If the statement does not start with a statement keyword or a
	    // brace, it's an ExpressionStatement or LabeledStatement. We
	    // simply start parsing an expression, and afterwards, if the
	    // next token is a colon and the expression was a simple
	    // Identifier node, we switch to interpreting it as a label.
	    default:
	      var maybeName = this.value,
	          expr = this.parseExpression();
	      if (starttype === _tokentype.types.name && expr.type === "Identifier" && this.eat(_tokentype.types.colon)) return this.parseLabeledStatement(node, maybeName, expr);else return this.parseExpressionStatement(node, expr);
	  }
	};

	pp.parseBreakContinueStatement = function (node, keyword) {
	  var isBreak = keyword == "break";
	  this.next();
	  if (this.eat(_tokentype.types.semi) || this.insertSemicolon()) node.label = null;else if (this.type !== _tokentype.types.name) this.unexpected();else {
	    node.label = this.parseIdent();
	    this.semicolon();
	  }

	  // Verify that there is an actual destination to break or
	  // continue to.
	  for (var i = 0; i < this.labels.length; ++i) {
	    var lab = this.labels[i];
	    if (node.label == null || lab.name === node.label.name) {
	      if (lab.kind != null && (isBreak || lab.kind === "loop")) break;
	      if (node.label && isBreak) break;
	    }
	  }
	  if (i === this.labels.length) this.raise(node.start, "Unsyntactic " + keyword);
	  return this.finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement");
	};

	pp.parseDebuggerStatement = function (node) {
	  this.next();
	  this.semicolon();
	  return this.finishNode(node, "DebuggerStatement");
	};

	pp.parseDoStatement = function (node) {
	  this.next();
	  this.labels.push(loopLabel);
	  node.body = this.parseStatement(false);
	  this.labels.pop();
	  this.expect(_tokentype.types._while);
	  node.test = this.parseParenExpression();
	  if (this.options.ecmaVersion >= 6) this.eat(_tokentype.types.semi);else this.semicolon();
	  return this.finishNode(node, "DoWhileStatement");
	};

	// Disambiguating between a `for` and a `for`/`in` or `for`/`of`
	// loop is non-trivial. Basically, we have to parse the init `var`
	// statement or expression, disallowing the `in` operator (see
	// the second parameter to `parseExpression`), and then check
	// whether the next token is `in` or `of`. When there is no init
	// part (semicolon immediately after the opening parenthesis), it
	// is a regular `for` loop.

	pp.parseForStatement = function (node) {
	  this.next();
	  this.labels.push(loopLabel);
	  this.expect(_tokentype.types.parenL);
	  if (this.type === _tokentype.types.semi) return this.parseFor(node, null);
	  if (this.type === _tokentype.types._var || this.type === _tokentype.types._let || this.type === _tokentype.types._const) {
	    var _init = this.startNode(),
	        varKind = this.type;
	    this.next();
	    this.parseVar(_init, true, varKind);
	    this.finishNode(_init, "VariableDeclaration");
	    if ((this.type === _tokentype.types._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) && _init.declarations.length === 1 && !(varKind !== _tokentype.types._var && _init.declarations[0].init)) return this.parseForIn(node, _init);
	    return this.parseFor(node, _init);
	  }
	  var refDestructuringErrors = { shorthandAssign: 0, trailingComma: 0 };
	  var init = this.parseExpression(true, refDestructuringErrors);
	  if (this.type === _tokentype.types._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) {
	    this.checkPatternErrors(refDestructuringErrors, true);
	    this.toAssignable(init);
	    this.checkLVal(init);
	    return this.parseForIn(node, init);
	  } else {
	    this.checkExpressionErrors(refDestructuringErrors, true);
	  }
	  return this.parseFor(node, init);
	};

	pp.parseFunctionStatement = function (node) {
	  this.next();
	  return this.parseFunction(node, true);
	};

	pp.parseIfStatement = function (node) {
	  this.next();
	  node.test = this.parseParenExpression();
	  node.consequent = this.parseStatement(false);
	  node.alternate = this.eat(_tokentype.types._else) ? this.parseStatement(false) : null;
	  return this.finishNode(node, "IfStatement");
	};

	pp.parseReturnStatement = function (node) {
	  if (!this.inFunction && !this.options.allowReturnOutsideFunction) this.raise(this.start, "'return' outside of function");
	  this.next();

	  // In `return` (and `break`/`continue`), the keywords with
	  // optional arguments, we eagerly look for a semicolon or the
	  // possibility to insert one.

	  if (this.eat(_tokentype.types.semi) || this.insertSemicolon()) node.argument = null;else {
	    node.argument = this.parseExpression();this.semicolon();
	  }
	  return this.finishNode(node, "ReturnStatement");
	};

	pp.parseSwitchStatement = function (node) {
	  this.next();
	  node.discriminant = this.parseParenExpression();
	  node.cases = [];
	  this.expect(_tokentype.types.braceL);
	  this.labels.push(switchLabel);

	  // Statements under must be grouped (by label) in SwitchCase
	  // nodes. `cur` is used to keep the node that we are currently
	  // adding statements to.

	  for (var cur, sawDefault = false; this.type != _tokentype.types.braceR;) {
	    if (this.type === _tokentype.types._case || this.type === _tokentype.types._default) {
	      var isCase = this.type === _tokentype.types._case;
	      if (cur) this.finishNode(cur, "SwitchCase");
	      node.cases.push(cur = this.startNode());
	      cur.consequent = [];
	      this.next();
	      if (isCase) {
	        cur.test = this.parseExpression();
	      } else {
	        if (sawDefault) this.raise(this.lastTokStart, "Multiple default clauses");
	        sawDefault = true;
	        cur.test = null;
	      }
	      this.expect(_tokentype.types.colon);
	    } else {
	      if (!cur) this.unexpected();
	      cur.consequent.push(this.parseStatement(true));
	    }
	  }
	  if (cur) this.finishNode(cur, "SwitchCase");
	  this.next(); // Closing brace
	  this.labels.pop();
	  return this.finishNode(node, "SwitchStatement");
	};

	pp.parseThrowStatement = function (node) {
	  this.next();
	  if (_whitespace.lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) this.raise(this.lastTokEnd, "Illegal newline after throw");
	  node.argument = this.parseExpression();
	  this.semicolon();
	  return this.finishNode(node, "ThrowStatement");
	};

	// Reused empty array added for node fields that are always empty.

	var empty = [];

	pp.parseTryStatement = function (node) {
	  this.next();
	  node.block = this.parseBlock();
	  node.handler = null;
	  if (this.type === _tokentype.types._catch) {
	    var clause = this.startNode();
	    this.next();
	    this.expect(_tokentype.types.parenL);
	    clause.param = this.parseBindingAtom();
	    this.checkLVal(clause.param, true);
	    this.expect(_tokentype.types.parenR);
	    clause.body = this.parseBlock();
	    node.handler = this.finishNode(clause, "CatchClause");
	  }
	  node.finalizer = this.eat(_tokentype.types._finally) ? this.parseBlock() : null;
	  if (!node.handler && !node.finalizer) this.raise(node.start, "Missing catch or finally clause");
	  return this.finishNode(node, "TryStatement");
	};

	pp.parseVarStatement = function (node, kind) {
	  this.next();
	  this.parseVar(node, false, kind);
	  this.semicolon();
	  return this.finishNode(node, "VariableDeclaration");
	};

	pp.parseWhileStatement = function (node) {
	  this.next();
	  node.test = this.parseParenExpression();
	  this.labels.push(loopLabel);
	  node.body = this.parseStatement(false);
	  this.labels.pop();
	  return this.finishNode(node, "WhileStatement");
	};

	pp.parseWithStatement = function (node) {
	  if (this.strict) this.raise(this.start, "'with' in strict mode");
	  this.next();
	  node.object = this.parseParenExpression();
	  node.body = this.parseStatement(false);
	  return this.finishNode(node, "WithStatement");
	};

	pp.parseEmptyStatement = function (node) {
	  this.next();
	  return this.finishNode(node, "EmptyStatement");
	};

	pp.parseLabeledStatement = function (node, maybeName, expr) {
	  for (var i = 0; i < this.labels.length; ++i) {
	    if (this.labels[i].name === maybeName) this.raise(expr.start, "Label '" + maybeName + "' is already declared");
	  }var kind = this.type.isLoop ? "loop" : this.type === _tokentype.types._switch ? "switch" : null;
	  for (var i = this.labels.length - 1; i >= 0; i--) {
	    var label = this.labels[i];
	    if (label.statementStart == node.start) {
	      label.statementStart = this.start;
	      label.kind = kind;
	    } else break;
	  }
	  this.labels.push({ name: maybeName, kind: kind, statementStart: this.start });
	  node.body = this.parseStatement(true);
	  this.labels.pop();
	  node.label = expr;
	  return this.finishNode(node, "LabeledStatement");
	};

	pp.parseExpressionStatement = function (node, expr) {
	  node.expression = expr;
	  this.semicolon();
	  return this.finishNode(node, "ExpressionStatement");
	};

	// Parse a semicolon-enclosed block of statements, handling `"use
	// strict"` declarations when `allowStrict` is true (used for
	// function bodies).

	pp.parseBlock = function (allowStrict) {
	  var node = this.startNode(),
	      first = true,
	      oldStrict = undefined;
	  node.body = [];
	  this.expect(_tokentype.types.braceL);
	  while (!this.eat(_tokentype.types.braceR)) {
	    var stmt = this.parseStatement(true);
	    node.body.push(stmt);
	    if (first && allowStrict && this.isUseStrict(stmt)) {
	      oldStrict = this.strict;
	      this.setStrict(this.strict = true);
	    }
	    first = false;
	  }
	  if (oldStrict === false) this.setStrict(false);
	  return this.finishNode(node, "BlockStatement");
	};

	// Parse a regular `for` loop. The disambiguation code in
	// `parseStatement` will already have parsed the init statement or
	// expression.

	pp.parseFor = function (node, init) {
	  node.init = init;
	  this.expect(_tokentype.types.semi);
	  node.test = this.type === _tokentype.types.semi ? null : this.parseExpression();
	  this.expect(_tokentype.types.semi);
	  node.update = this.type === _tokentype.types.parenR ? null : this.parseExpression();
	  this.expect(_tokentype.types.parenR);
	  node.body = this.parseStatement(false);
	  this.labels.pop();
	  return this.finishNode(node, "ForStatement");
	};

	// Parse a `for`/`in` and `for`/`of` loop, which are almost
	// same from parser's perspective.

	pp.parseForIn = function (node, init) {
	  var type = this.type === _tokentype.types._in ? "ForInStatement" : "ForOfStatement";
	  this.next();
	  node.left = init;
	  node.right = this.parseExpression();
	  this.expect(_tokentype.types.parenR);
	  node.body = this.parseStatement(false);
	  this.labels.pop();
	  return this.finishNode(node, type);
	};

	// Parse a list of variable declarations.

	pp.parseVar = function (node, isFor, kind) {
	  node.declarations = [];
	  node.kind = kind.keyword;
	  for (;;) {
	    var decl = this.startNode();
	    this.parseVarId(decl);
	    if (this.eat(_tokentype.types.eq)) {
	      decl.init = this.parseMaybeAssign(isFor);
	    } else if (kind === _tokentype.types._const && !(this.type === _tokentype.types._in || this.options.ecmaVersion >= 6 && this.isContextual("of"))) {
	      this.unexpected();
	    } else if (decl.id.type != "Identifier" && !(isFor && (this.type === _tokentype.types._in || this.isContextual("of")))) {
	      this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value");
	    } else {
	      decl.init = null;
	    }
	    node.declarations.push(this.finishNode(decl, "VariableDeclarator"));
	    if (!this.eat(_tokentype.types.comma)) break;
	  }
	  return node;
	};

	pp.parseVarId = function (decl) {
	  decl.id = this.parseBindingAtom();
	  this.checkLVal(decl.id, true);
	};

	// Parse a function declaration or literal (depending on the
	// `isStatement` parameter).

	pp.parseFunction = function (node, isStatement, allowExpressionBody) {
	  this.initFunction(node);
	  if (this.options.ecmaVersion >= 6) node.generator = this.eat(_tokentype.types.star);
	  if (isStatement || this.type === _tokentype.types.name) node.id = this.parseIdent();
	  this.parseFunctionParams(node);
	  this.parseFunctionBody(node, allowExpressionBody);
	  return this.finishNode(node, isStatement ? "FunctionDeclaration" : "FunctionExpression");
	};

	pp.parseFunctionParams = function (node) {
	  this.expect(_tokentype.types.parenL);
	  node.params = this.parseBindingList(_tokentype.types.parenR, false, false, true);
	};

	// Parse a class declaration or literal (depending on the
	// `isStatement` parameter).

	pp.parseClass = function (node, isStatement) {
	  this.next();
	  this.parseClassId(node, isStatement);
	  this.parseClassSuper(node);
	  var classBody = this.startNode();
	  var hadConstructor = false;
	  classBody.body = [];
	  this.expect(_tokentype.types.braceL);
	  while (!this.eat(_tokentype.types.braceR)) {
	    if (this.eat(_tokentype.types.semi)) continue;
	    var method = this.startNode();
	    var isGenerator = this.eat(_tokentype.types.star);
	    var isMaybeStatic = this.type === _tokentype.types.name && this.value === "static";
	    this.parsePropertyName(method);
	    method["static"] = isMaybeStatic && this.type !== _tokentype.types.parenL;
	    if (method["static"]) {
	      if (isGenerator) this.unexpected();
	      isGenerator = this.eat(_tokentype.types.star);
	      this.parsePropertyName(method);
	    }
	    method.kind = "method";
	    var isGetSet = false;
	    if (!method.computed) {
	      var key = method.key;

	      if (!isGenerator && key.type === "Identifier" && this.type !== _tokentype.types.parenL && (key.name === "get" || key.name === "set")) {
	        isGetSet = true;
	        method.kind = key.name;
	        key = this.parsePropertyName(method);
	      }
	      if (!method["static"] && (key.type === "Identifier" && key.name === "constructor" || key.type === "Literal" && key.value === "constructor")) {
	        if (hadConstructor) this.raise(key.start, "Duplicate constructor in the same class");
	        if (isGetSet) this.raise(key.start, "Constructor can't have get/set modifier");
	        if (isGenerator) this.raise(key.start, "Constructor can't be a generator");
	        method.kind = "constructor";
	        hadConstructor = true;
	      }
	    }
	    this.parseClassMethod(classBody, method, isGenerator);
	    if (isGetSet) {
	      var paramCount = method.kind === "get" ? 0 : 1;
	      if (method.value.params.length !== paramCount) {
	        var start = method.value.start;
	        if (method.kind === "get") this.raise(start, "getter should have no params");else this.raise(start, "setter should have exactly one param");
	      }
	      if (method.kind === "set" && method.value.params[0].type === "RestElement") this.raise(method.value.params[0].start, "Setter cannot use rest params");
	    }
	  }
	  node.body = this.finishNode(classBody, "ClassBody");
	  return this.finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression");
	};

	pp.parseClassMethod = function (classBody, method, isGenerator) {
	  method.value = this.parseMethod(isGenerator);
	  classBody.body.push(this.finishNode(method, "MethodDefinition"));
	};

	pp.parseClassId = function (node, isStatement) {
	  node.id = this.type === _tokentype.types.name ? this.parseIdent() : isStatement ? this.unexpected() : null;
	};

	pp.parseClassSuper = function (node) {
	  node.superClass = this.eat(_tokentype.types._extends) ? this.parseExprSubscripts() : null;
	};

	// Parses module export declaration.

	pp.parseExport = function (node) {
	  this.next();
	  // export * from '...'
	  if (this.eat(_tokentype.types.star)) {
	    this.expectContextual("from");
	    node.source = this.type === _tokentype.types.string ? this.parseExprAtom() : this.unexpected();
	    this.semicolon();
	    return this.finishNode(node, "ExportAllDeclaration");
	  }
	  if (this.eat(_tokentype.types._default)) {
	    // export default ...
	    var expr = this.parseMaybeAssign();
	    var needsSemi = true;
	    if (expr.type == "FunctionExpression" || expr.type == "ClassExpression") {
	      needsSemi = false;
	      if (expr.id) {
	        expr.type = expr.type == "FunctionExpression" ? "FunctionDeclaration" : "ClassDeclaration";
	      }
	    }
	    node.declaration = expr;
	    if (needsSemi) this.semicolon();
	    return this.finishNode(node, "ExportDefaultDeclaration");
	  }
	  // export var|const|let|function|class ...
	  if (this.shouldParseExportStatement()) {
	    node.declaration = this.parseStatement(true);
	    node.specifiers = [];
	    node.source = null;
	  } else {
	    // export { x, y as z } [from '...']
	    node.declaration = null;
	    node.specifiers = this.parseExportSpecifiers();
	    if (this.eatContextual("from")) {
	      node.source = this.type === _tokentype.types.string ? this.parseExprAtom() : this.unexpected();
	    } else {
	      // check for keywords used as local names
	      for (var i = 0; i < node.specifiers.length; i++) {
	        if (this.keywords.test(node.specifiers[i].local.name) || this.reservedWords.test(node.specifiers[i].local.name)) {
	          this.unexpected(node.specifiers[i].local.start);
	        }
	      }

	      node.source = null;
	    }
	    this.semicolon();
	  }
	  return this.finishNode(node, "ExportNamedDeclaration");
	};

	pp.shouldParseExportStatement = function () {
	  return this.type.keyword;
	};

	// Parses a comma-separated list of module exports.

	pp.parseExportSpecifiers = function () {
	  var nodes = [],
	      first = true;
	  // export { x, y as z } [from '...']
	  this.expect(_tokentype.types.braceL);
	  while (!this.eat(_tokentype.types.braceR)) {
	    if (!first) {
	      this.expect(_tokentype.types.comma);
	      if (this.afterTrailingComma(_tokentype.types.braceR)) break;
	    } else first = false;

	    var node = this.startNode();
	    node.local = this.parseIdent(this.type === _tokentype.types._default);
	    node.exported = this.eatContextual("as") ? this.parseIdent(true) : node.local;
	    nodes.push(this.finishNode(node, "ExportSpecifier"));
	  }
	  return nodes;
	};

	// Parses import declaration.

	pp.parseImport = function (node) {
	  this.next();
	  // import '...'
	  if (this.type === _tokentype.types.string) {
	    node.specifiers = empty;
	    node.source = this.parseExprAtom();
	  } else {
	    node.specifiers = this.parseImportSpecifiers();
	    this.expectContextual("from");
	    node.source = this.type === _tokentype.types.string ? this.parseExprAtom() : this.unexpected();
	  }
	  this.semicolon();
	  return this.finishNode(node, "ImportDeclaration");
	};

	// Parses a comma-separated list of module imports.

	pp.parseImportSpecifiers = function () {
	  var nodes = [],
	      first = true;
	  if (this.type === _tokentype.types.name) {
	    // import defaultObj, { x, y as z } from '...'
	    var node = this.startNode();
	    node.local = this.parseIdent();
	    this.checkLVal(node.local, true);
	    nodes.push(this.finishNode(node, "ImportDefaultSpecifier"));
	    if (!this.eat(_tokentype.types.comma)) return nodes;
	  }
	  if (this.type === _tokentype.types.star) {
	    var node = this.startNode();
	    this.next();
	    this.expectContextual("as");
	    node.local = this.parseIdent();
	    this.checkLVal(node.local, true);
	    nodes.push(this.finishNode(node, "ImportNamespaceSpecifier"));
	    return nodes;
	  }
	  this.expect(_tokentype.types.braceL);
	  while (!this.eat(_tokentype.types.braceR)) {
	    if (!first) {
	      this.expect(_tokentype.types.comma);
	      if (this.afterTrailingComma(_tokentype.types.braceR)) break;
	    } else first = false;

	    var node = this.startNode();
	    node.imported = this.parseIdent(true);
	    if (this.eatContextual("as")) {
	      node.local = this.parseIdent();
	    } else {
	      node.local = node.imported;
	      if (this.isKeyword(node.local.name)) this.unexpected(node.local.start);
	      if (this.reservedWordsStrict.test(node.local.name)) this.raise(node.local.start, "The keyword '" + node.local.name + "' is reserved");
	    }
	    this.checkLVal(node.local, true);
	    nodes.push(this.finishNode(node, "ImportSpecifier"));
	  }
	  return nodes;
	};

	},{"./state":10,"./tokentype":14,"./whitespace":16}],12:[function(_dereq_,module,exports){
	// The algorithm used to determine whether a regexp can appear at a
	// given point in the program is loosely based on sweet.js' approach.
	// See https://github.com/mozilla/sweet.js/wiki/design

	"use strict";

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _state = _dereq_("./state");

	var _tokentype = _dereq_("./tokentype");

	var _whitespace = _dereq_("./whitespace");

	var TokContext = function TokContext(token, isExpr, preserveSpace, override) {
	  _classCallCheck(this, TokContext);

	  this.token = token;
	  this.isExpr = !!isExpr;
	  this.preserveSpace = !!preserveSpace;
	  this.override = override;
	};

	exports.TokContext = TokContext;
	var types = {
	  b_stat: new TokContext("{", false),
	  b_expr: new TokContext("{", true),
	  b_tmpl: new TokContext("${", true),
	  p_stat: new TokContext("(", false),
	  p_expr: new TokContext("(", true),
	  q_tmpl: new TokContext("`", true, true, function (p) {
	    return p.readTmplToken();
	  }),
	  f_expr: new TokContext("function", true)
	};

	exports.types = types;
	var pp = _state.Parser.prototype;

	pp.initialContext = function () {
	  return [types.b_stat];
	};

	pp.braceIsBlock = function (prevType) {
	  if (prevType === _tokentype.types.colon) {
	    var _parent = this.curContext();
	    if (_parent === types.b_stat || _parent === types.b_expr) return !_parent.isExpr;
	  }
	  if (prevType === _tokentype.types._return) return _whitespace.lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
	  if (prevType === _tokentype.types._else || prevType === _tokentype.types.semi || prevType === _tokentype.types.eof || prevType === _tokentype.types.parenR) return true;
	  if (prevType == _tokentype.types.braceL) return this.curContext() === types.b_stat;
	  return !this.exprAllowed;
	};

	pp.updateContext = function (prevType) {
	  var update = undefined,
	      type = this.type;
	  if (type.keyword && prevType == _tokentype.types.dot) this.exprAllowed = false;else if (update = type.updateContext) update.call(this, prevType);else this.exprAllowed = type.beforeExpr;
	};

	// Token-specific context update code

	_tokentype.types.parenR.updateContext = _tokentype.types.braceR.updateContext = function () {
	  if (this.context.length == 1) {
	    this.exprAllowed = true;
	    return;
	  }
	  var out = this.context.pop();
	  if (out === types.b_stat && this.curContext() === types.f_expr) {
	    this.context.pop();
	    this.exprAllowed = false;
	  } else if (out === types.b_tmpl) {
	    this.exprAllowed = true;
	  } else {
	    this.exprAllowed = !out.isExpr;
	  }
	};

	_tokentype.types.braceL.updateContext = function (prevType) {
	  this.context.push(this.braceIsBlock(prevType) ? types.b_stat : types.b_expr);
	  this.exprAllowed = true;
	};

	_tokentype.types.dollarBraceL.updateContext = function () {
	  this.context.push(types.b_tmpl);
	  this.exprAllowed = true;
	};

	_tokentype.types.parenL.updateContext = function (prevType) {
	  var statementParens = prevType === _tokentype.types._if || prevType === _tokentype.types._for || prevType === _tokentype.types._with || prevType === _tokentype.types._while;
	  this.context.push(statementParens ? types.p_stat : types.p_expr);
	  this.exprAllowed = true;
	};

	_tokentype.types.incDec.updateContext = function () {
	  // tokExprAllowed stays unchanged
	};

	_tokentype.types._function.updateContext = function () {
	  if (this.curContext() !== types.b_stat) this.context.push(types.f_expr);
	  this.exprAllowed = false;
	};

	_tokentype.types.backQuote.updateContext = function () {
	  if (this.curContext() === types.q_tmpl) this.context.pop();else this.context.push(types.q_tmpl);
	  this.exprAllowed = false;
	};

	},{"./state":10,"./tokentype":14,"./whitespace":16}],13:[function(_dereq_,module,exports){
	"use strict";

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _identifier = _dereq_("./identifier");

	var _tokentype = _dereq_("./tokentype");

	var _state = _dereq_("./state");

	var _locutil = _dereq_("./locutil");

	var _whitespace = _dereq_("./whitespace");

	// Object type used to represent tokens. Note that normally, tokens
	// simply exist as properties on the parser object. This is only
	// used for the onToken callback and the external tokenizer.

	var Token = function Token(p) {
	  _classCallCheck(this, Token);

	  this.type = p.type;
	  this.value = p.value;
	  this.start = p.start;
	  this.end = p.end;
	  if (p.options.locations) this.loc = new _locutil.SourceLocation(p, p.startLoc, p.endLoc);
	  if (p.options.ranges) this.range = [p.start, p.end];
	}

	// ## Tokenizer

	;

	exports.Token = Token;
	var pp = _state.Parser.prototype;

	// Are we running under Rhino?
	var isRhino = typeof Packages == "object" && Object.prototype.toString.call(Packages) == "[object JavaPackage]";

	// Move to the next token

	pp.next = function () {
	  if (this.options.onToken) this.options.onToken(new Token(this));

	  this.lastTokEnd = this.end;
	  this.lastTokStart = this.start;
	  this.lastTokEndLoc = this.endLoc;
	  this.lastTokStartLoc = this.startLoc;
	  this.nextToken();
	};

	pp.getToken = function () {
	  this.next();
	  return new Token(this);
	};

	// If we're in an ES6 environment, make parsers iterable
	if (typeof Symbol !== "undefined") pp[Symbol.iterator] = function () {
	  var self = this;
	  return { next: function next() {
	      var token = self.getToken();
	      return {
	        done: token.type === _tokentype.types.eof,
	        value: token
	      };
	    } };
	};

	// Toggle strict mode. Re-reads the next number or string to please
	// pedantic tests (`"use strict"; 010;` should fail).

	pp.setStrict = function (strict) {
	  this.strict = strict;
	  if (this.type !== _tokentype.types.num && this.type !== _tokentype.types.string) return;
	  this.pos = this.start;
	  if (this.options.locations) {
	    while (this.pos < this.lineStart) {
	      this.lineStart = this.input.lastIndexOf("\n", this.lineStart - 2) + 1;
	      --this.curLine;
	    }
	  }
	  this.nextToken();
	};

	pp.curContext = function () {
	  return this.context[this.context.length - 1];
	};

	// Read a single token, updating the parser object's token-related
	// properties.

	pp.nextToken = function () {
	  var curContext = this.curContext();
	  if (!curContext || !curContext.preserveSpace) this.skipSpace();

	  this.start = this.pos;
	  if (this.options.locations) this.startLoc = this.curPosition();
	  if (this.pos >= this.input.length) return this.finishToken(_tokentype.types.eof);

	  if (curContext.override) return curContext.override(this);else this.readToken(this.fullCharCodeAtPos());
	};

	pp.readToken = function (code) {
	  // Identifier or keyword. '\uXXXX' sequences are allowed in
	  // identifiers, so '\' also dispatches to that.
	  if (_identifier.isIdentifierStart(code, this.options.ecmaVersion >= 6) || code === 92 /* '\' */) return this.readWord();

	  return this.getTokenFromCode(code);
	};

	pp.fullCharCodeAtPos = function () {
	  var code = this.input.charCodeAt(this.pos);
	  if (code <= 0xd7ff || code >= 0xe000) return code;
	  var next = this.input.charCodeAt(this.pos + 1);
	  return (code << 10) + next - 0x35fdc00;
	};

	pp.skipBlockComment = function () {
	  var startLoc = this.options.onComment && this.curPosition();
	  var start = this.pos,
	      end = this.input.indexOf("*/", this.pos += 2);
	  if (end === -1) this.raise(this.pos - 2, "Unterminated comment");
	  this.pos = end + 2;
	  if (this.options.locations) {
	    _whitespace.lineBreakG.lastIndex = start;
	    var match = undefined;
	    while ((match = _whitespace.lineBreakG.exec(this.input)) && match.index < this.pos) {
	      ++this.curLine;
	      this.lineStart = match.index + match[0].length;
	    }
	  }
	  if (this.options.onComment) this.options.onComment(true, this.input.slice(start + 2, end), start, this.pos, startLoc, this.curPosition());
	};

	pp.skipLineComment = function (startSkip) {
	  var start = this.pos;
	  var startLoc = this.options.onComment && this.curPosition();
	  var ch = this.input.charCodeAt(this.pos += startSkip);
	  while (this.pos < this.input.length && ch !== 10 && ch !== 13 && ch !== 8232 && ch !== 8233) {
	    ++this.pos;
	    ch = this.input.charCodeAt(this.pos);
	  }
	  if (this.options.onComment) this.options.onComment(false, this.input.slice(start + startSkip, this.pos), start, this.pos, startLoc, this.curPosition());
	};

	// Called at the start of the parse and after every token. Skips
	// whitespace and comments, and.

	pp.skipSpace = function () {
	  loop: while (this.pos < this.input.length) {
	    var ch = this.input.charCodeAt(this.pos);
	    switch (ch) {
	      case 32:case 160:
	        // ' '
	        ++this.pos;
	        break;
	      case 13:
	        if (this.input.charCodeAt(this.pos + 1) === 10) {
	          ++this.pos;
	        }
	      case 10:case 8232:case 8233:
	        ++this.pos;
	        if (this.options.locations) {
	          ++this.curLine;
	          this.lineStart = this.pos;
	        }
	        break;
	      case 47:
	        // '/'
	        switch (this.input.charCodeAt(this.pos + 1)) {
	          case 42:
	            // '*'
	            this.skipBlockComment();
	            break;
	          case 47:
	            this.skipLineComment(2);
	            break;
	          default:
	            break loop;
	        }
	        break;
	      default:
	        if (ch > 8 && ch < 14 || ch >= 5760 && _whitespace.nonASCIIwhitespace.test(String.fromCharCode(ch))) {
	          ++this.pos;
	        } else {
	          break loop;
	        }
	    }
	  }
	};

	// Called at the end of every token. Sets `end`, `val`, and
	// maintains `context` and `exprAllowed`, and skips the space after
	// the token, so that the next one's `start` will point at the
	// right position.

	pp.finishToken = function (type, val) {
	  this.end = this.pos;
	  if (this.options.locations) this.endLoc = this.curPosition();
	  var prevType = this.type;
	  this.type = type;
	  this.value = val;

	  this.updateContext(prevType);
	};

	// ### Token reading

	// This is the function that is called to fetch the next token. It
	// is somewhat obscure, because it works in character codes rather
	// than characters, and because operator parsing has been inlined
	// into it.
	//
	// All in the name of speed.
	//
	pp.readToken_dot = function () {
	  var next = this.input.charCodeAt(this.pos + 1);
	  if (next >= 48 && next <= 57) return this.readNumber(true);
	  var next2 = this.input.charCodeAt(this.pos + 2);
	  if (this.options.ecmaVersion >= 6 && next === 46 && next2 === 46) {
	    // 46 = dot '.'
	    this.pos += 3;
	    return this.finishToken(_tokentype.types.ellipsis);
	  } else {
	    ++this.pos;
	    return this.finishToken(_tokentype.types.dot);
	  }
	};

	pp.readToken_slash = function () {
	  // '/'
	  var next = this.input.charCodeAt(this.pos + 1);
	  if (this.exprAllowed) {
	    ++this.pos;return this.readRegexp();
	  }
	  if (next === 61) return this.finishOp(_tokentype.types.assign, 2);
	  return this.finishOp(_tokentype.types.slash, 1);
	};

	pp.readToken_mult_modulo = function (code) {
	  // '%*'
	  var next = this.input.charCodeAt(this.pos + 1);
	  if (next === 61) return this.finishOp(_tokentype.types.assign, 2);
	  return this.finishOp(code === 42 ? _tokentype.types.star : _tokentype.types.modulo, 1);
	};

	pp.readToken_pipe_amp = function (code) {
	  // '|&'
	  var next = this.input.charCodeAt(this.pos + 1);
	  if (next === code) return this.finishOp(code === 124 ? _tokentype.types.logicalOR : _tokentype.types.logicalAND, 2);
	  if (next === 61) return this.finishOp(_tokentype.types.assign, 2);
	  return this.finishOp(code === 124 ? _tokentype.types.bitwiseOR : _tokentype.types.bitwiseAND, 1);
	};

	pp.readToken_caret = function () {
	  // '^'
	  var next = this.input.charCodeAt(this.pos + 1);
	  if (next === 61) return this.finishOp(_tokentype.types.assign, 2);
	  return this.finishOp(_tokentype.types.bitwiseXOR, 1);
	};

	pp.readToken_plus_min = function (code) {
	  // '+-'
	  var next = this.input.charCodeAt(this.pos + 1);
	  if (next === code) {
	    if (next == 45 && this.input.charCodeAt(this.pos + 2) == 62 && _whitespace.lineBreak.test(this.input.slice(this.lastTokEnd, this.pos))) {
	      // A `-->` line comment
	      this.skipLineComment(3);
	      this.skipSpace();
	      return this.nextToken();
	    }
	    return this.finishOp(_tokentype.types.incDec, 2);
	  }
	  if (next === 61) return this.finishOp(_tokentype.types.assign, 2);
	  return this.finishOp(_tokentype.types.plusMin, 1);
	};

	pp.readToken_lt_gt = function (code) {
	  // '<>'
	  var next = this.input.charCodeAt(this.pos + 1);
	  var size = 1;
	  if (next === code) {
	    size = code === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2;
	    if (this.input.charCodeAt(this.pos + size) === 61) return this.finishOp(_tokentype.types.assign, size + 1);
	    return this.finishOp(_tokentype.types.bitShift, size);
	  }
	  if (next == 33 && code == 60 && this.input.charCodeAt(this.pos + 2) == 45 && this.input.charCodeAt(this.pos + 3) == 45) {
	    if (this.inModule) this.unexpected();
	    // `<!--`, an XML-style comment that should be interpreted as a line comment
	    this.skipLineComment(4);
	    this.skipSpace();
	    return this.nextToken();
	  }
	  if (next === 61) size = this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2;
	  return this.finishOp(_tokentype.types.relational, size);
	};

	pp.readToken_eq_excl = function (code) {
	  // '=!'
	  var next = this.input.charCodeAt(this.pos + 1);
	  if (next === 61) return this.finishOp(_tokentype.types.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2);
	  if (code === 61 && next === 62 && this.options.ecmaVersion >= 6) {
	    // '=>'
	    this.pos += 2;
	    return this.finishToken(_tokentype.types.arrow);
	  }
	  return this.finishOp(code === 61 ? _tokentype.types.eq : _tokentype.types.prefix, 1);
	};

	pp.getTokenFromCode = function (code) {
	  switch (code) {
	    // The interpretation of a dot depends on whether it is followed
	    // by a digit or another two dots.
	    case 46:
	      // '.'
	      return this.readToken_dot();

	    // Punctuation tokens.
	    case 40:
	      ++this.pos;return this.finishToken(_tokentype.types.parenL);
	    case 41:
	      ++this.pos;return this.finishToken(_tokentype.types.parenR);
	    case 59:
	      ++this.pos;return this.finishToken(_tokentype.types.semi);
	    case 44:
	      ++this.pos;return this.finishToken(_tokentype.types.comma);
	    case 91:
	      ++this.pos;return this.finishToken(_tokentype.types.bracketL);
	    case 93:
	      ++this.pos;return this.finishToken(_tokentype.types.bracketR);
	    case 123:
	      ++this.pos;return this.finishToken(_tokentype.types.braceL);
	    case 125:
	      ++this.pos;return this.finishToken(_tokentype.types.braceR);
	    case 58:
	      ++this.pos;return this.finishToken(_tokentype.types.colon);
	    case 63:
	      ++this.pos;return this.finishToken(_tokentype.types.question);

	    case 96:
	      // '`'
	      if (this.options.ecmaVersion < 6) break;
	      ++this.pos;
	      return this.finishToken(_tokentype.types.backQuote);

	    case 48:
	      // '0'
	      var next = this.input.charCodeAt(this.pos + 1);
	      if (next === 120 || next === 88) return this.readRadixNumber(16); // '0x', '0X' - hex number
	      if (this.options.ecmaVersion >= 6) {
	        if (next === 111 || next === 79) return this.readRadixNumber(8); // '0o', '0O' - octal number
	        if (next === 98 || next === 66) return this.readRadixNumber(2); // '0b', '0B' - binary number
	      }
	    // Anything else beginning with a digit is an integer, octal
	    // number, or float.
	    case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
	      // 1-9
	      return this.readNumber(false);

	    // Quotes produce strings.
	    case 34:case 39:
	      // '"', "'"
	      return this.readString(code);

	    // Operators are parsed inline in tiny state machines. '=' (61) is
	    // often referred to. `finishOp` simply skips the amount of
	    // characters it is given as second argument, and returns a token
	    // of the type given by its first argument.

	    case 47:
	      // '/'
	      return this.readToken_slash();

	    case 37:case 42:
	      // '%*'
	      return this.readToken_mult_modulo(code);

	    case 124:case 38:
	      // '|&'
	      return this.readToken_pipe_amp(code);

	    case 94:
	      // '^'
	      return this.readToken_caret();

	    case 43:case 45:
	      // '+-'
	      return this.readToken_plus_min(code);

	    case 60:case 62:
	      // '<>'
	      return this.readToken_lt_gt(code);

	    case 61:case 33:
	      // '=!'
	      return this.readToken_eq_excl(code);

	    case 126:
	      // '~'
	      return this.finishOp(_tokentype.types.prefix, 1);
	  }

	  this.raise(this.pos, "Unexpected character '" + codePointToString(code) + "'");
	};

	pp.finishOp = function (type, size) {
	  var str = this.input.slice(this.pos, this.pos + size);
	  this.pos += size;
	  return this.finishToken(type, str);
	};

	// Parse a regular expression. Some context-awareness is necessary,
	// since a '/' inside a '[]' set does not end the expression.

	function tryCreateRegexp(src, flags, throwErrorAt, parser) {
	  try {
	    return new RegExp(src, flags);
	  } catch (e) {
	    if (throwErrorAt !== undefined) {
	      if (e instanceof SyntaxError) parser.raise(throwErrorAt, "Error parsing regular expression: " + e.message);
	      throw e;
	    }
	  }
	}

	var regexpUnicodeSupport = !!tryCreateRegexp("￿", "u");

	pp.readRegexp = function () {
	  var _this = this;

	  var escaped = undefined,
	      inClass = undefined,
	      start = this.pos;
	  for (;;) {
	    if (this.pos >= this.input.length) this.raise(start, "Unterminated regular expression");
	    var ch = this.input.charAt(this.pos);
	    if (_whitespace.lineBreak.test(ch)) this.raise(start, "Unterminated regular expression");
	    if (!escaped) {
	      if (ch === "[") inClass = true;else if (ch === "]" && inClass) inClass = false;else if (ch === "/" && !inClass) break;
	      escaped = ch === "\\";
	    } else escaped = false;
	    ++this.pos;
	  }
	  var content = this.input.slice(start, this.pos);
	  ++this.pos;
	  // Need to use `readWord1` because '\uXXXX' sequences are allowed
	  // here (don't ask).
	  var mods = this.readWord1();
	  var tmp = content;
	  if (mods) {
	    var validFlags = /^[gim]*$/;
	    if (this.options.ecmaVersion >= 6) validFlags = /^[gimuy]*$/;
	    if (!validFlags.test(mods)) this.raise(start, "Invalid regular expression flag");
	    if (mods.indexOf('u') >= 0 && !regexpUnicodeSupport) {
	      // Replace each astral symbol and every Unicode escape sequence that
	      // possibly represents an astral symbol or a paired surrogate with a
	      // single ASCII symbol to avoid throwing on regular expressions that
	      // are only valid in combination with the `/u` flag.
	      // Note: replacing with the ASCII symbol `x` might cause false
	      // negatives in unlikely scenarios. For example, `[\u{61}-b]` is a
	      // perfectly valid pattern that is equivalent to `[a-b]`, but it would
	      // be replaced by `[x-b]` which throws an error.
	      tmp = tmp.replace(/\\u\{([0-9a-fA-F]+)\}/g, function (_match, code, offset) {
	        code = Number("0x" + code);
	        if (code > 0x10FFFF) _this.raise(start + offset + 3, "Code point out of bounds");
	        return "x";
	      });
	      tmp = tmp.replace(/\\u([a-fA-F0-9]{4})|[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "x");
	    }
	  }
	  // Detect invalid regular expressions.
	  var value = null;
	  // Rhino's regular expression parser is flaky and throws uncatchable exceptions,
	  // so don't do detection if we are running under Rhino
	  if (!isRhino) {
	    tryCreateRegexp(tmp, undefined, start, this);
	    // Get a regular expression object for this pattern-flag pair, or `null` in
	    // case the current environment doesn't support the flags it uses.
	    value = tryCreateRegexp(content, mods);
	  }
	  return this.finishToken(_tokentype.types.regexp, { pattern: content, flags: mods, value: value });
	};

	// Read an integer in the given radix. Return null if zero digits
	// were read, the integer value otherwise. When `len` is given, this
	// will return `null` unless the integer has exactly `len` digits.

	pp.readInt = function (radix, len) {
	  var start = this.pos,
	      total = 0;
	  for (var i = 0, e = len == null ? Infinity : len; i < e; ++i) {
	    var code = this.input.charCodeAt(this.pos),
	        val = undefined;
	    if (code >= 97) val = code - 97 + 10; // a
	    else if (code >= 65) val = code - 65 + 10; // A
	      else if (code >= 48 && code <= 57) val = code - 48; // 0-9
	        else val = Infinity;
	    if (val >= radix) break;
	    ++this.pos;
	    total = total * radix + val;
	  }
	  if (this.pos === start || len != null && this.pos - start !== len) return null;

	  return total;
	};

	pp.readRadixNumber = function (radix) {
	  this.pos += 2; // 0x
	  var val = this.readInt(radix);
	  if (val == null) this.raise(this.start + 2, "Expected number in radix " + radix);
	  if (_identifier.isIdentifierStart(this.fullCharCodeAtPos())) this.raise(this.pos, "Identifier directly after number");
	  return this.finishToken(_tokentype.types.num, val);
	};

	// Read an integer, octal integer, or floating-point number.

	pp.readNumber = function (startsWithDot) {
	  var start = this.pos,
	      isFloat = false,
	      octal = this.input.charCodeAt(this.pos) === 48;
	  if (!startsWithDot && this.readInt(10) === null) this.raise(start, "Invalid number");
	  var next = this.input.charCodeAt(this.pos);
	  if (next === 46) {
	    // '.'
	    ++this.pos;
	    this.readInt(10);
	    isFloat = true;
	    next = this.input.charCodeAt(this.pos);
	  }
	  if (next === 69 || next === 101) {
	    // 'eE'
	    next = this.input.charCodeAt(++this.pos);
	    if (next === 43 || next === 45) ++this.pos; // '+-'
	    if (this.readInt(10) === null) this.raise(start, "Invalid number");
	    isFloat = true;
	  }
	  if (_identifier.isIdentifierStart(this.fullCharCodeAtPos())) this.raise(this.pos, "Identifier directly after number");

	  var str = this.input.slice(start, this.pos),
	      val = undefined;
	  if (isFloat) val = parseFloat(str);else if (!octal || str.length === 1) val = parseInt(str, 10);else if (/[89]/.test(str) || this.strict) this.raise(start, "Invalid number");else val = parseInt(str, 8);
	  return this.finishToken(_tokentype.types.num, val);
	};

	// Read a string value, interpreting backslash-escapes.

	pp.readCodePoint = function () {
	  var ch = this.input.charCodeAt(this.pos),
	      code = undefined;

	  if (ch === 123) {
	    if (this.options.ecmaVersion < 6) this.unexpected();
	    var codePos = ++this.pos;
	    code = this.readHexChar(this.input.indexOf('}', this.pos) - this.pos);
	    ++this.pos;
	    if (code > 0x10FFFF) this.raise(codePos, "Code point out of bounds");
	  } else {
	    code = this.readHexChar(4);
	  }
	  return code;
	};

	function codePointToString(code) {
	  // UTF-16 Decoding
	  if (code <= 0xFFFF) return String.fromCharCode(code);
	  code -= 0x10000;
	  return String.fromCharCode((code >> 10) + 0xD800, (code & 1023) + 0xDC00);
	}

	pp.readString = function (quote) {
	  var out = "",
	      chunkStart = ++this.pos;
	  for (;;) {
	    if (this.pos >= this.input.length) this.raise(this.start, "Unterminated string constant");
	    var ch = this.input.charCodeAt(this.pos);
	    if (ch === quote) break;
	    if (ch === 92) {
	      // '\'
	      out += this.input.slice(chunkStart, this.pos);
	      out += this.readEscapedChar(false);
	      chunkStart = this.pos;
	    } else {
	      if (_whitespace.isNewLine(ch)) this.raise(this.start, "Unterminated string constant");
	      ++this.pos;
	    }
	  }
	  out += this.input.slice(chunkStart, this.pos++);
	  return this.finishToken(_tokentype.types.string, out);
	};

	// Reads template string tokens.

	pp.readTmplToken = function () {
	  var out = "",
	      chunkStart = this.pos;
	  for (;;) {
	    if (this.pos >= this.input.length) this.raise(this.start, "Unterminated template");
	    var ch = this.input.charCodeAt(this.pos);
	    if (ch === 96 || ch === 36 && this.input.charCodeAt(this.pos + 1) === 123) {
	      // '`', '${'
	      if (this.pos === this.start && this.type === _tokentype.types.template) {
	        if (ch === 36) {
	          this.pos += 2;
	          return this.finishToken(_tokentype.types.dollarBraceL);
	        } else {
	          ++this.pos;
	          return this.finishToken(_tokentype.types.backQuote);
	        }
	      }
	      out += this.input.slice(chunkStart, this.pos);
	      return this.finishToken(_tokentype.types.template, out);
	    }
	    if (ch === 92) {
	      // '\'
	      out += this.input.slice(chunkStart, this.pos);
	      out += this.readEscapedChar(true);
	      chunkStart = this.pos;
	    } else if (_whitespace.isNewLine(ch)) {
	      out += this.input.slice(chunkStart, this.pos);
	      ++this.pos;
	      switch (ch) {
	        case 13:
	          if (this.input.charCodeAt(this.pos) === 10) ++this.pos;
	        case 10:
	          out += "\n";
	          break;
	        default:
	          out += String.fromCharCode(ch);
	          break;
	      }
	      if (this.options.locations) {
	        ++this.curLine;
	        this.lineStart = this.pos;
	      }
	      chunkStart = this.pos;
	    } else {
	      ++this.pos;
	    }
	  }
	};

	// Used to read escaped characters

	pp.readEscapedChar = function (inTemplate) {
	  var ch = this.input.charCodeAt(++this.pos);
	  ++this.pos;
	  switch (ch) {
	    case 110:
	      return "\n"; // 'n' -> '\n'
	    case 114:
	      return "\r"; // 'r' -> '\r'
	    case 120:
	      return String.fromCharCode(this.readHexChar(2)); // 'x'
	    case 117:
	      return codePointToString(this.readCodePoint()); // 'u'
	    case 116:
	      return "\t"; // 't' -> '\t'
	    case 98:
	      return "\b"; // 'b' -> '\b'
	    case 118:
	      return "\u000b"; // 'v' -> '\u000b'
	    case 102:
	      return "\f"; // 'f' -> '\f'
	    case 13:
	      if (this.input.charCodeAt(this.pos) === 10) ++this.pos; // '\r\n'
	    case 10:
	      // ' \n'
	      if (this.options.locations) {
	        this.lineStart = this.pos;++this.curLine;
	      }
	      return "";
	    default:
	      if (ch >= 48 && ch <= 55) {
	        var octalStr = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0];
	        var octal = parseInt(octalStr, 8);
	        if (octal > 255) {
	          octalStr = octalStr.slice(0, -1);
	          octal = parseInt(octalStr, 8);
	        }
	        if (octalStr !== "0" && (this.strict || inTemplate)) {
	          this.raise(this.pos - 2, "Octal literal in strict mode");
	        }
	        this.pos += octalStr.length - 1;
	        return String.fromCharCode(octal);
	      }
	      return String.fromCharCode(ch);
	  }
	};

	// Used to read character escape sequences ('\x', '\u', '\U').

	pp.readHexChar = function (len) {
	  var codePos = this.pos;
	  var n = this.readInt(16, len);
	  if (n === null) this.raise(codePos, "Bad character escape sequence");
	  return n;
	};

	// Read an identifier, and return it as a string. Sets `this.containsEsc`
	// to whether the word contained a '\u' escape.
	//
	// Incrementally adds only escaped chars, adding other chunks as-is
	// as a micro-optimization.

	pp.readWord1 = function () {
	  this.containsEsc = false;
	  var word = "",
	      first = true,
	      chunkStart = this.pos;
	  var astral = this.options.ecmaVersion >= 6;
	  while (this.pos < this.input.length) {
	    var ch = this.fullCharCodeAtPos();
	    if (_identifier.isIdentifierChar(ch, astral)) {
	      this.pos += ch <= 0xffff ? 1 : 2;
	    } else if (ch === 92) {
	      // "\"
	      this.containsEsc = true;
	      word += this.input.slice(chunkStart, this.pos);
	      var escStart = this.pos;
	      if (this.input.charCodeAt(++this.pos) != 117) // "u"
	        this.raise(this.pos, "Expecting Unicode escape sequence \\uXXXX");
	      ++this.pos;
	      var esc = this.readCodePoint();
	      if (!(first ? _identifier.isIdentifierStart : _identifier.isIdentifierChar)(esc, astral)) this.raise(escStart, "Invalid Unicode escape");
	      word += codePointToString(esc);
	      chunkStart = this.pos;
	    } else {
	      break;
	    }
	    first = false;
	  }
	  return word + this.input.slice(chunkStart, this.pos);
	};

	// Read an identifier or keyword token. Will check for reserved
	// words when necessary.

	pp.readWord = function () {
	  var word = this.readWord1();
	  var type = _tokentype.types.name;
	  if ((this.options.ecmaVersion >= 6 || !this.containsEsc) && this.keywords.test(word)) type = _tokentype.keywords[word];
	  return this.finishToken(type, word);
	};

	},{"./identifier":2,"./locutil":5,"./state":10,"./tokentype":14,"./whitespace":16}],14:[function(_dereq_,module,exports){
	// ## Token types

	// The assignment of fine-grained, information-carrying type objects
	// allows the tokenizer to store the information it has about a
	// token in a way that is very cheap for the parser to look up.

	// All token type variables start with an underscore, to make them
	// easy to recognize.

	// The `beforeExpr` property is used to disambiguate between regular
	// expressions and divisions. It is set on all token types that can
	// be followed by an expression (thus, a slash after them would be a
	// regular expression).
	//
	// The `startsExpr` property is used to check if the token ends a
	// `yield` expression. It is set on all token types that either can
	// directly start an expression (like a quotation mark) or can
	// continue an expression (like the body of a string).
	//
	// `isLoop` marks a keyword as starting a loop, which is important
	// to know when parsing a label, in order to allow or disallow
	// continue jumps to that label.

	"use strict";

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var TokenType = function TokenType(label) {
	  var conf = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	  _classCallCheck(this, TokenType);

	  this.label = label;
	  this.keyword = conf.keyword;
	  this.beforeExpr = !!conf.beforeExpr;
	  this.startsExpr = !!conf.startsExpr;
	  this.isLoop = !!conf.isLoop;
	  this.isAssign = !!conf.isAssign;
	  this.prefix = !!conf.prefix;
	  this.postfix = !!conf.postfix;
	  this.binop = conf.binop || null;
	  this.updateContext = null;
	};

	exports.TokenType = TokenType;

	function binop(name, prec) {
	  return new TokenType(name, { beforeExpr: true, binop: prec });
	}
	var beforeExpr = { beforeExpr: true },
	    startsExpr = { startsExpr: true };

	var types = {
	  num: new TokenType("num", startsExpr),
	  regexp: new TokenType("regexp", startsExpr),
	  string: new TokenType("string", startsExpr),
	  name: new TokenType("name", startsExpr),
	  eof: new TokenType("eof"),

	  // Punctuation token types.
	  bracketL: new TokenType("[", { beforeExpr: true, startsExpr: true }),
	  bracketR: new TokenType("]"),
	  braceL: new TokenType("{", { beforeExpr: true, startsExpr: true }),
	  braceR: new TokenType("}"),
	  parenL: new TokenType("(", { beforeExpr: true, startsExpr: true }),
	  parenR: new TokenType(")"),
	  comma: new TokenType(",", beforeExpr),
	  semi: new TokenType(";", beforeExpr),
	  colon: new TokenType(":", beforeExpr),
	  dot: new TokenType("."),
	  question: new TokenType("?", beforeExpr),
	  arrow: new TokenType("=>", beforeExpr),
	  template: new TokenType("template"),
	  ellipsis: new TokenType("...", beforeExpr),
	  backQuote: new TokenType("`", startsExpr),
	  dollarBraceL: new TokenType("${", { beforeExpr: true, startsExpr: true }),

	  // Operators. These carry several kinds of properties to help the
	  // parser use them properly (the presence of these properties is
	  // what categorizes them as operators).
	  //
	  // `binop`, when present, specifies that this operator is a binary
	  // operator, and will refer to its precedence.
	  //
	  // `prefix` and `postfix` mark the operator as a prefix or postfix
	  // unary operator.
	  //
	  // `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
	  // binary operators with a very low precedence, that should result
	  // in AssignmentExpression nodes.

	  eq: new TokenType("=", { beforeExpr: true, isAssign: true }),
	  assign: new TokenType("_=", { beforeExpr: true, isAssign: true }),
	  incDec: new TokenType("++/--", { prefix: true, postfix: true, startsExpr: true }),
	  prefix: new TokenType("prefix", { beforeExpr: true, prefix: true, startsExpr: true }),
	  logicalOR: binop("||", 1),
	  logicalAND: binop("&&", 2),
	  bitwiseOR: binop("|", 3),
	  bitwiseXOR: binop("^", 4),
	  bitwiseAND: binop("&", 5),
	  equality: binop("==/!=", 6),
	  relational: binop("</>", 7),
	  bitShift: binop("<</>>", 8),
	  plusMin: new TokenType("+/-", { beforeExpr: true, binop: 9, prefix: true, startsExpr: true }),
	  modulo: binop("%", 10),
	  star: binop("*", 10),
	  slash: binop("/", 10)
	};

	exports.types = types;
	// Map keyword names to token types.

	var keywords = {};

	exports.keywords = keywords;
	// Succinct definitions of keyword token types
	function kw(name) {
	  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	  options.keyword = name;
	  keywords[name] = types["_" + name] = new TokenType(name, options);
	}

	kw("break");
	kw("case", beforeExpr);
	kw("catch");
	kw("continue");
	kw("debugger");
	kw("default", beforeExpr);
	kw("do", { isLoop: true, beforeExpr: true });
	kw("else", beforeExpr);
	kw("finally");
	kw("for", { isLoop: true });
	kw("function", startsExpr);
	kw("if");
	kw("return", beforeExpr);
	kw("switch");
	kw("throw", beforeExpr);
	kw("try");
	kw("var");
	kw("let");
	kw("const");
	kw("while", { isLoop: true });
	kw("with");
	kw("new", { beforeExpr: true, startsExpr: true });
	kw("this", startsExpr);
	kw("super", startsExpr);
	kw("class");
	kw("extends", beforeExpr);
	kw("export");
	kw("import");
	kw("yield", { beforeExpr: true, startsExpr: true });
	kw("null", startsExpr);
	kw("true", startsExpr);
	kw("false", startsExpr);
	kw("in", { beforeExpr: true, binop: 7 });
	kw("instanceof", { beforeExpr: true, binop: 7 });
	kw("typeof", { beforeExpr: true, prefix: true, startsExpr: true });
	kw("void", { beforeExpr: true, prefix: true, startsExpr: true });
	kw("delete", { beforeExpr: true, prefix: true, startsExpr: true });

	},{}],15:[function(_dereq_,module,exports){
	"use strict";

	exports.__esModule = true;
	exports.isArray = isArray;
	exports.has = has;

	function isArray(obj) {
	  return Object.prototype.toString.call(obj) === "[object Array]";
	}

	// Checks if an object has a property.

	function has(obj, propName) {
	  return Object.prototype.hasOwnProperty.call(obj, propName);
	}

	},{}],16:[function(_dereq_,module,exports){
	// Matches a whole line break (where CRLF is considered a single
	// line break). Used to count lines.

	"use strict";

	exports.__esModule = true;
	exports.isNewLine = isNewLine;
	var lineBreak = /\r\n?|\n|\u2028|\u2029/;
	exports.lineBreak = lineBreak;
	var lineBreakG = new RegExp(lineBreak.source, "g");

	exports.lineBreakG = lineBreakG;

	function isNewLine(code) {
	  return code === 10 || code === 13 || code === 0x2028 || code == 0x2029;
	}

	var nonASCIIwhitespace = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
	exports.nonASCIIwhitespace = nonASCIIwhitespace;

	},{}]},{},[3])(3)
	});

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var utils = __webpack_require__(24);
	var RunnerBase = __webpack_require__(29);
	var CPUKernel = __webpack_require__(42);
	var CPUFunctionBuilder = __webpack_require__(44);

	module.exports = function (_RunnerBase) {
		_inherits(CPURunner, _RunnerBase);

		/**
	  * @constructor CPURunner
	  *
	  * @desc Instantiates a Runner instance for the kernel.
	  * 
	  * @extends RunnerBase
	  *
	  * @param {Object} settings - Settings to instantiate properties in RunnerBase, with given values
	  *
	  */

		function CPURunner(settings) {
			_classCallCheck(this, CPURunner);

			var _this = _possibleConstructorReturn(this, (CPURunner.__proto__ || Object.getPrototypeOf(CPURunner)).call(this, new CPUFunctionBuilder(), settings));

			_this.Kernel = CPUKernel;
			_this.kernel = null;
			return _this;
		}

		/**
	  * @memberOf CPURunner#
	  * @function
	  * @name getMode()
	  *
	  * Return the current mode in which gpu.js is executing.
	  * 
	  * @returns {String} The current mode; "cpu".
	  *
	  */


		_createClass(CPURunner, [{
			key: 'getMode',
			value: function getMode() {
				return 'cpu';
			}
		}]);

		return CPURunner;
	}(RunnerBase);

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var KernelBase = __webpack_require__(32);
	var utils = __webpack_require__(24);
	var kernelString = __webpack_require__(43);

	module.exports = function (_KernelBase) {
		_inherits(CPUKernel, _KernelBase);

		/**
	  * @constructor CPUKernel
	  *
	  * @desc Kernel Implementation for CPU.
	  * 
	  * <p>Instantiates properties to the CPU Kernel.</p>
	  *
	  * @extends KernelBase
	  *
	  * @prop {Object} thread - The thread dimensions, x, y and z
	  * @prop {Object} output - The canvas dimensions
	  * @prop {Object} functionBuilder - Function Builder instance bound to this Kernel
	  * @prop {Function} run - Method to run the kernel
	  *
	  */
		function CPUKernel(fnString, settings) {
			_classCallCheck(this, CPUKernel);

			var _this = _possibleConstructorReturn(this, (CPUKernel.__proto__ || Object.getPrototypeOf(CPUKernel)).call(this, fnString, settings));

			_this._fnBody = utils.getFunctionBodyFromString(fnString);
			_this._fn = null;
			_this.run = null;
			_this._canvasCtx = null;
			_this._imageData = null;
			_this._colorData = null;
			_this._kernelString = null;
			_this.thread = {
				x: 0,
				y: 0,
				z: 0
			};

			_this.run = function () {
				this.run = null;
				this.build.apply(this, arguments);
				return this.run.apply(this, arguments);
			}.bind(_this);
			return _this;
		}

		/**
	  * @memberOf CPUKernel#
	  * @function
	  * @name validateOptions
	  *
	  * @desc Validate options related to CPU Kernel, such as 
	  * dimensions size, and auto dimension support.
	  *
	  */


		_createClass(CPUKernel, [{
			key: 'validateOptions',
			value: function validateOptions() {
				if (!this.output || this.output.length === 0) {
					if (arguments.length !== 1) {
						throw 'Auto dimensions only supported for kernels with only one input';
					}

					var argType = utils.getArgumentType(arguments[0]);
					if (argType === 'Array') {
						this.output = utils.getDimensions(argType);
					} else if (argType === 'Texture') {
						this.output = arguments[0].output;
					} else {
						throw 'Auto dimensions not supported for input type: ' + argType;
					}
				}
			}

			/**
	   * @memberOf CPUKernel#
	   * @function
	   * @name build
	   *
	   * @desc Builds the Kernel, by generating the kernel 
	   * string using thread dimensions, and arguments 
	   * supplied to the kernel.
	   *
	   * <p>If the graphical flag is enabled, canvas is used.</p>
	   *
	   */

		}, {
			key: 'build',
			value: function build() {
				this.setupParams(arguments);
				var threadDim = this.threadDim = utils.clone(this.output);

				while (threadDim.length < 3) {
					threadDim.push(1);
				}

				if (this.graphical) {
					var canvas = this.getCanvas();
					canvas.width = threadDim[0];
					canvas.height = threadDim[1];
					this._canvasCtx = canvas.getContext('2d');
					this._imageData = this._canvasCtx.createImageData(threadDim[0], threadDim[1]);
					this._colorData = new Uint8ClampedArray(threadDim[0] * threadDim[1] * 4);
				}

				var kernelString = this.getKernelString();

				if (this.debug) {
					console.log('Options:');
					console.dir(this);
					console.log('Function output:');
					console.log(kernelString);
				}

				this.kernelString = kernelString;
				this.run = new Function([], kernelString).bind(this)();
			}
		}, {
			key: 'color',
			value: function color(r, g, b, a) {
				if (typeof a === 'undefined') {
					a = 1;
				}

				r = Math.floor(r * 255);
				g = Math.floor(g * 255);
				b = Math.floor(b * 255);
				a = Math.floor(a * 255);

				var width = this.output[0];
				var height = this.output[1];

				var x = this.thread.x;
				var y = height - this.thread.y - 1;

				var index = x + y * width;

				this._colorData[index * 4 + 0] = r;
				this._colorData[index * 4 + 1] = g;
				this._colorData[index * 4 + 2] = b;
				this._colorData[index * 4 + 3] = a;
			}

			/**
	   * @memberOf CPUKernel#
	   * @function
	   * @name getKernelString
	   *
	   * @desc Generates kernel string for this kernel program.
	   * 
	   * <p>If sub-kernels are supplied, they are also factored in.
	   * This string can be saved by calling the `toString` method
	   * and then can be reused later.</p>
	   *
	   * @returns {String} result
	   *
	   */

		}, {
			key: 'getKernelString',
			value: function getKernelString() {
				var _this2 = this;

				if (this._kernelString !== null) return this._kernelString;

				var builder = this.functionBuilder;

				// Thread dim fix (to make compilable)
				var threadDim = this.threadDim || (this.threadDim = utils.clone(this.output));
				while (threadDim.length < 3) {
					threadDim.push(1);
				}

				builder.addKernel(this.fnString, {
					prototypeOnly: false,
					constants: this.constants,
					output: this.output,
					debug: this.debug,
					loopMaxIterations: this.loopMaxIterations
				}, this.paramNames, this.paramTypes);

				builder.addFunctions(this.functions, {
					constants: this.constants,
					output: this.output
				});

				if (this.subKernels !== null) {
					this.subKernelOutputTextures = [];
					this.subKernelOutputVariableNames = [];
					for (var i = 0; i < this.subKernels.length; i++) {
						var subKernel = this.subKernels[i];
						builder.addSubKernel(subKernel, {
							prototypeOnly: false,
							constants: this.constants,
							output: this.output,
							debug: this.debug,
							loopMaxIterations: this.loopMaxIterations
						});
						this.subKernelOutputVariableNames.push(subKernel.name + 'Result');
					}
				} else if (this.subKernelProperties !== null) {
					this.subKernelOutputVariableNames = [];
					var _i = 0;
					for (var p in this.subKernelProperties) {
						if (!this.subKernelProperties.hasOwnProperty(p)) continue;
						var _subKernel = this.subKernelProperties[p];
						builder.addSubKernel(_subKernel);
						this.subKernelOutputVariableNames.push(_subKernel.name + 'Result');
						_i++;
					}
				}

				var prototypes = builder.getPrototypes();
				var kernel = prototypes.shift();
				var kernelString = this._kernelString = '\n\t\tvar LOOP_MAX = ' + this._getLoopMaxString() + ';\n\t\tvar _this = this;\n  ' + (this.subKernelOutputVariableNames === null ? '' : this.subKernelOutputVariableNames.map(function (name) {
					return '  var ' + name + ' = null;\n';
				}).join('')) + '\n    return function (' + this.paramNames.map(function (paramName) {
					return 'user_' + paramName;
				}).join(', ') + ') {\n    var ret = new Array(' + threadDim[2] + ');\n  ' + (this.subKernelOutputVariableNames === null ? '' : this.subKernelOutputVariableNames.map(function (name) {
					return '  ' + name + 'Z = new Array(' + threadDim[2] + ');\n';
				}).join('')) + '\n    for (this.thread.z = 0; this.thread.z < ' + threadDim[2] + '; this.thread.z++) {\n      ret[this.thread.z] = new Array(' + threadDim[1] + ');\n  ' + (this.subKernelOutputVariableNames === null ? '' : this.subKernelOutputVariableNames.map(function (name) {
					return '    ' + name + 'Z[this.thread.z] = new Array(' + threadDim[1] + ');\n';
				}).join('')) + '\n      for (this.thread.y = 0; this.thread.y < ' + threadDim[1] + '; this.thread.y++) {\n        ret[this.thread.z][this.thread.y] = new Array(' + threadDim[0] + ');\n  ' + (this.subKernelOutputVariableNames === null ? '' : this.subKernelOutputVariableNames.map(function (name) {
					return '      ' + name + 'Z[this.thread.z][this.thread.y] = new Array(' + threadDim[0] + ');\n';
				}).join('')) + '\n        for (this.thread.x = 0; this.thread.x < ' + threadDim[0] + '; this.thread.x++) {\n          var kernelResult;\n          ' + kernel + '\n          ret[this.thread.z][this.thread.y][this.thread.x] = kernelResult;\n' + (this.subKernelOutputVariableNames === null ? '' : this.subKernelOutputVariableNames.map(function (name) {
					return '        ' + name + 'Z[this.thread.z][this.thread.y][this.thread.x] = ' + name + ';\n';
				}).join('')) + '\n          }\n        }\n      }\n      \n      if (this.graphical) {\n        this._imageData.data.set(this._colorData);\n        this._canvasCtx.putImageData(this._imageData, 0, 0);\n        return;\n      }\n      \n      if (this.output.length === 1) {\n        ret = ret[0][0];\n' + (this.subKernelOutputVariableNames === null ? '' : this.subKernelOutputVariableNames.map(function (name) {
					return '    ' + name + ' = ' + name + 'Z[0][0];\n';
				}).join('')) + '\n      \n    } else if (this.output.length === 2) {\n      ret = ret[0];\n      ' + (this.subKernelOutputVariableNames === null ? '' : this.subKernelOutputVariableNames.map(function (name) {
					return '    ' + name + ' = ' + name + 'Z[0];\n';
				}).join('')) + '\n    }\n    \n    ' + (this.subKernelOutputVariableNames === null ? 'return ret;\n' : this.subKernels !== null ? 'var result = [\n        ' + this.subKernelOutputVariableNames.map(function (name) {
					return '' + name;
				}).join(',\n') + '\n      ];\n      result.result = ret;\n      return result;\n' : 'return {\n        result: ret,\n        ' + Object.keys(this.subKernelProperties).map(function (name, i) {
					return name + ': ' + _this2.subKernelOutputVariableNames[i];
				}).join(',\n') + '\n      };') + '\n    ' + (prototypes.length > 0 ? prototypes.join('\n') : '') + '\n    }.bind(this);';
				return kernelString;
			}

			/**
	   * @memberOf CPUKernel#
	   * @function
	   * @name toString
	   *
	   * @desc Returns the *pre-compiled* Kernel as a JS Object String, that can be reused.
	   *
	   */

		}, {
			key: 'toString',
			value: function toString() {
				return kernelString(this);
			}

			/**
	   * @memberOf CPUKernel#
	   * @function
	   * @name precompileKernelObj
	   *
	   * @desc Precompile the kernel into a single object, 
	   * that can be used for building the execution kernel subsequently.
	   *
	   * @param {Array} argTypes - Array of argument types
	   *     
	   * Return:
	   *     Compiled kernel {Object}
	   *
	   */

		}, {
			key: 'precompileKernelObj',
			value: function precompileKernelObj(argTypes) {

				var threadDim = this.threadDim || (this.threadDim = utils.clone(this.output));

				return {
					threadDim: threadDim
				};
			}

			/**
	   * @memberOf CPUKernel
	   * @function
	   * @name compileKernel
	   * @static
	   *
	   * @desc Takes a previously precompiled kernel object,
	   * and complete compilation into a full kernel
	   * 
	   * @returns {Function} Compiled kernel
	   *
	   */

		}, {
			key: '_getLoopMaxString',


			/**
	   * @memberOf WebGLKernel#
	   * @function
	   * @name _getLoopMaxString
	   *
	   * @desc Get the maximum loop size String.
	   *
	   * @returns {String} result
	   *
	   */
			value: function _getLoopMaxString() {
				return this.loopMaxIterations ? ' ' + parseInt(this.loopMaxIterations) + ';\n' : ' 1000;\n';
			}
		}], [{
			key: 'compileKernel',
			value: function compileKernel(precompileObj) {

				// Extract values from precompiled obj
				var threadDim = precompileObj.threadDim;

				// Normalize certain values : For actual build
				while (threadDim.length < 3) {
					threadDim.push(1);
				}
			}
		}]);

		return CPUKernel;
	}(KernelBase);

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(24);
	var kernelRunShortcut = __webpack_require__(30);

	module.exports = function (cpuKernel, name) {
	  return '() => {\n    ' + kernelRunShortcut.toString() + ';\n    const utils = {\n      allPropertiesOf: function ' + utils.allPropertiesOf.toString() + ',\n      clone: function ' + utils.clone.toString() + ',\n      /*splitArray: function ' + utils.splitArray.toString() + ',\n      getArgumentType: function ' + utils.getArgumentType.toString() + ',\n      getOutput: function ' + utils.getOutput.toString() + ',\n      dimToTexSize: function ' + utils.dimToTexSize.toString() + ',\n      copyFlatten: function ' + utils.copyFlatten.toString() + ',\n      flatten: function ' + utils.flatten.toString() + ',\n      systemEndianness: \'' + utils.systemEndianness() + '\',\n      initWebGl: function ' + utils.initWebGl.toString() + ',\n      isArray: function ' + utils.isArray.toString() + '*/\n    };\n    class ' + (name || 'Kernel') + ' {\n      constructor() {        \n        this.argumentsLength = 0;\n        this._canvas = null;\n        this._webGl = null;\n        this.built = false;\n        this.program = null;\n        this.paramNames = ' + JSON.stringify(cpuKernel.paramNames) + ';\n        this.paramTypes = ' + JSON.stringify(cpuKernel.paramTypes) + ';\n        this.texSize = ' + JSON.stringify(cpuKernel.texSize) + ';\n        this.output = ' + JSON.stringify(cpuKernel.output) + ';\n        this._kernelString = `' + cpuKernel._kernelString + '`;\n        this.output = ' + JSON.stringify(cpuKernel.output) + ';\n\t\t    this.run = function() {\n          this.run = null;\n          this.build();\n          return this.run.apply(this, arguments);\n        }.bind(this);\n        this.thread = {\n          x: 0,\n          y: 0,\n          z: 0\n        };\n      }\n      setCanvas(canvas) { this._canvas = canvas; return this; }\n      setWebGl(webGl) { this._webGl = webGl; return this; }\n      ' + cpuKernel.build.toString() + '\n      run () { ' + cpuKernel.kernelString + ' }\n      getKernelString() { return this._kernelString; }\n    };\n    return kernelRunShortcut(new Kernel());\n  };';
	};

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var FunctionBuilderBase = __webpack_require__(37);
	var CPUFunctionNode = __webpack_require__(45);

	/**
	 * @class CPUFunctionBuilder
	 *
	 * @extends FunctionBuilderBase
	 *
	 * @desc Builds functions to execute on CPU from JavaScript function Strings
	 *
	 */
	module.exports = function (_FunctionBuilderBase) {
	  _inherits(CPUFunctionBuilder, _FunctionBuilderBase);

	  function CPUFunctionBuilder() {
	    _classCallCheck(this, CPUFunctionBuilder);

	    var _this = _possibleConstructorReturn(this, (CPUFunctionBuilder.__proto__ || Object.getPrototypeOf(CPUFunctionBuilder)).call(this));

	    _this.Node = CPUFunctionNode;
	    return _this;
	  }

	  _createClass(CPUFunctionBuilder, [{
	    key: 'polyfillStandardFunctions',
	    value: function polyfillStandardFunctions() {}
	  }]);

	  return CPUFunctionBuilder;
	}(FunctionBuilderBase);

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var BaseFunctionNode = __webpack_require__(39);
	var utils = __webpack_require__(24);

	/**
	 * @class CPUFunctionNode
	 * 
	 * @extends BaseFunctionNode
	 *
	 * @desc [INTERNAL] Represents a single function, inside JS
	 *
	 * <p>This handles all the raw state, converted state, etc. Of a single function.</p>
	 *
	 * @prop functionName         - {String}        Name of the function
	 * @prop jsFunction           - {Function}   The JS Function the node represents
	 * @prop jsFunctionString     - {String}        jsFunction.toString()
	 * @prop paramNames           - {String[]}  Parameter names of the function
	 * @prop paramTypes           - {String[]}  Shader land parameters type assumption
	 * @prop isRootKernel         - {Boolean}       Special indicator, for kernel function
	 * @prop webglFunctionString  - {String}        webgl converted function string
	 * @prop openglFunctionString - {String}        opengl converted function string
	 * @prop calledFunctions      - {String[]}  List of all the functions called
	 * @prop initVariables        - {String[]}  List of variables initialized in the function
	 * @prop readVariables        - {String[]}  List of variables read operations occur
	 * @prop writeVariables       - {String[]}  List of variables write operations occur
	 *
	 */
	module.exports = function (_BaseFunctionNode) {
		_inherits(CPUFunctionNode, _BaseFunctionNode);

		function CPUFunctionNode() {
			_classCallCheck(this, CPUFunctionNode);

			return _possibleConstructorReturn(this, (CPUFunctionNode.__proto__ || Object.getPrototypeOf(CPUFunctionNode)).apply(this, arguments));
		}

		_createClass(CPUFunctionNode, [{
			key: 'generate',
			value: function generate() {
				if (this.debug) {
					console.log(this);
				}
				this.functionStringArray = this.astGeneric(this.getJsAST(), [], this);
				this.functionString = this.functionStringArray.join('').trim();
				return this.functionString;
			}

			/**
	   * @memberOf CPUFunctionNode#
	   * @function
	   * @name getFunctionPrototypeString
	   *
	   * @desc Returns the converted JS function
	   *
	   * @returns {String} function string, result is cached under this.getFunctionPrototypeString
	   *
	   */

		}, {
			key: 'getFunctionPrototypeString',
			value: function getFunctionPrototypeString() {
				if (this.webGlFunctionPrototypeString) {
					return this.webGlFunctionPrototypeString;
				}
				return this.webGlFunctionPrototypeString = this.generate();
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astGeneric
	   *
	   * @desc Parses the abstract syntax tree for generically to its respective function
	   *
	   * @param {Object} ast - the AST object to parse
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the parsed cpu string array
	   */

		}, {
			key: 'astGeneric',
			value: function astGeneric(ast, retArr, funcParam) {
				if (ast === null) {
					throw this.astErrorOutput('NULL ast', ast, funcParam);
				} else {
					if (Array.isArray(ast)) {
						for (var i = 0; i < ast.length; i++) {
							this.astGeneric(ast[i], retArr, funcParam);
						}
						return retArr;
					}

					switch (ast.type) {
						case 'FunctionDeclaration':
							return this.astFunctionDeclaration(ast, retArr, funcParam);
						case 'FunctionExpression':
							return this.astFunctionExpression(ast, retArr, funcParam);
						case 'ReturnStatement':
							return this.astReturnStatement(ast, retArr, funcParam);
						case 'Literal':
							return this.astLiteral(ast, retArr, funcParam);
						case 'BinaryExpression':
							return this.astBinaryExpression(ast, retArr, funcParam);
						case 'Identifier':
							return this.astIdentifierExpression(ast, retArr, funcParam);
						case 'AssignmentExpression':
							return this.astAssignmentExpression(ast, retArr, funcParam);
						case 'ExpressionStatement':
							return this.astExpressionStatement(ast, retArr, funcParam);
						case 'EmptyStatement':
							return this.astEmptyStatement(ast, retArr, funcParam);
						case 'BlockStatement':
							return this.astBlockStatement(ast, retArr, funcParam);
						case 'IfStatement':
							return this.astIfStatement(ast, retArr, funcParam);
						case 'BreakStatement':
							return this.astBreakStatement(ast, retArr, funcParam);
						case 'ContinueStatement':
							return this.astContinueStatement(ast, retArr, funcParam);
						case 'ForStatement':
							return this.astForStatement(ast, retArr, funcParam);
						case 'WhileStatement':
							return this.astWhileStatement(ast, retArr, funcParam);
						case 'VariableDeclaration':
							return this.astVariableDeclaration(ast, retArr, funcParam);
						case 'VariableDeclarator':
							return this.astVariableDeclarator(ast, retArr, funcParam);
						case 'ThisExpression':
							return this.astThisExpression(ast, retArr, funcParam);
						case 'SequenceExpression':
							return this.astSequenceExpression(ast, retArr, funcParam);
						case 'UnaryExpression':
							return this.astUnaryExpression(ast, retArr, funcParam);
						case 'UpdateExpression':
							return this.astUpdateExpression(ast, retArr, funcParam);
						case 'LogicalExpression':
							return this.astLogicalExpression(ast, retArr, funcParam);
						case 'MemberExpression':
							return this.astMemberExpression(ast, retArr, funcParam);
						case 'CallExpression':
							return this.astCallExpression(ast, retArr, funcParam);
						case 'ArrayExpression':
							return this.astArrayExpression(ast, retArr, funcParam);
						case 'DebuggerStatement':
							return this.astDebuggerStatement(ast, retArr, funcParam);
					}

					throw this.astErrorOutput('Unknown ast type : ' + ast.type, ast, funcParam);
				}
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astFunctionDeclaration
	   *
	   * @desc Parses the abstract syntax tree for to its *named function declaration*
	   *
	   * @param {Object} ast - the AST object to parse
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astFunctionDeclaration',
			value: function astFunctionDeclaration(ast, retArr, funcParam) {
				if (this.addFunction) {
					this.addFunction(null, utils.getAstString(this.jsFunctionString, ast));
				}
				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astFunctionPrototype
	   * @static
	   *
	   * @desc Parses the abstract syntax tree for to its *named function prototype*
	   *
	   * @param {Object} ast - the AST object to parse
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astFunctionExpression',


			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astFunctionExpression
	   *
	   * @desc Parses the abstract syntax tree for to its *named function*
	   *
	   * @param {Object} ast - the AST object to parse
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */
			value: function astFunctionExpression(ast, retArr, funcParam) {

				// Setup function return type and name
				if (!funcParam.isRootKernel) {
					retArr.push('function');
					funcParam.kernalAst = ast;
					retArr.push(' ');
					retArr.push(funcParam.functionName);
					retArr.push('(');

					// Arguments handling
					for (var i = 0; i < funcParam.paramNames.length; ++i) {
						var paramName = funcParam.paramNames[i];

						if (i > 0) {
							retArr.push(', ');
						}

						retArr.push(' ');
						retArr.push('user_');
						retArr.push(paramName);
					}

					// Function opening
					retArr.push(') {\n');
				}

				// Body statement iteration
				for (var _i = 0; _i < ast.body.body.length; ++_i) {
					this.astGeneric(ast.body.body[_i], retArr, funcParam);
					retArr.push('\n');
				}

				if (!funcParam.isRootKernel) {
					// Function closing
					retArr.push('}\n');
				}
				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astReturnStatement
	   *
	   * @desc Parses the abstract syntax tree for to *return* statement
	   *
	   * @param {Object} ast - the AST object to parse
	   * @param {Array} retArr - return array string
	   * @param {Object} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astReturnStatement',
			value: function astReturnStatement(ast, retArr, funcParam) {
				if (funcParam.isRootKernel) {
					retArr.push('kernelResult = ');
					this.astGeneric(ast.argument, retArr, funcParam);
					retArr.push(';');
				} else if (funcParam.isSubKernel) {
					retArr.push(funcParam.functionName + 'Result = ');
					this.astGeneric(ast.argument, retArr, funcParam);
					retArr.push(';');
					retArr.push('return ' + funcParam.functionName + 'Result;');
				} else {
					retArr.push('return ');
					this.astGeneric(ast.argument, retArr, funcParam);
					retArr.push(';');
				}

				//throw this.astErrorOutput(
				//	'Non main function return, is not supported : '+funcParam.currentFunctionNamespace,
				//	ast, funcParam
				//);

				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astLiteral
	   *
	   * @desc Parses the abstract syntax tree for *literal value*
	   *
	   * @param {Object} ast - the AST object to parse
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astLiteral',
			value: function astLiteral(ast, retArr, funcParam) {

				// Reject non numeric literals
				if (isNaN(ast.value)) {
					throw this.astErrorOutput('Non-numeric literal not supported : ' + ast.value, ast, funcParam);
				}

				retArr.push(ast.value);

				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astBinaryExpression
	   *
	   * @desc Parses the abstract syntax tree for *binary* expression
	   *
	   * @param {Object} ast - the AST object to parse
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astBinaryExpression',
			value: function astBinaryExpression(ast, retArr, funcParam) {
				retArr.push('(');
				this.astGeneric(ast.left, retArr, funcParam);
				retArr.push(ast.operator);
				this.astGeneric(ast.right, retArr, funcParam);
				retArr.push(')');
				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astIdentifierExpression
	   *
	   * @desc Parses the abstract syntax tree for *identifier* expression
	   *
	   * @param {Object} idtNode - An ast Node
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astIdentifierExpression',
			value: function astIdentifierExpression(idtNode, retArr, funcParam) {
				if (idtNode.type !== 'Identifier') {
					throw this.astErrorOutput('IdentifierExpression - not an Identifier', idtNode, funcParam);
				}

				switch (idtNode.name) {
					case 'gpu_threadX':
						retArr.push('threadId.x');
						break;
					case 'gpu_threadY':
						retArr.push('threadId.y');
						break;
					case 'gpu_threadZ':
						retArr.push('threadId.z');
						break;
					case 'gpu_outputX':
						retArr.push('uOutputDim.x');
						break;
					case 'gpu_outputY':
						retArr.push('uOutputDim.y');
						break;
					case 'gpu_outputZ':
						retArr.push('uOutputDim.z');
						break;
					default:
						if (this.constants && this.constants.hasOwnProperty(idtNode.name)) {
							retArr.push('constants_' + idtNode.name);
						} else {
							var userParamName = funcParam.getUserParamName(idtNode.name);
							if (userParamName !== null) {
								retArr.push('user_' + userParamName);
							} else {
								retArr.push('user_' + idtNode.name);
							}
						}
				}

				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astForStatement
	   *
	   * @desc Parses the abstract syntax tree forfor *for-loop* expression
	   *
	   * @param {Object} forNode - An ast Node
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the parsed cpu string
	   */

		}, {
			key: 'astForStatement',
			value: function astForStatement(forNode, retArr, funcParam) {
				if (forNode.type !== 'ForStatement') {
					throw this.astErrorOutput('Invalid for statment', forNode, funcParam);
				}

				if (forNode.test && forNode.test.type === 'BinaryExpression') {
					if ((forNode.test.right.type === 'Identifier' || forNode.test.right.type === 'Literal') && forNode.test.operator === '<' && this.isIdentifierConstant(forNode.test.right.name) === false) {

						if (!this.loopMaxIterations) {
							console.warn('Warning: loopMaxIterations is not set! Using default of 1000 which may result in unintended behavior.');
							console.warn('Set loopMaxIterations or use a for loop of fixed length to silence this message.');
						}

						retArr.push('for (');
						this.astGeneric(forNode.init, retArr, funcParam);
						if (retArr[retArr.length - 1] !== ';') {
							retArr.push(';');
						}
						this.astGeneric(forNode.test.left, retArr, funcParam);
						retArr.push(forNode.test.operator);
						retArr.push('LOOP_MAX');
						retArr.push(';');
						this.astGeneric(forNode.update, retArr, funcParam);
						retArr.push(')');

						retArr.push('{\n');
						retArr.push('if (');
						this.astGeneric(forNode.test.left, retArr, funcParam);
						retArr.push(forNode.test.operator);
						this.astGeneric(forNode.test.right, retArr, funcParam);
						retArr.push(') {\n');
						if (forNode.body.type === 'BlockStatement') {
							for (var i = 0; i < forNode.body.body.length; i++) {
								this.astGeneric(forNode.body.body[i], retArr, funcParam);
							}
						} else {
							this.astGeneric(forNode.body, retArr, funcParam);
						}
						retArr.push('} else {\n');
						retArr.push('break;\n');
						retArr.push('}\n');
						retArr.push('}\n');

						return retArr;
					} else if (forNode.init.declarations) {
						var declarations = JSON.parse(JSON.stringify(forNode.init.declarations));
						var updateArgument = forNode.update.argument;
						if (!Array.isArray(declarations) || declarations.length < 1) {
							console.log(this.jsFunctionString);
							throw new Error('Error: Incompatible for loop declaration');
						}

						if (declarations.length > 1) {
							var initArgument = null;
							for (var _i2 = 0; _i2 < declarations.length; _i2++) {
								var declaration = declarations[_i2];
								if (declaration.id.name === updateArgument.name) {
									initArgument = declaration;
									declarations.splice(_i2, 1);
								} else {
									retArr.push('var ');
									this.astGeneric(declaration, retArr, funcParam);
									retArr.push(';');
								}
							}

							retArr.push('for (let ');
							this.astGeneric(initArgument, retArr, funcParam);
							retArr.push(';');
						} else {
							retArr.push('for (');
							this.astGeneric(forNode.init, retArr, funcParam);
						}

						this.astGeneric(forNode.test, retArr, funcParam);
						retArr.push(';');
						this.astGeneric(forNode.update, retArr, funcParam);
						retArr.push(')');
						this.astGeneric(forNode.body, retArr, funcParam);
						return retArr;
					}
				}

				throw this.astErrorOutput('Invalid for statement', forNode, funcParam);
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astWhileStatement
	   *
	   * @desc Parses the abstract syntax tree for *while* loop
	   *
	   *
	   * @param {Object} whileNode - An ast Node
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the parsed openclgl string
	   */

		}, {
			key: 'astWhileStatement',
			value: function astWhileStatement(whileNode, retArr, funcParam) {
				if (whileNode.type !== 'WhileStatement') {
					throw this.astErrorOutput('Invalid while statment', whileNode, funcParam);
				}

				retArr.push('for (let i = 0; i < LOOP_MAX; i++) {');
				retArr.push('if (');
				this.astGeneric(whileNode.test, retArr, funcParam);
				retArr.push(') {\n');
				this.astGeneric(whileNode.body, retArr, funcParam);
				retArr.push('} else {\n');
				retArr.push('break;\n');
				retArr.push('}\n');
				retArr.push('}\n');

				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astAssignmentExpression
	   *
	   * @desc Parses the abstract syntax tree for *Assignment* Expression
	   *
	   * @param {Object} assNode - An ast Node
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astAssignmentExpression',
			value: function astAssignmentExpression(assNode, retArr, funcParam) {
				this.astGeneric(assNode.left, retArr, funcParam);
				retArr.push(assNode.operator);
				this.astGeneric(assNode.right, retArr, funcParam);
				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astEmptyStatement
	   *
	   * @desc Parses the abstract syntax tree for an *Empty* Statement
	   *
	   * @param {Object} eNode - An ast Node
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astEmptyStatement',
			value: function astEmptyStatement(eNode, retArr, funcParam) {
				//retArr.push(';\n');
				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astBlockStatement
	   *
	   * @desc Parses the abstract syntax tree for *Block* statement
	   *
	   * @param {Object} bNode - the AST object to parse
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astBlockStatement',
			value: function astBlockStatement(bNode, retArr, funcParam) {
				retArr.push('{\n');
				for (var i = 0; i < bNode.body.length; i++) {
					this.astGeneric(bNode.body[i], retArr, funcParam);
				}
				retArr.push('}\n');
				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astExpressionStatement
	   *
	   * @desc Parses the abstract syntax tree for *generic expression* statement
	   *
	   * @param {Object} esNode - An ast Node
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astExpressionStatement',
			value: function astExpressionStatement(esNode, retArr, funcParam) {
				this.astGeneric(esNode.expression, retArr, funcParam);
				retArr.push(';\n');
				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astVariableDeclaration
	   *
	   * @desc Parses the abstract syntax tree for *Variable Declaration*
	   *
	   * @param {Object} vardecNode - An ast Node
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astVariableDeclaration',
			value: function astVariableDeclaration(vardecNode, retArr, funcParam) {
				retArr.push('var ');
				for (var i = 0; i < vardecNode.declarations.length; i++) {
					if (i > 0) {
						retArr.push(',');
					}
					this.astGeneric(vardecNode.declarations[i], retArr, funcParam);
				}
				retArr.push(';');
				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astVariableDeclarator
	   *
	   * @desc Parses the abstract syntax tree for *Variable Declarator*
	   *
	   * @param {Object} ivardecNode - An ast Node
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astVariableDeclarator',
			value: function astVariableDeclarator(ivardecNode, retArr, funcParam) {
				this.astGeneric(ivardecNode.id, retArr, funcParam);
				if (ivardecNode.init !== null) {
					retArr.push('=');
					this.astGeneric(ivardecNode.init, retArr, funcParam);
				}
				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astIfStatement
	   *
	   * @desc Parses the abstract syntax tree for *If* Statement
	   *
	   * @param {Object} ifNode - An ast Node
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astIfStatement',
			value: function astIfStatement(ifNode, retArr, funcParam) {
				retArr.push('if (');
				this.astGeneric(ifNode.test, retArr, funcParam);
				retArr.push(')');
				if (ifNode.consequent.type === 'BlockStatement') {
					this.astGeneric(ifNode.consequent, retArr, funcParam);
				} else {
					retArr.push(' {\n');
					this.astGeneric(ifNode.consequent, retArr, funcParam);
					retArr.push('\n}\n');
				}

				if (ifNode.alternate) {
					retArr.push('else ');
					if (ifNode.alternate.type === 'BlockStatement') {
						this.astGeneric(ifNode.alternate, retArr, funcParam);
					} else {
						retArr.push(' {\n');
						this.astGeneric(ifNode.alternate, retArr, funcParam);
						retArr.push('\n}\n');
					}
				}
				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astBreakStatement
	   *
	   * @desc Parses the abstract syntax tree for *Break* Statement
	   *
	   * @param {Object} brNode - An ast Node
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astBreakStatement',
			value: function astBreakStatement(brNode, retArr, funcParam) {
				retArr.push('break;\n');
				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astContinueStatement
	   *
	   * @desc Parses the abstract syntax tree for *Continue* Statement
	   *
	   * @param {Object} crNode - An ast Node
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astContinueStatement',
			value: function astContinueStatement(crNode, retArr, funcParam) {
				retArr.push('continue;\n');
				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astLogicalExpression
	   *
	   * @desc Parses the abstract syntax tree for *Logical* Expression
	   *
	   * @param {Object} logNode - An ast Node
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astLogicalExpression',
			value: function astLogicalExpression(logNode, retArr, funcParam) {
				retArr.push('(');
				this.astGeneric(logNode.left, retArr, funcParam);
				retArr.push(logNode.operator);
				this.astGeneric(logNode.right, retArr, funcParam);
				retArr.push(')');
				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astUpdateExpression
	   *
	   * @desc Parses the abstract syntax tree for *Update* Expression
	   *
	   * @param {Object} uNode - An ast Node
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astUpdateExpression',
			value: function astUpdateExpression(uNode, retArr, funcParam) {
				if (uNode.prefix) {
					retArr.push(uNode.operator);
					this.astGeneric(uNode.argument, retArr, funcParam);
				} else {
					this.astGeneric(uNode.argument, retArr, funcParam);
					retArr.push(uNode.operator);
				}

				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astUnaryExpression
	   *
	   * @desc Parses the abstract syntax tree for *Unary* Expression
	   *
	   * @param {Object} uNode - An ast Node
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astUnaryExpression',
			value: function astUnaryExpression(uNode, retArr, funcParam) {
				if (uNode.prefix) {
					retArr.push(uNode.operator);
					this.astGeneric(uNode.argument, retArr, funcParam);
				} else {
					this.astGeneric(uNode.argument, retArr, funcParam);
					retArr.push(uNode.operator);
				}

				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astThisExpression
	   *
	   * @desc Parses the abstract syntax tree for *This* expression
	   *
	   * @param {Object} tNode - An ast Node
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astThisExpression',
			value: function astThisExpression(tNode, retArr, funcParam) {
				retArr.push('_this');
				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astMemberExpression
	   *
	   * @desc Parses the abstract syntax tree for *Member* Expression
	   *
	   * @param {Object} mNode - An ast Node
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astMemberExpression',
			value: function astMemberExpression(mNode, retArr, funcParam) {
				if (mNode.computed) {
					if (mNode.object.type === 'Identifier') {
						this.astGeneric(mNode.object, retArr, funcParam);
						retArr.push('[');
						this.astGeneric(mNode.property, retArr, funcParam);
						retArr.push(']');
					} else {
						this.astGeneric(mNode.object, retArr, funcParam);
						var last = retArr.pop();
						retArr.push('][');
						this.astGeneric(mNode.property, retArr, funcParam);
						retArr.push(last);
					}
				} else {
					var unrolled = this.astMemberExpressionUnroll(mNode);
					if (mNode.property.type === 'Identifier' && mNode.computed) {
						unrolled = 'user_' + unrolled;
					}

					// Its a reference to `this`, add '_' before
					if (unrolled.indexOf('this') === 0) {
						unrolled = '_' + unrolled;
					}

					switch (unrolled) {
						case '_this.output.x':
							retArr.push(this.output[0]);
							break;
						case '_this.output.y':
							retArr.push(this.output[1]);
							break;
						case '_this.output.z':
							retArr.push(this.output[2]);
							break;
						default:
							retArr.push(unrolled);
					}
				}
				return retArr;
			}
		}, {
			key: 'astSequenceExpression',
			value: function astSequenceExpression(sNode, retArr, funcParam) {
				for (var i = 0; i < sNode.expressions.length; i++) {
					if (i > 0) {
						retArr.push(',');
					}
					this.astGeneric(sNode.expressions, retArr, funcParam);
				}
				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astCallExpression
	   *
	   * @desc Parses the abstract syntax tree for *call* expression
	   *
	   * @param {Object} ast - the AST object to parse
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns  {Array} the append retArr
	   */

		}, {
			key: 'astCallExpression',
			value: function astCallExpression(ast, retArr, funcParam) {
				if (ast.callee) {
					// Get the full function call, unrolled
					var funcName = this.astMemberExpressionUnroll(ast.callee);

					// Register the function into the called registry
					if (funcParam.calledFunctions.indexOf(funcName) < 0) {
						funcParam.calledFunctions.push(funcName);
					}
					if (!funcParam.hasOwnProperty('funcName')) {
						funcParam.calledFunctionsArguments[funcName] = [];
					}

					var functionArguments = [];
					funcParam.calledFunctionsArguments[funcName].push(functionArguments);

					// Call the function
					retArr.push(funcName);

					// Open arguments space
					retArr.push('(');

					// Add the vars
					for (var i = 0; i < ast.arguments.length; ++i) {
						var argument = ast.arguments[i];
						if (i > 0) {
							retArr.push(', ');
						}
						this.astGeneric(argument, retArr, funcParam);
						if (argument.type === 'Identifier') {
							var paramIndex = funcParam.paramNames.indexOf(argument.name);
							if (paramIndex === -1) {
								functionArguments.push(null);
							} else {
								functionArguments.push({
									name: argument.name,
									type: funcParam.paramTypes[paramIndex]
								});
							}
						} else {
							functionArguments.push(null);
						}
					}

					// Close arguments space
					retArr.push(')');

					return retArr;
				}

				// Failure, unknown expression
				throw this.astErrorOutput('Unknown CallExpression', ast, funcParam);

				return retArr;
			}

			/**
	   * @memberOf WebGLFunctionNode#
	   * @function
	   * @name astArrayExpression
	   *
	   * @desc Parses the abstract syntax tree for *Array* Expression
	   *
	   * @param {Object} arrNode - the AST object to parse
	   * @param {Array} retArr - return array string
	   * @param {Function} funcParam - FunctionNode, that tracks compilation state
	   *
	   * @returns {Array} the append retArr
	   */

		}, {
			key: 'astArrayExpression',
			value: function astArrayExpression(arrNode, retArr, funcParam) {
				var arrLen = arrNode.elements.length;

				retArr.push('new Float32Array(');
				for (var i = 0; i < arrLen; ++i) {
					if (i > 0) {
						retArr.push(', ');
					}
					var subNode = arrNode.elements[i];
					this.astGeneric(subNode, retArr, funcParam);
				}
				retArr.push(')');

				return retArr;

				// // Failure, unknown expression
				// throw this.astErrorOutput(
				// 	'Unknown  ArrayExpression',
				// 	arrNode, funcParam
				//);
			}
		}, {
			key: 'astDebuggerStatement',
			value: function astDebuggerStatement(arrNode, retArr, funcParam) {
				retArr.push('debugger;');
				return retArr;
			}
		}], [{
			key: 'astFunctionPrototype',
			value: function astFunctionPrototype(ast, retArr, funcParam) {
				// Setup function return type and name
				if (funcParam.isRootKernel || funcParam.isSubKernel) {
					return retArr;
				}

				retArr.push(funcParam.returnType);
				retArr.push(' ');
				retArr.push(funcParam.functionName);
				retArr.push('(');

				// Arguments handling
				for (var i = 0; i < funcParam.paramNames.length; ++i) {
					if (i > 0) {
						retArr.push(', ');
					}

					retArr.push(funcParam.paramTypes[i]);
					retArr.push(' ');
					retArr.push('user_');
					retArr.push(funcParam.paramNames[i]);
				}

				retArr.push(');\n');

				return retArr;
			}
		}]);

		return CPUFunctionNode;
	}(BaseFunctionNode);

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var WebGLKernel = __webpack_require__(31);
	var utils = __webpack_require__(24);

	/**
	 * @class WebGLValidatorKernel
	 *
	 * @desc Helper class for WebGLKernel to validate texture size and dimensions.
	 *
	 */
	module.exports = function (_WebGLKernel) {
		_inherits(WebGLValidatorKernel, _WebGLKernel);

		function WebGLValidatorKernel() {
			_classCallCheck(this, WebGLValidatorKernel);

			return _possibleConstructorReturn(this, (WebGLValidatorKernel.__proto__ || Object.getPrototypeOf(WebGLValidatorKernel)).apply(this, arguments));
		}

		_createClass(WebGLValidatorKernel, [{
			key: 'validateOptions',


			/** 
	   * @memberOf WebGLValidatorKernel#
	   * @function
	   * @name validateOptions
	   *
	   */
			value: function validateOptions() {
				this.texSize = utils.dimToTexSize({
					floatTextures: this.floatTextures,
					floatOutput: this.floatOutput
				}, this.output, true);
			}
		}]);

		return WebGLValidatorKernel;
	}(WebGLKernel);

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var UtilsCore = __webpack_require__(25);

	/**
	 * This is a minimalistic version of GPU.js used 
	 * to run precompiled GPU.JS code.
	 *
	 * This intentionally excludes the JS AST compiller : which is 400kb alone/
	 *
	 * @class GPUCore
	 */
	module.exports = function () {
		function GPUCore() {
			_classCallCheck(this, GPUCore);
		}

		_createClass(GPUCore, null, [{
			key: "validateKernelObj",


			/**
	   * @name validateKernelObj
	   * @function
	   * @static
	   * @memberOf GPUCore
	   *
	   * @description Validates the KernelObj to comply with the defined format
	   * Note that this does only a limited sanity check, and does not  
	   * guarantee a full working validation.
	   *
	   * For the kernel object format see : <kernelObj-format>
	   *
	   * @param {Object|String} kernelObj - KernelObj used to validate
	   *
	   * @returns {Object} The validated kernel object, converted from JSON if needed
	   *
	   */
			value: function validateKernelObj(kernelObj) {

				// NULL validation
				if (kernelObj === null) {
					throw "KernelObj being validated is NULL";
				}

				// String JSON conversion
				if (typeof kernelObj === "string") {
					try {
						kernelObj = JSON.parse(kernelObj);
					} catch (e) {
						console.error(e);
						throw "Failed to convert KernelObj from JSON string";
					}

					// NULL validation
					if (kernelObj === null) {
						throw "Invalid (NULL) KernelObj JSON string representation";
					}
				}

				// Check for kernel obj flag
				if (kernelObj.isKernelObj !== true) {
					throw "Failed missing isKernelObj flag check";
				}

				// Return the validated kernelObj
				return kernelObj;
			}

			/**
	   * @name loadKernelObj
	   * @function
	   * @static
	   * @memberOf GPUCore
	   *
	   * @description Loads the precompiled kernel object. For GPUCore this is the ONLY way to create the kernel.
	   * To generate the kernelObj use <Kernel.exportKernelObj>
	   *
	   * Note that this function calls <validateKernelObj> internally, and throws an exception if it fails.
	   *
	   * @see GPUCore.validateKernelObj
	   * @see	Kernel.exportKernelObj
	   *
	   * @param {Object} kernelObj - The precompiled kernel object
	   * @param {Object} inOpt - [Optional] the option overrides to use
	   *
	   * @returns {Function} The kernel function
	   * 
	   */

		}, {
			key: "loadKernelObj",
			value: function loadKernelObj(kernelObj, inOpt) {

				// Validates the kernelObj, throws an exception if it fails
				kernelObj = validateKernelObj(kernelObj);
			}
		}]);

		return GPUCore;
	}();

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(24);
	module.exports = function alias(name, fn) {
		var fnString = fn.toString();
		return new Function('return function ' + name + ' (' + utils.getParamNamesFromString(fnString).join(', ') + ') {' + utils.getFunctionBodyFromString(fnString) + '}')();
	};

/***/ }),
/* 49 */
/***/ (function(module, exports) {

	"use strict";
	function randBase36String() {
	    return (Math.random() + 1).toString(36).substr(2, 24);
	}
	exports.randBase36String = randBase36String;
	function runif(min, max, discrete) {
	    if (min === undefined) {
	        min = 0;
	    }
	    if (max === undefined) {
	        max = 1;
	    }
	    if (discrete === undefined) {
	        discrete = false;
	    }
	    if (discrete) {
	        return Math.floor(runif(min, max, false));
	    }
	    return Math.random() * (max - min) + min;
	}
	exports.runif = runif;
	function rnorm(mean, stdev) {
	    this.v2 = null;
	    var u1, u2, v1, v2, s;
	    if (mean === undefined) {
	        mean = 0.0;
	    }
	    if (stdev === undefined) {
	        stdev = 1.0;
	    }
	    if (this.v2 === null) {
	        do {
	            u1 = Math.random();
	            u2 = Math.random();
	            v1 = 2 * u1 - 1;
	            v2 = 2 * u2 - 1;
	            s = v1 * v1 + v2 * v2;
	        } while (s === 0 || s >= 1);
	        this.v2 = v2 * Math.sqrt(-2 * Math.log(s) / s);
	        return stdev * v1 * Math.sqrt(-2 * Math.log(s) / s) + mean;
	    }
	    v2 = this.v2;
	    this.v2 = null;
	    return stdev * v2 + mean;
	}
	exports.rnorm = rnorm;
	function rchisq(degreesOfFreedom) {
	    if (degreesOfFreedom === undefined) {
	        degreesOfFreedom = 1;
	    }
	    var i, z, sum = 0.0;
	    for (i = 0; i < degreesOfFreedom; i++) {
	        z = rnorm();
	        sum += z * z;
	    }
	    return sum;
	}
	exports.rchisq = rchisq;
	function rpoisson(lambda) {
	    if (lambda === undefined) {
	        lambda = 1;
	    }
	    var l = Math.exp(-lambda), k = 0, p = 1.0;
	    do {
	        k++;
	        p *= Math.random();
	    } while (p > l);
	    return k - 1;
	}
	exports.rpoisson = rpoisson;
	function rcauchy(loc, scale) {
	    if (loc === undefined) {
	        loc = 0.0;
	    }
	    if (scale === undefined) {
	        scale = 1.0;
	    }
	    var n2, n1 = rnorm();
	    do {
	        n2 = rnorm();
	    } while (n2 === 0.0);
	    return loc + scale * n1 / n2;
	}
	exports.rcauchy = rcauchy;
	function rbernoulli(p) {
	    return Math.random() < p ? 1 : 0;
	}
	exports.rbernoulli = rbernoulli;
	function vectorize(generator) {
	    return function () {
	        var n, result, i, args;
	        args = [].slice.call(arguments);
	        n = args.shift();
	        result = [];
	        for (i = 0; i < n; i++) {
	            result.push(generator.apply(this, args));
	        }
	        return result;
	    };
	}
	function histogram(data, binCount) {
	    binCount = binCount || 10;
	    var bins, i, scaled, max = Math.max.apply(this, data), min = Math.min.apply(this, data);
	    if (max === min) {
	        return [data.length];
	    }
	    bins = [];
	    for (i = 0; i < binCount; i++) {
	        bins.push(0);
	    }
	    for (i = 0; i < data.length; i++) {
	        scaled = (data[i] - min) / (max - min);
	        scaled *= binCount;
	        scaled = Math.floor(scaled);
	        if (scaled === binCount) {
	            scaled--;
	        }
	        bins[scaled]++;
	    }
	    return bins;
	}
	exports.histogram = histogram;
	function rlist(list) {
	    return list[runif(0, list.length, true)];
	}
	exports.rlist = rlist;
	var rvunif = vectorize(runif);
	exports.rvunif = rvunif;
	var rvnorm = vectorize(rnorm);
	exports.rvnorm = rvnorm;
	var rvchisq = vectorize(rchisq);
	exports.rvchisq = rvchisq;
	var rvpoisson = vectorize(rpoisson);
	exports.rvpoisson = rvpoisson;
	var rvcauchy = vectorize(rcauchy);
	exports.rvcauchy = rvcauchy;
	var rvbernoulli = vectorize(rbernoulli);
	exports.rvbernoulli = rvbernoulli;
	var rvlist = vectorize(rlist);
	exports.rvlist = rvlist;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var randgen = __webpack_require__(49);
	var logger_1 = __webpack_require__(5);
	var logger = new logger_1.Logger();
	var SimplePerturber = (function () {
	    function SimplePerturber(_graph) {
	        this._graph = _graph;
	    }
	    SimplePerturber.prototype.randomlyDeleteNodesPercentage = function (percentage) {
	        if (percentage > 100) {
	            percentage = 100;
	        }
	        var nr_nodes_to_delete = Math.ceil(this._graph.nrNodes() * percentage / 100);
	        this.randomlyDeleteNodesAmount(nr_nodes_to_delete);
	    };
	    SimplePerturber.prototype.randomlyDeleteUndEdgesPercentage = function (percentage) {
	        if (percentage > 100) {
	            percentage = 100;
	        }
	        var nr_edges_to_delete = Math.ceil(this._graph.nrUndEdges() * percentage / 100);
	        this.randomlyDeleteUndEdgesAmount(nr_edges_to_delete);
	    };
	    SimplePerturber.prototype.randomlyDeleteDirEdgesPercentage = function (percentage) {
	        if (percentage > 100) {
	            percentage = 100;
	        }
	        var nr_edges_to_delete = Math.ceil(this._graph.nrDirEdges() * percentage / 100);
	        this.randomlyDeleteDirEdgesAmount(nr_edges_to_delete);
	    };
	    SimplePerturber.prototype.randomlyDeleteNodesAmount = function (amount) {
	        if (amount < 0) {
	            throw 'Cowardly refusing to remove a negative amount of nodes';
	        }
	        if (this._graph.nrNodes() === 0) {
	            return;
	        }
	        for (var nodeID = 0, randomNodes = this._graph.pickRandomProperties(this._graph.getNodes(), amount); nodeID < randomNodes.length; nodeID++) {
	            this._graph.deleteNode(this._graph.getNodes()[randomNodes[nodeID]]);
	        }
	    };
	    SimplePerturber.prototype.randomlyDeleteUndEdgesAmount = function (amount) {
	        if (amount < 0) {
	            throw 'Cowardly refusing to remove a negative amount of edges';
	        }
	        if (this._graph.nrUndEdges() === 0) {
	            return;
	        }
	        for (var edgeID = 0, randomEdges = this._graph.pickRandomProperties(this._graph.getUndEdges(), amount); edgeID < randomEdges.length; edgeID++) {
	            this._graph.deleteEdge(this._graph.getUndEdges()[randomEdges[edgeID]]);
	        }
	    };
	    SimplePerturber.prototype.randomlyDeleteDirEdgesAmount = function (amount) {
	        if (amount < 0) {
	            throw 'Cowardly refusing to remove a negative amount of edges';
	        }
	        if (this._graph.nrDirEdges() === 0) {
	            return;
	        }
	        for (var edgeID = 0, randomEdges = this._graph.pickRandomProperties(this._graph.getDirEdges(), amount); edgeID < randomEdges.length; edgeID++) {
	            this._graph.deleteEdge(this._graph.getDirEdges()[randomEdges[edgeID]]);
	        }
	    };
	    SimplePerturber.prototype.randomlyAddUndEdgesPercentage = function (percentage) {
	        var nr_und_edges_to_add = Math.ceil(this._graph.nrUndEdges() * percentage / 100);
	        this.randomlyAddEdgesAmount(nr_und_edges_to_add, { directed: false });
	    };
	    SimplePerturber.prototype.randomlyAddDirEdgesPercentage = function (percentage) {
	        var nr_dir_edges_to_add = Math.ceil(this._graph.nrDirEdges() * percentage / 100);
	        this.randomlyAddEdgesAmount(nr_dir_edges_to_add, { directed: true });
	    };
	    SimplePerturber.prototype.randomlyAddEdgesAmount = function (amount, config) {
	        if (amount <= 0) {
	            throw new Error('Cowardly refusing to add a non-positive amount of edges');
	        }
	        var node_a, node_b, nodes;
	        var direction = (config && config.directed) ? config.directed : false, dir = direction ? "_d" : "_u";
	        while (amount) {
	            node_a = this._graph.getRandomNode();
	            while ((node_b = this._graph.getRandomNode()) === node_a) { }
	            var edge_id = node_a.getID() + "_" + node_b.getID() + dir;
	            if (node_a.hasEdgeID(edge_id)) {
	                continue;
	            }
	            else {
	                this._graph.addEdgeByID(edge_id, node_a, node_b, { directed: direction });
	                --amount;
	            }
	        }
	    };
	    SimplePerturber.prototype.randomlyAddNodesPercentage = function (percentage, config) {
	        var nr_nodes_to_add = Math.ceil(this._graph.nrNodes() * percentage / 100);
	        this.randomlyAddNodesAmount(nr_nodes_to_add, config);
	    };
	    SimplePerturber.prototype.randomlyAddNodesAmount = function (amount, config) {
	        if (amount < 0) {
	            throw 'Cowardly refusing to add a negative amount of nodes';
	        }
	        var new_nodes = {};
	        while (amount--) {
	            var new_node_id = randgen.randBase36String();
	            new_nodes[new_node_id] = this._graph.addNodeByID(new_node_id);
	        }
	        if (config == null) {
	            return;
	        }
	        else {
	            this.createEdgesByConfig(config, new_nodes);
	        }
	    };
	    SimplePerturber.prototype.createEdgesByConfig = function (config, new_nodes) {
	        var degree, min_degree, max_degree, deg_probability;
	        if (config.und_degree != null ||
	            config.dir_degree != null ||
	            config.min_und_degree != null && config.max_und_degree != null ||
	            config.min_dir_degree != null && config.max_dir_degree != null) {
	            if ((degree = config.und_degree) != null) {
	                this.createRandomEdgesSpan(degree, degree, false, new_nodes);
	            }
	            else if ((min_degree = config.min_und_degree) != null
	                && (max_degree = config.max_und_degree) != null) {
	                this.createRandomEdgesSpan(min_degree, max_degree, false, new_nodes);
	            }
	            if (degree = config.dir_degree) {
	                this.createRandomEdgesSpan(degree, degree, true, new_nodes);
	            }
	            else if ((min_degree = config.min_dir_degree) != null
	                && (max_degree = config.max_dir_degree) != null) {
	                this.createRandomEdgesSpan(min_degree, max_degree, true, new_nodes);
	            }
	        }
	        else {
	            if (config.probability_dir != null) {
	                this.createRandomEdgesProb(config.probability_dir, true, new_nodes);
	            }
	            if (config.probability_und != null) {
	                this.createRandomEdgesProb(config.probability_und, false, new_nodes);
	            }
	        }
	    };
	    SimplePerturber.prototype.createRandomEdgesProb = function (probability, directed, new_nodes) {
	        if (0 > probability || 1 < probability) {
	            throw new Error("Probability out of range.");
	        }
	        directed = directed || false;
	        new_nodes = new_nodes || this._graph.getNodes();
	        var all_nodes = this._graph.getNodes(), node_a, node_b, edge_id, dir = directed ? '_d' : '_u';
	        for (node_a in new_nodes) {
	            for (node_b in all_nodes) {
	                if (node_a !== node_b && Math.random() <= probability) {
	                    edge_id = all_nodes[node_a].getID() + "_" + all_nodes[node_b].getID() + dir;
	                    if (this._graph.getNodes()[node_a].hasEdgeID(edge_id)) {
	                        continue;
	                    }
	                    this._graph.addEdgeByID(edge_id, all_nodes[node_a], all_nodes[node_b], { directed: directed });
	                }
	            }
	        }
	    };
	    SimplePerturber.prototype.createRandomEdgesSpan = function (min, max, directed, setOfNodes) {
	        if (min < 0) {
	            throw new Error('Minimum degree cannot be negative.');
	        }
	        if (max >= this._graph.nrNodes()) {
	            throw new Error('Maximum degree exceeds number of reachable nodes.');
	        }
	        if (min > max) {
	            throw new Error('Minimum degree cannot exceed maximum degree.');
	        }
	        directed = directed || false;
	        var min = min | 0, max = max | 0, new_nodes = setOfNodes || this._graph.getNodes(), all_nodes = this._graph.getNodes(), idx_a, node_a, node_b, edge_id, node_keys = Object.keys(all_nodes), keys_len = node_keys.length, rand_idx, rand_deg, dir = directed ? '_d' : '_u';
	        for (idx_a in new_nodes) {
	            node_a = new_nodes[idx_a];
	            rand_idx = 0;
	            rand_deg = (Math.random() * (max - min) + min) | 0;
	            while (rand_deg) {
	                rand_idx = (keys_len * Math.random()) | 0;
	                node_b = all_nodes[node_keys[rand_idx]];
	                if (node_a !== node_b) {
	                    edge_id = node_a.getID() + "_" + node_b.getID() + dir;
	                    if (node_a.hasEdgeID(edge_id)) {
	                        continue;
	                    }
	                    this._graph.addEdgeByID(edge_id, node_a, node_b, { directed: directed });
	                    --rand_deg;
	                }
	            }
	        }
	    };
	    return SimplePerturber;
	}());
	exports.SimplePerturber = SimplePerturber;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var $G = __webpack_require__(4);
	var MCMFBoykov = (function () {
	    function MCMFBoykov(_graph, _source, _sink, config) {
	        this._graph = _graph;
	        this._source = _source;
	        this._sink = _sink;
	        this._state = {
	            residGraph: null,
	            activeNodes: {},
	            orphans: {},
	            treeS: {},
	            treeT: {},
	            parents: {},
	            path: [],
	            tree: {}
	        };
	        this._config = config || this.prepareMCMFStandardConfig();
	        if (this._config.directed) {
	            this.renameEdges(_graph);
	        }
	        this._state.residGraph = this._graph;
	        if (!this._config.directed) {
	            this._state.residGraph = this.convertToDirectedGraph(this._state.residGraph);
	            this._source = this._state.residGraph.getNodeById(this._source.getID());
	            this._sink = this._state.residGraph.getNodeById(this._sink.getID());
	        }
	    }
	    MCMFBoykov.prototype.calculateCycle = function () {
	        var result = {
	            edges: [],
	            edgeIDs: [],
	            cost: 0
	        };
	        this._state.treeS[this._source.getID()] = this._source;
	        this._state.tree[this._source.getID()] = "S";
	        this._state.treeT[this._sink.getID()] = this._sink;
	        this._state.tree[this._sink.getID()] = "T";
	        this._state.activeNodes[this._source.getID()] = this._source;
	        this._state.activeNodes[this._sink.getID()] = this._sink;
	        var nrCycles = 0;
	        while (true) {
	            this.grow();
	            if (!this._state.path.length) {
	                break;
	            }
	            this.augmentation();
	            this.adoption();
	            ++nrCycles;
	        }
	        console.log("computing result");
	        var smallTree = (Object.keys(this._state.treeS).length < Object.keys(this._state.treeT).length) ? this._state.treeS : this._state.treeT;
	        var smallTree_size = Object.keys(smallTree).length;
	        var smallTree_ids = Object.keys(smallTree);
	        for (var i = 0; i < smallTree_size; i++) {
	            var node_id = smallTree_ids[i];
	            var node = this._graph.getNodeById(node_id);
	            if (!this._config.directed) {
	                var undEdges = node.undEdges();
	                var undEdges_size = Object.keys(undEdges).length;
	                var undEdges_ids = Object.keys(undEdges);
	                for (var i_1 = 0; i_1 < undEdges_size; i_1++) {
	                    var edge = undEdges[undEdges_ids[i_1]];
	                    var neighbor = (edge.getNodes().a.getID() == node.getID()) ? edge.getNodes().b : edge.getNodes().a;
	                    if (this._state.tree[neighbor.getID()] != this._state.tree[node.getID()]) {
	                        result.edges.push(edge);
	                        result.edgeIDs.push(edge.getID());
	                        result.cost += edge.getWeight();
	                    }
	                }
	            }
	            else {
	                var outEdges_ids = Object.keys(node.outEdges());
	                var outEdges_length = outEdges_ids.length;
	                var inEdges_ids = Object.keys(node.inEdges());
	                var inEdges_length = inEdges_ids.length;
	                for (var i_2 = 0; i_2 < outEdges_length; i_2++) {
	                    var edge = this._graph.getEdgeById(outEdges_ids[i_2]);
	                    var neighbor = edge.getNodes().b;
	                    if (this._state.tree[neighbor.getID()] != this._state.tree[node.getID()]) {
	                        result.edges.push(edge);
	                        result.edgeIDs.push(edge.getID());
	                        result.cost += edge.getWeight();
	                    }
	                }
	                for (var i_3 = 0; i_3 < inEdges_length; i_3++) {
	                    var edge = this._graph.getEdgeById(inEdges_ids[i_3]);
	                    var neighbor = edge.getNodes().a;
	                    if (this.tree(neighbor) != this.tree(node)) {
	                        result.edges.push(edge);
	                        result.edgeIDs.push(edge.getID());
	                        result.cost += edge.getWeight();
	                    }
	                }
	            }
	        }
	        console.log("Cost => " + result.cost);
	        console.log("# cycles => " + nrCycles);
	        return result;
	    };
	    MCMFBoykov.prototype.renameEdges = function (graph) {
	        var edges = graph.getDirEdges();
	        var edges_ids = Object.keys(edges);
	        var edges_length = edges_ids.length;
	        for (var i = 0; i < edges_length; i++) {
	            var edge = edges[edges_ids[i]];
	            var weight = edge.getWeight();
	            graph.deleteEdge(edge);
	            var node_a = edge.getNodes().a;
	            var node_b = edge.getNodes().b;
	            var options = { directed: true, weighted: true, weight: weight };
	            var new_edge = graph.addEdgeByID(node_a.getID() + "_" + node_b.getID(), node_a, node_b, options);
	        }
	    };
	    MCMFBoykov.prototype.convertToDirectedGraph = function (uGraph) {
	        var dGraph = new $G.BaseGraph(uGraph._label + "_directed");
	        var nodes = uGraph.getNodes();
	        var nodes_ids = Object.keys(nodes);
	        var nodes_length = nodes_ids.length;
	        for (var i = 0; i < nodes_length; i++) {
	            var node = nodes[nodes_ids[i]];
	            dGraph.addNodeByID(node.getID());
	        }
	        var edges = uGraph.getUndEdges();
	        var edges_ids = Object.keys(edges);
	        var edges_length = edges_ids.length;
	        for (var i = 0; i < edges_length; i++) {
	            var und_edge = edges[edges_ids[i]];
	            var node_a_id = und_edge.getNodes().a.getID();
	            var node_b_id = und_edge.getNodes().b.getID();
	            var options = { directed: true, weighted: true, weight: und_edge.getWeight() };
	            dGraph.addEdgeByID(node_a_id + "_" + node_b_id, dGraph.getNodeById(node_a_id), dGraph.getNodeById(node_b_id), options);
	            dGraph.addEdgeByID(node_b_id + "_" + node_a_id, dGraph.getNodeById(node_b_id), dGraph.getNodeById(node_a_id), options);
	        }
	        return dGraph;
	    };
	    MCMFBoykov.prototype.tree = function (node) {
	        var tree = "";
	        if (node.getID() in this._state.treeS) {
	            tree = "S";
	            return tree;
	        }
	        if (node.getID() in this._state.treeT) {
	            tree = "T";
	            return tree;
	        }
	        return tree;
	    };
	    MCMFBoykov.prototype.getPathToRoot = function (node) {
	        var path_root = [];
	        var node_id = node.getID();
	        path_root.push(this._graph.getNodeById(node_id));
	        var sink_id = this._sink.getID();
	        var source_id = this._source.getID();
	        while ((node_id != sink_id) && (node_id != source_id)) {
	            if (this._state.parents[node_id] == null) {
	                return path_root;
	            }
	            node_id = this._state.parents[node_id].getID();
	            path_root.push(this._graph.getNodeById(node_id));
	        }
	        return path_root;
	    };
	    MCMFBoykov.prototype.getBottleneckCapacity = function () {
	        var min_capacity = 0;
	        var min_capacity = this._state.residGraph.getEdgeById(this._state.path[0].getID() + "_" + this._state.path[1].getID()).getWeight();
	        var path_length = this._state.path.length - 1;
	        for (var i = 0; i < path_length; i++) {
	            var node_a = this._state.path[i];
	            var node_b = this._state.path[i + 1];
	            var edge = this._state.residGraph.getEdgeById(node_a.getID() + "_" + node_b.getID());
	            if (edge.getWeight() < min_capacity) {
	                min_capacity = edge.getWeight();
	            }
	        }
	        return min_capacity;
	    };
	    MCMFBoykov.prototype.grow = function () {
	        var nr_active_nodes = Object.keys(this._state.activeNodes).length;
	        var active_nodes_ids = Object.keys(this._state.activeNodes);
	        while (nr_active_nodes) {
	            var activeNode = this._state.activeNodes[active_nodes_ids[0]];
	            var edges = (this._state.tree[activeNode.getID()] == "S") ? activeNode.outEdges() : activeNode.inEdges();
	            var edges_ids = Object.keys(edges);
	            var edges_length = edges_ids.length;
	            for (var i = 0; i < edges_length; i++) {
	                var edge = edges[edges_ids[i]];
	                var neighborNode = (this._state.tree[activeNode.getID()] == "S") ? edge.getNodes().b : edge.getNodes().a;
	                if (edge.getWeight() <= 0) {
	                    continue;
	                }
	                if (!(this._state.tree[neighborNode.getID()])) {
	                    if (this._state.tree[activeNode.getID()] == "S") {
	                        this._state.treeS[neighborNode.getID()] = neighborNode;
	                        this._state.tree[neighborNode.getID()] = "S";
	                    }
	                    else {
	                        this._state.treeT[neighborNode.getID()] = neighborNode;
	                        this._state.tree[neighborNode.getID()] = "T";
	                    }
	                    this._state.parents[neighborNode.getID()] = activeNode;
	                    this._state.activeNodes[neighborNode.getID()] = neighborNode;
	                    active_nodes_ids.push(neighborNode.getID());
	                    ++nr_active_nodes;
	                }
	                else if (this._state.tree[neighborNode.getID()] != this._state.tree[activeNode.getID()]) {
	                    var complete_path;
	                    var nPath = this.getPathToRoot(neighborNode);
	                    var aPath = this.getPathToRoot(activeNode);
	                    var root_node_npath = nPath[nPath.length - 1];
	                    if (this._state.tree[root_node_npath.getID()] == "S") {
	                        nPath = nPath.reverse();
	                        complete_path = nPath.concat(aPath);
	                    }
	                    else {
	                        aPath = aPath.reverse();
	                        complete_path = aPath.concat(nPath);
	                    }
	                    this._state.path = complete_path;
	                    return;
	                }
	            }
	            delete this._state.activeNodes[activeNode.getID()];
	            active_nodes_ids.shift();
	            --nr_active_nodes;
	        }
	        this._state.path = [];
	        return;
	    };
	    MCMFBoykov.prototype.augmentation = function () {
	        var min_capacity = this.getBottleneckCapacity();
	        for (var i = 0; i < this._state.path.length - 1; i++) {
	            var node_a = this._state.path[i], node_b = this._state.path[i + 1];
	            var edge = this._state.residGraph.getEdgeById(node_a.getID() + "_" + node_b.getID());
	            var reverse_edge = this._state.residGraph.getEdgeById(node_b.getID() + "_" + node_a.getID());
	            this._state.residGraph.getEdgeById(edge.getID()).setWeight(edge.getWeight() - min_capacity);
	            this._state.residGraph.getEdgeById(reverse_edge.getID()).setWeight(reverse_edge.getWeight() + min_capacity);
	            edge = this._state.residGraph.getEdgeById(edge.getID());
	            if (!edge.getWeight()) {
	                if (this._state.tree[node_a.getID()] == this._state.tree[node_b.getID()]) {
	                    if (this._state.tree[node_b.getID()] == "S") {
	                        delete this._state.parents[node_b.getID()];
	                        this._state.orphans[node_b.getID()] = node_b;
	                    }
	                    if (this._state.tree[node_a.getID()] == "T") {
	                        delete this._state.parents[node_a.getID()];
	                        this._state.orphans[node_a.getID()] = node_a;
	                    }
	                }
	            }
	        }
	    };
	    MCMFBoykov.prototype.adoption = function () {
	        var orphans_ids = Object.keys(this._state.orphans);
	        var orphans_size = orphans_ids.length;
	        while (orphans_size) {
	            var orphan = this._state.orphans[orphans_ids[0]];
	            delete this._state.orphans[orphan.getID()];
	            orphans_ids.shift();
	            --orphans_size;
	            var edges = (this._state.tree[orphan.getID()] == "S") ? orphan.inEdges() : orphan.outEdges();
	            var edge_ids = Object.keys(edges);
	            var edge_length = edge_ids.length;
	            var found = false;
	            for (var i = 0; i < edge_length; i++) {
	                var edge = edges[edge_ids[i]];
	                var neighbor = (this._state.tree[orphan.getID()] == "S") ? edge.getNodes().a : edge.getNodes().b;
	                if ((this._state.tree[orphan.getID()] == this._state.tree[neighbor.getID()]) && edge.getWeight()) {
	                    var neighbor_root_path = this.getPathToRoot(neighbor);
	                    var neighbor_root = neighbor_root_path[neighbor_root_path.length - 1];
	                    if ((neighbor_root.getID() == this._sink.getID()) || (neighbor_root.getID() == this._source.getID())) {
	                        this._state.parents[orphan.getID()] = neighbor;
	                        found = true;
	                        break;
	                    }
	                }
	            }
	            if (found) {
	                continue;
	            }
	            for (var i = 0; i < edge_length; i++) {
	                var edge = edges[edge_ids[i]];
	                var neighbor = (this._state.tree[orphan.getID()] == "S") ? edge.getNodes().a : edge.getNodes().b;
	                if (this._state.tree[orphan.getID()] == this._state.tree[neighbor.getID()]) {
	                    if (edge.getWeight()) {
	                        this._state.activeNodes[neighbor.getID()] = neighbor;
	                    }
	                    if (this._state.parents[neighbor.getID()] == null) {
	                        continue;
	                    }
	                    if (this._state.parents[neighbor.getID()].getID() == orphan.getID()) {
	                        this._state.orphans[neighbor.getID()] = neighbor;
	                        orphans_ids.push(neighbor.getID());
	                        ++orphans_size;
	                        delete this._state.parents[neighbor.getID()];
	                    }
	                }
	            }
	            var orphan_tree = this._state.tree[orphan.getID()];
	            if (orphan_tree == "S") {
	                delete this._state.treeS[orphan.getID()];
	                delete this._state.tree[orphan.getID()];
	            }
	            else if (orphan_tree == "T") {
	                delete this._state.treeT[orphan.getID()];
	                delete this._state.tree[orphan.getID()];
	            }
	            delete this._state.activeNodes[orphan.getID()];
	        }
	    };
	    MCMFBoykov.prototype.prepareMCMFStandardConfig = function () {
	        return {
	            directed: true
	        };
	    };
	    return MCMFBoykov;
	}());
	exports.MCMFBoykov = MCMFBoykov;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var $SU = __webpack_require__(3);
	(function (DegreeMode) {
	    DegreeMode[DegreeMode["in"] = 0] = "in";
	    DegreeMode[DegreeMode["out"] = 1] = "out";
	    DegreeMode[DegreeMode["und"] = 2] = "und";
	    DegreeMode[DegreeMode["dir"] = 3] = "dir";
	    DegreeMode[DegreeMode["all"] = 4] = "all";
	})(exports.DegreeMode || (exports.DegreeMode = {}));
	var DegreeMode = exports.DegreeMode;
	var degreeCentrality = (function () {
	    function degreeCentrality() {
	    }
	    degreeCentrality.prototype.getCentralityMap = function (graph, weighted, conf) {
	        weighted = (weighted != null) ? !!weighted : true;
	        conf = (conf == null) ? DegreeMode.all : conf;
	        var ret = {};
	        switch (conf) {
	            case DegreeMode.in:
	                for (var key in graph.getNodes()) {
	                    var node = graph.getNodeById(key);
	                    if (node != null)
	                        if (!weighted)
	                            ret[key] = node.inDegree();
	                        else {
	                            ret[key] = ret[key] || 0;
	                            for (var k in node.inEdges()) {
	                                ret[key] += node.inEdges()[k].getWeight();
	                            }
	                        }
	                }
	                break;
	            case DegreeMode.out:
	                for (var key in graph.getNodes()) {
	                    var node = graph.getNodeById(key);
	                    if (node != null)
	                        if (!weighted)
	                            ret[key] = node.outDegree();
	                        else {
	                            ret[key] = ret[key] || 0;
	                            for (var k in node.outEdges())
	                                ret[key] += node.outEdges()[k].getWeight();
	                        }
	                }
	                break;
	            case DegreeMode.und:
	                for (var key in graph.getNodes()) {
	                    var node = graph.getNodeById(key);
	                    if (node != null)
	                        if (!weighted)
	                            ret[key] = node.degree();
	                        else {
	                            ret[key] = ret[key] || 0;
	                            for (var k in node.undEdges())
	                                ret[key] += node.undEdges()[k].getWeight();
	                        }
	                }
	                break;
	            case DegreeMode.dir:
	                for (var key in graph.getNodes()) {
	                    var node = graph.getNodeById(key);
	                    if (node != null)
	                        if (!weighted)
	                            ret[key] = node.inDegree() + node.outDegree();
	                        else {
	                            ret[key] = ret[key] || 0;
	                            var comb = $SU.mergeObjects([node.inEdges(), node.outEdges()]);
	                            for (var k in comb)
	                                ret[key] += comb[k].getWeight();
	                        }
	                }
	                break;
	            case DegreeMode.all:
	                for (var key in graph.getNodes()) {
	                    var node = graph.getNodeById(key);
	                    if (node != null)
	                        if (!weighted)
	                            ret[key] = node.degree() + node.inDegree() + node.outDegree();
	                        else {
	                            ret[key] = ret[key] || 0;
	                            var comb = $SU.mergeObjects([node.inEdges(), node.outEdges(), node.undEdges()]);
	                            for (var k in comb) {
	                                ret[key] += comb[k].getWeight();
	                            }
	                        }
	                }
	                break;
	        }
	        return ret;
	    };
	    degreeCentrality.prototype.getHistorgram = function (graph) {
	        return graph.degreeDistribution();
	    };
	    return degreeCentrality;
	}());
	exports.degreeCentrality = degreeCentrality;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var $PFS = __webpack_require__(11);
	var $FW = __webpack_require__(21);
	var closenessCentrality = (function () {
	    function closenessCentrality() {
	    }
	    closenessCentrality.prototype.getCentralityMapFW = function (graph) {
	        var dists = $FW.FloydWarshallArray(graph);
	        var ret = [];
	        var N = dists.length;
	        for (var a = 0; a < N; ++a) {
	            var sum = 0;
	            for (var b = 0; b < N; ++b) {
	                if (dists[a][b] != Number.POSITIVE_INFINITY)
	                    sum += dists[a][b];
	            }
	            ret[a] = 1 / sum;
	        }
	        return ret;
	    };
	    closenessCentrality.prototype.getCentralityMap = function (graph) {
	        var pfs_config = $PFS.preparePFSStandardConfig();
	        var accumulated_distance = 0;
	        var not_encountered = function (context) {
	            accumulated_distance += context.current.best + (isNaN(context.next.edge.getWeight()) ? 1 : context.next.edge.getWeight());
	        };
	        var betterPathFound = function (context) {
	            accumulated_distance -= pfs_config.result[context.next.node.getID()].distance - context.better_dist;
	        };
	        var bp = pfs_config.callbacks.better_path.pop();
	        pfs_config.callbacks.better_path.push(betterPathFound);
	        pfs_config.callbacks.better_path.push(bp);
	        pfs_config.callbacks.not_encountered.push(not_encountered);
	        var ret = {};
	        for (var key in graph.getNodes()) {
	            var node = graph.getNodeById(key);
	            if (node != null) {
	                accumulated_distance = 0;
	                $PFS.PFS(graph, node, pfs_config);
	                ret[key] = 1 / accumulated_distance;
	            }
	        }
	        return ret;
	    };
	    return closenessCentrality;
	}());
	exports.closenessCentrality = closenessCentrality;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var $FW = __webpack_require__(21);
	function inBetweennessCentrality(graph, sparse) {
	    var paths;
	    paths = $FW.FloydWarshallAPSP(graph)[1];
	    var nodes = graph.adjListArray();
	    var map = {};
	    for (var keyA in nodes) {
	        map[keyA] = 0;
	    }
	    var N = paths.length;
	    for (var a = 0; a < N; ++a) {
	        for (var b = 0; b < N; ++b) {
	            if (a != b && !(paths[a][b].length == 1 && paths[a][b][0] == b)) {
	                addBetweeness(a, b, paths, map, a);
	            }
	        }
	    }
	    var dem = 0;
	    for (var a_1 in map) {
	        dem += map[a_1];
	    }
	    for (var a_2 in map) {
	        map[a_2] /= dem;
	    }
	    return map;
	}
	exports.inBetweennessCentrality = inBetweennessCentrality;
	function addBetweeness(u, v, next, map, start) {
	    if (u == v)
	        return 1;
	    var nodes = 0;
	    for (var e = 0; e < next[u][v].length; e++) {
	        nodes += addBetweeness(next[u][v][e], v, next, map, start);
	    }
	    if (u != start) {
	        map[u] += nodes;
	    }
	    return nodes;
	}


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var $SU = __webpack_require__(3);
	var $GAUSS = __webpack_require__(56);
	var pageRankDetCentrality = (function () {
	    function pageRankDetCentrality() {
	    }
	    pageRankDetCentrality.prototype.getCentralityMap = function (graph, weighted) {
	        var divideTable = {};
	        var matr = [];
	        var ctr = 0;
	        var map = {};
	        for (var key in graph.getNodes()) {
	            divideTable[key] = 0;
	        }
	        for (var key in graph.getNodes()) {
	            map[key] = ctr;
	            var node = graph.getNodeById(key);
	            var node_InEdges = $SU.mergeObjects([node.inEdges(), node.undEdges()]);
	            matr[ctr] = new Array();
	            for (var edgeKey in node_InEdges) {
	                var edge = node_InEdges[edgeKey];
	                if (edge.getNodes().a.getID() == node.getID()) {
	                    matr[ctr].push(edge.getNodes().b.getID());
	                    divideTable[edge.getNodes().b.getID()]++;
	                }
	                else {
	                    matr[ctr].push(edge.getNodes().a.getID());
	                    divideTable[edge.getNodes().a.getID()]++;
	                }
	            }
	            matr[ctr].push(node.getID());
	            ctr++;
	        }
	        ctr = 0;
	        var mapCtr = {};
	        var numMatr = [[]];
	        for (var key in matr) {
	            numMatr[key] = Array.apply(null, Array(graph.nrNodes())).map(Number.prototype.valueOf, 0);
	            var p = matr[key].pop();
	            if (mapCtr[p] == null)
	                mapCtr[p] = ctr++;
	            numMatr[key][mapCtr[p]] = -1;
	            for (var k in matr[key]) {
	                var a = matr[key][k];
	                if (mapCtr[a] == null)
	                    mapCtr[a] = ctr++;
	                numMatr[key][mapCtr[a]] += 1 / divideTable[a];
	            }
	        }
	        numMatr[numMatr.length - 1] = Array.apply(null, Array(graph.nrNodes())).map(Number.prototype.valueOf, 1);
	        var x = Array.apply(null, Array(graph.nrNodes())).map(Number.prototype.valueOf, 0);
	        x[x.length - 1] = 1;
	        x = $GAUSS.gauss(numMatr, x);
	        var y = {};
	        for (var key in map) {
	            y[key] = x[ctr];
	        }
	        return x;
	    };
	    return pageRankDetCentrality;
	}());
	exports.pageRankDetCentrality = pageRankDetCentrality;


/***/ }),
/* 56 */
/***/ (function(module, exports) {

	"use strict";
	var abs = Math.abs;
	function array_fill(i, n, v) {
	    var a = [];
	    for (; i < n; i++) {
	        a.push(v);
	    }
	    return a;
	}
	function gauss(A, x) {
	    var i, k, j;
	    for (i = 0; i < A.length; i++) {
	        A[i].push(x[i]);
	    }
	    var n = A.length;
	    for (i = 0; i < n; i++) {
	        var maxEl = abs(A[i][i]), maxRow = i;
	        for (k = i + 1; k < n; k++) {
	            if (abs(A[k][i]) > maxEl) {
	                maxEl = abs(A[k][i]);
	                maxRow = k;
	            }
	        }
	        for (k = i; k < n + 1; k++) {
	            var tmp = A[maxRow][k];
	            A[maxRow][k] = A[i][k];
	            A[i][k] = tmp;
	        }
	        for (k = i + 1; k < n; k++) {
	            var c = -A[k][i] / A[i][i];
	            for (j = i; j < n + 1; j++) {
	                if (i === j) {
	                    A[k][j] = 0;
	                }
	                else {
	                    A[k][j] += c * A[i][j];
	                }
	            }
	        }
	    }
	    x = array_fill(0, n, 0);
	    for (i = n - 1; i > -1; i--) {
	        x[i] = A[i][n] / A[i][i];
	        for (k = i - 1; k > -1; k--) {
	            A[k][n] -= A[k][i] * x[i];
	        }
	    }
	    return x;
	}
	exports.gauss = gauss;


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var $SU = __webpack_require__(3);
	var pageRankCentrality = (function () {
	    function pageRankCentrality() {
	    }
	    pageRankCentrality.prototype.getCentralityMap = function (graph, weighted, alpha, conv, iterations) {
	        if (alpha == null)
	            alpha = 0.10;
	        if (iterations == null)
	            iterations = 1000;
	        if (conv == null)
	            conv = 0.000125;
	        var curr = {};
	        var old = {};
	        var nrNodes = graph.nrNodes();
	        var structure = {};
	        for (var key in graph.getNodes()) {
	            key = String(key);
	            var node = graph.getNodeById(key);
	            structure[key] = {};
	            structure[key]['deg'] = node.outDegree() + node.degree();
	            structure[key]['inc'] = [];
	            var incomingEdges = $SU.mergeObjects([node.inEdges(), node.undEdges()]);
	            for (var edge in incomingEdges) {
	                var edgeNode = incomingEdges[edge];
	                var parent_1 = edgeNode.getNodes().a;
	                if (edgeNode.getNodes().a.getID() == node.getID())
	                    parent_1 = edgeNode.getNodes().b;
	                structure[key]['inc'].push(parent_1.getID());
	            }
	        }
	        for (var key in graph.getNodes()) {
	            key = String(key);
	            curr[key] = 1 / nrNodes;
	            old[key] = 1 / nrNodes;
	        }
	        for (var i = 0; i < iterations; i++) {
	            var me = 0.0;
	            for (var key in graph.getNodes()) {
	                key = String(key);
	                var total = 0;
	                var parents = structure[key]['inc'];
	                for (var k in parents) {
	                    var p = String(parents[k]);
	                    total += old[p] / structure[p]['deg'];
	                }
	                curr[key] = total * (1 - alpha) + alpha / nrNodes;
	                me += Math.abs(curr[key] - old[key]);
	            }
	            if (me <= conv) {
	                return curr;
	            }
	            old = $SU.clone(curr);
	        }
	        return curr;
	    };
	    return pageRankCentrality;
	}());
	exports.pageRankCentrality = pageRankCentrality;


/***/ })
/******/ ]);