import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModelDataResolver } from './model-data.resolver';

const routes: Routes = [
  {
    path: 'model/:id',
    loadChildren: () => import('./panorama-player/panorama-player.module').then(m => m.PanoramaPlayerModule),
    resolve: {
      model: ModelDataResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
