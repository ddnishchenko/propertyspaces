export interface Panorama {
  id?: string;
  name?: string;
  url?: string | ArrayBuffer | null;
  x?: number;
  y?: number;
  z?: number
  floor?: number;
  panoCameraStartAngle?: number;
  visibilityRadius?: number;
  order?: string;
  index?: number;
  neighbors?: string[]
}
