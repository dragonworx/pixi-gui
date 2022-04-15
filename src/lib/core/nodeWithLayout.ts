import yoga, {
  EDGE_LEFT,
  EDGE_TOP,
  Node as YogaNode,
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
import NodeWithState, { BaseProps } from './nodeWithState';
import Node from './node';

export interface LayoutAPI {
  x: number;
  y: number;
  width: number;
  height: number;
}

const layoutApiKeys = ['x', 'y', 'width', 'height'];

export const JUSTIFY = {
  start: JUSTIFY_FLEX_START,
  center: JUSTIFY_CENTER,
  end: JUSTIFY_FLEX_END,
};

export const ALIGN = {
  start: ALIGN_FLEX_START,
  center: ALIGN_CENTER,
  end: ALIGN_FLEX_END,
};

export const defaultX = 0;
export const defaultY = 0;
export const defaultWidth = 100;
export const defaultHeight = 100;

export interface Props extends BaseProps, LayoutAPI {
  justifyContent: YogaJustifyContent;
  alignItems: YogaAlign;
}

export default class NodeWithLayout<P>
  extends NodeWithState<P & Props>
  implements LayoutAPI
{
  _yoga: yoga.YogaNode = YogaNode.create();

  x = defaultX;
  y = defaultY;
  width = defaultWidth;
  height = defaultHeight;

  constructor(props: Partial<P & Props>) {
    super(props);

    this._transitions
      .initKey('x')
      .initKey('y')
      .initKey('width')
      .initKey('height');

    layoutApiKeys.forEach(key => {
      Object.defineProperty(this, key, {
        get() {
          return this.state[key];
        },
        set(value: number) {
          this._transitions.start(key, this.state[key], value);
        },
      });
    });
  }

  foo = '';

  protected defaultProps(): P & Props {
    return {
      ...super.defaultProps(),
      x: defaultX,
      y: defaultY,
      width: defaultWidth,
      height: defaultHeight,
      justifyContent: JUSTIFY_FLEX_START,
      alignItems: ALIGN_FLEX_START,
    };
  }

  get yoga() {
    return this._yoga;
  }

  protected transitionKeys(): string[] {
    return [...super.transitionKeys(), 'x', 'y', 'width', 'height'];
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

  addChild(child: NodeWithLayout<any>): void {
    super.addChild(child as Node);

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
      const child = node as NodeWithLayout<P>;
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
