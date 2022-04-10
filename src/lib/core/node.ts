import { Container } from 'pixi.js';
import yoga, { Node } from 'yoga-layout-prebuilt';
import DOM from './document';
import Hierarchical from './hierarchical';

export default abstract class DOMNode extends Hierarchical {
  _layout: yoga.YogaNode;
  _document?: DOM;

  constructor() {
    super();

    this._layout = Node.create();
  }

  get document() {
    return this._document;
  }

  setDocument(dom: DOM) {
    this._document = dom;
  }

  getDocument() {
    const { document } = this;
    if (document) {
      return document;
    }
    let node: DOMNode | null = this;
    while (node) {
      if (node.document) {
        return node.document;
      }
      node = node.getParent<DOMNode>();
    }
    throw new Error('Node is not in a document');
  }

  get layout() {
    return this._layout;
  }

  get width() {
    return this._layout.getWidth().value;
  }

  set width(value: number) {
    this._layout.setWidth(value);
    this.onGeometryChanged();
  }

  get height() {
    return this._layout.getHeight().value;
  }

  set height(value: number) {
    this._layout.setHeight(value);
    this.onGeometryChanged();
  }

  onGeometryChanged() {}

  addChild(child: DOMNode): void {
    const { _layout, _children } = this;
    _layout.insertChild(child.layout, _children.length);
    super.addChild(child);
  }
}
