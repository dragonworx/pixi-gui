import Box, { GeometryUpdate } from 'src/lib/node/box';
import Rectangle from 'src/lib/rectangle';
import { Position } from 'src/lib/display/style';
import AbstractLayout from 'src/lib/layout/layout';
import { Cell, LayoutAlign, Direction } from 'src/lib/layout';

export default abstract class FlowLayout extends AbstractLayout {
  protected _x: number;
  protected _y: number;

  constructor(readonly root: Box, reverse: boolean = false) {
    super(root);

    this.reverse = reverse;
    this._x = 0;
    this._y = 0;
  }

  protected getDirection(): Direction {
    return 'horizontal';
  }

  protected perform(hAlign: LayoutAlign, vAlign: LayoutAlign) {
    const { root, contentBounds, cells: cells } = this;

    const left = contentBounds.left;
    const top = contentBounds.top;

    this._x = 0;
    this._y = 0;

    cells.length = 0;
    let cell: Cell | undefined;

    const newCell = () => {
      const row = {
        rect: new Rectangle(this._x + left, this._y + top, 0, 0),
        nodes: [],
      };
      cells.push(row);
      return row;
    };

    const children = [...root.children] as Box[];

    if (this.reverse) {
      children.reverse();
    }

    children.forEach(node => {
      // if (node.hasFixture) {
      //   return;
      // }

      const {
        geometry: { position },
      } = node;

      if (!cell) {
        cell = newCell();
      }

      const anchoralBounds = node.bounds;

      position.x = this._x;
      position.y = this._y;

      let bounds = node.marginBounds;

      if (this.isValidBounds(bounds)) {
        this.move(bounds);
      } else {
        this.wrap(cell, position);
        cell = newCell();
        bounds = node.marginBounds;
        this.move(bounds);
      }

      if (cell) {
        this.trackCell(cell, bounds);
        cell.nodes.push(node);
        if (!node.bounds.equals(anchoralBounds)) {
          node.onGeometryChanged([GeometryUpdate.Position]);
        }
      }
    });

    cells.forEach(cell => {
      this.alignCell(cell, hAlign, vAlign, this.getDirection());
      cell.nodes.forEach(node => node.applyFixtures());
    });
  }

  protected alignCell(
    cell: Cell,
    hAlign: LayoutAlign,
    vAlign: LayoutAlign,
    direction: 'horizontal' | 'vertical'
  ) {
    const { contentBounds } = this;
    const { rect, nodes } = cell;

    if (direction === 'horizontal') {
      let offset = 0;

      nodes.forEach(node => {
        const bounds = node.marginBounds;

        if (vAlign === 'center') {
          node.y = node.y + (rect.height - bounds.height) * 0.5;
        } else if (vAlign === 'end') {
          node.y = node.y + rect.height - bounds.height;
        }

        if (hAlign === 'center') {
          offset = (contentBounds.width - rect.width) * 0.5;
          node.x = node.x + offset;
        } else if (hAlign === 'end') {
          offset = contentBounds.width - rect.width;
          node.x = node.x + offset;
        }
      });

      rect.translate(offset, 0);
    } else {
      let offset = 0;

      nodes.forEach(node => {
        const bounds = node.marginBounds;

        if (hAlign === 'center') {
          node.x = node.x + (rect.width - bounds.width) * 0.5;
        } else if (hAlign === 'end') {
          node.x = node.x + rect.width - bounds.width;
        }

        if (vAlign === 'center') {
          offset = (contentBounds.height - rect.height) * 0.5;
          node.y = node.y + offset;
        } else if (vAlign === 'end') {
          offset = contentBounds.height - rect.height;
          node.y = node.y + offset;
        }
      });

      rect.translate(offset, 0);
    }
  }

  protected abstract wrap(cell: Cell, position: Position): void;
  protected abstract trackCell(cell: Cell, bounds: Rectangle): void;
  protected abstract isValidBounds(bounds: Rectangle): boolean;
  protected abstract move(bounds: Rectangle): void;
}
