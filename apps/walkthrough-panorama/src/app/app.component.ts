import { Component, OnInit } from '@angular/core';
import { PanoramaPlayerService } from './panorama-player/panorama-player.service';
import { map } from 'rxjs/operators';
import { ProjectsService } from './projects/service/projects.service';

@Component({
  selector: 'propertyspaces-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  rotationY$;
  constructor(
    public panoramaPlayer: PanoramaPlayerService,
    private projcetService: ProjectsService
  ) {}

  ngOnInit() {
    this.rotationY$ = this.panoramaPlayer.modelData$.pipe()
  }
  updateY(y) {
    this.panoramaPlayer.changeMeshY(+y);
  }
  saveY(id, y) {
    this.projcetService.updateRotationProject(id, y);
  }
}
