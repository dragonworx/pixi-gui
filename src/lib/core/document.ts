import { Application } from 'pixi.js';
import Container from './container';

export default class DOM {
  _root: Container;
  _width: number = 0;
  _height: number = 0;

  constructor(readonly app: Application) {
    const { width, height } = app.view;
    this._width = width;
    this._height = height;

    const root = (this._root = new Container());
    root.width = width;
    root.height = height;
    root.setDocument(this);
  }

  get root() {
    return this._root;
  }

  get stage() {
    return this.app.stage;
  }
}
