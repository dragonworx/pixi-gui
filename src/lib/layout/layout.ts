import Box from 'src/lib/node/box';
import Rectangle from 'src/lib/rectangle';
import { log } from '../log';

export type LayoutType =
  | 'wrap'
  | 'wrap-reverse'
  | 'vertical'
  | 'vertical-reverse'
  | 'horizontal'
  | 'horizontal-reverse';

export type LayoutAlign = 'start' | 'center' | 'end';

export type Orientation = 'vertical' | 'horizontal';

export type Fixture =
  | 'left'
  | 'top'
  | 'right'
  | 'bottom'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'topCenter'
  | 'bottomCenter'
  | 'leftCenter'
  | 'rightCenter'
  | 'fill'
  | 'center';

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

  toString() {
    return (this as any).__proto__.constructor.name;
  }

  apply(hAlign: LayoutAlign, vAlign: LayoutAlign) {
    log(this, 'apply');
    this.perform(hAlign, vAlign);
  }

  abstract perform(hAlign: LayoutAlign, vAlign: LayoutAlign): void;
}
