import { Container, Graphics } from 'pixi.js';
import Box, { GeometryUpdate } from 'src/lib/node/box';

export default class DisplayContainer extends Box {
  container: Container;

  protected mask: Graphics;
  protected _clip: boolean;

  constructor() {
    super();

    this.container = new Container();

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

    this.parentDisplayContainer.addChild(this.container);

    this.updateContainerPosition();
    this.updateMaskSize();
  }

  removeFromParent(): void {
    this.parentDisplayContainer.removeChild(this.container);
    super.removeFromParent();
  }

  onGeometryChanged(updateType: GeometryUpdate[]) {
    super.onGeometryChanged(updateType);

    if (!this.isReady) {
      return;
    }

    if (
      updateType.indexOf(GeometryUpdate.Size) > -1 ||
      updateType.indexOf(GeometryUpdate.Fixture) > -1
    ) {
      this.updateMaskSize();
    }

    if (updateType.indexOf(GeometryUpdate.Position) > -1) {
      this.updateContainerPosition();
    }
  }

  get clip() {
    return this._clip;
  }

  get parentDisplayContainer() {
    if (this.isDocumentParent) {
      return this.document.stage;
    } else {
      if (this.parent && 'container' in this.parent) {
        return (this.parent as any).container;
      }
      throw new Error(
        'Cannot get parent display container, parent does not have a .container'
      );
    }
  }

  get alpha() {
    return this.container.alpha;
  }

  get rotation() {
    return this.container.angle;
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

  set alpha(value: number) {
    this.container.alpha = value;
  }

  set rotation(value: number) {
    this.container.angle = value;
  }
}
