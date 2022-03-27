import Block from 'src/lib/layout/block';
import { Orientation } from 'src/lib/layout/layout';

export default class Row extends Block {
  constructor() {
    super();

    this._orientation = 'horizontal';
  }

  set orientation(value: Orientation) {
    if (value !== 'horizontal') {
      throw new Error('Row only uses horizontal layout');
    }
  }
}
