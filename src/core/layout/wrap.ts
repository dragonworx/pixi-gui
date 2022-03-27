import Rectangle from 'src/lib/rectangle';
import FlowLayout from './flow';
import { Cell } from './layout';

export default class WrapLayout extends FlowLayout {
  wrap(cell: Cell, position: { x: number; y: number }) {
    this.x = 0;
    this.y += cell.rect.height;
    position.x = this.x;
    position.y = this.y;
  }

  trackCell(cell: Cell, bounds: Rectangle) {
    cell.rect.height = Math.max(cell.rect.height, bounds.height);
    cell.rect.width = Math.max(cell.rect.width, this.x);
  }

  isValidBounds(bounds: Rectangle) {
    return bounds.right <= this.contentBounds.right;
  }

  move(bounds: Rectangle) {
    this.x += bounds.width;
  }
}
