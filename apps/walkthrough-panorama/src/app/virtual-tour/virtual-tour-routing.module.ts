import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VirtualTourComponent } from './virtual-tour.component';

const routes: Routes = [
  {
    path: '',
    component: VirtualTourComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../panorama-player/panorama-player.module').then(m => m.PanoramaPlayerModule),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VirtualTourRoutingModule { }
