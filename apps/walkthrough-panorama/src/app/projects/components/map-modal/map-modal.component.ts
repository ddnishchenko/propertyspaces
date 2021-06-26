import { AgmMap, MapsAPILoader } from '@agm/core';
import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs/operators';
import { GoogleStreetViewDirective } from '../../../shared/directives/google-street-view.directive';

const urlRegEx = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
@Component({
  selector: 'propertyspaces-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss']
})
export class MapModalComponent implements OnInit, AfterViewInit {
  @ViewChild('search') searchElementRef: ElementRef;
  @ViewChild(GoogleStreetViewDirective) streetViewRef: GoogleStreetViewDirective;
  @ViewChild(AgmMap) agmMap: AgmMap;
  form;
  latitude = 51.678418;
  longitude = 7.809007;
  searching = false;
  project_id;
  project;
  coords$;
  constructor(
    public activeModal: NgbActiveModal,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) { }



  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = new FormGroup({
      mapEnabled: new FormControl(!this.project.additional_data.hasOwnProperty('mapEnabled') ? true : this.project.additional_data.mapEnabled),
      streetViewEnabled: new FormControl(!this.project.additional_data.hasOwnProperty('streetViewEnabled') ? true : this.project.additional_data.streetViewEnabled),
      map: new FormControl(this.project.additional_data.map, [Validators.pattern(urlRegEx)]),
      streetView: new FormControl(this.project.additional_data.streetView, [Validators.pattern(urlRegEx)]),
      address: new FormControl(this.project.project.address),
      latitude: new FormControl(+this.project.project.latitude),
      longitude: new FormControl(+this.project.project.longitude)
    });
    this.coords$ = this.form.get('latitude').valueChanges.pipe(
      map(() => this.form.value)
    );
  }

  async ngAfterViewInit() {
    await this.mapsAPILoader.load();
    const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);

    /*
    const fenway = { lat: this.form.value.latitude, lng: this.form.value.longitude };
    const panorama = new google.maps.StreetViewPanorama(
      this.streetViewRef.nativeElement as HTMLElement,
      {
        position: fenway,
        pov: {
          heading: 0,
          pitch: 0,
        },
      }
    ); */

    autocomplete.addListener("place_changed", () => {
      // some details

      this.ngZone.run(() => {
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();
        /* this.address = place.formatted_address;
        this.web_site = place.website;
        this.name = place.name;
        this.zip_code = place.address_components[place.address_components.length - 1].long_name;
        //set latitude, longitude and zoom

        this.zoom = 12; */
        this.latitude = place.geometry.location.lat();
        this.longitude = place.geometry.location.lng();
        this.form.patchValue({
          address: place.formatted_address,
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng()
        });

        this.streetViewRef.setView({
          lat: +this.form.value.latitude,
          lng: +this.form.value.latitude
        });


      });
    })
  }

  mapLoaded($event) {
    console.log($event);
    const panorama = $event.getStreetView();
    // panorama.setPosition({ lat: +this.form.value.latitude, lng: +this.form.value.latitude });
    // panorama.setVisible(true);
  }

  submit() {
    this.activeModal.close(this.form.value);
  }

  filterPaste($event) {
    // @ts-ignore
    let paste = ($event.clipboardData || window.clipboardData).getData('text');
    let url;
    try {
      url = new URL(paste);
      url = url.href;
    } catch (e) {
      const div = document.createElement('div');
      div.innerHTML = paste;
      const iframe = div.querySelector('iframe');
      if (!iframe?.src) {
        alert('Invalid embed code or url');
      } else {
        url = iframe.src;
      }
      div.remove();
    }
    const field = $event.target.getAttribute('formcontrolname');
    this.form.patchValue({[field]: url});
    $event.preventDefault();
  }
}
