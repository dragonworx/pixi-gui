import { Application } from 'pixi.js';
import Element from './element';
import yoga from 'yoga-layout-prebuilt';

export default class DOM {
  _root: Element;
  _width: number = 0;
  _height: number = 0;

  constructor(readonly app: Application) {
    const { width, height } = app.view;

    this._width = width;
    this._height = height;

    const root = (this._root = new Element({
      id: 'root',
      backgroundColor: 0xff0000,
      width,
      height,
    }));
    root.setDocument(this);
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
