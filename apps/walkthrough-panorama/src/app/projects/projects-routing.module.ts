import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { ProjectListComponent } from './pages/project-list/project-list.component';

import { ProjectsComponent } from './projects.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectsComponent,
    children: [
      {
        path: '',
        component: ProjectListComponent
      },
      {
        path: ':id',
        component: ProjectDetailsComponent,
      },
    ]
  },
  {
    path: 'vr-tour-model/:id',
    loadChildren: () => import('../panorama-player/panorama-player.module').then(m => m.PanoramaPlayerModule),
  },
  {
    path: 'vr-tour-embed/:id',
    loadChildren: () => import('../panorama-player/panorama-player.module').then(m => m.PanoramaPlayerModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
