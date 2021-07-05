import { MapsAPILoader } from '@agm/core';
import { AfterContentInit, Directive, ElementRef, EventEmitter, NgZone, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[propertyspacesGoogleAutocomplete]'
})
export class GoogleAutocompleteDirective implements OnInit {
  @Output() placeChanged = new EventEmitter();
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private el: ElementRef
  ) { }

  async ngOnInit() {
    await this.mapsAPILoader.load();
    const autocomplete = new google.maps.places.Autocomplete(this.el.nativeElement);
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();
        this.placeChanged.emit(place);
      });
    })
  }
}
