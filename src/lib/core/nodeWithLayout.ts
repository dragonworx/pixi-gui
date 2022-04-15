import yoga, {
  EDGE_LEFT,
  EDGE_TOP,
  Node as YogaNode,
  YogaJustifyContent,
  YogaAlign,
  YogaFlexDirection,
  FLEX_DIRECTION_COLUMN,
  FLEX_DIRECTION_COLUMN_REVERSE,
  FLEX_DIRECTION_ROW,
  FLEX_DIRECTION_ROW_REVERSE,
  FLEX_DIRECTION_COUNT,
  JUSTIFY_FLEX_START,
  JUSTIFY_CENTER,
  JUSTIFY_FLEX_END,
  ALIGN_FLEX_START,
  ALIGN_CENTER,
  ALIGN_FLEX_END,
  DIRECTION_LTR,
  POSITION_TYPE_ABSOLUTE,
  POSITION_TYPE_RELATIVE,
} from 'yoga-layout-prebuilt';
import NodeWithState, { BaseProps } from './nodeWithState';
import Node from './node';
import { TransitionKey } from './transition';

export interface NumericLayoutProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const numericLayoutProps = ['x', 'y', 'width', 'height'];

export const JUSTIFY: Record<string, YogaJustifyContent> = {
  start: JUSTIFY_FLEX_START,
  center: JUSTIFY_CENTER,
  end: JUSTIFY_FLEX_END,
};

export type JUSTIFY_VALUE = 'start' | 'center' | 'end';

export const ALIGN: Record<string, YogaAlign> = {
  start: ALIGN_FLEX_START,
  center: ALIGN_CENTER,
  end: ALIGN_FLEX_END,
};

export type ALIGN_VALUE = 'start' | 'center' | 'end';

export const FLEX_DIRECTION: Record<string, YogaFlexDirection> = {
  row: FLEX_DIRECTION_ROW,
  'row-reverse': FLEX_DIRECTION_ROW_REVERSE,
  column: FLEX_DIRECTION_COLUMN,
  'column-reverse': FLEX_DIRECTION_COLUMN_REVERSE,
};

export type FLEX_DIRECTION_VALUE =
  | 'row'
  | 'row-reverse'
  | 'column'
  | 'column-reverse';

export const defaultX = 0;
export const defaultY = 0;
export const defaultWidth = 100;
export const defaultHeight = 100;
export const defaultJustifyContent: JUSTIFY_VALUE = 'start';
export const defaultAlignItems: ALIGN_VALUE = 'start';
export const defaultFlexDirection = 'row';

export interface Props extends BaseProps, NumericLayoutProps {
  flexDirection: FLEX_DIRECTION_VALUE;
  justifyContent: JUSTIFY_VALUE;
  alignItems: ALIGN_VALUE;
}

export default class NodeWithLayout<P>
  extends NodeWithState<P & Props>
  implements NumericLayoutProps
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

    numericLayoutProps.forEach(key => {
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

  protected defaultProps(): P & Props {
    return {
      ...super.defaultProps(),
      x: defaultX,
      y: defaultY,
      width: defaultWidth,
      height: defaultHeight,
      justifyContent: defaultJustifyContent,
      alignItems: defaultAlignItems,
      flexDirection: defaultFlexDirection,
    };
  }

  get yoga() {
    return this._yoga;
  }

  protected transitionKeys(): TransitionKey[] {
    return [...super.transitionKeys(), 'x', 'y', 'width', 'height'];
  }

  onStateChange<Props>(
    key: keyof Props,
    value: unknown,
    _oldValue: unknown
  ): void {
    const num = value as number;
    const str = value as string;

    if (key === 'x') {
      this._yoga.setPosition(EDGE_LEFT, num);
    } else if (key === 'y') {
      this._yoga.setPosition(EDGE_TOP, num);
    } else if (key === 'width') {
      this._yoga.setWidth(num);
    } else if (key === 'height') {
      this._yoga.setHeight(num);
    } else if (key === 'justifyContent') {
      this._yoga.setJustifyContent(JUSTIFY[str]);
    } else if (key === 'alignItems') {
      this._yoga.setAlignItems(ALIGN[str]);
    } else if (key === 'flexDirection') {
      this._yoga.setFlexDirection(FLEX_DIRECTION[str]);
    } else {
      return;
    }

    this.calcLayout();

    if (key === 'alignItems' || key === 'justifyContent') {
      this.updateChildrenFromLayout();
    }
  }

  calcLayout() {
    const { _yoga, state, _transitions } = this;
    _yoga.calculateLayout(this.width, this.height, DIRECTION_LTR);
    const { left, top, width, height } = this._yoga.getComputedLayout();
    if (_transitions.getDuration('x') === 0) {
      state.x = left;
    }
    if (_transitions.getDuration('y') === 0) {
      state.y = top;
    }
    if (_transitions.getDuration('width') === 0) {
      state.width = width;
    }
    if (_transitions.getDuration('height') === 0) {
      state.height = height;
    }
    return this;
  }

  addChild(child: NodeWithLayout<any>): void {
    super.addChild(child as Node);

    const { _yoga, _children } = this;

    _yoga.insertChild(child.yoga, _children.length - 1);

    this.calcLayout();
    child.update();
  }

  get computedLayout() {
    return this._yoga.getComputedLayout();
  }

  get justifyContent() {
    return this.state.justifyContent;
  }

  set justifyContent(value: JUSTIFY_VALUE) {
    this.setState({ justifyContent: value });
  }

  get alignItems() {
    return this.state.alignItems;
  }

  set alignItems(value: ALIGN_VALUE) {
    this.setState({ alignItems: value });
  }

  get flexDirection() {
    return this.state.flexDirection;
  }

  set flexDirection(value: FLEX_DIRECTION_VALUE) {
    this.setState({ alignItems: value });
  }

  updateChildrenFromLayout() {
    this._children.forEach(node => {
      (node as NodeWithLayout<P>).calcLayout().refresh().refresh2();
    });
  }

  refresh() {
    return this;
  }

  refresh2() {
    // this.calcLayout();
    const {
      _transitions,
      computedLayout: { left, top, width, height },
    } = this;
    // const { x: left, y: top, width, height } = this.state;
    console.log(this.id, left, top);
    // this.x = left;
    // this.y = top;
    // this.width = width;
    // this.height = height;
    if (_transitions.getDuration('x') > 0) {
      this.x = left;
    }
    if (_transitions.getDuration('y') > 0) {
      this.y = top;
    }
    if (_transitions.getDuration('width') > 0) {
      this.width = width;
    }
    if (_transitions.getDuration('height') > 0) {
      this.height = height;
    }
    return this;
  }
}
