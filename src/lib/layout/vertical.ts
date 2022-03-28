import { Cell, Direction } from 'src/lib/layout';
import HorizontalLayout from 'src/lib/layout/horizontal';
import Rectangle from 'src/lib/rectangle';

export default class VerticalLayout extends HorizontalLayout {
  protected getDirection(): Direction {
    return 'vertical';
  }

  protected trackCell(cell: Cell, bounds: Rectangle) {
    cell.rect.width = Math.max(cell.rect.width, bounds.width);
    cell.rect.height = Math.max(cell.rect.height, this._y);
  }

  protected move(bounds: Rectangle) {
    this._y += bounds.height;
  }
}
