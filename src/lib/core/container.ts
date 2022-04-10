import { Container as PIXIContainer } from 'pixi.js';
import document from './document';
import Display from './display';
import node from './node';

export default class Container extends Display<PIXIContainer> {
  protected createDisplayObject(): PIXIContainer {
    return new PIXIContainer();
  }

  setDocument(dom: document): void {
    super.setDocument(dom);

    dom.stage.addChild(this._displayObject);
  }

  addChild(child: node): void {
    if (child instanceof Display) {
      this._displayObject.addChild(child._displayObject);
    }
  }
}
