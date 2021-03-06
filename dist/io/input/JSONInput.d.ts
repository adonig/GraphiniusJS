/// <reference path="../../../typings/tsd.d.ts" />
import * as $G from '../../core/Graph';
import * as $R from '../../utils/remoteUtils';
export interface JSONEdge {
    to: string;
    directed?: string;
    weight?: string;
    type?: string;
}
export interface JSONNode {
    edges: Array<JSONEdge>;
    coords?: {
        [key: string]: Number;
    };
    features?: {
        [key: string]: any;
    };
}
export interface JSONGraph {
    name: string;
    nodes: number;
    edges: number;
    data: {
        [key: string]: JSONNode;
    };
}
export interface IJSONInput {
    _explicit_direction: boolean;
    _direction: boolean;
    _weighted_mode: boolean;
    readFromJSONFile(file: string): $G.IGraph;
    readFromJSON(json: {}): $G.IGraph;
    readFromJSONURL(config: $R.RequestConfig, cb: Function): void;
}
declare class JSONInput implements IJSONInput {
    _explicit_direction: boolean;
    _direction: boolean;
    _weighted_mode: boolean;
    constructor(_explicit_direction?: boolean, _direction?: boolean, _weighted_mode?: boolean);
    readFromJSONFile(filepath: string): $G.IGraph;
    readFromJSONURL(config: $R.RequestConfig, cb: Function): void;
    /**
     * In this case, there is one great difference to the CSV edge list cases:
     * If you don't explicitly define a directed edge, it will simply
     * instantiate an undirected one
     * we'll leave that for now, as we will produce apt JSON sources later anyways...
     */
    readFromJSON(json: JSONGraph): $G.IGraph;
    /**
     * Infinity & -Infinity cases are redundant, as JavaScript
     * handles them correctly anyways (for now)
     * @param edge_input
     */
    private handleEdgeWeights(edge_input);
    private checkNodeEnvironment();
}
export { JSONInput };
