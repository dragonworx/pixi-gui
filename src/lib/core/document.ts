import { Application } from 'pixi.js';
import Element from './element';

export default class Document {
  _root: Element;
  _width: number = 0;
  _height: number = 0;

  constructor(readonly app: Application) {
    const { width, height } = app.view;

    this._width = width;
    this._height = height;

    const root = (this._root = new Element({
      id: 'root',
      backgroundColor: -1,
      width,
      height,
    }));
    root.setAsRoot(this);
    root.init();
  }

  get root() {
    return this._root;
  }

  get stage() {
    return this.app.stage;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }
}
