import Color from 'color';
import { Graphics } from 'pixi.js';

const correction = 0.5;
export const px = (value: number) => value + correction;

export default class GraphicsPainter {
  graphics: Graphics;

  constructor(graphics: Graphics) {
    this.graphics = graphics;
  }

  setGraphics(graphics: Graphics) {
    this.graphics = graphics;
    return this;
  }

  drawRect(x: number, y: number, w: number, h: number) {
    this.graphics.drawRect(px(x), px(y), px(w), px(h));
    return this;
  }

  beginFill(color: string, alpha: number = 1) {
    this.graphics.beginFill(Color(color).rgbNumber(), alpha);
    return this;
  }

  endFill() {
    this.graphics.endFill();
    return this;
  }

  lineStyle(color: string, lineWidth: number = 1, alpha: number = 1) {
    this.graphics.lineStyle(lineWidth, Color(color).rgbNumber(), alpha);
    return this;
  }

  line(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    closePath: boolean = false
  ) {
    const { graphics } = this;
    graphics.moveTo(px(x1), px(y1));
    graphics.lineTo(px(x2), px(y2));
    if (closePath) {
      graphics.closePath();
    }
  }

  clear() {
    this.graphics.clear();
    return this;
  }

  uncache() {
    this.graphics.cacheAsBitmap = false;
    return this;
  }

  cache() {
    this.graphics.cacheAsBitmap = true;
    return this;
  }
}
