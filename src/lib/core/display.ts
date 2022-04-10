import { Container, DisplayObject } from 'pixi.js';
import DOMNode from './node';

export default abstract class Display<T extends DisplayObject> extends DOMNode {
  _displayObject: T;

  constructor() {
    super();

    this._displayObject = this.createDisplayObject();
  }

  protected abstract createDisplayObject(): T;

  getDisplayObject<T extends DisplayObject = DisplayObject>() {
    return this._displayObject as unknown as T;
  }
}
