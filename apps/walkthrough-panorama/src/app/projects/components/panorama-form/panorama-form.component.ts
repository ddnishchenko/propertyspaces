import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
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
      this.mediaPath = environment.apiHost + this.panoData.path;
    }
    this.createForm();
  }

  createPanoFormGroup(data) {
    return new FormGroup({
      name: new FormControl(data?.name),
      x: new FormControl(data?.panoramas.x),
      y: new FormControl(data?.panoramas.y),
      z: new FormControl(data?.panoramas.z),
      url: new FormControl(data.url)
    });
  }

  createForm() {
    if (this.isEdit) {
      this.form = this.createPanoFormGroup(this.panorama);
    } else {
      this.form = new FormGroup({
        panoramas: new FormArray([])
      });
    }

  }
  async uploadImage($event) {
    if ($event.target.files.length) {
      this.loading = true;
      const files: File[] = Array.from($event.target.files);
      for (let file of files) {
        const fileName = file.name.split('.').slice(0, -1).join('.');
        const fileNameParts = fileName.split('_');
        const [ name, x, y, z ] = fileNameParts;
        const url = await fileToBase64(file);
        const fg = this.createPanoFormGroup({
          name, url, panoramas: {x, y, z}
        });


        if (this.isEdit) {
          if (x && y && z) {
            this.form.patchValue({x, y, z});
          }
          this.form.patchValue({url});
        } else {
          this.form.get('panoramas').push(fg);
        }
      }


      this.loading = false;
    }
  }

  submit() {
    if (this.isEdit) {
      this.activeModal.close({
        name: this.form.value.name,
        panoramas: {
          panorama: this.form.value.url,
          // neighbors: this.form.value.neighbors,
          x: this.form.value.x,
          y: this.form.value.y,
          z: this.form.value.z
        }
      });
    } else {
      const formatData = this.form.value.panoramas.map(p => ({
        name: p.name,
        panoramas: {
          panorama: p.url,
          x: p.x,
          y: p.y,
          z: p.z
        }
      }));
      this.activeModal.close(formatData);
    }

  }
}
