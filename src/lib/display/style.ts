export interface Sides {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Geometry {
  origin: Position;
  position: Position;
  size: Size;
  margin: Sides;
  padding: Sides;
  fixture: Partial<Sides>;
}

export type FillType = 'solid' | 'none';

export interface Fill {
  type: FillType;
  color?: string;
}

export interface Stroke {
  width: number;
  color: string;
  radius?: number;
}

export interface Appearance {
  fill?: Fill;
  stroke?: Stroke;
}
