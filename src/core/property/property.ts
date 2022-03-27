export interface PropertyListener {
  onPropertyChanged: (key: string, value: any, oldValue: any) => void;
}

export default class Property<T> {
  value: T;

  constructor(
    readonly listener: PropertyListener,
    readonly key: string,
    readonly defaultValue: T
  ) {
    this.value = defaultValue;
  }

  set(value: T) {
    const oldValue = this.value;
    if (value !== oldValue) {
      this.value = value;
      this.listener.onPropertyChanged(this.key, value, oldValue);
    }
  }

  get() {
    return this.value;
  }

  clear() {
    delete (this as any).value;
  }
}
