import Block from 'src/lib/layout/block';
import { Orientation } from 'src/lib/layout/layout';

export default class Column extends Block {
  constructor() {
    super();

    this._orientation = 'vertical';
  }

  set orientation(value: Orientation) {
    if (value !== 'vertical') {
      throw new Error('Column only uses vertical layout');
    }
  }
}
