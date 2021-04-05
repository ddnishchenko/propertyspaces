import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModelDataResolver } from './model-data.resolver';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'projects'
  },
  {
    path: 'model/:id',
    loadChildren: () => import('./panorama-player/panorama-player.module').then(m => m.PanoramaPlayerModule),
    resolve: {
      model: ModelDataResolver
    }
  },
  {
    path: 'embed/:id',
    loadChildren: () => import('./panorama-player/panorama-player.module').then(m => m.PanoramaPlayerModule),
    resolve: {
      model: ModelDataResolver
    },
    data: {}
  },
  { path: 'projects', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
