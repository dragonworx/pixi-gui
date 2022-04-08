import { Container, Sprite, Texture } from 'pixi.js';

const lowerAlpha = 'abcdefghijklmnopqrstuvwxyz';
const upperAlpha = lowerAlpha.toUpperCase();
const numeric = '0123456789';
const symbol = `!@#$%^&*()_+-=[]{}\|;:'",<';'.>/? `;

const fullCharSet = lowerAlpha + upperAlpha + numeric + symbol;

export type FontWeight = 'bold' | 'regular';

export interface FontInfo {
  charSet?: string;
  fontSize: number;
  fontWeight?: FontWeight;
  fontFamily: string;
}

export interface FontChar {
  char: string;
  width: number;
  texture: Texture;
}

export default class Font {
  canvas: HTMLCanvasElement;
  charMap: Map<string, FontChar>;
  metrics: TextMetrics;

  constructor(readonly fontInfo: FontInfo) {
    const { canvas, charMap, metrics } = this.generate();

    this.canvas = canvas;
    this.charMap = charMap;
    this.metrics = metrics;
  }

  private generate() {
    const { charSet = fullCharSet } = this.fontInfo;
    const fontStyle = this.fontStyle;

    const bgColor = 'transparent';
    const color = 'white';

    const canvas = (this.canvas = document.createElement('canvas'));
    const ctx = canvas.getContext('2d')!;

    ctx.font = fontStyle;
    const metrics = (this.metrics = ctx.measureText(charSet));
    const height = this.height;
    const width = this.width;
    canvas.width = width;
    canvas.height = height;

    ctx.font = fontStyle;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = color;
    ctx.fillText(charSet, 0, height - metrics.actualBoundingBoxDescent);

    const bounds = [];
    for (let i = 0; i < charSet.length; i++) {
      const char = charSet.charAt(i);
      const metrics = ctx.measureText(char);
      bounds.push(metrics.width);
    }

    const charMap = (this.charMap = new Map());
    let x = 0;
    ctx.strokeStyle = 'red';
    bounds.forEach((width, i) => {
      const char = charSet.charAt(i);
      const charCanvas = document.createElement('canvas');
      charCanvas.width = width;
      charCanvas.height = height;
      const charCtx = charCanvas.getContext('2d')!;
      charCtx.font = fontStyle;
      charCtx.drawImage(canvas, x, 0, width, height, 0, 0, width, height);
      const texture = Texture.from(charCanvas);
      charMap.set(char, {
        char,
        width,
        texture,
      });
      x += width;
    });

    return { canvas, charMap, metrics };
  }

  get height() {
    return (
      this.metrics.actualBoundingBoxAscent +
      this.metrics.actualBoundingBoxDescent
    );
  }

  get width() {
    return this.metrics.width;
  }

  get fontStyle() {
    const { fontSize, fontWeight = 'regular', fontFamily } = this.fontInfo;

    return `${fontWeight === 'bold' ? 'bold ' : ''}${fontSize}px ${fontFamily}`;
  }

  createText(text: string, color: number) {
    const group = new Container();
    let x = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charAt(i);
      const fontChar = this.charMap.get(char);
      if (fontChar) {
        const sprite = Sprite.from(fontChar.texture);
        sprite.tint = color;
        group.addChild(sprite);
        sprite.x = x;
        x += fontChar.width;
      }
    }
    return group;
  }

  set fontSize(value: number) {
    this.fontInfo.fontSize = value;
    this.generate();
  }

  set fontFamily(value: string) {
    this.fontInfo.fontFamily = value;
    this.generate();
  }

  set fontWeight(value: FontWeight) {
    this.fontInfo.fontWeight = value;
    this.generate();
  }

  setFontInfo(fontInfo: FontInfo) {
    this.fontInfo.charSet = fontInfo.fontFamily;
    this.fontInfo.fontFamily = fontInfo.fontFamily;
    this.fontInfo.fontSize = fontInfo.fontSize;
    this.fontInfo.fontWeight = fontInfo.fontWeight;
    this.generate();
  }
}

export const defaultFont = new Font({
  fontSize: 14,
  fontFamily: 'sans-serif',
});
