import HorizontalLayout from 'src/lib/layout/horizontal';
import { Direction } from 'src/lib/layout';
import VerticalLayout from 'src/lib/layout/vertical';
import DisplayContainer from 'src/lib/node/displayContainer';
// import DisplayContainer from 'src/lib/node/debugSurface';

export default class Block extends DisplayContainer {
  protected _direction: Direction;
  protected _reverse: boolean;

  constructor() {
    super();

    this._direction = 'horizontal';
    this._reverse = false;
  }

  protected shouldInitBeforeChildren() {
    return false;
  }

  init() {
    this._layout =
      this._direction === 'horizontal'
        ? new HorizontalLayout(this, this._reverse)
        : new VerticalLayout(this, this._reverse);

    super.init();
  }

  updateLayout(): void {
    const { _layout, _alignH, _alignV } = this;

    if (_layout && this.children.length) {
      const {
        geometry: { size },
      } = this;

      _layout.apply(_alignH, _alignV);

      size.width = _layout!.cells[0].rect.width;
      size.height = _layout!.cells[0].rect.height;

      this.applyFixtures();

      this.forEach(node => {
        if (node instanceof DisplayContainer) {
          node.updateLayout();
        }
      });
    }
  }

  get layout() {
    return this._direction;
  }

  get reverse() {
    return this._reverse;
  }

  set layout(direction: Direction) {
    this._direction = direction;
  }

  set reverse(reverse: boolean) {
    this._reverse = reverse;

    if (this._layout) {
      this._layout.reverse = reverse;
    }
  }
}
