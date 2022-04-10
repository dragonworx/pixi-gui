import yoga, { Node } from 'yoga-layout-prebuilt';
import Hierarchical from './hierarchical';

export default class DOMNode extends Hierarchical {
  _layout: yoga.YogaNode;

  constructor() {
    super();
    this._layout = Node.create();
  }

  addChild(child: Hierarchical): void {}
}
