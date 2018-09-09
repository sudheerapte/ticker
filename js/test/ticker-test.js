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
// console.log(arr);
if (arr.length !== 6) {
  err(`bad: ${JSON.stringify(arr)}`);
}

if (ticker.exists("0.0.2")) {
  err("0.0.2 exists!");
}

// Try adding a node to a Simple parent

let simpleThrown = false;
try {
  ticker.addNode('Simple', "0.0.1");
} catch (e) {
  if (e.match(/Simple/)) {
    simpleThrown = true;
  }
} finally {
  if (! simpleThrown) {
    err("Simple parent addNode succeeded!");
  }
}

// Try adding a node to a nonexistent parent

let nonexistentThrown = false;
try {
  ticker.addNode('Simple', "0.0.2");
} catch (e) {
  if (e.match(/bad\s+parent/)) {
    nonexistentThrown = true;
  } else {
    err(e);
  }
} finally {
  if (! nonexistentThrown) {
    err("Nonexistent parent addNode succeeded!");
  }
}

/**
   swapping 0.1.0 with 0.0:
   new situation:
     0
     +-0.0,        0.1
                    +-0.1.0
                        +-0.1.0.0, 0.1.0.1 
*/

ticker.swapSubtree("0.1.0", "0.0");

if (! ticker.exists("0.1.0.1")) {
  err("0.1.0.1 should exist!");
}
if (ticker.exists("0.0.1")) {
  err("0.0.1 should not exist!");
}

// Swap them back the way they were

ticker.swapSubtree("0.0", "0.1.0");

if (! ticker.exists("0.0.1")) {
  err("0.0.1 should exist!");
}
if (ticker.exists("0.1.0.1")) {
  err("0.1.0.1 should not exist!");
}

let arrFinal = [];
ticker.traverseAll("0", arrFinal);
// console.log(`arr final = ${JSON.stringify(arrFinal)}`);

if (! equalArrays(arr, arrFinal)) {
  err(`arr !== arrFinal!`);
}

function equalArrays(a, b) {
  a.forEach( (ea, i) => {
    if (ea !== b[i]) {
      err(`equalArrays: ${ea} !== ${b[i]}`);
    }
  });
  return true;
}
