import { Container, Sprite, Texture } from 'pixi.js';
import { Tween } from 'tweenyweeny';
import yoga, {
  Node as YogaNode,
  EDGE_LEFT,
  EDGE_TOP,
  EDGE_RIGHT,
  EDGE_BOTTOM,
} from 'yoga-layout-prebuilt';
import Document from '../document';
import {
  ALIGN,
  ALIGN_VALUE,
  FLEX_DIRECTION,
  FLEX_DIRECTION_VALUE,
  FLEX_WRAP,
  FLEX_WRAP_VALUE,
  JUSTIFY,
  JUSTIFY_VALUE,
  Layout,
} from './yoga';

export const defaultTransitionDuration = 250;

/**
 * To add new prop/state:
 *  1. define in Prop type
 *  2. define in defaultProps
 *  3. initialise in .init()
 *  4. update in .update()
 */

let id = 0;
const nextId = () => String(id++);

// config
export interface NumericProps {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
  backgroundColor: number;
  alpha: number;
  marginLeft: number;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  paddingLeft: number;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  borderLeft: number;
  borderTop: number;
  borderRight: number;
  borderBottom: number;
}

export interface FlexProps {
  alignItems: ALIGN_VALUE;
  alignContent: ALIGN_VALUE;
  justifyContent: JUSTIFY_VALUE;
  flexDirection: FLEX_DIRECTION_VALUE;
  flexWrap: FLEX_WRAP_VALUE;
}

export interface Props extends NumericProps, FlexProps {
  id?: string;
  parent?: Element;
}

// config
export const defaultProps: Props = {
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  width: 100,
  height: 100,
  marginLeft: 0,
  marginTop: 0,
  marginBottom: 0,
  marginRight: 0,
  paddingLeft: 0,
  paddingTop: 0,
  paddingBottom: 0,
  paddingRight: 0,
  borderLeft: 0,
  borderTop: 0,
  borderBottom: 0,
  borderRight: 0,
  backgroundColor: 0x333333,
  alpha: 0.5,
  alignItems: 'stretch',
  alignContent: 'stretch',
  justifyContent: 'start',
  flexDirection: 'row',
  flexWrap: 'no-wrap',
};

export interface State extends Props {}

export default class Element {
  _state: State;
  _yoga: yoga.YogaNode;
  _container: Container;
  _backgroundFill: Sprite;
  _parent?: Element;
  _children: Array<Element>;
  _transitions: Map<keyof NumericProps, Tween>;
  _cachedLayout?: Layout;
  _document?: Document;

  constructor(readonly props: Partial<Props> = {}) {
    this._state = {
      id: nextId(),
      ...defaultProps,
      ...props,
    };

    this._children = [];

    this._yoga = YogaNode.create();

    this._transitions = new Map();

    this._container = new Container();
    this._backgroundFill = Sprite.from(Texture.WHITE);
    this._container.addChild(this._backgroundFill);

    this.init();
  }

  addChild(element: Element) {
    this._children.push(element);
    element._parent = this;

    this._yoga.insertChild(element._yoga, this._children.length - 1);
    this._container.addChild(element._container);

    this.calculateLayout();

    this._children.forEach(child => {
      child.calculateLayout();
    });
  }

  setAsRoot(document: Document) {
    this._yoga.setWidth(document.width);
    this._yoga.setHeight(document.height);
    this._document = document;
    document.stage.addChild(this._container);
  }

  getDocument(): Document | undefined {
    if (this._document) {
      return this._document;
    }
    return this._parent?.getDocument();
  }

  // config
  init() {
    const {
      _yoga: yoga,
      _state: {
        left,
        top,
        right,
        bottom,
        width,
        height,
        backgroundColor,
        alpha,
        marginLeft,
        marginTop,
        marginRight,
        marginBottom,
        paddingLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        borderLeft,
        borderTop,
        borderRight,
        borderBottom,
        alignItems,
        alignContent,
        justifyContent,
        flexDirection,
        flexWrap,
      },
      _container,
      _backgroundFill,
    } = this;

    _container.alpha = alpha;

    if (backgroundColor === -1) {
      _backgroundFill.alpha = 0.3;
    } else {
      _backgroundFill.tint = backgroundColor;
    }

    yoga.setWidth(width);
    yoga.setHeight(height);
    yoga.setPosition(EDGE_LEFT, left);
    yoga.setPosition(EDGE_RIGHT, right);
    yoga.setPosition(EDGE_TOP, top);
    yoga.setPosition(EDGE_BOTTOM, bottom);
    yoga.setMargin(EDGE_LEFT, marginLeft);
    yoga.setMargin(EDGE_RIGHT, marginRight);
    yoga.setMargin(EDGE_TOP, marginTop);
    yoga.setMargin(EDGE_BOTTOM, marginBottom);
    yoga.setPadding(EDGE_LEFT, paddingLeft);
    yoga.setPadding(EDGE_RIGHT, paddingRight);
    yoga.setPadding(EDGE_TOP, paddingTop);
    yoga.setPadding(EDGE_BOTTOM, paddingBottom);
    yoga.setBorder(EDGE_LEFT, borderLeft);
    yoga.setBorder(EDGE_RIGHT, borderRight);
    yoga.setBorder(EDGE_TOP, borderTop);
    yoga.setBorder(EDGE_BOTTOM, borderBottom);
    yoga.setFlexDirection(FLEX_DIRECTION[flexDirection]);
    yoga.setAlignItems(ALIGN[alignItems]);
    yoga.setAlignContent(ALIGN[alignContent]);
    yoga.setJustifyContent(JUSTIFY[justifyContent]);
    yoga.setFlexWrap(FLEX_WRAP[flexWrap]);

    this.calculateLayout();
  }

