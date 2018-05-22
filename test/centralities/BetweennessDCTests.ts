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
let graph_midSizeGraph = json.readFromJSONFile(path_midSizeGraph);
let graph_search_pos = json.readFromJSONFile(path_search_pos);

describe('test divide and conquer', () => {

  it('label partition and frontier-boolean in each nodes features', () => {
    let graph = graph_midSizeGraph;
    let skeleton= new $G.BaseGraph("SK");
    let parts = $DC.fakePartition(graph);
    let SNresults = $DC.prepareSuperNode(graph, skeleton, parts);
    let partitions = SNresults.partitions,
      intraSNedges = SNresults.intraSNedges;
    let result = $DC.Dijkstra_SK(partitions[0], intraSNedges[0], graph);
    

  });

  it('label partition and frontier-boolean correctly if there are favorite nodes', () => {
    let graph = graph_midSizeGraph;
    let skeleton= new $G.BaseGraph("SK");
    let targets = { "1": true, "3": true, "5": true };
    let parts = $DC.fakePartition(graph);
    let SNresults = $DC.prepareSuperNode(graph, skeleton, parts, targets);
    let partitions = SNresults.partitions,
      intraSNedges = SNresults.intraSNedges;
    let result = $DC.Dijkstra_SK(partitions[0], intraSNedges[0], graph);
    console.log(result.sigma[52]);


  });

  it.only('check if BrandesDCmain runs', () => {
    let graph = graph_midSizeGraph;
    
    let targets = { "1": true, "3": true, "5": true };
    $DC.BrandesDCmain(graph, targets);


  });

});