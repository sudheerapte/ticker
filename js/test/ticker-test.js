"use strict";

const [err] = require('./util.js')
const ticker = require('../ticker.js');

let arr = [];
ticker.traverseAll(1, arr);
if (arr.length !== 1) {
  err(`arr = ${arr}`);
}
// console.log(`arr = ${JSON.stringify(arr)}`);

arr = [];
const n = ticker.addNode('Simple', 1, 0);
ticker.traverseAll(1, arr);
if (arr.length !== 2) {
  err(`arr = ${JSON.stringify(arr)}`);
}
