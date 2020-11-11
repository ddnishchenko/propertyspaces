import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PanoramaPlayerComponent } from './panorama-player.component';

const routes: Routes = [
  {
    path: '',
    component: PanoramaPlayerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanoramaPlayerRoutingModule { }
