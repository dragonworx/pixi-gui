import Property, { PropertyListener } from './property';

export default class Size {
  protected _width: Property<number>;
  protected _height: Property<number>;

  constructor(readonly listener: PropertyListener) {
    this._width = new Property(listener, 'width', 0);
    this._height = new Property(listener, 'height', 0);
  }

  get width() {
    return this._width.value;
  }

  set width(value: number) {
    this._width.set(value);
  }

  get height() {
    return this._height.value;
  }

  set height(value: number) {
    this._height.set(value);
  }
}
