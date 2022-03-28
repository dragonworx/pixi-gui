import Box from 'src/lib/node/box';
import Rectangle from 'src/lib/rectangle';

export type Cell = {
  rect: Rectangle;
  nodes: Box[];
};

export type LayoutType =
  | 'wrap'
  | 'wrap-reverse'
  | 'vertical'
  | 'vertical-reverse'
  | 'horizontal'
  | 'horizontal-reverse';

export type LayoutAlign = 'start' | 'center' | 'end';

export type Direction = 'vertical' | 'horizontal';

export type Fixture =
  | 'left'
  | 'top'
  | 'right'
  | 'bottom'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'topCenter'
  | 'bottomCenter'
  | 'leftCenter'
  | 'rightCenter'
  | 'fill'
  | 'center';
