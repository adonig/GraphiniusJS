/// <reference path="../../typings/tsd.d.ts" />

import * as $G from '../core/Graph';
import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
import * as $P from '../search/PFS';
import * as $BH from '../datastructs/binaryHeap';


function prepareSuperNode(graph: $G.IGraph, partitions: Array<Array<$N.IBaseNode>>) {

//points to check: output of mincutmaxflow? can I use it now?
//arguments of Brandes, and return type

//parts of this function:
//label partition number in the nodes.features
//set a feature frontier and set it false
//loop through edges, check the origin of their start-end nodes
//sort them into two dictionaries, edge ID: object characteristic tuple (sigma, dist)
//for internode edges, add the values on the fly

//then start Brandes on the partitions, take care of touching no more than 2 frontier nodes per path!




}