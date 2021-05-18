import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { environment } from '../../../../environments/environment';
import { Panorama } from '../../../interfaces/panorama';
import { fileToBase64 } from '../../../utils';
import { ProjectsService } from '../../service/projects.service';
import { createHdrPanorama, createPanorama, deletePanorama, updatePanorama } from '../../state/projects.actions';

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
    public activeModal: NgbActiveModal,
    private projectService: ProjectsService,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.mediaPath = environment.apiHost + this.panoData.path;
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
      url: new FormControl(data?.url)
    });
  }

  updateName() {
    if (!this.isEdit) {
      this.form.patchValue({name: `x=${this.form.value.x}y=${this.form.value.y}z=${this.form.value.z}f=${this.form.value.floor}`})
    }
  }

  createForm() {
    this.form = this.createPanoFormGroup(this.panorama);
  }
  async uploadImage($event) {
    if ($event.target.files.length) {
      const file: File[] = Array.from($event.target.files);
      const fileName = file[0].name.split('.').slice(0, -1).join('.');
      const fileNameParts = fileName.split('_');
      const [ name, x, y, z, floor ] = fileNameParts;
      const url = await fileToBase64(file[0]);

      let rawPano: Panorama;
      if (this.isEdit || this.panorama.name) {
        rawPano = {
          name: this.panorama.name,
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
              ...coords
            }
          };
          this.store.dispatch(createPanorama({ projectId: this.panoData.project_id, panorama: rawPano }));
        } else {
          alert('Achtung! Coordinates are invalid! Please enter valid coordinates.')
        }

      }
    }
  }

  async uploadPano($event, type, posfix) {
    if ($event.target.files.length) {
      const files: File[] = Array.from($event.target.files);
      const url = await fileToBase64(files[0]);
      let rawPano: Panorama;
      if (this.panorama[type]) {
        rawPano = {
          name: this.panorama[type].name,
          panoramas: {
            panorama: url
          }
        };
        this.store.dispatch(updatePanorama({ projectId: this.panoData.project_id, panorama: rawPano }));
      } else {
        const {x, y, z, name, floor} = this.form.value;
        const n = `${name}_${posfix}`;
        rawPano = {
          name: n,
          panoramas: {
            panorama: url,
            x, y, z, floor
          }
        };
        this.store.dispatch(createPanorama({ projectId: this.panoData.project_id, panorama: rawPano }));
      }

    }
  }

  submit() {
    this.activeModal.close({
      name: this.form.value.name,
      panoramas: {
        // neighbors: this.form.value.neighbors,
        x: this.form.value.x,
        y: this.form.value.y,
        z: this.form.value.z,
        floor: this.form.value.floor
      }
    });
  }

  async makeHdr() {
    this.store.dispatch(createHdrPanorama({projectId: this.panoData.project_id, name: this.panorama.name}));
  }
  remove(name) {
    this.store.dispatch(deletePanorama({projectId: this.panoData.project_id, names: [name]}));
  }
}
