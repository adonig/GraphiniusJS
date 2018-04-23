/// <reference path="../../typings/tsd.d.ts" />

import * as fs from 'fs';
import * as chai from 'chai';
import * as $G from '../../src/core/Graph';
import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';
import * as $P from '../../src/search/PFS';
import * as $BH from '../../src/datastructs/binaryHeap';
import * as $CSV from '../../src/io/input/CSVInput';
import * as $JSON from '../../src/io/input/JSONInput';


import {Logger} from '../../src/utils/logger';
const logger = new Logger();

let expect = chai.expect,
    csv: $CSV.ICSVInput = new $CSV.CSVInput(" ", false, false),
    json: $JSON.IJSONInput = new $JSON.JSONInput(true, false, true);

const PATH_PREFIX = "./test/test_data/";
let path_midSizeGraph = PATH_PREFIX + "bernd_ares_intermediate_pos.json";
let graph_midSizeGraph = json.readFromJSONFile(path_midSizeGraph);

describe('test divide and conquer', () => {

  it('first test', () => {
    
});



});