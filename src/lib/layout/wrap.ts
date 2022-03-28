import { Cell } from 'src/lib/layout';
import Rectangle from 'src/lib/rectangle';
import { Position } from 'src/lib/display/style';
import FlowLayout from 'src/lib/layout/flow';

export default class WrapLayout extends FlowLayout {
  protected wrap(cell: Cell, position: Position) {
    this._x = 0;
    this._y += cell.rect.height;
    position.x = this._x;
    position.y = this._y;
  }

  protected trackCell(cell: Cell, bounds: Rectangle) {
    cell.rect.height = Math.max(cell.rect.height, bounds.height);
    cell.rect.width = Math.max(cell.rect.width, this._x);
  }

  protected isValidBounds(bounds: Rectangle) {
    return bounds.right <= this.contentBounds.right;
  }

  protected move(bounds: Rectangle) {
    this._x += bounds.width;
  }
}
