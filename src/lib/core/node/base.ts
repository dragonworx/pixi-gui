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
  JUSTIFY,
  JUSTIFY_VALUE,
  Layout,
} from './yoga';

/**
 * To add new prop/state:
 *  1. define in Prop type
 *  2. define in defaultProps
 *  3. initialise in .init()
 *  4. update in .update()
 */

let id = 0;
const nextId = () => String(id++);

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
}

export interface FlexProps {
  alignItems: ALIGN_VALUE;
  justifyContent: JUSTIFY_VALUE;
  flexDirection: FLEX_DIRECTION_VALUE;
}

export interface Props extends NumericProps, FlexProps {
  id?: string;
  parent?: Element;
}

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
  backgroundColor: 0x333333,
  alpha: 0.5,
  alignItems: 'start',
  justifyContent: 'start',
  flexDirection: 'row',
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
    this._container.addChild(element._container);
    this._yoga.insertChild(element._yoga, this._children.length - 1);
    this.calculateLayout();
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
        alignItems,
        justifyContent,
        flexDirection,
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
    yoga.setFlexDirection(FLEX_DIRECTION[flexDirection]);
    yoga.setAlignItems(ALIGN[alignItems]);
    yoga.setJustifyContent(JUSTIFY[justifyContent]);

    this.calculateLayout();
  }

  set(key: keyof Props, value: Props[keyof Props]) {
    const { _children } = this;
    if (typeof value === 'number') {
      if (
        key === 'paddingLeft' ||
        key === 'paddingTop' ||
        key === 'paddingRight' ||
        key === 'paddingBottom'
      ) {
        this.updateWithChildLayoutRefresh(key, value);
      } else {
        this.cacheLayout();
        this.update(key, value);
        this.updateDisplayFromCachedLayout();
      }
    } else if (
      key === 'alignItems' ||
      key === 'justifyContent' ||
      key === 'flexDirection'
    ) {
      this.updateWithChildLayoutRefresh(key, value);
    }
  }

  get(key: keyof Props) {
    return this._state[key];
  }

  update(key: keyof Props, value: Props[keyof Props]) {
    const { _yoga: yoga, _state: state } = this;
    if (typeof value === 'number') {
      // numeric prop
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
      } else {
        throw new Error(`Property "${key}" not found`);
      }
    } else if (typeof value === 'string') {
      // flex layout prop
      if (key === 'flexDirection') {
        const val = value as FLEX_DIRECTION_VALUE;
        yoga.setFlexDirection(FLEX_DIRECTION[val]);
        state.flexDirection = val;
      } else if (key === 'alignItems') {
        const val = value as ALIGN_VALUE;
        yoga.setAlignItems(ALIGN[val]);
        state.alignItems = val;
      } else if (key === 'justifyContent') {
        const val = value as JUSTIFY_VALUE;
        yoga.setJustifyContent(JUSTIFY[val]);
        state.justifyContent = val;
      } else {
        throw new Error(`Property "${key}" not found`);
      }
    }

    this.calculateLayout();
  }

  calculateLayout() {
    const { _yoga, _parent, _children } = this;
    if (_parent?._yoga.isDirty) {
      _parent._yoga.calculateLayout();
    }
    if (_yoga.isDirty()) {
      _yoga.calculateLayout();
      this.updateDisplayFromLayout();
    }
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
        this.getTransition('left').start(oldLeft, left);
      }

      if (top !== oldTop) {
        this.getTransition('top').start(oldTop, top);
      }

      if (width !== oldWidth) {
        this.getTransition('width').start(oldWidth, width);
      }

      if (height !== oldHeight) {
        this.getTransition('height').start(oldHeight, height);
      }
    }
  }

  getTransition(key: keyof NumericProps) {
    const { _transitions } = this;
    if (!_transitions.has(key)) {
      const tween = new Tween(250);
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

  get computedLayout() {
    return this._yoga.getComputedLayout();
  }

  get id() {
    return this._state.id;
  }
}
