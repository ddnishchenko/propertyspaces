import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DraggableDirective } from '@propertyspaces/drag-resize';
import { ProjectsService } from '../../../projects/service/projects.service';

@Component({
  selector: 'propertyspaces-floorplan-editor',
  templateUrl: './floorplan-editor.component.html',
  styleUrls: ['./floorplan-editor.component.scss']
})
export class FloorplanEditorComponent implements OnInit, AfterViewInit {
  @ViewChild(DraggableDirective) floorplanWrapper!: DraggableDirective;
  @ViewChild('floorPlan') floorPlan: ElementRef<HTMLImageElement>;
  @ViewChild('bound') bound: ElementRef<HTMLImageElement>;
  data;
  form;
  dotSize = 24;
  constructor(
    public activeModal: NgbActiveModal,
    private projectsService: ProjectsService
  ) { }
  ngOnInit(): void {
    this.createForm();
  }
  ngAfterViewInit() {
    console.log(this.floorplanWrapper);
  }

  createForm() {
    const additional_data = this.data.additional_data || {};
    this.form = new FormGroup({

      nav_dots_width: new FormControl(additional_data.nav_dots_width || 0),
      nav_dots_height: new FormControl(additional_data.nav_dots_height || 0),
      nav_dots_width_: new FormControl(additional_data.nav_dots_width_ || 0),
      nav_dots_height_: new FormControl(additional_data.nav_dots_height_ || 0),
      nav_dots_top: new FormControl(additional_data.nav_dots_top || 0),
      nav_dots_left: new FormControl(additional_data.nav_dots_left || 0),
      nav_dots_top_: new FormControl(additional_data.nav_dots_top_ || 0),
      nav_dots_left_: new FormControl(additional_data.nav_dots_left_ || 0),
      nav_dots_rotation: new FormControl(additional_data.nav_dots_rotation || 0),
      nav_dots_mirror_h: new FormControl(additional_data.nav_dots_mirror_h || false),
      nav_dots_mirror_v: new FormControl(additional_data.nav_dots_mirror_v || false),
    })
  }
  submit() {
    const additional_data = {
      ...this.data.additional_data,
      ...this.form.value
    }
    this.projectsService.updateDataProject(this.data.project_id, additional_data).subscribe(res => {
      this.activeModal.close(res);
    })
  }
  onResizeEnd($event) {
    console.log($event);
  }
  rotate(d) {
    console.log(this.floorplanWrapper);
    // const transformState = this.floorplanWrapper.nativeElement.style.transform.split(' (');
    this.form.patchValue({nav_dots_rotation: d === 'r' ? this.form.value.nav_dots_rotation + 90 : this.form.value.nav_dots_rotation - 90});
    // this.floorplanWrapper.nativeElement.style.transform = transformState[0] + ` rotate(${this.form.value.rotation})`;
    // console.log(this.floorplanWrapper.nativeElement.style.transform)
  }
  dragEnd($event, img) {
    console.log($event);
    console.log(this.floorPlan);
    const pos = this.floorplanWrapper.getCurrentOffset();
    this.form.patchValue({
      nav_dots_top: pos.y,
      nav_dots_left: pos.x,
      nav_dots_top_: (pos.y / img.offsetHeight) * 100,
      nav_dots_left_: (pos.x / img.offsetWidth) * 100
    })
  }
  resizeEnd($event, img) {
    console.log($event);
    this.form.patchValue({
      nav_dots_width: $event.size.width,
      nav_dots_height: $event.size.height,
      nav_dots_width_: ($event.size.width / img.offsetHeight) * 100,
      nav_dots_height_: ($event.size.height / img.offsetHeight) * 100,
    })
  }
  mirror(p) {
    this.form.patchValue({[`nav_dots_mirror_${p}`]: !this.form.value[`nav_dots_mirror_${p}`] })
  }

  getStyleForDot(p) {
    return {
      [this.form.value['nav_dots_mirror_v'] ? 'bottom' : 'top']: `calc(${p.x}%)`,
      [this.form.value['nav_dots_mirror_h'] ? 'right' : 'left']: `calc(${p.z}%)`,
      transform: `rotate(${-this.form.value.nav_dots_rotation}deg)`
    }
  }
  rotationChange() {}
}