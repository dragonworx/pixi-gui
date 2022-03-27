import HorizontalLayout from 'src/lib/layout/horizontal';
import { Orientation } from 'src/lib/layout/layout';
import VerticalLayout from 'src/lib/layout/vertical';
import BoxContainer from 'src/lib/node/container';
import { log } from '../log';

export default class Block extends BoxContainer {
  _orientation: Orientation;
  _reverse: boolean;

  constructor() {
    super();

    this._orientation = 'horizontal';
    this._reverse = false;
  }

  shouldInitBeforeChildren() {
    return false;
  }

  onInit() {
    this._layout =
      this._orientation === 'horizontal'
        ? new HorizontalLayout(this, this._reverse)
        : new VerticalLayout(this, this._reverse);

    super.onInit();
  }

  performLayout(): void {
    const { _layout, _alignH, _alignV } = this;

    if (_layout && this.children.length) {
      log(this, 'Block.performLayout');

      const {
        geometry: { size },
      } = this;

      _layout.apply(_alignH, _alignV);

      size.width = _layout!.cells[0].rect.width;
      size.height = _layout!.cells[0].rect.height;

      this.applyAnchors();
      // this.render();
    }
  }

  /** Getters */
  get layout() {
    return this._orientation;
  }

  get reverse() {
    return this._reverse;
  }

  /** Setters */
  set layout(orientation: Orientation) {
    this._orientation = orientation;
  }

  set reverse(reverse: boolean) {
    this._reverse = reverse;
    if (this._layout) {
      this._layout.reverse = reverse;
    }
  }
}
