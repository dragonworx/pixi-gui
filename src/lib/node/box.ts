import { Geometry } from 'src/lib/display/style';
import Node from 'src/lib/node/node';
import Rectangle from 'src/lib/rectangle';
import Document from 'src/lib/node/document';
import AbstractLayout from 'src/lib/layout/layout';
import { LayoutAlign, LayoutType, Fixture } from 'src/lib/layout/';
import WrapLayout from 'src/lib/layout/wrap';
import HorizontalLayout from 'src/lib/layout/horizontal';
import VerticalLayout from 'src/lib/layout/vertical';
import { GeometrySystem } from 'pixi.js';

export enum GeometryUpdate {
  Anchor = 'Anchor',
  AnchorX = 'AnchorX',
  AnchorY = 'AnchorY',
  Position = 'Position',
  X = 'X',
  Y = 'Y',
  Size = 'Size',
  Width = 'Width',
  Height = 'Height',
  Padding = 'Padding',
  PaddingLeft = 'PaddingLeft',
  PaddingTop = 'PaddingTop',
  PaddingRight = 'PaddingRight',
  PaddingBottom = 'PaddingBottom',
  Margin = 'Margin',
  MarginLeft = 'MarginLeft',
  MarginTop = 'MarginTop',
  MarginRight = 'MarginRight',
  MarginBottom = 'MarginBottom',
  Fixture = 'Fixture',
  FixtureLeft = 'FixtureLeft',
  FixtureTop = 'FixtureTop',
  FixtureRight = 'FixtureRight',
  FixtureBottom = 'FixtureBottom',
}

export default class Box extends Node {
  readonly geometry: Geometry;

  protected _layout?: AbstractLayout;
  protected _alignH: LayoutAlign;
  protected _alignV: LayoutAlign;

  constructor() {
    super();

    this.geometry = this.defaultGeometry();

    this._alignH = 'start';
    this._alignV = 'start';
  }

  defaultGeometry(): Geometry {
    return {
      anchor: { x: 0, y: 0 },
      position: { x: 0, y: 0 },
      size: { width: 0, height: 0 },
      margin: { left: 0, top: 0, right: 0, bottom: 0 },
      padding: { left: 0, top: 0, right: 0, bottom: 0 },
      fixture: {},
    };
  }

  init() {
    super.init();

    this.updateLayout();
  }

  updateLayout() {
    this.applyFixtures();
    this.applyLayout();
  }

