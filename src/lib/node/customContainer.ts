import { Container } from 'pixi.js';
import DisplayContainer from 'src/lib/node/displayContainer';
import { GeometryUpdate } from 'src/lib/node/box';

export default class CustomContainer extends DisplayContainer {
  protected _object?: Container;

  constructor() {
    super();
  }

  private setObject(object: Container) {
    if (this._object) {
      this.object = undefined;
    }
    this._object = object;
    this.container.addChildAt(object, 0);
    this.width = object.width;
    this.height = object.height;
    this.applyFixtures();
    this.updateObjectSize();
    this.updateContainerPosition();
  }

  init() {
    super.init();

    const { _object } = this;
    if (_object) {
      this.setObject(_object);
    }
  }

  onGeometryChanged(updateType: GeometryUpdate[]): void {
    super.onGeometryChanged(updateType);

    if (!this.isReady) {
      return;
    }

    if (updateType.indexOf(GeometryUpdate.Size) > -1) {
      this.updateObjectSize();
    }
  }

  updateObjectSize() {
    const { object, width, height } = this;
    if (object) {
      object.width = width;
      object.height = height;
    }
  }

  get object() {
    return this._object;
  }

  set object(object: Container | undefined) {
    if (object) {
      this.setObject(object);
    } else {
      const { object } = this;
      if (object && object.parent) {
        object.parent.removeChild(object);
        delete this.object;
      }
      this._object = undefined;
    }
  }
}
