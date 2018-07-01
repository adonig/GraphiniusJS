/// <reference path="../../typings/tsd.d.ts" />

import * as fs from 'fs';
import * as chai from 'chai';
import * as $DC from '../../src/centralities/BetweennessDC';
import * as $G from '../../src/core/Graph';
import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';
import * as $P from '../../src/search/PFS';
import * as $BH from '../../src/datastructs/binaryHeap';
import * as $CSV from '../../src/io/input/CSVInput';
import * as $JSON from '../../src/io/input/JSONInput';


import { Logger } from '../../src/utils/logger';
const logger = new Logger();

let expect = chai.expect,
  csv: $CSV.ICSVInput = new $CSV.CSVInput(" ", false, false),
  json: $JSON.IJSONInput = new $JSON.JSONInput(true, false, true);

const PATH_PREFIX = "./test/test_data/";
let path_midSizeGraph = PATH_PREFIX + "bernd_ares_intermediate_pos.json";
let path_search_pos = PATH_PREFIX + "search_graph_multiple_SPs_positive.json";
let path_333 = PATH_PREFIX + "DCBrandes/inputs/graph_333_continuous.txt";
let path_10 = PATH_PREFIX + "DCBrandes/inputs/graph_10.txt";
let graph_midSizeGraph = json.readFromJSONFile(path_midSizeGraph);
let graph_search_pos = json.readFromJSONFile(path_search_pos);
let graph_333 = csv.readFromEdgeListFile(path_333);
let graph_10 = csv.readFromEdgeListFile(path_10);

describe('test divide and conquer', () => {

  it('label partition and frontier-boolean in each nodes features', () => {
    let graph = graph_midSizeGraph;
    let skeleton = new $G.BaseGraph("SK");
    let parts = $DC.fakePartition(graph);
    let SNresults = $DC.prepareSuperNode(graph, parts);
    let partitions = SNresults.partitions,
      intraSNedges = SNresults.intraSNedges;
    let result = $DC.Dijkstra_SK(partitions[0], intraSNedges[0], graph);


  });

  it('label partition and frontier-boolean correctly if there is a targetSet', () => {
    let graph = graph_midSizeGraph;
    let skeleton = new $G.BaseGraph("SK");
    let targets = { "1": true, "3": true, "5": true };
    let parts = $DC.fakePartition(graph);
    let SNresults = $DC.prepareSuperNode(graph, parts, targets);
    let partitions = SNresults.partitions,
      intraSNedges = SNresults.intraSNedges;
    let result = $DC.Dijkstra_SK(partitions[0], intraSNedges[0], graph);
    logger.log(result.sigma[52]);
  });

  it('check if BrandesDCmain runs', () => {
    let graph = graph_10;

    let targets = { "1": true, "3": true, "5": true };
    let res = $DC.BrandesDCmain(graph, targets);
    logger.log(res);
    // $DC.BrandesDCmain(graph);
  });

});