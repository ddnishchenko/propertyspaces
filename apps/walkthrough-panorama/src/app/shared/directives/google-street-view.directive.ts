import { MapsAPILoader } from '@agm/core';
import { AfterContentInit, Directive, ElementRef, Input, NgZone } from '@angular/core';

@Directive({
  selector: '[propertyspacesGoogleStreetView]'
})
export class GoogleStreetViewDirective implements AfterContentInit {
  @Input() coords: {lat: number; lng: number};
  streetView: any;
  constructor(
    private mapsAPILoader: MapsAPILoader,
    public el: ElementRef
  ) { }
  async ngAfterContentInit() {
    await this.mapsAPILoader.load();
    this.streetView = new google.maps.StreetViewPanorama(
      this.el.nativeElement as HTMLElement,
      {
        position: this.coords,
        pov: {
          heading: 0,
          pitch: 0,
        },
      }
    );
  }
  setView(coords: {lat: number; lng: number}) {
    this.streetView.setPosition(coords);
    this.streetView.setPov({heading: 0, pitch: 0})
  }
}
