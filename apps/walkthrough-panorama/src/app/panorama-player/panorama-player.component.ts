import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from '../projects/service/projects.service';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { VirtualTourDirective } from '@propertyspaces/virtual-tour';
import { FormControl, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'propertyspaces-panorama-player',
  templateUrl: './panorama-player.component.html',
  styleUrls: ['./panorama-player.component.scss']
})
export class PanoramaPlayerComponent implements OnInit {

  @ViewChild(VirtualTourDirective) virtualTour;

  activePoint = 0;

  data$;
  form;
  isEdit = false;
  rotationAngle = 0;
  constructor(
    private projcetService: ProjectsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.isEdit = this.router.url.includes('model');
    this.createForm();
    this.data$ = this.route.data.pipe(
      map(data => {
        const model = data.model;
        let xArray = model.data.map(p => +p.panoramas.x);
        let zArray = model.data.map(p => +p.panoramas.z);

        let xMin = Math.min(...xArray);
        let xMax = Math.max(...xArray);

        let zMin = Math.min(...zArray);
        let zMax = Math.max(...zArray);

        if (xMin < 0) {
          xArray = model.data.map(p => Math.abs(xMin) + +p.panoramas.x);
          xMin = Math.min(...xArray);
          xMax = Math.max(...xArray);
        }

        const xSide = xMax - (xMin);
        const zSide = zMax - (zMin);

        const floorplanMap = model.data.map((p,i) => ({
          z: (zArray[i] / zSide) * 100,
          x: (xArray[i] / xSide) * 100
        }));

        const size = 50;

        const floorplanArea = (xSide * zSide) * size;
        const width = (zSide  + (zMin*2)) * size;
        const height = (xSide  + (zMin*2)) * size;
        console.log(floorplanMap);
        return {...data.model, floorplanMap, floorplanArea, width, height, hostname: environment.apiHost}
      })
    );
  }

  createForm() {
    this.form = new FormGroup({
      rotationY: new FormControl(''),
      editMode: new FormControl(false),
      zoom: new FormControl(0)
    });
  }

  vrInit() {
    this.form.patchValue({
      rotationY: +this.virtualTour.virtualTourService.mesh.rotation.y,
      zoom: this.virtualTour.virtualTourService.OrbitControls.object.fov
    });
    this.rotationAngle = this.virtualTour.virtualTourService.OrbitControls.getPolarAngle() - Math.PI / (+this.virtualTour.virtualTourService.mesh.rotation.y - 0.3);
  }

  editModeSwitch() {
    this.virtualTour.virtualTourService.toggleNavMode(this.form.value.editMode);
  }

  rotationYChange() {
    this.virtualTour.virtualTourService.changeMeshRotation(this.form.value.rotationY);
  }

  saveY(id) {
    const updateY = this.projcetService.updateRotationProject(id, this.form.value.rotationY);
    const updateData = this.projcetService.updateDataProject(id, {zoom: this.form.value.zoom, rotation_y: this.form.value.rotationY});

    forkJoin([updateY, updateData]).subscribe(res => {
      alert('saved');
    });
  }

  navTo(i) {
    this.activePoint = i;
    this.virtualTour.virtualTourService.moveMark(i);
  }

  changeActive($event) {
    console.log($event);
    this.activePoint = $event;
  }
  zoomChange() {
    this.virtualTour.virtualTourService.changeZoom(+this.form.value.zoom)
  }
  viewChange($event) {
    this.form.get('zoom').patchValue($event.object.fov);
    this.rotationAngle = this.virtualTour.virtualTourService.OrbitControls.getAzimuthalAngle() - Math.PI / (+this.virtualTour.virtualTourService.mesh.rotation.y - 1.3);
  }
}
