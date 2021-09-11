import { AgmMap } from '@agm/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

const urlRegEx = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
@Component({
  selector: 'propertyspaces-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss']
})
export class MapModalComponent implements OnInit {
  @ViewChild(AgmMap) agmMap: AgmMap;
  form;
  searching = false;
  data
  isStreetViewVisible = true;
  constructor(
    public activeModal: NgbActiveModal,
  ) { }



  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = new FormGroup({
      mapEnabled: new FormControl(this.data.mapEnabled),
      streetViewEnabled: new FormControl(this.data.streetViewEnabled),
      mapUrl: new FormControl(this.data.mapUrl, [Validators.pattern(urlRegEx)]),
      streetViewUrl: new FormControl(this.data.streetViewUrl, [Validators.pattern(urlRegEx)]),
      address: new FormControl(this.data.address),
      latitude: new FormControl(this.data.latitude),
      longitude: new FormControl(this.data.longitude)
    });
  }



  onAutocomplete($event) {
    this.isStreetViewVisible = false;
    this.form.patchValue({
      address: $event.formatted_address,
      latitude: $event.geometry.location.lat(),
      longitude: $event.geometry.location.lng()
    });

    setTimeout(() => {
      this.isStreetViewVisible = true;
    }, 300);
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
    this.form.patchValue({ [field]: url });
    $event.preventDefault();
  }
}
