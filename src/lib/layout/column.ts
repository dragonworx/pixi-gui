import Block from 'src/lib/layout/block';
import { Direction } from 'src/lib/layout';

export default class Column extends Block {
  constructor() {
    super();

    this._direction = 'vertical';
  }

  set direction(value: Direction) {
    if (value !== 'vertical') {
      throw new Error('Column only uses vertical layout');
    }
  }
}
