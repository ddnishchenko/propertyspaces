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
  constructor(
    private projcetService: ProjectsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.isEdit = this.router.url.includes('model');
    this.createForm();
    this.data$ = this.route.data.pipe(
      map(data => ({...data.model, hostname: environment.apiHost}))
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
  }
}
