import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment';

export function fileToBase64(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (ev: ProgressEvent<FileReader>) => resolve(ev.target.result);
    fileReader.onerror = reject;
    fileReader.readAsDataURL(file);
  });
}

@Component({
  selector: 'propertyspaces-panorama-form',
  templateUrl: './panorama-form.component.html',
  styleUrls: ['./panorama-form.component.scss']
})
export class PanoramaFormComponent implements OnInit {
  title = '+ Add Panoramas';
  isEdit = false;
  panorama;
  panoData;
  mediaPath;
  form;
  loading = false;
  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    if (this.isEdit) {
      this.mediaPath = environment.apiHost + this.panoData.path + this.panorama.name;
    }
    this.createForm();
  }
  createForm() {
    this.form = new FormGroup({
      name: new FormControl(''),
      x: new FormControl(this.panorama?.panoramas.x),
      y: new FormControl(this.panorama?.panoramas.y),
      z: new FormControl(this.panorama?.panoramas.z),
      url: new FormControl('')
    });
  }
  async uploadImage($event) {
    if ($event.target.files.length) {
      this.loading = true;
      const file: File = $event.target.files[0];
      const fileName = file.name.split('.').slice(0, -1).join('.');
      const fileNameParts = fileName.split('_');
      const [ name, x, y, z ] = fileNameParts;
      const url = await fileToBase64(file);
      this.form.patchValue({
        name: file.name, x, y, z, url
      });
      this.loading = false;
    }
  }

  submit() {
    this.activeModal.close({
      name: this.form.value.name,
      panoramas: {
        panorama: this.form.value.url,
        neighbors: [],
        x: this.form.value.x,
        y: this.form.value.y,
        z: this.form.value.z
      }
    });
  }
}
