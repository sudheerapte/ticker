"use strict";

const [err] = require('./util.js')
const ticker = require('../ticker.js');

let arr = [];
ticker.traverseAll(1, arr);
if (arr.length !== 1) {
  err(`arr = ${arr}`);
}
// console.log(`arr = ${JSON.stringify(arr)}`);

/**
   construct:
     1
     +-2,     3
       +-4,6  +-5
*/

const parents = {2: 1, 3: 1, 4: 2, 6: 2, 5: 3};

console.log(`adding child 2`);
const two = ticker.addNode('Parallel', 1, 0);
console.log(`two = ${two}`);
err(two === 2);
console.log(`adding child 3`);
const three = ticker.addNode('Parallel', 1, 0);
err(three === 3);
arr = [];
ticker.traverseAll(1, arr);
console.log(`arr = ${JSON.stringify(arr)}`);


for (let i=4; i<7; i++) {
  console.log(`adding child ${i} to ${parents[i]}`);
  const n = ticker.addNode('Simple', parents[i], 0);
  arr = [];
  ticker.traverseAll(1, arr);
  console.log(`arr = ${JSON.stringify(arr)}`);
  if (arr.length !== i) {
    err(`arr = ${JSON.stringify(arr)}`);
  }
}

