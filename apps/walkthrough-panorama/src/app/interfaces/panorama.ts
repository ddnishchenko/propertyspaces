export interface Panorama {
  name: string;
  panoramas: {
    panorama?: string;
    url?: string;
    x?: number;
    y?: number;
    z?: number
    floor?: number;
  }
}
