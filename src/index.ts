export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  rot: boolean;
  data?: any;
}

export interface FreeRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Job {
  w: number;
  h: number;
  data?: any;
}

export { MaxRectsPacker } from "./MaxRectsPacker";
export { MaxRectsPackerMultiPage } from "./MaxRectsPackerMultiPage";