import yoga, {
  EDGE_LEFT,
  EDGE_TOP,
  Node as YogaNode,
} from 'yoga-layout-prebuilt';
import NodeWithTransitions, { Props as BaseProps } from './nodeWithTransitions';
import Node from './node';
import {
  ALIGN,
  ALIGN_VALUE,
  DIRECTION,
  DIRECTION_VALUE,
  EDGE,
  FLEX_DIRECTION,
  FLEX_DIRECTION_VALUE,
  JUSTIFY,
  JUSTIFY_VALUE,
  POSITION_TYPE,
  POSITION_TYPE_VALUE,
} from './yoga';

export interface NumericLayoutProps {
  x: number;
  y: number;
  width: number;
  height: number;
  marginLeft: number;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
}

// dynamically generated
export const numericLayoutProps = [
  'x',
  'y',
  'width',
  'height',
  'marginLeft',
  'marginTop',
  'marginRight',
  'marginBottom',
];

// defaults
export const defaultX = 0;
export const defaultY = 0;
export const defaultWidth = 100;
export const defaultHeight = 100;
export const defaultJustifyContent: JUSTIFY_VALUE = 'start';
export const defaultAlignItems: ALIGN_VALUE = 'start';
export const defaultAlignContent: ALIGN_VALUE = 'start';
export const defaultFlexDirection: FLEX_DIRECTION_VALUE = 'row';
export const defaultDirection: DIRECTION_VALUE = 'ltr';
export const defaultPosition: POSITION_TYPE_VALUE = 'relative';
export const defaultMargin = 0;

// main props
export interface Props extends BaseProps, NumericLayoutProps {
  direction: DIRECTION_VALUE;
  flexDirection: FLEX_DIRECTION_VALUE;
  justifyContent: JUSTIFY_VALUE;
  alignItems: ALIGN_VALUE;
  alignContent: ALIGN_VALUE;
}

export default class NodeWithLayout<P>
  extends NodeWithTransitions<P & Props>
  implements NumericLayoutProps
{
  _yoga: yoga.YogaNode = YogaNode.create();

  // stubs for dynamically generate props in constructor
  x = defaultX;
  y = defaultY;
  width = defaultWidth;
  height = defaultHeight;
  marginLeft = defaultMargin;
  marginTop = defaultMargin;
  marginRight = defaultMargin;
  marginBottom = defaultMargin;

  constructor(props: Partial<P & Props>) {
    super(props);

    // dynamically generate numeric props to save boilerplate
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
      alignContent: defaultAlignContent,
      flexDirection: defaultFlexDirection,
      direction: defaultDirection,
      position: defaultPosition,
      marginLeft: defaultMargin,
      marginTop: defaultMargin,
      marginRight: defaultMargin,
      marginBottom: defaultMargin,
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
      this._yoga.setJustifyContent(JUSTIFY[str as JUSTIFY_VALUE]);
    } else if (key === 'alignItems') {
      this._yoga.setAlignItems(ALIGN[str as ALIGN_VALUE]);
    } else if (key === 'alignContent') {
      this._yoga.setAlignContent(ALIGN[str as ALIGN_VALUE]);
    } else if (key === 'flexDirection') {
      this._yoga.setFlexDirection(FLEX_DIRECTION[str as FLEX_DIRECTION_VALUE]);
    } else if (key === 'position') {
      this._yoga.setPositionType(POSITION_TYPE[str as POSITION_TYPE_VALUE]);
    } else if (key === 'marginLeft') {
      this._yoga.setMargin(EDGE.left, num);
    } else if (key === 'marginTop') {
      this._yoga.setMargin(EDGE.top, num);
    } else if (key === 'marginRight') {
      this._yoga.setMargin(EDGE.right, num);
    } else if (key === 'marginBottom') {
      this._yoga.setMargin(EDGE.bottom, num);
    } else {
      // wasn't a layout prop, save re-calculating layout
      return;
    }

    this.calcLayout();

    if (key !== 'x' && key !== 'y') {
      // children need to update their visual components when anything but position changes
      this._children.forEach(node => {
        (node as NodeWithLayout<P>).onParentLayoutChanged();
      });
    }
  }

  calcLayout() {
    const { _yoga, state } = this;
    _yoga.calculateLayout(this.width, this.height, DIRECTION[state.direction]);
    this.onLayoutChanged();
  }

  onLayoutChanged() {}

  addChild(child: NodeWithLayout<P>): void {
    super.addChild(child as Node);

    const { _yoga, _children } = this;

    _yoga.insertChild(child.yoga, _children.length - 1);

    this.calcLayout();
  }

  removeChild(child: Node): void {
    this._yoga.removeChild((child as NodeWithLayout<P>).yoga);

    super.removeChild(child);
  }

  setMargin(value: number) {
    this.setState({
      marginLeft: value,
      marginTop: value,
      marginRight: value,
      marginBottom: value,
    });
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

  onParentLayoutChanged() {}
}
