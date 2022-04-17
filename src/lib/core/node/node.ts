import Document from '../document';

export interface WithInit {
  hasInit: boolean;
}

export default class Node {
  _parent: Node | null;
  _children: Node[];

  constructor() {
    this._parent = null;
    this._children = [];
  }

  getParent<T>() {
    return this._parent as unknown as T;
  }

  get children() {
    return this._children;
  }

  addChild(child: Node) {
    this._children.push(child);
    child.setParent(this);
    child.onAddedToParent(this);
    child.init();
  }

  onAddedToParent(parent: Node) {}
  onRemovedFromParent(parent: Node) {}

  setParent(parent: Node | null) {
    this._parent = parent;
  }

  removeChild(child: Node) {
    const { _children } = this;
    const index = _children.indexOf(child);
    if (index === -1) {
      throw new Error('Child not found');
    }
    _children.splice(index, 1);
    child.setParent(null);
    child.onRemovedFromParent(this);
  }

  removeFromParent() {
    const { _parent } = this;
    if (_parent === null) {
      throw new Error('Node has no parent');
    }
    _parent.removeChild(this);
  }

  _document?: Document;
  _hasInit: boolean = false;

  get document() {
    return this._document;
  }

  get hasInit() {
    return this._hasInit;
  }

  setAsRoot(document: Document) {
    this._document = document;
  }

  getDocument() {
    const { document } = this;

    if (document) {
      return document;
    }

    let node: Node | null = this;

    while (node) {
      if (node.document) {
        return node.document;
      }
      node = node.getParent<Node>();
    }

    throw new Error('Node is not in any document');
  }

  init() {
    this._hasInit = true;
  }
}
