"use strict";

const [err] = require('./util.js')
const ticker = require('../ticker.js');

let arr = [];
ticker.traverseAll("0", arr);
if (arr.length !== 1) {
  err(`arr = ${arr}`);
}

/**
   construct:
     0
     +-0.0,            0.1
       +-0.0.0, 0.0.1  +-0.1.0
*/

const two = ticker.addNode('Parallel', "0");
err(two === "0.0");
const three = ticker.addNode('Parallel', "0");
err(three === "0.1");

ticker.addNode('Simple', "0.0");
const c010 = ticker.addNode('Simple', "0.1");
err(c010 === "0.1.0");
ticker.addNode('Simple', "0.0");

arr = [];
ticker.traverseAll("0", arr);
if (arr.length !== 6) {
  err(`bad: ${JSON.stringify(arr)}`);
}

