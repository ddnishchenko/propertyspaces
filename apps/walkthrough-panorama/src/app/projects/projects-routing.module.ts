import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { ProjectListComponent } from './pages/project-list/project-list.component';

import { ProjectsComponent } from './projects.component';
import { ProjectResolver } from './service/project.resolver';
import { ProjectsResolver } from './service/projects.resolver';

const routes: Routes = [
  {
    path: '',
    component: ProjectsComponent,
    children: [
      {
        path: '',
        component: ProjectListComponent,
        resolve: {
          projects: ProjectsResolver
        }
      }
    ]
  },
  {
    path: ':id',
    component: ProjectDetailsComponent,
    resolve: {
      project: ProjectResolver
    }
  },
  {
    path: 'vr-tour-model/:id',
    loadChildren: () => import('../panorama-player/panorama-player.module').then(m => m.PanoramaPlayerModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
