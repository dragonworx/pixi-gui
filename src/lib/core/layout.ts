import yoga, { EDGE_LEFT, EDGE_TOP, Node } from 'yoga-layout-prebuilt';
import DOMNode from './node';

export default abstract class Layout extends DOMNode {
  _layout: yoga.YogaNode;

  constructor() {
    super();

    this._layout = Node.create();
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

  get x() {
    return this._layout.getPosition(EDGE_LEFT).value;
  }

  get y() {
    return this._layout.getPosition(EDGE_TOP).value;
  }

  set x(value: number) {
    this._layout.setPosition(EDGE_LEFT, value);
    this.onGeometryChanged();
  }

  set y(value: number) {
    this._layout.setPosition(EDGE_TOP, value);
    this.onGeometryChanged();
  }

  onGeometryChanged() {
    this._layout.calculateLayout();
    this.update();
  }

  addChild(child: Layout): void {
    const { _layout, _children } = this;
    _layout.insertChild(child.layout, _children.length);
    super.addChild(child);
  }

  update() {}
}
