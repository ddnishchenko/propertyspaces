import { ImageGallery } from './image-gallery';
import { Panorama } from './panorama';

interface ProjectLocation {
  lat?: number;
  lng?: number;
  address?: string;
  mapUrl?: string;
  streetViewUrl?: string;
  mapEnabled?: boolean;
  streetViewEnabled?: boolean;
}



export interface Project {
  id?: string;
  name?: string;
  location?: ProjectLocation;
  dollhouse?: string;
  description?: string;
  settings?: any;
  panoramas?: Panorama[];
  gallery?: ImageGallery[];
}
