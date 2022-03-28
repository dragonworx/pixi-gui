import { Graphics } from 'pixi.js';
import GraphicsPainter from 'src/lib/display/graphicsPainter';
import Surface from 'src/lib/node/surface';

export default abstract class PaintedSurface extends Surface {
  protected painter: GraphicsPainter;
  protected graphics: Graphics;

  constructor() {
    super();

    const graphics = (this.graphics = new Graphics());
    this.painter = new GraphicsPainter(graphics);
  }

  init() {
    super.init();

    this.container.addChildAt(this.graphics, 0);
    this.render();
  }

  render() {
    const { painter: _painter } = this;

    if (!this.isReady) {
      return;
    }

    _painter.clear().uncache();

    this.paint();

    _painter.cache();
  }

  protected abstract paint(): void;
}
