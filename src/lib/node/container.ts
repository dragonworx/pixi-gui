import { Container, Graphics, Sprite } from 'pixi.js';
import Box, { GeometryUpdate } from 'src/lib/node/box';
import GraphicsPainter from 'src/lib/display/graphicsPainter';
import Canvas2DPainter from '../display/canvas2DPainter';
import { Setter } from 'src/lib/parser';
import { log } from '../log';

export default class BoxContainer extends Box {
  container: Container;
  childContainer: Container;
  graphics: Graphics;
  painter: GraphicsPainter;
  mask: Graphics;
  _clip: boolean;
  _idSprite?: Sprite;

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

    const graphics = (this.graphics = new Graphics());

    this.painter = new GraphicsPainter(graphics);

    this.mask = new Graphics();
    this._clip = false;
  }

  onInit() {
    super.onInit();

    if (this._clip) {
      this.clip = true;
    }

    this.parentDisplayContainer.addChild(this.container);

    this.container.addChild(this.graphics);

    this.container.addChild(this.childContainer);

    if (this.document.debug) {
      this.createIdSprite();
    }

    this.updateContainerPosition();

    this.updateMaskSize();
    this.render();
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
      updateType.indexOf(GeometryUpdate.Anchor) > -1
    ) {
      this.render();
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

  createIdSprite() {
    const idSprite = (this._idSprite = Canvas2DPainter.createTextSprite(
      this.id,
      'white'
    ));
    idSprite.anchor.x = 0.5;
    idSprite.anchor.y = 0.5;
    this.container.addChildAt(idSprite, this.container.children.length);
  }

  render() {
    const { painter, hasSize, hasDocument, _hasInit } = this;

    if (!hasSize || !hasDocument || !_hasInit) {
      return;
    }

    log(this, 'render');

    painter.uncache().clear();

    this.paintBackground();

    if (this.document.debug) {
      this.paintDebug();
    }

    painter.cache();
  }

  paintBackground() {
    const { painter } = this;

    if (this.document.debug) {
      painter
        .beginFill('#999', 0.2)
        .drawRect(0, 0, this.width, this.height)
        .endFill();
    }
  }

  paintDebug() {
    const { painter, _idSprite } = this;

    painter
      .lineStyle('cyan', 1, 0.5)
      .drawRect(...this.localContentBounds.toArray())
      .lineStyle('yellow', 1, 0.5)
      .drawRect(...this.localMarginBounds.expand(-1, -1).toArray());

    if (_idSprite) {
      _idSprite.x = this.width / 2;
      _idSprite.y = this.height / 2;
    }
  }

  onDebugChange(debug: boolean): void {
    if (!debug && this._idSprite) {
      this.container.removeChild(this._idSprite);
      delete this._idSprite;
    } else if (debug && !this._idSprite) {
      this.createIdSprite();
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
