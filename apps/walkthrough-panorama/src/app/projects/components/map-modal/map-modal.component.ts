import { AgmMap, MapsAPILoader } from '@agm/core';
import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GoogleStreetViewDirective } from '../../../shared/directives/google-street-view.directive';
import { ProjectsService } from '../../service/projects.service';

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
      map: new FormControl(this.project.project.map?.link),
      tours: new FormControl(this.project.project.tour?.link),
      address: new FormControl(this.project.project.address),
      latitude: new FormControl(+this.project.project.latitude),
      longitude: new FormControl(+this.project.project.longitude)
    });
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
      this.ngZone.run(() => {
        // some details
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

  submit() {
    this.activeModal.close(this.form.value);
  }
}
