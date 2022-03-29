import { Sprite } from 'pixi.js';
import DisplayContainer from 'src/lib/node/displayContainer';
import Font from 'src/lib/text/font';
import Color from 'color';

export default class Text extends DisplayContainer {
  color: string;
  private _text: string;

  constructor(readonly font: Font, color: string) {
    super();

    this.color = color;
    this._text = '';
  }

  set text(value: string) {
    this._text = value;
    this.renderText();
  }

  private renderText() {
    const { font, color, _text: text } = this;
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
    this.width = x;
  }
}
