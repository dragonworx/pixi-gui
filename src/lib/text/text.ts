import { Sprite } from 'pixi.js';
import DisplayContainer from 'src/lib/node/displayContainer';
import Font, { defaultFont } from 'src/lib/text/font';
import Color from 'color';
import { GeometryUpdate } from '../node/box';

export default class Text extends DisplayContainer {
  protected _color: string;
  protected _text: string;
  protected _font: Font;

  constructor() {
    super();

    this._color = 'white';
    this._text = '';
    this._font = defaultFont;
  }

  init() {
    this.text = this._text;

    super.init();
  }

  get font() {
    return this._font;
  }

  get text() {
    return this._text;
  }

  get color() {
    return this._color;
  }

  set text(value: string) {
    this._text = value;
    this.renderText();
  }

  set color(value: string) {
    this._color = value;
    this.renderText();
  }

  set font(value: Font) {
    this._font = value;
    this.renderText();
  }

  protected renderText() {
    const { font, color, text } = this;

    [...this.container.children].forEach(child =>
      this.container.removeChild(child)
    );

    let x = 0;

    for (let i = 0; i < text.length; i++) {
      const char = text.charAt(i);
      const fontChar = font.charMap.get(char);

      if (fontChar) {
        const sprite = Sprite.from(fontChar.texture);
        sprite.tint = Color(color).rgbNumber();
        this.container.addChild(sprite);
        sprite.x = x;
        x += fontChar.width;
      }
    }

    this.geometry.size.height = this.font.height;
    this.geometry.size.width = x;
    this.onGeometryChanged([
      GeometryUpdate.Size,
      GeometryUpdate.Width,
      GeometryUpdate.Height,
    ]);
  }
}
