import { Graphics } from 'pixi.js';
import GraphicsPainter from 'src/lib/display/graphicsPainter';
import Surface from 'src/lib/node/surface';
import { log } from '../log';

export default class PaintedSurface extends Surface {
  protected _painter: GraphicsPainter;
  protected _graphics: Graphics;

  constructor() {
    super();

    const graphics = (this._graphics = new Graphics());
    this._painter = new GraphicsPainter(graphics);
  }

  onInit() {
    super.onInit();
    this.container.addChildAt(this._graphics, 0);
  }

  render() {
    const { _painter } = this;

    if (!this.isReady) {
      return;
    }

    log(this, 'render');

    _painter.clear().uncache();

    this.paint();

    _painter.cache();
  }

  paint() {}
}
