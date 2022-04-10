import { Application } from 'pixi.js';
import DOMNode from './domNode';

export default class DOM {
  _root: DOMNode;
  _width: number = 0;
  _height: number = 0;

  constructor(readonly app: Application) {
    this._root = new DOMNode();
  }
}
