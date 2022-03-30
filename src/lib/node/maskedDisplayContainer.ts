import { Graphics } from 'pixi.js';
import { GeometryUpdate } from 'src/lib/node/box';
import DisplayContainer from 'src/lib/node/displayContainer';

export default class MaskedDisplayContainer extends DisplayContainer {
  protected mask: Graphics;
  protected _clip: boolean;

  constructor() {
    super();

    this.mask = new Graphics();
    this._clip = false;
  }

  protected updateMaskSize() {
    const { mask: mask } = this;

    mask.clear();
    mask.beginFill(0xffffff);
    mask.drawRect(0, 0, this.width, this.height);
    mask.endFill();
  }

  protected updateContainerPosition() {
    if (!this.isReady) {
      return;
    }

    const { bounds } = this;

    this.container.x = bounds.left;
    this.container.y = bounds.top;
  }

  init() {
    super.init();

    if (this._clip) {
      this.clip = true;
    }

    this.updateMaskSize();
  }

  onGeometryChanged(updateType: GeometryUpdate[]) {
    super.onGeometryChanged(updateType);

    if (
      updateType.indexOf(GeometryUpdate.Size) > -1 ||
      updateType.indexOf(GeometryUpdate.Fixture) > -1
    ) {
      this.updateMaskSize();
    }
  }

  get clip() {
    return this._clip;
  }

  set clip(shouldClip: boolean) {
    // todo: fix up
    const { container, mask: mask } = this;
    this._clip = shouldClip;
    if (shouldClip) {
      this.updateMaskSize();
      container.addChild(mask);
      container.mask = mask;
    } else {
      if (mask.parent === container) {
        container.removeChild(mask);
        container.mask = null;
      }
    }
  }
}
