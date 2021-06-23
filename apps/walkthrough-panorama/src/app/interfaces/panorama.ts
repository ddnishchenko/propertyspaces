export interface Panorama {
  name: string;
  panoramas: {
    panorama?: string | ArrayBuffer | null;
    url?: string;
    x?: number;
    y?: number;
    z?: number
    floor?: number;
    panoCameraStartAngle?: number;
    order?: number;
  }
}
