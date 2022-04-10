import { Container, DisplayObject } from 'pixi.js';
import Layout from './layout';

export default abstract class Display<T extends DisplayObject> extends Layout {
  _displayObject: T;

  constructor() {
    super();

    this._displayObject = this.createDisplayObject();
  }

  protected abstract createDisplayObject(): T;

  getDisplayObject<T extends DisplayObject = DisplayObject>() {
    return this._displayObject as unknown as T;
  }

  update(): void {
    const { _displayObject, _layout } = this;
    const { left, top, width, height } = _layout.getComputedLayout();
    _displayObject.x = left;
    _displayObject.y = top;
    if (_displayObject instanceof Container) {
      _displayObject.width = width;
      _displayObject.height = height;
    }
  }
}
