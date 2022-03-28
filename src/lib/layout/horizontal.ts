import Rectangle from 'src/lib/rectangle';
import WrapLayout from 'src/lib/layout/wrap';

export default class HorizontalLayout extends WrapLayout {
  protected isValidBounds(_bounds: Rectangle): boolean {
    return true;
  }
}
