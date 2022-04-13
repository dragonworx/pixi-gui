import yoga, {
  EDGE_LEFT,
  EDGE_TOP,
  Node,
  YogaJustifyContent,
  YogaAlign,
  JUSTIFY_FLEX_START,
  JUSTIFY_CENTER,
  JUSTIFY_FLEX_END,
  ALIGN_FLEX_START,
  ALIGN_CENTER,
  ALIGN_FLEX_END,
  DIRECTION_LTR,
} from 'yoga-layout-prebuilt';
import Component, { BaseProps } from './component';
import Hierarchical from './hierarchical';

export interface Props extends BaseProps {
  x: number;
  y: number;
  width: number;
  height: number;
  justifyContent: YogaJustifyContent;
  alignItems: YogaAlign;
}

export type TransitionKeys = 'x' | 'y' | 'width' | 'height';

export default class Layout<P> extends Component<P & Props> {
  _yoga: yoga.YogaNode = Node.create();

  constructor(props: Partial<P & Props>) {
    super(props);

    this._transitions
      .initKey('x')
      .initKey('y')
      .initKey('width')
      .initKey('height');
  }

  protected defaultProps(): P & Props {
    return {
      ...super.defaultProps(),
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      justifyContent: JUSTIFY_FLEX_START,
      alignItems: ALIGN_FLEX_START,
    };
  }

  get yoga() {
    return this._yoga;
  }

  onStateChange<Props>(
    key: keyof Props,
    value: unknown,
    _oldValue: unknown
  ): void {
    if (key === 'x') {
      this._yoga.setPosition(EDGE_LEFT, value as number);
    } else if (key === 'y') {
      this._yoga.setPosition(EDGE_TOP, value as number);
    } else if (key === 'width') {
      this._yoga.setWidth(value as number);
    } else if (key === 'height') {
      this._yoga.setHeight(value as number);
    } else if (key === 'justifyContent') {
      this._yoga.setJustifyContent(value as YogaJustifyContent);
    } else if (key === 'alignItems') {
      this._yoga.setAlignItems(value as YogaAlign);
    } else {
      return;
    }

    this.calcLayout();
  }

  addChild(node: Hierarchical): void {
    const child = node as Layout<P>;
    super.addChild(child);

    const { _yoga, _children } = this;

    _yoga.insertChild(child.yoga, _children.length - 1);

    this.calcLayout();
    child.update();
  }

  calcLayout() {
    this._yoga.calculateLayout(this.width, this.height, DIRECTION_LTR);
  }

  get computedLayout() {
    return this._yoga.getComputedLayout();
  }

  get x() {
    return this.state.x;
  }

  set x(value: number) {
    this._transitions.start('x', this.state.x, value);
  }

  get y() {
    return this.state.y;
  }

  set y(value: number) {
    this._transitions.start('y', this.state.y, value);
  }

  get width() {
    return this.state.width;
  }

  set width(value: number) {
    this._transitions.start('width', this.state.width, value);
  }

  get height() {
    return this.state.height;
  }

  set height(value: number) {
    this._transitions.start('height', this.state.height, value);
  }

  get justifyContent() {
    return this._yoga.getJustifyContent();
  }

  set justifyContent(value: YogaJustifyContent) {
    this.setState({ justifyContent: value });
    this.updateChildrenFromLayout();
  }

  get alignItems() {
    return this._yoga.getJustifyContent();
  }

  set alignItems(value: YogaJustifyContent) {
    this.setState({ alignItems: value });
    this.updateChildrenFromLayout();
  }

  updateChildrenFromLayout() {
    this._children.forEach(node => {
      const child = node as Layout<P>;
      const layout = child.computedLayout;
      child.x = layout.left;
      child.y = layout.top;
    });
  }

  setJustifyStart() {
    this.justifyContent = JUSTIFY_FLEX_START;
  }

  setJustifyCenter() {
    this.justifyContent = JUSTIFY_CENTER;
  }

  setJustifyEnd() {
    this.justifyContent = JUSTIFY_FLEX_END;
  }

  setAlignItemsStart() {
    this.alignItems = ALIGN_FLEX_START;
  }

  setAlignItemsCenter() {
    this.alignItems = ALIGN_CENTER;
  }

  setAlignItemsEnd() {
    this.alignItems = ALIGN_FLEX_END;
  }
}
