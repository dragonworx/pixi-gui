import { Container, Sprite, Texture } from 'pixi.js';
import document from './document';
import NodeWithLayout, { Props as LayoutProps } from './nodeWithLayout';
import { TransitionKey } from './transition';

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
    background.visible = false;

    container.addChild(background);
    container.addChild(childContainer);

    this._transitions.initKey('alpha');
  }

  protected defaultProps(): P & Props {
    return {
      ...super.defaultProps(),
      alpha: 0.5,
    };
  }

  get container() {
    return this._container;
  }

  protected transitionKeys(): TransitionKey[] {
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
    const num = value as number;

    if (key === 'backgroundColor') {
      if (num === -1) {
        _background.visible = false;
      } else {
        if (!_background.visible) {
          _background.visible = true;
        }
        _background.tint = num;
      }
    } else if (key === 'alpha') {
      this._container.alpha = num;
    } else if (
      key === 'width' ||
      key === 'height' ||
      key === 'x' ||
      key === 'y'
    ) {
      this.updateFromLayout();
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

  updateFromLayout(): void {
    const {
      container,
      _background,
      computedLayout: { left, top, width, height },
    } = this;
    container.x = left;
    container.y = top;
    _background.width = width;
    _background.height = height;
  }
}
