import Rectangle from 'src/lib/rectangle';
import { Orientation } from '.';
import HorizontalLayout from './horizontal';
import { Cell } from './layout';

export default class VerticalLayout extends HorizontalLayout {
  getOrientation(): Orientation {
    return 'vertical';
  }

  trackCell(cell: Cell, bounds: Rectangle) {
    cell.rect.width = Math.max(cell.rect.width, bounds.width);
    cell.rect.height = Math.max(cell.rect.height, this.y);
  }

  move(bounds: Rectangle) {
    this.y += bounds.height;
  }
}
