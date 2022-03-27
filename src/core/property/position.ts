import Property, { PropertyListener } from './property';

export default class Position {
  protected _x: Property<number>;
  protected _y: Property<number>;

  constructor(readonly listener: PropertyListener, readonly key: string) {
    this._x = new Property(listener, `${key}.x`, 0);
    this._y = new Property(listener, `${key}.y`, 0);
  }

  get x() {
    return this._x.value;
  }

  set x(value: number) {
    this._x.set(value);
  }

  get y() {
    return this._y.value;
  }

  set y(value: number) {
    this._y.set(value);
  }
}
