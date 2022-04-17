import {
  JUSTIFY_VALUE,
  ALIGN_VALUE,
  FLEX_DIRECTION_VALUE,
  DIRECTION_VALUE,
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
  paddingLeft: number;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
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
  'paddingLeft',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
];

// defaults
export const defaultX = 0;
export const defaultY = 0;
export const defaultWidth = 100;
export const defaultHeight = 100;
export const defaultAlignItems: ALIGN_VALUE = 'start';
export const defaultAlignSelf: ALIGN_VALUE = 'auto';
export const defaultAlignContent: ALIGN_VALUE = 'start';
export const defaultJustifyContent: JUSTIFY_VALUE = 'start';
export const defaultFlexDirection: FLEX_DIRECTION_VALUE = 'row';
export const defaultDirection: DIRECTION_VALUE = 'ltr';
export const defaultPosition: POSITION_TYPE_VALUE = 'relative';
export const defaultMargin = 0;
export const defaultPadding = 0;
