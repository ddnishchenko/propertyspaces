import { Panorama } from "./panorama";

export interface Project {
  name?: string;
  address?: string;
  additional_date?: any;
  client_id?: string;
  id?: string;
  path?: string;
  project_id?: string;
  rowid?: string;
  __permissions?: {
    canUpdate?: boolean;
    canRemove?: boolean;
  }
  data?: Panorama[];
  error?: string;
}
