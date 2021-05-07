import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DraggableDirective } from '@propertyspaces/drag-resize';
import { SubjxDirective } from '@propertyspaces/subjx';
import { ProjectsService } from '../../../projects/service/projects.service';
import { fileToBase64 } from '../../../utils';

@Component({
  selector: 'propertyspaces-floorplan-editor',
  templateUrl: './floorplan-editor.component.html',
  styleUrls: ['./floorplan-editor.component.scss']
})
export class FloorplanEditorComponent implements OnInit, AfterViewInit {
  @ViewChild(DraggableDirective) floorplanWrapper!: DraggableDirective;
  @ViewChild(SubjxDirective) subjxWrapper!: SubjxDirective;
  @ViewChild('floorPlan') floorPlan: ElementRef<HTMLImageElement>;
  @ViewChild('bound') bound: ElementRef<HTMLImageElement>;
  data;
  form;
  dotSize = 24;
  prevRotate = 0;
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
      dots_size: new FormControl(additional_data.dots_size || 1),
      floorplan_max_height: new FormControl(additional_data.floorplan_max_height || 300),
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

      nd_width: new FormControl(additional_data.nd_width || 30),
      nd_height: new FormControl(additional_data.nd_height || 30),
      nd_resize_dx: new FormControl(additional_data.nd_resize_dx || 0),
      nd_resize_dy: new FormControl(additional_data.nd_resize_dy || 0),

      nd_move_dx: new FormControl(additional_data.nd_move_dx || 0),
      nd_move_dy: new FormControl(additional_data.nd_move_dy || 0),

      nd_clientx: new FormControl(additional_data.nd_clientx || 0),
      nd_clienty: new FormControl(additional_data.nd_clienty || 0),

      nd_delta: new FormControl(additional_data.nd_delta || 0),
      nd_deg: new FormControl(additional_data.nd_deg || 0),
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
  }
  rotate(d) {
    // const transformState = this.floorplanWrapper.nativeElement.style.transform.split(' (');
    this.form.patchValue({nav_dots_rotation: d === 'r' ? this.form.value.nav_dots_rotation + 90 : this.form.value.nav_dots_rotation - 90});
    // this.floorplanWrapper.nativeElement.style.transform = transformState[0] + ` rotate(${this.form.value.rotation})`;
    // console.log(this.floorplanWrapper.nativeElement.style.transform)
  }
  dragEnd($event, img) {
    const pos = this.floorplanWrapper.getCurrentOffset();
    this.form.patchValue({
      nav_dots_top: pos.y,
      nav_dots_left: pos.x,
      nav_dots_top_: (pos.y / img.offsetHeight) * 100,
      nav_dots_left_: (pos.x / img.offsetWidth) * 100
    })
  }
  resizeEnd($event, img) {
    this.form.patchValue({
      nav_dots_width: $event.size.width,
      nav_dots_height: $event.size.height,
      nav_dots_width_: ($event.size.width / img.offsetWidth) * 100,
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
      transform: `rotate(${-this.form.value.nav_dots_rotation}deg) scale(${this.form.value.dots_size})`
    }
  }
  fpMove($event) {
    this.form.patchValue({
      nd_move_dx: $event.elX,
      nd_move_dy: $event.elY,
    })
  }
  fpDrop($event, img) {
    this.form.patchValue({
      nd_move_dx: $event.elX,
      nd_move_dy: $event.elY,
      nav_dots_top_: ($event.y / img.offsetHeight) * 100,
      nav_dots_left_: ($event.x / img.offsetWidth) * 100
    })
  }
  fpResize($event, img) {
    this.form.patchValue({
      nd_width: $event.width,
      nd_height: $event.height,
      nav_dots_width: $event.width,
      nav_dots_height: $event.height,
      nav_dots_width_: ($event.width / img.offsetWidth) * 100,
      nav_dots_height_: ($event.height / img.offsetHeight) * 100,
    })
  }
  fpRotate($event) {
    if (this.prevRotate != $event.delta) {

    }
    this.prevRotate = $event.delta;
    this.form.patchValue({
      nd_delta: this.form.value.nd_delta + $event.delta,
      nd_deg: this.form.value.nd_deg + $event.deg,
      // nav_dots_rotation: this.form.value.nd_deg
    })
  }
  rotationChange($event) {
    console.log($event.type);
    if ($event.type === 'input') {
      this.subjxWrapper.dragEl.exeRotate({delta: -this.form.value.nd_delta});
      const delta = this.form.value.nav_dots_rotation * Math.PI/180;
      this.subjxWrapper.dragEl.exeRotate({delta});
    }
    /*
    if ($event.type === 'input') {
      const delta = 1 * Math.PI/180;
      this.subjxWrapper.dragEl.exeRotate({delta});
    }*/

  }
  floorplanHeightChange() {}

  rotateCub(deg) {
    const delta = deg * Math.PI/180;
    this.subjxWrapper.dragEl.exeRotate({delta});
    this.form.patchValue({nav_dots_rotation: this.form.value.nav_dots_rotation + deg })
  }
  async uploadFloorplan($event) {
    if ($event.target.files.length) {
      const base64 = await fileToBase64($event.target.files[0]);
      const res: any = await this.projectsService.updateDataProject(this.data.project_id, {['floorplan.svg']: base64}).toPromise();
      this.data._t = Date.now()
    }
  }
}
