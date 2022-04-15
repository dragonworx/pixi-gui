import { Container, Sprite, Texture } from 'pixi.js';
import document from './document';
import Node from './node';
import NodeWithLayout, { Props as LayoutProps } from './nodeWithLayout';

export interface Props extends LayoutProps {
  backgroundColor: number;
  alpha: number;
}

export default abstract class NodeWithDisplay<P> extends NodeWithLayout<
  P & Props
> {
  _container: Container;
  _childContainer: Container;
  _background: Sprite;

  constructor(props: Partial<P & Props> = {}) {
    super(props);

    const container = (this._container = new Container());
    const childContainer = (this._childContainer = new Container());
    const background = (this._background = Sprite.from(Texture.WHITE));

    container.addChild(background);
    container.addChild(childContainer);

    this._transitions.initKey('alpha');
  }

  protected defaultProps(): P & Props {
    return {
      ...super.defaultProps(),
      backgroundColor: 0x333333,
      alpha: 1,
    };
  }

  get container() {
    return this._container;
  }

  protected transitionKeys(): string[] {
    return [...super.transitionKeys(), 'alpha'];
  }

  onStateChange<Props>(
    key: keyof Props,
    value: unknown,
    oldValue: unknown
  ): void {
    super.onStateChange(key as keyof LayoutProps, value, oldValue);

    const { _background, computedLayout } = this;
    const { left, top, width, height } = computedLayout;

    if (key === 'backgroundColor') {
      _background.tint = value as number;
    } else if (key === 'alpha') {
      this._container.alpha = value as number;
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

  addChild(child: NodeWithDisplay<any>): void {
    this._childContainer.addChild(child.container);

    super.addChild(child as NodeWithLayout<any>);
  }

  setAsRoot(dom: document): void {
    dom.stage.addChild(this._container);

    super.setAsRoot(dom);
  }

  get backgroundColor() {
    return this.getState<Props>().backgroundColor;
  }

  set backgroundColor(value: number) {
    this.setState<Props>({ backgroundColor: value });
  }

  get alpha() {
    return this.getState<Props>().alpha;
  }

  set alpha(value: number) {
    this._transitions.start('alpha', this.state.alpha, value);
  }
}
