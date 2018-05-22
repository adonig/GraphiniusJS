"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $N = require("./Nodes");
var $SU = require("../utils/structUtils");
var BaseEdge = /** @class */ (function () {
    function BaseEdge(_id, _node_a, _node_b, options, features) {
        this._id = _id;
        this._node_a = _node_a;
        this._node_b = _node_b;
        if (!(_node_a instanceof $N.BaseNode) || !(_node_b instanceof $N.BaseNode)) {
            throw new Error("cannot instantiate edge without two valid node objects");
        }
        options = options || {};
        this._directed = options.directed || false;
        this._weighted = options.weighted || false;
        // @NOTE isNaN and Number.isNaN confusion...
        this._weight = this._weighted ? (isNaN(options.weight) ? 1 : options.weight) : undefined;
        this._label = options.label || this._id;
        this._features = features || {};
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
    BaseEdge.prototype.getFeatures = function () {
        return this._features;
    };
    BaseEdge.prototype.getFeature = function (key) {
        return this._features[key];
    };
    BaseEdge.prototype.setFeatures = function (features) {
        this._features = $SU.clone(features);
        return this;
    };
    BaseEdge.prototype.setFeature = function (key, value) {
        this._features[key] = value;
        return this;
    };
    BaseEdge.prototype.deleteFeature = function (key) {
        var feat = this._features[key];
        delete this._features[key];
        return feat;
    };
    BaseEdge.prototype.clearFeatures = function () {
        this._features = {};
        return this;
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
