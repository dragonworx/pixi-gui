import Color from 'color';
import { px } from 'src/lib/display/graphicsPainter';
import Painter from 'src/lib/display/canvas2DPainter';
import { Texture, TilingSprite } from 'pixi.js';

const large = 1;
const medium = 1;
const small = 0.5;

const light = 0.2;
const inbetween = 0.4;
const dark = 0.6;

export default class Grid {
  painter: Painter;
  canvas: HTMLCanvasElement;
  width: number;
  height: number;

  constructor(width: number = 100, height: number = 100) {
    const { canvas } = Painter.createCanvas();
    this.canvas = canvas;
    this.width = canvas.width = width;
    this.height = canvas.height = height;
    this.painter = new Painter(canvas);
    this.render();
  }

  static createTilingSprite(width: number, height: number) {
    const grid = new Grid();
    return new TilingSprite(Texture.from(grid.canvas), width, height);
  }

  private render() {
    const { painter, width, height } = this;

    painter.clear(width, height);

    for (let y = 0; y <= height; y += 10) {
      painter
        .strokeStyle(this.lineColor(y), this.lineWidth(y))
        .line(px(0), px(y), px(width), px(y));
      for (let x = 0; x <= width; x += 10) {
        painter
          .strokeStyle(this.lineColor(x), this.lineWidth(x))
          .line(px(x), px(0), px(x), px(height));
      }
    }
  }

  private lineWidth(num: number) {
    return num % 100 === 0 ? large : num % 50 === 0 ? medium : small;
  }

  private lineColor(num: number) {
    const green = Color('green');
    const alpha = num % 100 === 0 ? light : num % 50 === 0 ? inbetween : dark;
    return green.darken(alpha).hex();
  }
}
