import Box, { GeometryUpdate } from 'src/lib/node/box';
import Rectangle from 'src/lib/rectangle';
import { Position } from 'src/lib/display/style';
import Layout, { Cell, LayoutAlign, Orientation } from 'src/lib/layout/layout';

export default abstract class FlowLayout extends Layout {
  reverse: boolean;
  x: number;
  y: number;

  constructor(readonly root: Box, reverse: boolean = false) {
    super(root);

    this.x = 0;
    this.y = 0;
    this.reverse = reverse;
  }

  getOrientation(): Orientation {
    return 'horizontal';
  }

  perform(hAlign: LayoutAlign, vAlign: LayoutAlign) {
    const { root, contentBounds, cells } = this;

    const left = contentBounds.left;
    const top = contentBounds.top;

    this.x = 0;
    this.y = 0;

    cells.length = 0;
    let cell: Cell | undefined;

    const newCell = () => {
      const row = {
        rect: new Rectangle(this.x + left, this.y + top, 0, 0),
        nodes: [],
      };
      cells.push(row);
      return row;
    };

    // layout
    const children = [...root.children] as Box[];

    if (this.reverse) {
      children.reverse();
    }

    children.forEach(node => {
      if (node.isAnchored) {
        return;
      }

      const {
        geometry: { position },
      } = node;

      if (!cell) {
        cell = newCell();
      }

      const originalBounds = node.bounds;

      position.x = this.x;
      position.y = this.y;

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
        if (!node.bounds.equals(originalBounds)) {
          node.onGeometryChanged([GeometryUpdate.Position]);
        }
      }
    });

    // align
    cells.forEach(cell =>
      this.alignCell(cell, hAlign, vAlign, this.getOrientation())
    );
  }

  abstract wrap(cell: Cell, position: Position): void;

  abstract trackCell(cell: Cell, bounds: Rectangle): void;

  abstract isValidBounds(bounds: Rectangle): boolean;

  abstract move(bounds: Rectangle): void;

  alignCell(
    cell: Cell,
    hAlign: LayoutAlign,
    vAlign: LayoutAlign,
    orientation: 'horizontal' | 'vertical'
  ) {
    const { contentBounds } = this;
    const { rect, nodes } = cell;

    if (orientation === 'horizontal') {
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
}
