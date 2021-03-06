"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $N = require("./Nodes");
class BaseEdge {
    constructor(_id, _node_a, _node_b, options) {
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
    }
    getID() {
        return this._id;
    }
    getLabel() {
        return this._label;
    }
    setLabel(label) {
        this._label = label;
    }
    isDirected() {
        return this._directed;
    }
    isWeighted() {
        return this._weighted;
    }
    getWeight() {
        return this._weight;
    }
    setWeight(w) {
        if (!this._weighted) {
            throw new Error("Cannot set weight on unweighted edge.");
        }
        this._weight = w;
    }
    getNodes() {
        return { a: this._node_a, b: this._node_b };
    }
    clone(new_node_a, new_node_b) {
        if (!(new_node_a instanceof $N.BaseNode) || !(new_node_b instanceof $N.BaseNode)) {
            throw new Error("refusing to clone edge if any new node is invalid");
        }
        return new BaseEdge(this._id, new_node_a, new_node_b, {
            directed: this._directed,
            weighted: this._weighted,
            weight: this._weight,
            label: this._label
        });
    }
}
exports.BaseEdge = BaseEdge;
