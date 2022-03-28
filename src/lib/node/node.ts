import { EventEmitter } from 'eventemitter3';
import Document from 'src/lib/node/document';
import { log } from 'src/lib/log';

let nextId = 0;

export type NodeParent = Node | Document | undefined;

export default class Node extends EventEmitter {
  parent: NodeParent;
  children: Node[];

  protected _id: string;
  protected _hasInit: boolean;

  constructor() {
    super();

    this._id = String(nextId++);
    this._hasInit = false;
    this.children = [];
  }

  shouldInitBeforeChildren() {
    return true;
  }

  init() {
    this._hasInit = true;
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

  addChild(node: Node, autoInitialise: boolean = true) {
    node.setParent(this);
    if (autoInitialise) {
      node.init();
    }
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

  set width(value: number) {
    // do nothing, for subclasses
  }

  set height(value: number) {
    // do nothing, for subclasses
  }

  set size(value: number) {
    this.width = value;
    this.height = value;
  }
}
