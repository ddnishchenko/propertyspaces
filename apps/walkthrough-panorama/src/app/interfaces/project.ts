import { Panorama } from "./panorama";

export interface Project {
  client_id?: string;
  id?: string;
  path?: string;
  project_id?: string;
  rowid?: string;
  __permissions?: {
    canUpdate?: boolean;
    canRemove?: boolean;
  }
  data?: Panorama[]
}
