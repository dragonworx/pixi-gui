import { Sprite } from 'pixi.js';
import Sides from './property/sides';
import Position from './property/position';
import Property, { PropertyListener } from './property/property';
import Rectangle from 'src/lib/rectangle';
import Layout from './layout/layout';
import { Fixture, LayoutAlign, LayoutType } from './layout';
import WrapLayout from './layout/wrap';

export default class Box extends Sprite implements PropertyListener {
  protected _anchors: Position;
  protected _x: Property<number>;
  protected _y: Property<number>;
  protected _w: Property<number>;
  protected _h: Property<number>;
  protected _margin: Sides<number>;
  protected _padding: Sides<number>;
  protected _fixture: Sides<number | undefined>;
  protected _layout?: Layout;
  protected alignH: LayoutAlign;
  protected alignV: LayoutAlign;

  constructor() {
    super();

    this._anchors = new Position(this, 'anchors');
    this._x = new Property(this, 'x', 0);
    this._y = new Property(this, 'y', 0);
    this._w = new Property(this, 'width', 0);
    this._h = new Property(this, 'height', 0);
    this._margin = new Sides(this, 'margin', 0);
    this._padding = new Sides(this, 'padding', 0);
    this._fixture = new Sides(this, 'fixture', undefined);
    this.alignH = 'start';
    this.alignV = 'start';
  }

  /** Getters */

  get anchors() {
    return this._anchors;
  }

  get anchorX() {
    return this.anchors.x;
  }

  get anchorY() {
    return this.anchors.y;
  }

  get offsetX() {
    return this.width * this.anchors.x;
  }

  get offsetY() {
    return this.height * this.anchors.y;
  }

  get x() {
    return this._x.value;
  }

  get y() {
    return this._y.value;
  }

  get width() {
    return this._w.value;
  }

  get height() {
    return this._h.value;
  }

  get hasSize() {
    return this.width > 0 && this.height > 0;
  }

  get margin() {
    return this._margin;
  }

  get padding() {
    return this._padding;
  }

  get fixture() {
    return this._fixture;
  }

  get bounds() {
    const {
      x,
      y,
      width,
      height,
      offsetX,
      offsetY,
      fixture,
      margin,
      parentLocalContentBounds,
    } = this;

    const leftOffset =
      (typeof fixture.left === 'number' ? 0 : parentLocalContentBounds.left) -
      offsetX +
      margin.left;

    const topOffset =
      (typeof fixture.top === 'number' ? 0 : parentLocalContentBounds.top) -
      offsetY +
      margin.top;

    return new Rectangle(leftOffset + x, topOffset + y, width, height);
  }

  get marginBounds() {
    const { bounds, margin } = this;
    return new Rectangle(
      bounds.left - margin.left,
      bounds.top - margin.top,
      bounds.width + margin.left + margin.right,
      bounds.height + margin.top + margin.bottom
    );
  }

  get localMarginBounds() {
    const { margin, width, height } = this;
    return new Rectangle(
      -margin.left,
      -margin.top,
      width + margin.left + margin.right,
      height + margin.top + margin.bottom
    );
  }

  get localBounds() {
    return new Rectangle(0, 0, this.width, this.height);
  }

  get localContentBounds() {
    const { width, height, padding } = this;

    return new Rectangle(
      padding.left,
      padding.top,
      width - (padding.left + padding.right),
      height - (padding.top + padding.bottom)
    );
  }

  get parentLocalContentBounds() {
    if (this.parent) {
      return (this.parent as Box).localContentBounds;
    } else {
      return this.localContentBounds;
    }
  }

  get parentLocalBounds() {
    if (this.parent) {
      return (this.parent as Box).localBounds;
    } else {
      return new Rectangle(0, 0, this.width, this.height);
    }
  }

  get hasFixture() {
    const { fixture } = this;
    return (
      fixture.left !== undefined ||
      fixture.top !== undefined ||
      fixture.right !== undefined ||
      fixture.bottom !== undefined
    );
  }

  /** Setters */

  set anchorX(value: number) {
    this.anchors.x = value;
  }

  set anchorY(value: number) {
    this.anchors.y = value;
  }

  set x(value: number) {
    this.transform.position.x = value;
    this._x.set(value);
  }

  set y(value: number) {
    this.transform.position.y = value;
    this._y.set(value);
  }

  set width(value: number) {
    this._w.set(value);
    const width = this.getLocalBounds().width;

    if (width !== 0) {
      this.scale.x = value / width;
    } else {
      this.scale.x = 1;
    }
  }

  set height(value: number) {
    this._h.set(value);
    const height = this.getLocalBounds().height;

    if (height !== 0) {
      this.scale.y = value / height;
    } else {
      this.scale.y = 1;
    }
  }