  get(key: keyof Props) {
    return this._state[key];
  }

  // config?
  set(key: keyof Props, value: Props[keyof Props]) {
    if (typeof value === 'number') {
      if (
        key === 'paddingLeft' ||
        key === 'paddingTop' ||
        key === 'paddingRight' ||
        key === 'paddingBottom' ||
        key === 'borderLeft' ||
        key === 'borderTop' ||
        key === 'borderRight' ||
        key === 'borderBottom'
      ) {
        this.updateWithChildLayoutRefresh(key, value);
      } else {
        this.cacheLayout();
        this.update(key, value);
        this.updateDisplayFromCachedLayout();
      }
    } else if (
      key === 'alignItems' ||
      key === 'alignContent' ||
      key === 'justifyContent' ||
      key === 'flexDirection'
    ) {
      this.updateWithChildLayoutRefresh(key, value);
    }
  }

  // config
  update(key: keyof Props, value: Props[keyof Props]) {
    const { _yoga: yoga, _state: state } = this;
    const propNotFoundErrorMessage = `Property "${key}" not found`;

    if (typeof value === 'number') {
      if (key === 'left') {
        yoga.setPosition(EDGE_LEFT, value);
        state.left = value;
      } else if (key === 'right') {
        yoga.setPosition(EDGE_RIGHT, value);
        state.right = value;
      } else if (key === 'top') {
        yoga.setPosition(EDGE_TOP, value);
        state.top = value;
      } else if (key === 'bottom') {
        yoga.setPosition(EDGE_BOTTOM, value);
        state.bottom = value;
      } else if (key === 'width') {
        yoga.setWidth(value);
        state.width = value;
      } else if (key === 'height') {
        yoga.setHeight(value);
        state.height = value;
      } else if (key === 'marginLeft') {
        yoga.setMargin(EDGE_LEFT, value);
        state.marginLeft = value;
      } else if (key === 'marginTop') {
        yoga.setMargin(EDGE_TOP, value);
        state.marginTop = value;
      } else if (key === 'marginRight') {
        yoga.setMargin(EDGE_RIGHT, value);
        state.marginRight = value;
      } else if (key === 'marginBottom') {
        yoga.setMargin(EDGE_BOTTOM, value);
        state.marginBottom = value;
      } else if (key === 'paddingLeft') {
        yoga.setPadding(EDGE_LEFT, value);
        state.paddingLeft = value;
      } else if (key === 'paddingTop') {
        yoga.setPadding(EDGE_TOP, value);
        state.paddingTop = value;
      } else if (key === 'paddingRight') {
        yoga.setPadding(EDGE_RIGHT, value);
        state.paddingRight = value;
      } else if (key === 'paddingBottom') {
        yoga.setPadding(EDGE_BOTTOM, value);
        state.paddingBottom = value;
      } else if (key === 'borderLeft') {
        yoga.setBorder(EDGE_LEFT, value);
        state.borderLeft = value;
      } else if (key === 'borderTop') {
        yoga.setBorder(EDGE_TOP, value);
        state.borderTop = value;
      } else if (key === 'borderRight') {
        yoga.setBorder(EDGE_RIGHT, value);
        state.borderRight = value;
      } else if (key === 'borderBottom') {
        yoga.setBorder(EDGE_BOTTOM, value);
        state.borderBottom = value;
      } else {
        throw new Error(propNotFoundErrorMessage);
      }
    }

    if (typeof value === 'string') {
      if (key === 'flexDirection') {
        const val = value as FLEX_DIRECTION_VALUE;
        yoga.setFlexDirection(FLEX_DIRECTION[val]);
        state.flexDirection = val;
      } else if (key === 'alignItems') {
        const val = value as ALIGN_VALUE;
        yoga.setAlignItems(ALIGN[val]);
        state.alignItems = val;
      } else if (key === 'alignContent') {
        const val = value as ALIGN_VALUE;
        yoga.setAlignContent(ALIGN[val]);
        state.alignContent = val;
      } else if (key === 'justifyContent') {
        const val = value as JUSTIFY_VALUE;
        yoga.setJustifyContent(JUSTIFY[val]);
        state.justifyContent = val;
      } else if (key === 'flexWrap') {
        const val = value as FLEX_WRAP_VALUE;
        yoga.setFlexWrap(FLEX_WRAP[val]);
        state.flexWrap = val;
      } else {
        throw new Error(propNotFoundErrorMessage);
      }
    }

    this.calculateLayout();
  }

