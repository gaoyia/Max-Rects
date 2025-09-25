export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  rot: boolean; // 是否旋转
  data?: any; // 关联数据
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
