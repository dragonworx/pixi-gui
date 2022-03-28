import { Loader, Sprite } from 'pixi.js';
import { GeometryUpdate } from './box';
import Surface from './surface';

export default class ImageSurface extends Surface {
  protected _src?: string;
  protected sprite?: Sprite;

  constructor() {
    super();
  }

  init() {
    super.init();

    const { _src } = this;
    if (_src) {
      const loader = new Loader();
      loader.onComplete.add(() => {
        const texture = loader.resources[_src].texture;
        if (texture) {
          const sprite = (this.sprite = Sprite.from(texture));
          (sprite as any).id = 'image';
          this.container.addChildAt(sprite, 0);
          this.width = texture.width;
          this.height = texture.height;
          this.applyFixtures();
          this.updateSpriteSize();
          this.updateContainerPosition();
        }
      });
      loader.add(_src).load();
    }
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
    const { sprite, width, height } = this;
    if (sprite) {
      sprite.width = width;
      sprite.height = height;
    }
  }

  get src() {
    return this._src;
  }

  set src(src: string | undefined) {
    this._src = src;
  }
}
