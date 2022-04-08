import { Container } from 'pixi.js';
import Box, { GeometryUpdate } from 'src/lib/node/box';

export default class DisplayContainer<
  T extends Container = Container
> extends Box {
  container: T;

  constructor() {
    super();

    this.container = this.createContainer() as T;
  }

  protected createContainer() {
    return new Container();
  }

  protected updateContainerPosition() {
    if (!this.isReady) {
      return;
    }

    const { bounds } = this;

    this.container.x = bounds.left;
    this.container.y = bounds.top;
  }

  init() {
    super.init();

    this.parentDisplayContainer.addChild(this.container);

    this.updateContainerPosition();
  }

  removeFromParent(): void {
    this.parentDisplayContainer.removeChild(this.container);

    super.removeFromParent();
  }

  onGeometryChanged(updateType: GeometryUpdate[]) {
    super.onGeometryChanged(updateType);

    if (
      updateType.indexOf(GeometryUpdate.Position) > -1 ||
      updateType.indexOf(GeometryUpdate.Anchor) > -1
    ) {
      this.updateContainerPosition();
    }
  }

  get parentDisplayContainer() {
    if (this.isDocumentParent) {
      return this.document.stage;
    } else {
      if (this.parent && 'container' in this.parent) {
        return (this.parent as any).container;
      }
      throw new Error(
        'Cannot get parent display container, parent does not have a .container'
      );
    }
  }

  get alpha() {
    return this.container.alpha;
  }

  set alpha(value: number) {
    this.container.alpha = value;
  }
}
