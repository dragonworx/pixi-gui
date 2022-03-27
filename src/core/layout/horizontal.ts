import Rectangle from 'src/lib/rectangle';
import WrapLayout from './wrap';

export default class HorizontalLayout extends WrapLayout {
  isValidBounds(_bounds: Rectangle): boolean {
    return true;
  }
}
