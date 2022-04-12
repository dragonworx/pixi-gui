import yoga, { EDGE_LEFT, EDGE_TOP, Node } from 'yoga-layout-prebuilt';
import Component from './component';
import Transition from './transition';

type TransitionKeys = 'x' | 'y' | 'width' | 'height';

export interface Props {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default class Layout extends Component<Props> {
  _layout: yoga.YogaNode = Node.create();
  _transitions: Transition<TransitionKeys>;

  constructor(props: Partial<Props> = {}) {
    super(props);

    (this._transitions = new Transition<TransitionKeys>(this))
      .set('x', 250)
      .set('y', 250)
      .set('width', 250)
      .set('height', 250);
  }

  protected defaultProps(): Props {
    return {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    };
  }

  get _layoutNode() {
    return this._layout;
  }

  onStateChange(
    key: keyof Props,
    value: Props[keyof Props],
    _oldValue: Props[keyof Props]
  ): void {
    if (key === 'x') {
      this._layout.setPosition(EDGE_LEFT, value);
    } else if (key === 'y') {
      this._layout.setPosition(EDGE_TOP, value);
    } else if (key === 'width') {
      this._layout.setWidth(value);
    } else if (key === 'height') {
      this._layout.setHeight(value);
    } else {
      return;
    }

    this._layout.calculateLayout();
  }

  addChild(child: Layout): void {
    super.addChild(child);

    const { _layout, _children } = this;

    _layout.insertChild(child._layoutNode, _children.length - 1);

    this._layout.calculateLayout();
  }

  get x() {
    return this.state.x;
  }

  set x(value: number) {
    this._transitions.get('x').start(this.state.x, value);
  }

  get y() {
    return this.state.y;
  }

  set y(value: number) {
    this._transitions.get('y').start(this.state.y, value);
  }

  get width() {
    return this.state.width;
  }

  set width(value: number) {
    this._transitions.get('width').start(this.state.width, value);
  }

  get height() {
    return this.state.height;
  }

  set height(value: number) {
    this._transitions.get('height').start(this.state.height, value);
  }
}
