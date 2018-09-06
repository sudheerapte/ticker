"use strict";

const NodeType = {
  Simple: 'Simple',
  Sequence: 'Sequence',
  Parallel: 'Parallel',
};

class Ticker {
  constructor() {
    this._rootNode = 1; // ID of root node is always 1
    this._maxId = 1;  // how many nodes exist
    this._nextActiveNode = 0;
    this._activeNodes = [];
    this._children = { 1: [], }; // children of node ID
    this._types = { 1: NodeType.Parallel, };
  }
  // addNode: index is the child position where to insert
  addNode(nodetype, parent, index) {
    if (! Object.values(NodeType).includes(nodetype)) {
      throw(`addNode: bad node type ${nodetype}`);
    }
    if (! this._maxId >= parent) {
      throw(`addNode: bad parent ${parent}`);
    } else if (this.getType(parent) === NodeType.Simple) {
      throw(`addNode: parent cannot be ${NodeType.Simple}`);
    }
    const n = ++ this._maxId;
    this._types[n] = nodetype;
    if (nodetype !== NodeType.Simple) {
      this._children[n] = [];
    }
    const entry = this._children[parent];
    if (entry && Array.isArray(entry)) {
      if (index >= 0 && index <= entry.length) {
        // this._children[parent].splice(index, 0, n);
        this._children[parent].push(n);
      } else {
        throw(`addNode: bad index ${index}`);
      }
    }
    return n;
  }
  getType(n) {
    return this._types[n];
  }
  getParent(n) {
    return this._children.findIndex( (i,arr) => arr.includes(n) );
  }
  getChildren(n) {
    return this._children[n];
  }
  nextActiveNode() { return this._nextActiveNode; }
  toNextActiveNode() {
    const oldN = this._nextActiveNode;
    this._nextActiveNode = this.findNextActiveNode();
    return oldN;
  }
  findNextActiveNode() {
    let pos = this._activeNodes.indexOf(this._nextActiveNode);
    if (pos < 0) {
      throw(`failed to find index of ${this._nextActiveNode}`);
    }
    pos++;
    if (pos > this._activeNodes.length) {
      pos = 0;
    }
    return this._activeNodes[pos];
  }
  traverseAll(n, arr) {
    arr.push(n);
    if (this.getType(n) !== NodeType.Simple) {
      const children = this.getChildren(n);
      children.forEach( c => {
        this.traverseAll(c, arr);
      });
    }
  }
}

function log(msg) {
  console.log(`ticker: ${msg}`);
}

module.exports = new Ticker();
