import yoga, {
  EDGE_LEFT,
  EDGE_TOP,
  Node as YogaNode,
  DIRECTION_LTR,
} from 'yoga-layout-prebuilt';
import NodeWithTransitions, { Props as BaseProps } from './nodeWithTransitions';
import Node from './node';
import {
  ALIGN,
  ALIGN_VALUE,
  FLEX_DIRECTION,
  FLEX_DIRECTION_VALUE,
  JUSTIFY,
  JUSTIFY_VALUE,
} from './yoga';

export interface NumericLayoutProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const numericLayoutProps = ['x', 'y', 'width', 'height'];

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
  extends NodeWithTransitions<P & Props>
  implements NumericLayoutProps
{
  _yoga: yoga.YogaNode = YogaNode.create();

  x = defaultX;
  y = defaultY;
  width = defaultWidth;
  height = defaultHeight;

  constructor(props: Partial<P & Props>) {
    super(props);

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
    } else if (key === 'flexDirection') {
      this._yoga.setFlexDirection(FLEX_DIRECTION[str as FLEX_DIRECTION_VALUE]);
    } else {
      return;
    }

    this.calcLayout();

    if (key === 'justifyContent' || key === 'alignItems') {
      this.updateChildrenFromLayout();
    }
  }

  calcLayout() {
    const { _yoga } = this;
    _yoga.calculateLayout(
      this.width,
      this.height,
      DIRECTION_LTR /** todo: add to props */
    );
  }

  addChild(child: NodeWithLayout<any>): void {
    super.addChild(child as Node);

    const { _yoga, _children } = this;

    _yoga.insertChild(child.yoga, _children.length - 1);

    this.calcLayout();
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
      (node as NodeWithLayout<P>).onParentLayoutChanged();
    });
  }

  onParentLayoutChanged() {}
}
