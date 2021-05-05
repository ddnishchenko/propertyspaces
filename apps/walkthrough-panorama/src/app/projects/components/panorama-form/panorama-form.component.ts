import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
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

  async uploadPano($event, type) {
    if ($event.target.files.length) {
      const files: File[] = Array.from($event.target.files);
      for (let file of files) {
        const url = await fileToBase64(file);
        const res: any = await this.projectService.updatePanorama(this.panoData.project_id, {
          name: this.panorama[type].name,
          panoramas: {
            panorama: url
          }
        }).toPromise();
        const pano = res.data.find(p => p.name.includes(this.panorama[type].name));
        console.log(res,pano);
        if (pano) {
          pano._t = '?_t=' + Date.now();
          this.panorama[type] = pano;
        }

      }
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
