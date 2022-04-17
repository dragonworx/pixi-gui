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
  Layout,
} from './yoga';
import {
  NumericLayoutProps,
  defaultX,
  defaultY,
  defaultWidth,
  defaultHeight,
  defaultMargin,
  numericLayoutProps,
  defaultJustifyContent,
  defaultAlignItems,
  defaultAlignContent,
  defaultFlexDirection,
  defaultDirection,
  defaultPosition,
  defaultPadding,
  defaultAlignSelf,
} from './nodeWithLayout.types';

export interface Props extends BaseProps, NumericLayoutProps {
  direction: DIRECTION_VALUE;
  flexDirection: FLEX_DIRECTION_VALUE;
  alignItems: ALIGN_VALUE;
  alignContent: ALIGN_VALUE;
  alignSelf: ALIGN_VALUE;
  justifyContent: JUSTIFY_VALUE;
}

export default class NodeWithLayout<P>
  extends NodeWithTransitions<P & Props>
  implements NumericLayoutProps
{
  _yoga: yoga.YogaNode = YogaNode.create();
  _lastLayout?: Layout;

  // stubs for dynamically generate props in constructor
  x = defaultX;
  y = defaultY;
  width = defaultWidth;
  height = defaultHeight;
  marginLeft = defaultMargin;
  marginTop = defaultMargin;
  marginRight = defaultMargin;
  marginBottom = defaultMargin;
  paddingLeft = defaultPadding;
  paddingTop = defaultPadding;
  paddingRight = defaultPadding;
  paddingBottom = defaultPadding;

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
      alignItems: defaultAlignItems,
      alignContent: defaultAlignContent,
      alignSelf: defaultAlignSelf,
      justifyContent: defaultJustifyContent,
      flexDirection: defaultFlexDirection,
      direction: defaultDirection,
      position: defaultPosition,
      marginLeft: defaultMargin,
      marginTop: defaultMargin,
      marginRight: defaultMargin,
      marginBottom: defaultMargin,
      paddingLeft: defaultPadding,
      paddingTop: defaultPadding,
      paddingRight: defaultPadding,
      paddingBottom: defaultPadding,
    };
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
    } else if (key === 'alignSelf') {
      this._yoga.setAlignSelf(ALIGN[str as ALIGN_VALUE]);
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
    } else if (key === 'paddingLeft') {
      this._yoga.setPadding(EDGE.left, num);
    } else if (key === 'paddingTop') {
      this._yoga.setPadding(EDGE.top, num);
    } else if (key === 'paddingRight') {
      this._yoga.setPadding(EDGE.right, num);
    } else if (key === 'paddingBottom') {
      this._yoga.setPadding(EDGE.bottom, num);
    } else {
      // wasn't a layout prop, save re-calculating layout
      return;
    }

    this.calcLayout();

    if (key !== 'x' && key !== 'y') {
      // children need to update their visual components when anything but position changes
      this._children.forEach(node => {
        (node as NodeWithLayout<P>).onLayoutChanged();
      });
    }
  }

  calcLayout() {
    const { _yoga, state, computedLayout } = this;
    this._lastLayout = computedLayout;
    _yoga.calculateLayout(undefined, undefined, DIRECTION[state.direction]);
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
    // this.onLayoutChanged();
  }

  setPadding(value: number) {
    this.setState({
      paddingLeft: value,
      paddingRight: value,
      paddingTop: value,
      paddingBottom: value,
    });
  }

  get yoga() {
    return this._yoga;
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

  get alignSelf() {
    return this.state.alignSelf;
  }

  set alignSelf(value: ALIGN_VALUE) {
    this.setState({ alignSelf: value });
  }

  get flexDirection() {
    return this.state.flexDirection;
  }

  set flexDirection(value: FLEX_DIRECTION_VALUE) {
    this.setState({ alignItems: value });
  }
}
