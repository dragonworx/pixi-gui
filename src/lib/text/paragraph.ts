import WrapLayout from '../layout/wrap';
import Text from './staticText';

export default class Paragraph extends Text {
  constructor() {
    super();

    this._layout = new WrapLayout(this);
  }

  init() {
    super.init();

    this.updateLayout();
  }

  protected renderText() {
    const { font, text } = this;

    [...this.children].forEach(child => {
      this.removeChild(child);
    });

    const words: Text[] = [];
    const wordStrs = text.split(' ');

    wordStrs.forEach((wordStr, i) => {
      const word = new Text();
      word.font = font;
      word.text = wordStr;
      this.addChild(word, false);
      words.push(word);
      if (i <= wordStrs.length - 1) {
        const space = new Text();
        space.text = ' ';
        this.addChild(space, false);
        words.push(space);
      }
    });
  }
}
