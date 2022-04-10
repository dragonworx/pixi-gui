import { Sprite, Texture } from 'pixi.js';
import Display from './display';

export default class FillColor extends Display<Sprite> {
  _color: number = 0xffffff;

  protected createDisplayObject(): Sprite {
    return Sprite.from(Texture.WHITE);
  }

  set color(value: number) {
    this._color = value;
    this._displayObject.tint = value;
  }

  get color() {
    return this._color;
  }
}
