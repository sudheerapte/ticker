"use strict";

const NodeType = {
  Simple: 'Simple',
  Sequence: 'Sequence',
  Parallel: 'Parallel',
};

/**
   Node IDs are assigned based on position in the tree.
   The root node itself is assigned "0".
   The root node's children are "0.0", "0.1", etc.
   The children of "0.0" are "0.0.0", "0.0.1", etc.
   The tenth child of "0.0" is "0.0.10".

   The "traverseAll" method enumerates all the nodes in
   depth-first fashion.
*/

class Ticker {
  constructor() {
    this._nodes = [ "0", ]; // ID of root node is always "0"
    this._types = { "0": NodeType.Parallel, }; // root node is parallel
    this._children = {}; // number of children
  }

  exists(id) {
    if (typeof id !== 'string') {
      throw(`exists: bad id: ${JSON.stringify(id)}`);
    } else {
      return this._nodes.includes(id);
    }
  }
  getType(id) {
    return this._types[id];
  }
  getNumChildren(id) {
    const n = this._children[id];
    return n ? n : 0;
  }
  getChild(id, i) {
    const n = this._children[id];
    if (n) {
      if (i >= 0 && i < this.getNumChildren(id)) {
        return `${id}.${i}`;
      }
    } else {
      return undefined;
    }
  }
  getParent(id) {
    if (id && typeof id === 'string') {
      if (id.match(/^\d+\.[\d.]+$/)) {
        const m = id.match(/^([\d.]+)\.\d+$/);
        if (m) {
          return m[1];
        } else {
          return "";
        }
      }
    }
  }

  // addNode: add a child to the end; return its new ID
  addNode(nodetype, parent) {
    if (! Object.values(NodeType).includes(nodetype)) {
      throw(`addNode: bad node type ${nodetype}`);
    }
    if (! this.exists(parent)) {
      throw(`addNode: bad parent ${parent}`);
    } else if (this.getType(parent) === NodeType.Simple) {
      throw(`addNode: parent cannot be ${NodeType.Simple}`);
    }
    const children = this.getNumChildren(parent);
    const newNode = `${parent}.${children}`;
    this._types[newNode] = nodetype;
    this._nodes.push(newNode);
    this._children[parent] = this.getNumChildren(parent) + 1;
    return newNode;
  }
  traverseAll(id, arr) {
    arr.push(id);
    if (this.getType(id) !== NodeType.Simple) {
      const children = this.getNumChildren(id);
      for (let c = 0; c<children; c++) {
        this.traverseAll(this.getChild(id, c), arr);
      }
    }
  }
}

function log(msg) {
  console.log(`ticker: ${msg}`);
}

module.exports = new Ticker();