  set layout(type: LayoutType) {
    if (type === 'wrap') {
      this._layout = new WrapLayout(this);
    } else if (type === 'wrap-reverse') {
      this._layout = new WrapLayout(this, true);
      // } else if (type === 'horizontal') {
      //   this._layout = new HorizontalLayout(this);
      // } else if (type === 'horizontal-reverse') {
      //   this._layout = new HorizontalLayout(this, true);
      // } else if (type === 'vertical') {
      //   this._layout = new VerticalLayout(this);
      // } else if (type === 'vertical-reverse') {
      //   this._layout = new VerticalLayout(this, true);
      // } else {
      throw new Error(`Layout type "${type} is undefined`);
    }
  }

  setAnchor(x: number, y: number) {
    this.anchors.x = x;
    this.anchors.y = y;
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  setSize(w: number, h?: number) {
    this.width = w;
    this.height = h === undefined ? w : h;
  }

  setPadding(value: number) {
    this.padding.left = value;
    this.padding.right = value;
    this.padding.top = value;
    this.padding.bottom = value;
  }

  setMargin(value: number) {
    this.margin.left = value;
    this.margin.right = value;
    this.margin.top = value;
    this.margin.bottom = value;
  }

  setFixture(fixture: Fixture) {
    this.anchors.x = 0;
    this.anchors.y = 0;
    this.fixture.clear();
    if (fixture === 'top') {
      this.fixture.top = 0;
      this.fixture.left = 0;
      this.fixture.right = 1;
    } else if (fixture === 'left') {
      this.fixture.top = 0;
      this.fixture.left = 0;
      this.fixture.bottom = 1;
    } else if (fixture === 'right') {
      this.anchorX = 1;
      this.fixture.top = 0;
      this.fixture.left = 1;
      this.fixture.bottom = 1;
    } else if (fixture === 'bottom') {
      this.anchorY = 1;
      this.fixture.top = 1;
      this.fixture.left = 0;
      this.fixture.right = 1;
    } else if (fixture === 'topLeft') {
      this.fixture.left = 0;
      this.fixture.top = 0;
    } else if (fixture === 'topRight') {
      this.anchorX = 1;
      this.fixture.left = 1;
      this.fixture.top = 0;
    } else if (fixture === 'bottomLeft') {
      this.anchorY = 1;
      this.fixture.left = 0;
      this.fixture.top = 1;
    } else if (fixture === 'bottomRight') {
      this.anchorX = 1;
      this.anchorY = 1;
      this.fixture.left = 1;
      this.fixture.top = 1;
    } else if (fixture === 'topCenter') {
      this.anchorX = 0.5;
      this.fixture.left = 0.5;
      this.fixture.top = 0;
    } else if (fixture === 'bottomCenter') {
      this.anchorX = 0.5;
      this.anchorY = 1;
      this.fixture.left = 0.5;
      this.fixture.top = 1;
    } else if (fixture === 'leftCenter') {
      this.anchorY = 0.5;
      this.fixture.left = 0;
      this.fixture.top = 0.5;
    } else if (fixture === 'rightCenter') {
      this.anchorX = 1;
      this.anchorY = 0.5;
      this.fixture.left = 1;
      this.fixture.top = 0.5;
    } else if (fixture === 'fill') {
      this.fixture.left = 0;
      this.fixture.top = 0;
      this.fixture.right = 1;
      this.fixture.bottom = 1;
    } else if (fixture === 'center') {
      this.anchorX = this.anchorY = 0.5;
      this.fixture.top = 0.5;
      this.fixture.left = 0.5;
    }
  }

  onPropertyChanged(key: string, value: any, oldValue: any) {
    this.emit(`propchange`, key, value, oldValue);
    console.log('onPropertyChanged', key, value, oldValue);
  }

  performLayout() {
    this.applyAnchors();
    this.applyLayout();
  }

  applyAnchors() {
    const {
      fixture,
      parentLocalContentBounds: parentLocalBounds,
      bounds,
    } = this;

    if (fixture.left !== undefined) {
      const { x } = parentLocalBounds.globalPointFromFractional(
        fixture.left,
        0
      );

      bounds.setLeft(x);
      this.x = bounds.left;
    }

    if (fixture.right !== undefined) {
      const { x } = parentLocalBounds.globalPointFromFractional(
        fixture.right,
        0
      );

      bounds.setRight(x);
      this.width = bounds.width;
    }

    if (fixture.top !== undefined) {
      const { y } = parentLocalBounds.globalPointFromFractional(0, fixture.top);

      bounds.setTop(y);
      this.y = bounds.top;
    }

    if (fixture.bottom !== undefined) {
      const { y } = parentLocalBounds.globalPointFromFractional(
        0,
        fixture.bottom
      );

      bounds.setBottom(y);
      this.height = bounds.height;
    }
  }

  applyLayout() {
    const { _layout, alignH: _alignH, alignV: _alignV } = this;

    if (_layout && this.children.length) {
      _layout.apply(_alignH, _alignV);
    }
  }
}
