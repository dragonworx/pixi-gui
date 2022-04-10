export default class Hierarchical {
  _parent: Hierarchical | null;
  _children: Hierarchical[];

  constructor() {
    this._parent = null;
    this._children = [];
  }

  addChild(child: Hierarchical) {
    this._children.push(child);
    child.setParent(this);
  }

  setParent(parent: Hierarchical | null) {
    this._parent = parent;
  }

  removeChild(child: Hierarchical) {
    const { _children } = this;
    const index = _children.indexOf(child);
    if (index === -1) {
      throw new Error('Child not found');
    }
    _children.splice(index, 1);
    child.setParent(null);
  }

  removeFromParent() {
    const { _parent } = this;
    if (_parent === null) {
      throw new Error('Node has no parent');
    }
    _parent.removeChild(this);
  }
}
