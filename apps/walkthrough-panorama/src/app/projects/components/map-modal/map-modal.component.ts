import { MapsAPILoader } from '@agm/core';
import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { ProjectsService } from '../../service/projects.service';

@Component({
  selector: 'propertyspaces-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss']
})
export class MapModalComponent implements OnInit, AfterViewInit {
  @ViewChild('search') searchElementRef: ElementRef;
  @ViewChild('streetView') streetViewRef: ElementRef;
  form;
  latitude = 51.678418;
  longitude = 7.809007;
  searching = false;
  project_id;

  constructor(
    public activeModal: NgbActiveModal,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private projectService: ProjectsService
  ) { }



  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = new FormGroup({
      map: new FormControl(''),
      tours: new FormControl('')
    });
  }

  async ngAfterViewInit() {
    await this.mapsAPILoader.load();
    const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);

    const fenway = { lat: this.latitude, lng: this.longitude };
    const panorama = new google.maps.StreetViewPanorama(
      this.streetViewRef.nativeElement as HTMLElement,
      {
        position: fenway,
        pov: {
          heading: 34,
          pitch: 10,
        },
      }
    );

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
        panorama.setPosition({
          lat: this.latitude,
          lng: this.latitude
        });
        panorama.setPov({
          heading: 34,
          pitch: 10,
        })
        console.log(panorama, this.latitude, this.latitude)
      });
    })
  }

  submit() {
    this.projectService.updateAddress(this.project_id, this.form.value).subscribe(res => {
      console.log(res);
      this.activeModal.close(res);
    });
  }
}
