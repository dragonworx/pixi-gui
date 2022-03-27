import Property, { PropertyListener } from './property';

export default class Sides<T> {
  protected _left: Property<T>;
  protected _right: Property<T>;
  protected _top: Property<T>;
  protected _bottom: Property<T>;

  constructor(
    readonly listener: PropertyListener,
    readonly key: string,
    defaultValue: T
  ) {
    this._left = new Property(listener, `${key}.left`, defaultValue);
    this._right = new Property(listener, `${key}.right`, defaultValue);
    this._top = new Property(listener, `${key}.top`, defaultValue);
    this._bottom = new Property(listener, `${key}.bottom`, defaultValue);
  }

  get left() {
    return this._left.value;
  }

  set left(value: T) {
    this._left.set(value);
  }

  get right() {
    return this._right.value;
  }

  set right(value: T) {
    this._right.set(value);
  }

  get top() {
    return this._top.value;
  }

  set top(value: T) {
    this._top.set(value);
  }

  get bottom() {
    return this._bottom.value;
  }

  set bottom(value: T) {
    this._bottom.set(value);
  }

  clear() {
    this._left.clear();
    this._right.clear();
    this._top.clear();
    this._left.clear();
  }
}
