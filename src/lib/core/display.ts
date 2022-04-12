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
    const { _background, _transitions } = this;
    super.onStateChange(key as keyof LayoutProps, value, oldValue);

    console.log('Display update state', key, value, oldValue);

    if (key === 'backgroundColor') {
      _background.tint = value;
    } else if (key === 'width') {
      _background.width = value;
    } else if (key === 'height') {
      _background.height = value;
    } else if (key === 'x') {
      this.container.x = value;
    } else if (key === 'y') {
      this.container.y = value;
    }
  }

  addChild(child: Display): void {
    super.addChild(child);

    this._childContainer.addChild(child.container);
  }

  setDocument(dom: document): void {
    super.setDocument(dom);

    dom.stage.addChild(this._container);
  }
}
