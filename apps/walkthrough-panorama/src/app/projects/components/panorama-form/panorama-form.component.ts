import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { environment } from '../../../../environments/environment';
import { Panorama } from '../../../interfaces/panorama';
import { createHdrPanorama, createPanorama, deletePanorama, updatePanorama } from '../../state/projects.actions';
import { selectProjectPanoramaByName } from '../../state/projects.selectors';

@Component({
  selector: 'propertyspaces-panorama-form',
  templateUrl: './panorama-form.component.html',
  styleUrls: ['./panorama-form.component.scss']
})
export class PanoramaFormComponent implements OnInit {
  title = '+ Add Panoramas';
  isEdit = false;
  project;
  pano;
  panorama$;
  mediaPath;
  form;
  loading = false;
  panoForm$;
  constructor(
    public activeModal: NgbActiveModal,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.mediaPath = environment.apiHost + this.project.id;
    this.panorama$ = this.store.pipe(select(selectProjectPanoramaByName(this.pano.name)));
    this.createForm();
  }

  createPanoFormGroup(data) {
    const validators = [
      Validators.required
    ];
    return new FormGroup({
      id: new FormControl(data?.id),
      name: new FormControl(data?.name || '', [Validators.required]),
      x: new FormControl(data?.x, validators),
      y: new FormControl(data?.y, validators),
      z: new FormControl(data?.z, validators),
      floor: new FormControl(data?.floor, validators),
      order: new FormControl(data?.order),
      url: new FormControl(data?.url)
    });
  }

  updateName() {
    if (!this.isEdit) {
      this.form.patchValue({ name: `x=${this.form.value.x}y=${this.form.value.y}z=${this.form.value.z}f=${this.form.value.floor}` })
    }
  }

  createForm() {
    this.form = this.createPanoFormGroup(this.pano);
  }
  async uploadImage($event, panoName) {
    const order = !isNaN(parseInt('' + this.form.value.order, 10)) ? this.form.value.order : this.project.panoramas.length;
    this.form.patchValue({ order });
    const fileName = $event.file.name.split('.').slice(0, -1).join('.');
    const fileNameParts = fileName.split('_');
    const [name, x, y, z, floor] = fileNameParts;
    const url = $event.result;

    let rawPano: Panorama;
    if (this.isEdit || panoName) {
      rawPano = {
        ...this.form.value,
        url
      };
      this.store.dispatch(updatePanorama({ projectId: this.project.id, panorama: rawPano }));
    } else {
      const isCoordValid = !isNaN(+x) && !isNaN(+y) && !isNaN(+z);
      if (isCoordValid) {
        this.form.patchValue({ x, y, z, name: `x=${x}y=${y}z=${z}=f${floor}` })
      }
      const f = this.form.value;
      const coords = isCoordValid ? { x, y, z, floor } : {
        x: f.x, y: f.y, z: f.z, floor: f.floor
      };
      const theName = isCoordValid ? f.name : `x=${coords.x}y=${coords.y}z=${coords.z}f=${coords.floor}`;
      if (coords.x && coords.y && coords.z && coords.floor) {
        rawPano = {
          ...coords,
          name: theName,
          url,
          order
        };
        this.store.dispatch(createPanorama({ projectId: this.project.id, panorama: rawPano }));
        this.panorama$ = this.store.pipe(select(selectProjectPanoramaByName(theName)));
      } else {
        alert('Achtung! Coordinates are invalid! Please enter valid coordinates.')
      }

    }
  }

  async uploadPano($event, panorama, type) {
    const rawPano = {
      ...this.form.value,
      [type]: {
        ...panorama[type],
        url: $event.result
      }
    };

    this.store.dispatch(updatePanorama({ projectId: this.project.id, panorama: rawPano }));
  }

  submit(id) {
    this.form.patchValue({ id });
    this.activeModal.close({ ...this.pano, ...this.form.value });
  }

  async makeHdr(name) {
    this.store.dispatch(createHdrPanorama({ projectId: this.project.id, name: name }));
  }
  remove(pano) {
    this.store.dispatch(deletePanorama({ projectId: this.project.id, panoramas: [pano] }));
  }
}
