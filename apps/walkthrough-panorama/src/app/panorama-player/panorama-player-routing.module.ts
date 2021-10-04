import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectResolver } from '../projects/service/project.resolver';
import { PanoramaPlayerComponent } from './panorama-player.component';

const routes: Routes = [
  {
    path: '',
    component: PanoramaPlayerComponent,
    resolve: {
      project: ProjectResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanoramaPlayerRoutingModule { }
