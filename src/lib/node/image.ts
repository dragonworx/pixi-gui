import { Container, Resource, Sprite, Texture } from 'pixi.js';
import { GeometryUpdate } from 'src/lib/node/box';
import Surface from 'src/lib/node/surface';

export default class Image extends Surface {
  protected _src?: string;
  protected _sprite?: Sprite;

  private setSrc(src: string) {
    if (this._src) {
      this.src = undefined;
    }
    this._src = src;

    if (!this.isReady) {
      return;
    }

    const texture = this.document.getTexture(src);
    const sprite = (this._sprite = this.createSpriteFromTexture(
      texture
    ) as Sprite);
    this.container.addChildAt(sprite, 0);
    this.width = texture.width;
    this.height = texture.height;
    this.applyFixtures();
    this.updateSpriteSize();
    this.updateContainerPosition();
  }

  init() {
    super.init();

    const { _src } = this;
    if (_src) {
      this.setSrc(_src);
    }
  }

  createSpriteFromTexture(texture: Texture<Resource>): Container {
    return Sprite.from(texture);
  }

  onGeometryChanged(updateType: GeometryUpdate[]): void {
    super.onGeometryChanged(updateType);

    if (!this.isReady) {
      return;
    }

    if (updateType.indexOf(GeometryUpdate.Size) > -1) {
      this.updateSpriteSize();
    }
  }

  updateSpriteSize() {
    const { _sprite: sprite, width, height } = this;
    if (sprite) {
      sprite.width = width;
      sprite.height = height;
    }
  }

  getSprite<T = Sprite>(): T {
    return this._sprite as unknown as T;
  }

  get src() {
    return this._src;
  }

  set src(src: string | undefined) {
    if (src) {
      this.setSrc(src);
    } else {
      const { _sprite: sprite } = this;
      if (sprite && sprite.parent) {
        sprite.parent.removeChild(sprite);
        delete this._sprite;
      }
      this._src = undefined;
    }
  }

  get sprite() {
    return this._sprite;
  }
}
