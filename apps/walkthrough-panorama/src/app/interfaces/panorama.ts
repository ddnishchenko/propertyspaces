export interface Panorama {
  name: string;
  panoramas: {
    panorama?: string;
    url?: string;
    x?: string | number;
    y?: string | number;
    z?: string | number;
  }
}
