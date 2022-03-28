import { Container, Graphics, Sprite } from 'pixi.js';
import Box, { GeometryUpdate } from 'src/lib/node/box';
import GraphicsPainter from 'src/lib/display/graphicsPainter';
import Canvas2DPainter from '../display/canvas2DPainter';
import { log } from '../log';

export default class DisplayContainer extends Box {
  container: Container;

  protected _mask: Graphics;
  protected _clip: boolean;

  constructor() {
    super();

    this.container = new Container();
    this._mask = new Graphics();
    this._clip = false;
  }

  onInit() {
    super.onInit();

    if (this._clip) {
      this.clip = true;
    }

    this.parentDisplayContainer.addChild(this.container);

    this.updateContainerPosition();
    this.updateMaskSize();
    // this.render();
  }

  removeFromParent(): void {
    this.parentDisplayContainer.removeChild(this.container);
    super.removeFromParent();
  }

  onGeometryChanged(updateType: GeometryUpdate[]) {
    super.onGeometryChanged(updateType);

    if (!this.hasDocument) {
      return;
    }

    if (
      updateType.indexOf(GeometryUpdate.Size) > -1 ||
      updateType.indexOf(GeometryUpdate.Fixture) > -1
    ) {
      // this.render();
      this.updateMaskSize();
    }

    if (updateType.indexOf(GeometryUpdate.Position) > -1) {
      this.updateContainerPosition();
    }
  }

  updateMaskSize() {
    const { _mask: mask } = this;

    mask.clear();
    mask.beginFill(0xffffff);
    mask.drawRect(0, 0, this.width, this.height);
    mask.endFill();
  }

  updateContainerPosition() {
    if (!this.hasParent) {
      return;
    }

    log(this, 'updateSpriteBounds');

    const { bounds } = this;

    this.container.x = bounds.left;
    this.container.y = bounds.top;
  }

  /** Getter */
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

  /** Setter */
  set clip(shouldClip: boolean) {
    // todo: fix up
    const { container, _mask: mask } = this;
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
