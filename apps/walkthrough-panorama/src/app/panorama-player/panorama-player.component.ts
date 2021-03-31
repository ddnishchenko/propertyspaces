import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PanoramaPlayerService } from './panorama-player.service';

@Component({
  selector: 'propertyspaces-panorama-player',
  templateUrl: './panorama-player.component.html',
  styleUrls: ['./panorama-player.component.scss']
})
export class PanoramaPlayerComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('mainScene', { static: true }) mainScene: ElementRef<HTMLCanvasElement>;

  constructor(
    private panoramaPlayer: PanoramaPlayerService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.route.data.subscribe(data => {
      this.panoramaPlayer.createScene(this.mainScene, data.model);
      this.panoramaPlayer.animate();
    });
  }

  ngOnDestroy() {
    this.panoramaPlayer.destroy();
  }

}
