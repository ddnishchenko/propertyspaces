import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment';
import { fileToBase64 } from '../../../utils';
import { ProjectsService } from '../../service/projects.service';

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
    private projectService: ProjectsService
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

      if (this.isEdit || this.panorama.name) {
        const res: any = await this.projectService.updatePanorama(this.panoData.project_id, {
          name: this.panorama.name,
          panoramas: {
            panorama: url
          }
        }).toPromise();
        const pano = res.data.find(p => p.name.includes(this.panorama.name));
        this.panorama._t = '?_t=' + Date.now();
      } else {
        const isCoordValid = !isNaN(+x) && !isNaN(+y) && !isNaN(+z);
        if (isCoordValid) {
          this.form.patchValue({x, y, z, name:`x=${x}y=${y}z=${z}=f${floor}`})
        }
        const f = this.form.value;
        const coords = isCoordValid ? {x,y,z, floor} : {
          x: f.x, y: f.y, z: f.z, floor
        };
        const theName = isCoordValid ? f.name : `x=${coords.x}y=${coords.y}z=${coords.z}f=${coords.floor}`;
        if (coords.x && coords.y && coords.z && coords.floor) {

          const res: any = await this.projectService.createPanorama(this.panoData.project_id, {
            name: theName,
            panoramas: {
              panorama: url,
              floor: 1,
              ...coords
            }
          }).toPromise();
          const pano = res.data.find(p => p.name.includes(theName));
          const dark = res.data.find(p => p.name.includes(`${theName}_dark`));
          const light = res.data.find(p => p.name.includes(`${theName}_light`));
          if (dark) {
            dark._t = '?_t=' + Date.now();
            pano.dark_pano = dark;
          }
          if (light) {
            light._t = '?_t=' + Date.now();
            pano.light_pano = light;
          }
          pano._t = '?_t=' + Date.now();
          this.form.patchValue({...coords});
          this.panorama = pano;

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
      if (this.panorama[type]) {
        const res: any = await this.projectService.updatePanorama(this.panoData.project_id, {
          name: this.panorama[type].name,
          panoramas: {
            panorama: url
          }
        }).toPromise();
        const pano = res.data.find(p => p.name.includes(this.panorama[type].name));
        console.log(res, pano);
        if (pano) {
          pano._t = '?_t=' + Date.now();
          this.panorama[type] = pano;
        }
      } else {
        const {x, y, z, name, floor} = this.form.value;
        const n = `${name}_${posfix}`;
        const res: any = await this.projectService.createPanorama(this.panoData.project_id, {
          name: n,
          panoramas: {
            panorama: url,
            x, y, z, floor
          }
        }).toPromise();
        const pano = res.data.find(p => p.name.includes(n));
        console.log(res, pano);
        if (pano) {
          pano._t = '?_t=' + Date.now();
          this.panorama[type] = pano;
        }
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
    const res: any = await this.projectService.makeHdr(this.panoData.project_id, this.panorama.name).toPromise();
    const pano = res.data.find(p => p.name.includes(this.panorama.name + '_hdr'));
    if (pano) {
      pano._t = '?_t=' + Date.now();
      this.panorama.hdr_pano = pano;
    }
  }
  remove(name) {
    this.projectService.deletePanoramaProject(this.panoData.project_id, name).subscribe(res => {
      console.log(res);
      this.panorama.hdr_pano = null;
    })
  }
}
