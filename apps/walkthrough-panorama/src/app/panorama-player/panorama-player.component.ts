import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from '../projects/service/projects.service';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { VirtualTourDirective } from '@propertyspaces/virtual-tour';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'propertyspaces-panorama-player',
  templateUrl: './panorama-player.component.html',
  styleUrls: ['./panorama-player.component.scss']
})
export class PanoramaPlayerComponent implements OnInit {

  @ViewChild(VirtualTourDirective) virtualTour;

  get activePoint() {
    return this.virtualTour ? this.virtualTour.virtualTourService.activeIndex : -1;
  }

  data$;
  form;
  constructor(
    private projcetService: ProjectsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.data$ = this.route.data.pipe(
      map(data => ({...data.model, hostname: environment.apiHost}))
    );
  }

  createForm() {
    this.form = new FormGroup({
      rotationY: new FormControl(''),
      editMode: new FormControl(false)
    });
  }

  vrInit() {
    this.form.patchValue({rotationY: +this.virtualTour.virtualTourService.mesh.rotation.y});
  }

  editModeSwitch() {
    this.virtualTour.virtualTourService.toggleNavMode(this.form.value.editMode);
  }

  rotationYChange() {
    this.virtualTour.virtualTourService.changeMeshRotation(this.form.value.rotationY);
  }

  saveY(id) {
    this.projcetService.updateRotationProject(id, this.form.value.rotationY).subscribe(() => {
      alert('Rotation saved')
    });
  }

  navTo(i) {
    this.virtualTour.virtualTourService.moveMark(i);
  }
}
