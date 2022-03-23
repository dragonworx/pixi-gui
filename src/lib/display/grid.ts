import Color from 'color';
import { Graphics } from 'pixi.js';
import { px } from 'src/lib/display/graphicsPainter';

const large = 1;
const medium = 1;
const small = 0.5;

const light = 0.2;
const inbetween = 0.4;
const dark = 0.6;

export default class Grid extends Graphics {
  constructor(width: number, height: number) {
    super();
    this.renderGrid(width, height);
  }

  private renderGrid(width: number, height: number) {
    this.cacheAsBitmap = false;

    this.clear();
    this.beginFill(0x000000);
    this.drawRect(0, 0, width, height);
    this.endFill();

    for (let y = 0; y <= height; y += 10) {
      this.lineStyle(this.lineWidth(y), this.lineColor(y));
      this.moveTo(px(0), px(y));
      this.lineTo(px(width), px(y));
      for (let x = 0; x <= width; x += 10) {
        this.lineStyle(this.lineWidth(x), this.lineColor(x));
        this.moveTo(px(x), px(0));
        this.lineTo(px(x), px(height));
      }
    }

    this.lineStyle(1, Color('yellow').rgbNumber());
    this.moveTo(px(width * 0.5), px(0));
    this.lineTo(px(width * 0.5), px(height));
    this.moveTo(px(0), px(height * 0.5));
    this.lineTo(px(width), px(height * 0.5));

    this.cacheAsBitmap = true;
  }

  private lineWidth(num: number) {
    return num % 100 === 0 ? large : num % 50 === 0 ? medium : small;
  }

  private lineColor(num: number) {
    const green = Color('lime');
    const alpha = num % 100 === 0 ? light : num % 50 === 0 ? inbetween : dark;
    return green.darken(alpha).rgbNumber();
  }

  resize(width: number, height: number) {
    this.renderGrid(width, height);
  }
}
