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
  addr?: ProjectLocation;
  dollhouse?: string;
  description?: string | any;
  settings?: any;
  panoramas?: Panorama[];
  gallery?: ImageGallery[];
  profile?: any;
  company?: any;
}
