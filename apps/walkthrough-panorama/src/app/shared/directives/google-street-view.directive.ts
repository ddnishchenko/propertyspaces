import { MapsAPILoader } from '@agm/core';
import { AfterContentInit, Directive, ElementRef, Input, NgZone } from '@angular/core';

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

@Directive({
  selector: '[propertyspacesGoogleStreetView]'
})
export class GoogleStreetViewDirective implements AfterContentInit {
  @Input() coords: {lat: number; lng: number};
  streetView: any;
  sv;
  constructor(
    private mapsAPILoader: MapsAPILoader,
    public el: ElementRef
  ) { }
  async ngAfterContentInit() {
    await this.mapsAPILoader.load();
    this.sv = new google.maps.StreetViewService();
    console.log(this.coords);
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
    // console.log(this.streetView)
  }
  setView(coords: {lat: number; lng: number}) {
    // this.streetView.setPosition(coords);
    // this.streetView.setPov({heading: 0, pitch: 0});
    const {lat, lng} = coords;
    const position = {
      lat: +lat.toFixed(3),
      lng: +lng.toFixed(3)
    };

    const radius = 50; // meters;
    // this.el.nativeElement.innerHTML = '';
    console.log(this.sv);
    /* this.sv.getPanoramaByLocation(position, radius, (data) => {
      console.log(data, 'aa')
    }); */
    // console.log(pano);
    // this.streetView.setPosition(pano.data.location.latLng);
    this.streetView = null;
    removeAllChildNodes(this.el.nativeElement);
    this.mapsAPILoader.load().then(() => {
      this.streetView = new google.maps.StreetViewPanorama(
        this.el.nativeElement as HTMLElement,
        {
          position,
          pov: {
            heading: 0,
            pitch: 0,
          },
        }
      );
      console.log(this.streetView);
    });
    setTimeout(() => {



    }, 1000);


  }
}
