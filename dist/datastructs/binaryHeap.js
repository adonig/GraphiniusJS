/// <reference path="../../typings/tsd.d.ts" />
"use strict";
(function (BinaryHeapMode) {
    BinaryHeapMode[BinaryHeapMode["MIN"] = 0] = "MIN";
    BinaryHeapMode[BinaryHeapMode["MAX"] = 1] = "MAX";
})(exports.BinaryHeapMode || (exports.BinaryHeapMode = {}));
var BinaryHeapMode = exports.BinaryHeapMode;
var BinaryHeap = (function () {
    /**
     * Mode of a min heap should only be set upon
     * instantiation and never again afterwards...
     * @param _mode MIN or MAX heap
     * @param _evalPriority the evaluation function applied to
     * all incoming objects to determine it's score
     * @param _evalObjID function to determine the identity of
     * the object we are looking for at removal etc..
     */
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
    }
    BinaryHeap.prototype.getMode = function () {
        return this._mode;
    };
    BinaryHeap.prototype.getArray = function () {
        return this._array;
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
        return this.remove(this._array[0]);
    };
    /**
     * Insert - Adding an object to the heap
     * @param obj the obj to add to the heap
     * @returns {number} the objects index in the internal array
     */
    BinaryHeap.prototype.insert = function (obj) {
        if (isNaN(this._evalPriority(obj))) {
            throw new Error("Cannot insert object without numeric priority.");
        }
        this._array.push(obj);
        this.trickleUp(this._array.length - 1);
    };
    BinaryHeap.prototype.remove = function (obj) {
        if (isNaN(this._evalPriority(obj))) {
            throw new Error('Object invalid.');
        }
        var objID = this._evalObjID(obj);
        var found = undefined;
        for (var i = 0; i < this._array.length; i++) {
            if (this._evalObjID(this._array[i]) === objID) {
                found = this._array[i];
                // we pop the last element
                var last = this._array.pop();
                // we switch the last with the found element
                // and restore the heaps order, but only if the
                // heap size is not down to zero
                if (this.size()) {
                    this._array[i] = last;
                    this.trickleUp(i);
                    this.trickleDown(i);
                }
                return found;
            }
        }
        return found;
    };
    BinaryHeap.prototype.trickleDown = function (i) {
        var parent = this._array[i];
        // run until we manually break
        while (true) {
            var right_child_idx = (i + 1) * 2, left_child_idx = right_child_idx - 1, right_child = this._array[right_child_idx], left_child = this._array[left_child_idx], swap = null;
            // check if left child exists
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
            // we only have to swap one child, doesn't matter which one
            this._array[i] = this._array[swap];
            this._array[swap] = parent;
            i = swap;
        }
    };
    BinaryHeap.prototype.trickleUp = function (i) {
        var child = this._array[i];
        // Can only trickle up from positive levels
        while (i) {
            var parent_idx = Math.floor((i + 1) / 2) - 1, parent = this._array[parent_idx];
            if (this.orderCorrect(parent, child)) {
                break;
            }
            else {
                this._array[parent_idx] = child;
                this._array[i] = parent;
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
    return BinaryHeap;
}());
exports.BinaryHeap = BinaryHeap;
