import Box from '../box';
import Rectangle from 'src/lib/rectangle';
import { LayoutAlign } from '.';

export type Cell = {
  rect: Rectangle;
  nodes: Box[];
};

export default abstract class Layout {
  reverse: boolean;
  cells: Cell[];
  x: number;
  y: number;

  constructor(readonly root: Box, reverse: boolean = false) {
    this.cells = [];
    this.x = 0;
    this.y = 0;
    this.reverse = reverse;
  }

  get contentBounds() {
    return this.root.localContentBounds;
  }

  apply(hAlign: LayoutAlign, vAlign: LayoutAlign) {
    this.perform(hAlign, vAlign);
  }

  abstract perform(hAlign: LayoutAlign, vAlign: LayoutAlign): void;
}
