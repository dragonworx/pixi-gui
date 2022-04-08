import { Sprite } from 'pixi.js';
import DisplayContainer from 'src/lib/node/displayContainer';
import Font, { defaultFont } from 'src/lib/text/font';
import { GeometryUpdate } from '../node/box';

export default abstract class Text extends DisplayContainer<Sprite> {
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

  setText(text: string, font: Font, color: string) {
    this._color = color;
    this._font = font;
    this.text = text;
  }

  protected createContainer() {
    return new Sprite();
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
    this.text = this.text;
  }

  set fontSize(value: number) {}

  protected abstract renderText(): void;
}
