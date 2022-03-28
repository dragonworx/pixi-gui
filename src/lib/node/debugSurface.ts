import Themable from 'src/lib/node/themable';
import Canvas2DPainter from 'src/lib/display/canvas2DPainter';
import { GeometryUpdate } from 'src/lib/node/box';
import { Sprite } from 'pixi.js';

export default class DebugSurface extends Themable {
  protected idSprite?: Sprite;

  init() {
    super.init();
    const idSprite = (this.idSprite = Canvas2DPainter.createTextSprite(
      this.id,
      'white'
    ));
    idSprite.anchor.x = 0.5;
    idSprite.anchor.y = 0.5;
    this.container.addChild(idSprite);
    this.updateIdSpritePosition();
  }

  protected paint() {
    const { painter } = this;
    super.paint();
    painter
      .lineStyle('cyan')
      .drawRect(...this.localContentBounds.toArray())
      .lineStyle('yellow')
      .drawRect(...this.localMarginBounds.toArray());
  }

  onGeometryChanged(updates: GeometryUpdate[]): void {
    super.onGeometryChanged(updates);
    if (this.hasUpdate(updates, GeometryUpdate.Size)) {
      this.updateIdSpritePosition();
    }
  }

  protected updateIdSpritePosition() {
    const { idSprite } = this;
    if (idSprite) {
      idSprite.x = this.width / 2;
      idSprite.y = this.height / 2;
    }
  }
}
