import WrapLayout from 'src/lib/layout/wrap';
import StaticText from 'src/lib/text/staticText';

export default class Paragraph extends StaticText {
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

    const words: StaticText[] = [];
    const wordStrs = text.split(' ');

    wordStrs.forEach((wordStr, i) => {
      const word = new StaticText();
      word.font = font;
      word.text = wordStr;
      this.addChild(word, false);
      words.push(word);

      if (i <= wordStrs.length - 1) {
        const space = new StaticText();
        space.text = ' ';
        this.addChild(space, false);
        words.push(space);
      }
    });
  }
}