  calculateLayout() {
    const { _yoga, _parent } = this;

    if (_parent?._yoga.isDirty) {
      _parent._yoga.calculateLayout();
    }

    if (_yoga.isDirty()) {
      _yoga.calculateLayout();
    }

    this.updateDisplayFromLayout();
  }

  cacheLayout() {
    this._cachedLayout = this.computedLayout;
  }

  updateWithChildLayoutRefresh(key: keyof Props, value: Props[keyof Props]) {
    this._children.forEach(child => child.cacheLayout());

    this.update(key, value);

    this._children.forEach(child => {
      child.calculateLayout();
      child.updateDisplayFromCachedLayout();
    });
  }

  updateDisplayFromLayout() {
    const { _yoga, _container, _backgroundFill } = this;
    const { left, top, width, height } = _yoga.getComputedLayout();

    _container.x = left;
    _container.y = top;
    _backgroundFill.width = width;
    _backgroundFill.height = height;
  }

  updateDisplayFromCachedLayout() {
    const { _cachedLayout } = this;

    if (_cachedLayout) {
      const {
        left: oldLeft,
        top: oldTop,
        width: oldWidth,
        height: oldHeight,
      } = _cachedLayout;

      const { left, top, width, height } = this._yoga.getComputedLayout();

      if (left !== oldLeft) {
        this.startTransition('left', oldLeft, left);
      }

      if (top !== oldTop) {
        this.startTransition('top', oldTop, top);
      }

      if (width !== oldWidth) {
        this.startTransition('width', oldWidth, width);
      }

      if (height !== oldHeight) {
        this.startTransition('height', oldHeight, height);
      }
    }
  }

  startTransition(key: keyof NumericProps, fromValue: number, toValue: number) {
    const tween = this.getTransition(key);

    if (tween.duration === 0) {
      this.onTransitionUpdate(key, toValue);
    } else {
      tween.start(fromValue, toValue);
    }
  }

  getTransition(key: keyof NumericProps) {
    const { _transitions } = this;

    if (!_transitions.has(key)) {
      const tween = new Tween(defaultTransitionDuration);
      tween.onUpdate(value => this.onTransitionUpdate(key, value));
      _transitions.set(key, tween);
    }

    return _transitions.get(key)!;
  }

  onTransitionUpdate(key: keyof NumericProps, value: number) {
    const { _container, _backgroundFill } = this;

    if (key === 'left') {
      _container.x = value;
    } else if (key === 'top') {
      _container.y = value;
    } else if (key === 'width') {
      _backgroundFill.width = value;
    } else if (key === 'height') {
      _backgroundFill.height = value;
    }
  }

  setMargin(value: number) {
    const { _yoga, _state } = this;

    _yoga.setMargin(EDGE_LEFT, value);
    _yoga.setMargin(EDGE_RIGHT, value);
    _yoga.setMargin(EDGE_TOP, value);
    _yoga.setMargin(EDGE_BOTTOM, value);
    _state.marginLeft = value;
    _state.marginTop = value;
    _state.marginRight = value;
    _state.marginBottom = value;

    this.cacheLayout();
    this.calculateLayout();
    this.updateDisplayFromCachedLayout();
  }

  setPadding(value: number) {
    const { _yoga, _state } = this;

    _yoga.setPadding(EDGE_LEFT, value);
    _yoga.setPadding(EDGE_RIGHT, value);
    _yoga.setPadding(EDGE_TOP, value);
    _yoga.setPadding(EDGE_BOTTOM, value);
    _state.paddingLeft = value;
    _state.paddingTop = value;
    _state.paddingRight = value;
    _state.paddingBottom = value;

    this._children.forEach(child => child.cacheLayout());

    this.calculateLayout();

    this._children.forEach(child => {
      child.calculateLayout();
      child.updateDisplayFromCachedLayout();
    });
  }

  setBorder(value: number) {
    const { _yoga, _state } = this;

    _yoga.setBorder(EDGE_LEFT, value);
    _yoga.setBorder(EDGE_RIGHT, value);
    _yoga.setBorder(EDGE_TOP, value);
    _yoga.setBorder(EDGE_BOTTOM, value);
    _state.borderLeft = value;
    _state.borderRight = value;
    _state.borderBottom = value;
    _state.borderTop = value;

    this._children.forEach(child => child.cacheLayout());

    this.calculateLayout();

    this._children.forEach(child => {
      child.calculateLayout();
      child.updateDisplayFromCachedLayout();
    });
  }

  get computedLayout() {
    return this._yoga.getComputedLayout();
  }

  get id() {
    return this._state.id;
  }
}
