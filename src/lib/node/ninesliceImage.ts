import { Texture, Resource, NineSlicePlane } from 'pixi.js';
import Image from 'src/lib/node/image';
import { Sides } from 'src/lib/display/style';

const defaultEdge = 5;

export default class NineSliceImage extends Image {
  protected edge: Sides;

  constructor() {
    super();
    this.edge = {
      left: defaultEdge,
      top: defaultEdge,
      right: defaultEdge,
      bottom: defaultEdge,
    };
  }

  createSpriteFromTexture(texture: Texture<Resource>) {
    const { left, top, right, bottom } = this.edge;
    const sprite = new NineSlicePlane(texture, left, top, right, bottom);
    sprite.autoResize = true;
    return sprite;
  }

  get leftEdge() {
    return this.edge.left;
  }

  get topEdge() {
    return this.edge.left;
  }

  get rightEdge() {
    return this.edge.left;
  }

  get bottomEdge() {
    return this.edge.left;
  }

  set leftEdge(value: number) {
    this.edge.left = value;
  }

  set topEdge(value: number) {
    this.edge.top = value;
  }

  set rightEdge(value: number) {
    this.edge.right = value;
  }

  set bottomEdge(value: number) {
    this.edge.bottom = value;
  }

  set edges(value: number) {
    this.edge = {
      left: value,
      top: value,
      right: value,
      bottom: value,
    };
  }
}