  applyFixtures() {
    if (!this.isReady) {
      return;
    }

    const {
      geometry: { fixture },
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

    if (fixture.top !== undefined) {
      const { y } = parentLocalBounds.globalPointFromFractional(0, fixture.top);

      bounds.setTop(y);
      this.y = bounds.top;
    }

    if (fixture.right !== undefined) {
      const { x } = parentLocalBounds.globalPointFromFractional(
        fixture.right,
        0
      );

      bounds.setRight(x);
      this.width = bounds.width;
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
    const { _layout, _alignH, _alignV } = this;

    if (_layout && this.children.length) {
      _layout.apply(_alignH, _alignV);
    }
  }

  protected hasUpdate(updates: GeometryUpdate[], type: GeometryUpdate) {
    return updates.indexOf(type) > -1;
  }

  onGeometryChanged(updates: GeometryUpdate[]) {
    if (this.hasUpdate(updates, GeometryUpdate.Size)) {
      this.forEach<Box>(node => node.updateLayout());
    }

    if (this.hasUpdate(updates, GeometryUpdate.Padding)) {
      this.applyLayout();
    }

    if (this.hasUpdate(updates, GeometryUpdate.Fixture)) {
      this.updateLayout();
    }
  }

  setPosition(x: number, y: number) {
    this.geometry.position.x = x;
    this.geometry.position.y = y;
    this.onGeometryChanged([
      GeometryUpdate.Position,
      GeometryUpdate.X,
      GeometryUpdate.Y,
    ]);
  }

  setSize(width: number, height: number) {
    this.geometry.size.width = width;
    this.geometry.size.height = height;
    this.onGeometryChanged([
      GeometryUpdate.Size,
      GeometryUpdate.Width,
      GeometryUpdate.Height,
    ]);
  }

  /** Getters */
  get bounds() {
    const {
      geometry: {
        position: { x, y },
        size: { width, height },
        margin,
        fixture,
      },
      originX,
      originY,
      parentLocalContentBounds,
    } = this;

    const leftOffset =
      (typeof fixture.left === 'number' ? 0 : parentLocalContentBounds.left) -
      originX +
      margin.left;

    const topOffset =
      (typeof fixture.top === 'number' ? 0 : parentLocalContentBounds.top) -
      originY +
      margin.top;

    return new Rectangle(leftOffset + x, topOffset + y, width, height);
  }

  get marginBounds() {
    const {
      bounds,
      geometry: { margin },
    } = this;
    return new Rectangle(
      bounds.left - margin.left,
      bounds.top - margin.top,
      bounds.width + margin.left + margin.right,
      bounds.height + margin.top + margin.bottom
    );
  }

  get localMarginBounds() {
    const {
      geometry: { margin, size },
    } = this;
    return new Rectangle(
      -margin.left,
      -margin.top,
      size.width + margin.left + margin.right,
      size.height + margin.top + margin.bottom
    );
  }

  get localBounds() {
    return new Rectangle(0, 0, this.width, this.height);
  }

  get localContentBounds() {
    const {
      size: { width, height },
      padding,
    } = this.geometry;

    return new Rectangle(
      padding.left,
      padding.top,
      width - (padding.left + padding.right),
      height - (padding.top + padding.bottom)
    );
  }

  get parentLocalContentBounds() {
    if (this.isDocumentParent) {
      const doc = this.parent as Document;
      return new Rectangle(0, 0, doc.width, doc.height);
    } else {
      return (this.parent as Box).localContentBounds;
    }
  }

  get parentLocalBounds() {
    if (this.isDocumentParent) {
      const doc = this.parent as Document;
      return new Rectangle(0, 0, doc.width, doc.height);
    } else {
      return (this.parent as Box).localBounds;
    }
  }

  get anchorX() {
    return this.geometry.anchor.x;
  }

  get anchorY() {
    return this.geometry.anchor.y;
  }

  get originX() {
    return this.width * this.anchorX;
  }

  get originY() {
    return this.height * this.anchorY;
  }

  get x() {
    return this.geometry.position.x;
  }

  get y() {
    return this.geometry.position.y;
  }

  get hasSize() {
    return this.width > 0 && this.height > 0;
  }

  get width() {
    return this.geometry.size.width;
  }

  get height() {
    return this.geometry.size.height;
  }

  get hasFixture() {
    const { fixture } = this.geometry;
    return (
      fixture.left !== undefined ||
      fixture.top !== undefined ||
      fixture.right !== undefined ||
      fixture.bottom !== undefined
    );
  }

  /** Setters */
  set anchor(value: number) {
    this.anchorX = value;
    this.anchorY = value;
  }

  set anchorX(value: number) {
    const {
      geometry: { anchor },
    } = this;
    if (anchor.x !== value) {
      anchor.x = value;
      this.onGeometryChanged([GeometryUpdate.Anchor, GeometryUpdate.AnchorX]);
    }
  }

  set anchorY(value: number) {
    const {
      geometry: { anchor },
    } = this;
    if (anchor.y !== value) {
      anchor.y = value;
      this.onGeometryChanged([GeometryUpdate.Anchor, GeometryUpdate.AnchorY]);
    }
  }

  set x(value: number) {
    const {
      geometry: { position },
    } = this;
    if (position.x !== value) {
      position.x = value;
      this.onGeometryChanged([GeometryUpdate.Position, GeometryUpdate.X]);
    }
  }

  set y(value: number) {
    const {
      geometry: { position },
    } = this;
    if (position.y !== value) {
      position.y = value;
      this.onGeometryChanged([GeometryUpdate.Position, GeometryUpdate.Y]);
    }
  }

  set width(value: number) {
    const {
      geometry: { size },
    } = this;
    if (size.width !== value) {
      size.width = value;
      this.onGeometryChanged([GeometryUpdate.Size, GeometryUpdate.Width]);
    }
  }

  set height(value: number) {
    const {
      geometry: { size },
    } = this;
    if (size.height !== value) {
      size.height = value;
      this.onGeometryChanged([GeometryUpdate.Size, GeometryUpdate.Height]);
    }
  }

  set padding(value: number) {
    this.paddingLeft = value;
    this.paddingTop = value;
    this.paddingRight = value;
    this.paddingBottom = value;
  }

  set paddingLeft(value: number) {
    const {
      geometry: { padding },
    } = this;
    if (padding.left !== value) {
      padding.left = value;
      this.onGeometryChanged([
        GeometryUpdate.Padding,
        GeometryUpdate.PaddingLeft,
      ]);
    }
  }

  set paddingRight(value: number) {
    const {
      geometry: { padding },
    } = this;
    if (padding.right !== value) {
      padding.right = value;
      this.onGeometryChanged([
        GeometryUpdate.Padding,
        GeometryUpdate.PaddingRight,
      ]);
    }
  }

  set paddingTop(value: number) {
    const {
      geometry: { padding },
    } = this;
    if (padding.top !== value) {
      padding.top = value;
      this.onGeometryChanged([
        GeometryUpdate.Padding,
        GeometryUpdate.PaddingTop,
      ]);
    }
  }

  set paddingBottom(value: number) {
    const {
      geometry: { padding },
    } = this;
    if (padding.bottom !== value) {
      padding.bottom = value;
      this.onGeometryChanged([
        GeometryUpdate.Padding,
        GeometryUpdate.PaddingBottom,
      ]);
    }
  }

  set margin(value: number) {
    this.marginLeft = value;
    this.marginTop = value;
    this.marginRight = value;
    this.marginBottom = value;
  }

  set marginLeft(value: number) {
    const {
      geometry: { margin },
    } = this;
    if (margin.left !== value) {
      margin.left = value;
      this.onGeometryChanged([
        GeometryUpdate.Margin,
        GeometryUpdate.MarginLeft,
      ]);
    }
  }

  set marginRight(value: number) {
    const {
      geometry: { margin },
    } = this;
    if (margin.right !== value) {
      margin.right = value;
      this.onGeometryChanged([
        GeometryUpdate.Margin,
        GeometryUpdate.MarginRight,
      ]);
    }
  }

  set marginTop(value: number) {
    const {
      geometry: { margin },
    } = this;
    if (margin.top !== value) {
      margin.top = value;
      this.onGeometryChanged([GeometryUpdate.Margin, GeometryUpdate.MarginTop]);
    }
  }

  set marginBottom(value: number) {
    const {
      geometry: { margin },
    } = this;
    if (margin.bottom !== value) {
      margin.bottom = value;
      this.onGeometryChanged([
        GeometryUpdate.Margin,
        GeometryUpdate.MarginBottom,
      ]);
    }
  }

  set fixture(fixture: Fixture) {
    const { geometry } = this;
    geometry.anchor.x = 0;
    geometry.anchor.y = 0;
    geometry.fixture = {};
    if (fixture === 'top') {
      this.fixtureTop = 0;
      this.fixtureLeft = 0;
      this.fixtureRight = 1;
    } else if (fixture === 'left') {
      this.fixtureTop = 0;
      this.fixtureLeft = 0;
      this.fixtureBottom = 1;
    } else if (fixture === 'right') {
      this.anchorX = 1;
      this.fixtureTop = 0;
      this.fixtureLeft = 1;
      this.fixtureBottom = 1;
    } else if (fixture === 'bottom') {
      this.anchorY = 1;
      this.fixtureTop = 1;
      this.fixtureLeft = 0;
      this.fixtureRight = 1;
    } else if (fixture === 'topLeft') {
      this.fixtureLeft = 0;
      this.fixtureTop = 0;
    } else if (fixture === 'topRight') {
      this.anchorX = 1;
      this.fixtureLeft = 1;
      this.fixtureTop = 0;
    } else if (fixture === 'bottomLeft') {
      this.anchorY = 1;
      this.fixtureLeft = 0;
      this.fixtureTop = 1;
    } else if (fixture === 'bottomRight') {
      this.anchorX = 1;
      this.anchorY = 1;
      this.fixtureLeft = 1;
      this.fixtureTop = 1;
    } else if (fixture === 'topCenter') {
      this.anchorX = 0.5;
      this.fixtureLeft = 0.5;
      this.fixtureTop = 0;
    } else if (fixture === 'bottomCenter') {
      this.anchorX = 0.5;
      this.anchorY = 1;
      this.fixtureLeft = 0.5;
      this.fixtureTop = 1;
    } else if (fixture === 'leftCenter') {
      this.anchorY = 0.5;
      this.fixtureLeft = 0;
      this.fixtureTop = 0.5;
    } else if (fixture === 'rightCenter') {
      this.anchorX = 1;
      this.anchorY = 0.5;
      this.fixtureLeft = 1;
      this.fixtureTop = 0.5;
    } else if (fixture === 'fill') {
      this.fixtureLeft = 0;
      this.fixtureTop = 0;
      this.fixtureRight = 1;
      this.fixtureBottom = 1;
    } else if (fixture === 'center') {
      this.anchor = 0.5;
      this.fixtureTop = 0.5;
      this.fixtureLeft = 0.5;
    }
  }

  set fixtureTop(value: number) {
    const {
      geometry: { fixture },
    } = this;
    if (fixture.top !== value) {
      fixture.top = value;
      this.onGeometryChanged([
        GeometryUpdate.Fixture,
        GeometryUpdate.FixtureTop,
      ]);
    }
  }

  set fixtureLeft(value: number) {
    const {
      geometry: { fixture },
    } = this;
    if (fixture.left !== value) {
      fixture.left = value;
      this.onGeometryChanged([
        GeometryUpdate.Fixture,
        GeometryUpdate.FixtureLeft,
      ]);
    }
  }

  set fixtureRight(value: number) {
    const {
      geometry: { fixture },
    } = this;
    if (fixture.right !== value) {
      fixture.right = value;
      this.onGeometryChanged([
        GeometryUpdate.Fixture,
        GeometryUpdate.FixtureRight,
      ]);
    }
  }

  set fixtureBottom(value: number) {
    const {
      geometry: { fixture },
    } = this;
    if (fixture.bottom !== value) {
      fixture.bottom = value;
      this.onGeometryChanged([
        GeometryUpdate.Fixture,
        GeometryUpdate.FixtureBottom,
      ]);
    }
  }

  set layout(type: LayoutType) {
    if (type === 'wrap') {
      this._layout = new WrapLayout(this);
    } else if (type === 'wrap-reverse') {
      this._layout = new WrapLayout(this, true);
    } else if (type === 'horizontal') {
      this._layout = new HorizontalLayout(this);
    } else if (type === 'horizontal-reverse') {
      this._layout = new HorizontalLayout(this, true);
    } else if (type === 'vertical') {
      this._layout = new VerticalLayout(this);
    } else if (type === 'vertical-reverse') {
      this._layout = new VerticalLayout(this, true);
    } else {
      throw new Error(`Layout type "${type} is undefined`);
    }

    this.updateLayout();
  }

  set alignH(align: LayoutAlign) {
    this._alignH = align;

    this.applyLayout();
  }

  set alignV(align: LayoutAlign) {
    this._alignV = align;

    this.applyLayout();
  }
}
