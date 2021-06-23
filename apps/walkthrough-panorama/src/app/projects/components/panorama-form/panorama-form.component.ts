import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { environment } from '../../../../environments/environment';
import { Panorama } from '../../../interfaces/panorama';
import { fileToBase64 } from '../../../utils';
import { createHdrPanorama, createPanorama, deletePanorama, updatePanorama } from '../../state/projects.actions';
import { selectPanoForm, selectVirtualTourPanoramaByName } from '../../state/projects.selectors';

@Component({
  selector: 'propertyspaces-panorama-form',
  templateUrl: './panorama-form.component.html',
  styleUrls: ['./panorama-form.component.scss']
})
export class PanoramaFormComponent implements OnInit {
  title = '+ Add Panoramas';
  isEdit = false;
  pano;
  panorama$;
  panoData;
  mediaPath;
  form;
  loading = false;
  panoForm$;
  constructor(
    public activeModal: NgbActiveModal,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.mediaPath = environment.apiHost + this.panoData.path;
    this.panorama$ = this.store.pipe(select(selectVirtualTourPanoramaByName(this.pano.name)));
    this.panoForm$ = this.store.pipe(select(selectPanoForm));
    this.createForm();
  }

  createPanoFormGroup(data) {
    const validators = [
      Validators.required
    ];
    return new FormGroup({
      name: new FormControl(data?.name || '', [Validators.required]),
      x: new FormControl(data?.panoramas?.x, validators),
      y: new FormControl(data?.panoramas?.y, validators),
      z: new FormControl(data?.panoramas?.z, validators),
      floor: new FormControl(data?.panoramas?.floor, validators),
      order: new FormControl(data?.panoramas?.order),
      url: new FormControl(data?.url)
    });
  }

  panoForm(data) {
    return {
      name: data?.name,
      x: data?.panoramas?.x,
      y: data?.panoramas?.y,
      z: data?.panoramas?.z,
      floor: data?.panoramas?.floor,
      order: data?.panoramas?.order,
      url: data?.url
    }
  }

  updateName() {
    if (!this.isEdit) {
      this.form.patchValue({name: `x=${this.form.value.x}y=${this.form.value.y}z=${this.form.value.z}f=${this.form.value.floor}`})
    }
  }

  createForm() {
    this.form = this.createPanoFormGroup(this.pano);
  }
  async uploadImage($event, panoName) {
    if ($event.target.files.length) {
      const order = !isNaN(parseInt(''+this.form.value.order, 10)) ? this.form.value.order : this.panoData.data.length;
      this.form.patchValue({order});
      const file: File[] = Array.from($event.target.files);
      const fileName = file[0].name.split('.').slice(0, -1).join('.');
      const fileNameParts = fileName.split('_');
      const [ name, x, y, z, floor ] = fileNameParts;
      const url = await fileToBase64(file[0]);

      let rawPano: Panorama;
      if (this.isEdit || panoName) {
        rawPano = {
          name: panoName,
          panoramas: {
            panorama: url
          }
        };
        this.store.dispatch(updatePanorama({ projectId: this.panoData.project_id, panorama: rawPano }));
      } else {
        const isCoordValid = !isNaN(+x) && !isNaN(+y) && !isNaN(+z);
        if (isCoordValid) {
          this.form.patchValue({x, y, z, name:`x=${x}y=${y}z=${z}=f${floor}`})
        }
        const f = this.form.value;
        const coords = isCoordValid ? {x,y,z, floor} : {
          x: f.x, y: f.y, z: f.z, floor: f.floor
        };
        const theName = isCoordValid ? f.name : `x=${coords.x}y=${coords.y}z=${coords.z}f=${coords.floor}`;
        if (coords.x && coords.y && coords.z && coords.floor) {
          rawPano = {
            name: theName,
            panoramas: {
              panorama: url,
              ...coords,
              order
            }
          };
          this.store.dispatch(createPanorama({ projectId: this.panoData.project_id, panorama: rawPano }));
          this.panorama$ = this.store.pipe(select(selectVirtualTourPanoramaByName(theName)));
        } else {
          alert('Achtung! Coordinates are invalid! Please enter valid coordinates.')
        }

      }
    }
  }

  async uploadPano($event, panorama, type, posfix) {
    if ($event.target.files.length) {
      const files: File[] = Array.from($event.target.files);
      const url = await fileToBase64(files[0]);
      let rawPano: Panorama;
      if (panorama[type]) {
        rawPano = {
          name: panorama[type].name,
          panoramas: {
            panorama: url
          }
        };
        this.store.dispatch(updatePanorama({ projectId: this.panoData.project_id, panorama: rawPano }));
      } else {
        const {x, y, z, name, floor, order} = this.form.value;
        const n = `${name}_${posfix}`;
        rawPano = {
          name: n,
          panoramas: {
            panorama: url,
            x, y, z, floor, order
          }
        };
        this.store.dispatch(createPanorama({ projectId: this.panoData.project_id, panorama: rawPano }));
      }

    }
  }

  submit() {
    const {
      name,
      x,
      y,
      z,
      floor,
      order
    } = this.form.value;
    this.activeModal.close({
      name,
      panoramas: {
        x,
        y,
        z,
        floor,
        order
      }
    });
  }

  async makeHdr(name) {
    this.store.dispatch(createHdrPanorama({projectId: this.panoData.project_id, name: name}));
  }
  remove(name) {
    this.store.dispatch(deletePanorama({projectId: this.panoData.project_id, names: [name]}));
  }
}
