import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PanoramaPlayerService } from './panorama-player.service';

@Component({
  selector: 'propertyspaces-panorama-player',
  templateUrl: './panorama-player.component.html',
  styleUrls: ['./panorama-player.component.scss']
})
export class PanoramaPlayerComponent implements OnInit {

  @ViewChild('mainScene', { static: true }) mainScene: ElementRef<HTMLCanvasElement>;

  constructor(
    private panoramaPlayer: PanoramaPlayerService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.panoramaPlayer.createScene(this.mainScene, data.model);
      this.panoramaPlayer.animate();
    });
    
  }

}
