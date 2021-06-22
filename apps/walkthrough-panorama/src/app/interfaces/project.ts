import { Panorama } from "./panorama";
import { ProjectSite } from "./project-site";

export interface Project {
  name?: string;
  address?: string;
  additional_data?: any;
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
  project?: ProjectSite;
  error?: string;
}
