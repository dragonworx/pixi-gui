import { GeometryUpdate } from 'src/lib/node/box';
import DisplayContainer from 'src/lib/node/container';

export default class Surface extends DisplayContainer {
  onInit() {
    super.onInit();

    this.render();
  }

  onGeometryChanged(updateType: GeometryUpdate[]) {
    super.onGeometryChanged(updateType);

    if (!this.isReady) {
      return;
    }

    if (updateType.indexOf(GeometryUpdate.Padding) > -1) {
      this.render();
    }

    if (
      updateType.indexOf(GeometryUpdate.Size) > -1 ||
      updateType.indexOf(GeometryUpdate.Fixture) > -1
    ) {
      this.render();
    }
  }

  render() {}
}
