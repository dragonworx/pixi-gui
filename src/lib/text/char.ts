import Color from 'color';
import Text from 'src/lib/text/text';
import { GeometryUpdate } from '../node/box';

export default class Char extends Text {
  protected renderText() {
    const { text, font, color, container } = this;
    const char = text.charAt(0);
    const fontChar = font.charMap.get(char);
    this.geometry.size.width = 0;
    this.geometry.size.height = this.font.height;

    if (fontChar) {
      container.texture = fontChar.texture;
      container.tint = Color(color).rgbNumber();
      this.geometry.size.width = fontChar.width;
    }

    this.onGeometryChanged([
      GeometryUpdate.Size,
      GeometryUpdate.Width,
      GeometryUpdate.Height,
    ]);
  }
}
