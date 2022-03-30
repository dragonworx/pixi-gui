import { GeometryUpdate } from 'src/lib/node/box';
import MaskedDisplayContainer from 'src/lib/node/maskedDisplayContainer';

export default class Surface extends MaskedDisplayContainer {
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
