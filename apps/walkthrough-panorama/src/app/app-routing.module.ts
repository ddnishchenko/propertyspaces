import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModelDataResolver } from './model-data.resolver';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'projects'
  },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
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
  { path: 'projects', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule) },
  {
    path: 'virtual-tour',
    loadChildren: () => import('./virtual-tour/virtual-tour.module').then(m => m.VirtualTourModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy', initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
