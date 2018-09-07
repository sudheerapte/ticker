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
    // ID of root node is always "0"
    // _types contains entries only for Parallel or Sequence nodes.
    this._types = { "0": NodeType.Parallel, }; // root node is parallel
    this._children = {}; // number of children
  }

  exists(id) {
    if (typeof id !== 'string' || ! id.match(/^[\d.]+$/)) {
      throw(`exists: bad id: ${JSON.stringify(id)}`);
    } else {
      const t = this._types[id];
      if (t) { return true;}
      const pId = this.getParent(id);
      const childPart = id.substr(pId.length+1);
      if (childPart.match(/^\d+$/) && this.exists(pId)) {
        const childNum = Number.parseInt(childPart);
        return this._children[pId] > childNum;
      }
    }
    return false;
  }
  getType(id) {
    if (this.exists(id)) {
      const t = this._types[id];
      return t ? t : NodeType.Simple;
    } else {
      throw(`getType: bad id: ${id}`);
    }
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
      throw(`addNode: ${parent}: parent cannot be ${NodeType.Simple}`);
    }
    const children = this.getNumChildren(parent);
    const newNode = `${parent}.${children}`;
    if (nodetype !== NodeType.Simple) {
      this._types[newNode] = nodetype;
    }
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

  swapSubtree(aId, bId) {
    if (! this.exists(aId)) {
      throw(`_swapSubtree: bad aId: ${aId}`);
    }
    if (! this.exists(bId)) {
      throw(`_swapSubtree: bad bId: ${bId}`);
    }
    // Build an array of records
    // {parent: "0.0.4", type: 'Parallel', numChildren: 3},
    // where you want to replace the given parent's info.
    let recs = {};
    Object.keys(this._children).
      filter( p => p.startsWith(aId) ).
      forEach( p => {
        const rec = {
          newParent: `${bId}${p.substr(aId.length)}`,
          type: this._types[p],
          numChildren: this._children[p]
        };
        recs[p] = rec;
      });
    Object.keys(this._children).
      filter( p => p.startsWith(bId) ).
      forEach( p => {
        const rec = {
          newParent: `${aId}${p.substr(bId.length)}`,
          type: this._types[p],
          numChildren: this._children[p]
        };
        recs[p] = rec;
      });
    Object.keys(recs).forEach( p => {
      let tempT = recs[p].type;
      let tempC = recs[p].numChildren;
      let newP = recs[p].newParent;
      if (recs[newP]) {
        this._children[p] = recs[newP].numChildren;
        this._types[p] = recs[newP].type;
      } else {
        this._types[p] = NodeType.Simple;
        delete this._children[p];
      }
      this._children[newP] = tempC;
      this._types[newP] = tempT;
    });
  }
}



function log(msg) {
  console.log(`ticker: ${msg}`);
}

module.exports = new Ticker();
