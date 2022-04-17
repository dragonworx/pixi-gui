import {
  YogaJustifyContent,
  YogaAlign,
  YogaFlexDirection,
  FLEX_DIRECTION_COLUMN,
  FLEX_DIRECTION_COLUMN_REVERSE,
  FLEX_DIRECTION_ROW,
  FLEX_DIRECTION_ROW_REVERSE,
  JUSTIFY_FLEX_START,
  JUSTIFY_CENTER,
  JUSTIFY_FLEX_END,
  JUSTIFY_SPACE_AROUND,
  JUSTIFY_SPACE_BETWEEN,
  JUSTIFY_SPACE_EVENLY,
  ALIGN_FLEX_START,
  ALIGN_CENTER,
  ALIGN_FLEX_END,
  ALIGN_AUTO,
  ALIGN_BASELINE,
  ALIGN_SPACE_AROUND,
  ALIGN_SPACE_BETWEEN,
  ALIGN_STRETCH,
  DIRECTION_LTR,
  DIRECTION_RTL,
  DIRECTION_INHERIT,
  YogaDirection,
  YogaPositionType,
  POSITION_TYPE_RELATIVE,
  POSITION_TYPE_ABSOLUTE,
} from 'yoga-layout-prebuilt';

export type JUSTIFY_VALUE =
  | 'start'
  | 'center'
  | 'end'
  | 'space-around'
  | 'space-between'
  | 'space-evenly';

export const JUSTIFY: Record<JUSTIFY_VALUE, YogaJustifyContent> = {
  start: JUSTIFY_FLEX_START,
  center: JUSTIFY_CENTER,
  end: JUSTIFY_FLEX_END,
  'space-around': JUSTIFY_SPACE_AROUND,
  'space-between': JUSTIFY_SPACE_BETWEEN,
  'space-evenly': JUSTIFY_SPACE_EVENLY,
};

export type ALIGN_VALUE =
  | 'start'
  | 'center'
  | 'end'
  | 'auto'
  | 'baseline'
  | 'space-around'
  | 'space-between'
  | 'stretch';

export const ALIGN: Record<ALIGN_VALUE, YogaAlign> = {
  start: ALIGN_FLEX_START,
  center: ALIGN_CENTER,
  end: ALIGN_FLEX_END,
  auto: ALIGN_AUTO,
  baseline: ALIGN_BASELINE,
  'space-around': ALIGN_SPACE_AROUND,
  'space-between': ALIGN_SPACE_BETWEEN,
  stretch: ALIGN_STRETCH,
};

export type FLEX_DIRECTION_VALUE =
  | 'row'
  | 'row-reverse'
  | 'column'
  | 'column-reverse';

export const FLEX_DIRECTION: Record<FLEX_DIRECTION_VALUE, YogaFlexDirection> = {
  row: FLEX_DIRECTION_ROW,
  'row-reverse': FLEX_DIRECTION_ROW_REVERSE,
  column: FLEX_DIRECTION_COLUMN,
  'column-reverse': FLEX_DIRECTION_COLUMN_REVERSE,
};

export type DIRECTION_VALUE = 'inherit' | 'ltr' | 'rtl';

export const DIRECTION: Record<DIRECTION_VALUE, YogaDirection> = {
  inherit: DIRECTION_INHERIT,
  ltr: DIRECTION_LTR,
  rtl: DIRECTION_RTL,
};

export type POSITION_TYPE_VALUE = 'relative' | 'absolute';

export const POSITION_TYPE: Record<POSITION_TYPE_VALUE, YogaPositionType> = {
  relative: POSITION_TYPE_RELATIVE,
  absolute: POSITION_TYPE_ABSOLUTE,
};
