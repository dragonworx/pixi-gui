import { Sprite, Texture } from 'pixi.js';

export const px = (value: number) => value + 0.5;

export default class Canvas2DPainter {
  ctx: CanvasRenderingContext2D;

  constructor(readonly canvas: HTMLCanvasElement) {
    this.ctx = this.canvas.getContext('2d')!;
  }

  static createCanvas() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    return { canvas, ctx };
  }

  static createTextCanvas(
    text: string,
    color: string,
    bgColor: string = 'black'
  ) {
    const { canvas, ctx } = Canvas2DPainter.createCanvas();
    let metrics = ctx.measureText(text);
    // let fontHeight =
    //   metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
    const padding = 3;
    let height =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    let width = metrics.width;
    canvas.width = width + padding;
    canvas.height = height + padding;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width + padding, height + padding);
    ctx.fillStyle = color;
    ctx.fillText(text, padding / 2, height + padding / 2);
    return canvas;
  }

  static createTextSprite(text: string, color: string) {
    const canvas = Canvas2DPainter.createTextCanvas(text, color);
    return Sprite.from(Texture.from(canvas));
  }

  clear(width: number, height: number, color: string = 'transparent') {
    this.ctx.fillStyle = 'transparent';
    this.fillRect(0, 0, width, height);
    return this;
  }

  fillRect(x: number, y: number, w: number, h: number) {
    this.ctx.fillRect(px(x), px(y), px(w), px(h));
    return this;
  }

  strokeRect(x: number, y: number, w: number, h: number) {
    this.ctx.strokeRect(px(x), px(y), px(w), px(h));
    return this;
  }

  fillColor(color: string) {
    this.ctx.fillStyle = color;
    return this;
  }

  strokeStyle(color: string, lineWidth: number = 1) {
    return this.strokeColor(color).lineWidth(lineWidth);
  }

  strokeColor(color: string) {
    this.ctx.strokeStyle = color;
    return this;
  }

  lineWidth(width: number) {
    this.ctx.lineWidth = width;
    return this;
  }

  line(x1: number, y1: number, x2: number, y2: number) {
    const { ctx } = this;
    ctx.beginPath();
    ctx.moveTo(px(x1), px(y1));
    ctx.lineTo(px(x2), px(y2));
    ctx.stroke();
    ctx.closePath();
    return this;
  }

  drawText(text: string, x: number, y: number) {
    const { ctx } = this;
    ctx.fillText(text, x, y);
    return this;
  }
}
