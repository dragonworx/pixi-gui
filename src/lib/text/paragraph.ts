import DisplayContainer from 'src/lib/node/displayContainer';
import WrapLayout from '../layout/wrap';
import Font from './font';
import Text from './text';

export default class Paragraph extends DisplayContainer {
  protected _text: string;

  constructor(readonly font: Font, text: string) {
    super();
    this._text = text;
    this._layout = new WrapLayout(this);
  }

  init() {
    super.init();

    this.text = this._text;
    this.updateLayout();
  }

  set text(value: string) {
    this._text = value;
    this.renderText();
  }

  private renderText() {
    const { font, _text: text } = this;

    [...this.children].forEach(child => {
      this.removeChild(child);
    }); // todo: diff
    const words: Text[] = [];
    const wordStrs = text.split(' ');
    wordStrs.forEach((wordStr, i) => {
      const word = new Text(font, 'white');
      word.text = wordStr;
      this.addChild(word, false);
      words.push(word);
      if (i <= wordStrs.length - 1) {
        const space = new Text(font, 'white');
        space.text = ' ';
        this.addChild(space, false);
        words.push(space);
      }
    });
  }
}
