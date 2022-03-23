import { Cell, Orientation } from 'src/lib/layout/layout';
import HorizontalLayout from 'src/lib/layout/horizontal';
import Rectangle from 'src/lib/rectangle';

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
