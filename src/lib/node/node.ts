import Document from 'src/lib/node/document';
import { Setter } from 'src/lib/parser';
import { log } from 'src/lib/log';

let nextId = 0;

export type NodeParent = Node | Document | undefined;

export default class Node {
  children: Node[];
  parent: NodeParent;

  private _id: string;

  static setters(): Setter[] {
    return [
      {
        name: 'id',
        type: 'string',
      },
      {
        name: 'width',
        type: 'number',
      },
      {
        name: 'height',
        type: 'number',
      },
    ];
  }

  constructor() {
    this._id = String(nextId++);
    this.children = [];
  }

  shouldInitBeforeChildren() {
    return true;
  }

  init() {
    if (this.shouldInitBeforeChildren()) {
      log(this, 'init');
      this.onInit();
      this.children.forEach(node => node.init());
    } else {
      this.children.forEach(node => node.init());
      log(this, 'init');
      this.onInit();
    }
    log(this, 'init-end');
  }

  onInit() {}

  setParent(node: Node) {
    this.parent = node;
    node.children.push(this);
  }

  removeFromParent() {
    if (this.parent) {
      const index = this.parent.children.indexOf(this);
      this.parent.children.splice(index, 1);
      delete this.parent;
    } else {
      throw new Error('Cannot remove node from undefined parent');
    }
  }

  addChild(node: Node) {
    node.setParent(this);
    node.init();
  }

  removeChild(node: Node) {
    if (node.parent === this) {
      node.removeFromParent();
    } else {
      throw new Error('Cannot remove node which is not a child');
    }
  }

  walk<T extends Node>(fn: (node: T) => void) {
    this.children.forEach(child => {
      fn(child as T);
      child.walk(fn);
    });
    return this;
  }

  filter<T extends Node>(fn: (node: T) => boolean) {
    const nodes: Node[] = [];
    this.walk(node => (fn(node as T) ? nodes.push(node) : void 0));
    return nodes;
  }

  forEach<T extends Node>(fn: (node: T, index: number) => void) {
    this.children.forEach((node, i) => fn(node as T, i));
  }

  map<T extends Node>(fn: (node: T, index: number) => void) {
    return this.children.filter((node, i) => fn(node as T, i));
  }

  getNodeById<T extends Node>(id: string) {
    const nodes = this.filter(node => node.id === id);
    return nodes[0] as T;
  }

  is(className: string) {
    return this.className === className;
  }

  toString() {
    return this.id;
  }

  /** Getters */

  get className() {
    return (this as any).__proto__.constructor.name;
  }

  get id() {
    return this._id;
  }

  get width() {
    return 0;
  }

  get height() {
    return 0;
  }

  get isDocumentParent() {
    if (!this.hasDocument) {
      return false;
    }
    return this.parent === this.document;
  }

  get hasDocument() {
    try {
      return !!this.document;
    } catch (e) {
      return false;
    }
  }

  get hasParent() {
    return this.parent !== undefined;
  }

  get document(): Document {
    if (this instanceof Document) {
      return this;
    }

    if (this.parent) {
      let parent: NodeParent = this.parent;
      while (parent !== undefined) {
        if (parent instanceof Document) {
          return parent;
        }
        parent = parent.parent;
      }
    }

    throw new Error('Document not found');
  }

  /** Setters */
  set id(value: string) {
    this._id = value;
  }
}
