import Text from 'src/lib/text/text';
import Char from 'src/lib/text/char';
import { GeometryUpdate } from '../node/box';

export default class StaticText extends Text {
  protected renderText() {
    const { font, color, text } = this;

    [...this.container.children].forEach(child =>
      this.container.removeChild(child)
    );

    let x = 0;

    for (let i = 0; i < text.length; i++) {
      const char = new Char();
      char.set(text.charAt(i), font, color);
      this.addChild(char);
      char.x = x;
      x += char.width;
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
