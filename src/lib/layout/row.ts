import Block from 'src/lib/layout/block';
import { Direction } from 'src/lib/layout';

export default class Row extends Block {
  constructor() {
    super();

    this._direction = 'horizontal';
  }

  set direction(value: Direction) {
    if (value !== 'horizontal') {
      throw new Error('Row only uses horizontal layout');
    }
  }
}
