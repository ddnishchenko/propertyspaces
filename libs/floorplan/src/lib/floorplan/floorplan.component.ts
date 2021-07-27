import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SvgZoomPanDirective } from 'libs/svgzoompan/src/lib/svgzoompan.directive';

@Component({
  selector: 'propertyspaces-floorplan',
  templateUrl: './floorplan.component.html',
  styleUrls: ['./floorplan.component.scss']
})
export class FloorplanComponent implements OnInit {
  @ViewChild(SvgZoomPanDirective) svgZoomPan;
  @Input() url;
  @Input() floor: any;
  @Input() navs: any;
  @Input() showNav;
  @Input() activePoint: any;
  @Input() rotationAngle: any;
  @Output() nav = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
  scaleDots(data) {
    return {
      width: `calc(${data.nav_dots_width_}%)`,
      height: `calc(${data.nav_dots_height_}%)`,
      // transform: `rotate(${-data.nav_dots_rotation}deg)`,
      top: `${data.nav_dots_top_}%`,
      left: `${data.nav_dots_left_}%`
    }
  }
  getStyleForDot(data, p) {
    return data ? {
      [data.nav_dots_mirror_v ? 'bottom' : 'top']: `calc(${p.x}%)`,
      [data.nav_dots_mirror_h ? 'right' : 'left']: `calc(${p.z}%)`,
      transform: `rotate(${data.nav_dots_rotation}deg)`
    } : {}
  }
  navTo(index) {
    this.nav.emit(index);
  }
  zoom(zoom?: string) {
    switch(zoom) {
      case '-':
        this.svgZoomPan.svg.zoomOut();
        break;
      case '+':
        this.svgZoomPan.svg.zoomIn();
        break;
      default:
        this.svgZoomPan.svg.resetZoom();
    }
  }
}