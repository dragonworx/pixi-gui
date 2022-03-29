import { Container, Sprite, Texture } from 'pixi.js';

const lowerAlpha = 'abcdefghijklmnopqrstuvwxyz';
const upperAlpha = lowerAlpha.toUpperCase();
const numeric = '0123456789';
const symbol = `!@#$%^&*()_+-=[]{}\|;:'",<';'.>/? `;

const fullCharSet = lowerAlpha + upperAlpha + numeric + symbol;

export interface FontInfo {
  charSet?: string;
  fontSize: number;
  fontWeight?: 'bold' | 'regular';
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
    const { charSet = fullCharSet } = fontInfo;

    const font = this.font;

    const bgColor = 'transparent';
    const color = 'white';

    const canvas = (this.canvas = document.createElement('canvas'));
    const ctx = canvas.getContext('2d')!;

    ctx.font = font;
    const metrics = (this.metrics = ctx.measureText(charSet));
    const height = this.height;
    const width = this.width;
    canvas.width = width;
    canvas.height = height;

    ctx.font = font;
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
      charCtx.font = font;
      charCtx.drawImage(canvas, x, 0, width, height, 0, 0, width, height);
      const texture = Texture.from(charCanvas);
      charMap.set(char, {
        char,
        width,
        texture,
      });

      // charCanvas.style.cssText = `position:absolute;top:200px;left:${x}px;`;
      // document.body.appendChild(charCanvas);

      // ctx.beginPath();
      // ctx.moveTo(x, 0);
      // ctx.lineTo(x, height);
      // ctx.stroke();
      // ctx.closePath();

      x += width;
    });
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

  get font() {
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
}
