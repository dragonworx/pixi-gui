import { Container, Sprite, Texture } from 'pixi.js';
import document from './document';
import Layout, { Props as LayoutProps } from './layout';

export interface Props extends LayoutProps {
  backgroundColor: number;
}

export default abstract class Display extends Layout {
  _container: Container;
  _childContainer: Container;
  _background: Sprite;

  constructor(props: Partial<Props> = {}) {
    super(props);

    const container = (this._container = new Container());
    const childContainer = (this._childContainer = new Container());
    const background = (this._background = Sprite.from(Texture.WHITE));

    container.addChild(background);
    container.addChild(childContainer);
  }

  protected defaultProps(): Props {
    return {
      ...super.defaultProps(),
      backgroundColor: 0x333333,
    };
  }

  get container() {
    return this._container;
  }

  onStateChange(
    key: keyof Props,
    value: Props[keyof Props],
    oldValue: number
  ): void {
    super.onStateChange(key as keyof LayoutProps, value, oldValue);

    const { _background, computedLayout } = this;
    const { left, top, width, height } = computedLayout;

    if (key === 'backgroundColor') {
      _background.tint = value as number;
    } else if (key === 'width') {
      _background.width = width;
    } else if (key === 'height') {
      _background.height = height;
    } else if (key === 'x') {
      this.container.x = left;
    } else if (key === 'y') {
      this.container.y = top;
    }
  }

  addChild(child: Display): void {
    this._childContainer.addChild(child.container);

    super.addChild(child);
  }

  setDocument(dom: document): void {
    dom.stage.addChild(this._container);

    super.setDocument(dom);
  }
}
