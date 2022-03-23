import { Container, Graphics } from 'pixi.js';
import Box, { GeometryUpdate } from 'src/lib/node/box';
import GraphicsPainter from 'src/lib/display/graphicsPainter';
import Canvas2DPainter from '../display/canvas2DPainter';
import { Setter } from 'src/lib/parser';
import { log } from '../log';

export default class BoxContainer extends Box {
  container: Container;
  childContainer: Container;
  debugGraphics: Graphics;
  debugPainter: GraphicsPainter;
  mask: Graphics;
  _clip: boolean;

  static setters(): Setter[] {
    return [
      ...super.setters(),
      {
        name: 'clip',
        type: 'boolean',
      },
    ];
  }

  constructor() {
    super();

    this.container = new Container();
    this.childContainer = new Container();

    const debug = (this.debugGraphics = new Graphics());

    this.debugPainter = new GraphicsPainter(debug);

    this.mask = new Graphics();
    this._clip = false;
  }

  onInit() {
    super.onInit();

    if (this._clip) {
      this.clip = true;
    }

    this.parentDisplayContainer.addChild(this.container);

    this.container.addChild(this.childContainer);

    if (this.document.debug) {
      this.container.addChild(this.debugGraphics);

      const idSprite = Canvas2DPainter.createTextSprite(this.id, 'white');
      idSprite.anchor.x = 0.5;
      idSprite.anchor.y = 0.5;
      idSprite.x = this.width / 2;
      idSprite.y = this.height / 2;
      this.container.addChild(idSprite);
    }

    this.updateContainerPosition();

    this.updateMaskSize();
    this.render();
  }

  removeFromParent(): void {
    this.parentDisplayContainer.removeChild(this.container);
  }

  onGeometryChanged(updateType: GeometryUpdate[]) {
    super.onGeometryChanged(updateType);

    if (!this.hasDocument) {
      return;
    }

    if (updateType.indexOf(GeometryUpdate.Size) > -1) {
      this.updateMaskSize();
    }

    if (updateType.indexOf(GeometryUpdate.Position) > -1) {
      this.updateContainerPosition();
    }
  }

  updateMaskSize() {
    const { mask } = this;

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

  render() {
    const { debugPainter, hasSize, hasDocument } = this;

    if (!hasSize || !hasDocument) {
      return;
    }

    log(this, 'render');

    if (this.document.debug) {
      debugPainter
        .uncache()
        .clear()
        .beginFill('#999', 0.3)
        .drawRect(0, 0, this.width, this.height)
        .endFill()
        .lineStyle('cyan', 1, 0.5)
        .drawRect.apply(debugPainter, this.localContentBounds.toArray())
        .lineStyle('yellow', 1, 0.5)
        .drawRect.apply(
          debugPainter,
          this.localMarginBounds.expand(-3, -3).toArray()
        )
        .cache();
    }
  }

  /** Getter */
  get clip() {
    return this._clip;
  }

  get parentDisplayContainer() {
    if (this.isDocumentParent) {
      return this.document.stage;
    } else {
      if (this.parent && 'childContainer' in this.parent) {
        return (this.parent as any).childContainer;
      }
      throw new Error(
        'Cannot get parent display container, parent does not have a child container'
      );
    }
  }

  /** Setter */
  set clip(shouldClip: boolean) {
    // todo: fix up
    const { container, mask } = this;
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
