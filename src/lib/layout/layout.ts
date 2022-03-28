import Box from 'src/lib/node/box';
import { LayoutAlign, Cell } from 'src/lib/layout';

export default abstract class AbstractLayout {
  reverse: boolean;
  cells: Cell[];

  protected _x: number;
  protected _y: number;

  constructor(readonly root: Box, reverse: boolean = false) {
    this.cells = [];
    this.reverse = reverse;
    this._x = 0;
    this._y = 0;
  }

  get contentBounds() {
    return this.root.localContentBounds;
  }

  get className() {
    return (this as any).__proto__.constructor.name;
  }

  apply(hAlign: LayoutAlign, vAlign: LayoutAlign) {
    this.perform(hAlign, vAlign);
  }

  protected abstract perform(hAlign: LayoutAlign, vAlign: LayoutAlign): void;
}
