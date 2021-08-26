import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DraggableDirective } from '@propertyspaces/drag-resize';
import { SubjxDirective } from '@propertyspaces/subjx';

@Component({
  selector: 'propertyspaces-floorplan-editor',
  templateUrl: './floorplan-editor.component.html',
  styleUrls: ['./floorplan-editor.component.scss']
})
export class FloorplanEditorComponent implements OnInit {
  @Input() data;
  @ViewChild(DraggableDirective) floorplanWrapper!: DraggableDirective;
  @ViewChild(SubjxDirective) subjxWrapper!: SubjxDirective;
  @ViewChild('floorPlan') floorPlan: ElementRef<HTMLImageElement>;
  @ViewChild('bound') bound: ElementRef<HTMLImageElement>;
  form;
  get formArray() {
    return this.form?.get('floors') as FormArray;
  };
  dotSize = 24;
  prevRotate = 0;

  ngOnInit(): void {
    this.createForm();
  }

  readFileAs($event) {
    const fileReader = new FileReader();
    if ($event.target.files.length) {
      fileReader.readAsText($event.target.files[0]);
      fileReader.onload = (e) => {
        console.log(e)
      }
    }
  }

  createForm() {
    const floorObject = (floorName, index) => {
      const floor = this.data.floors ? this.data.floors[index] : {};
      return new FormGroup({
        floor: new FormControl(floorName),
        url: new FormControl(floor.url),
        key: new FormControl(floor.key),
        dots_size: new FormControl(floor.dots_size || 1),
        floorplan_max_height: new FormControl(floor.floorplan_max_height || 300),
        nav_dots_width: new FormControl(floor.nav_dots_width || 0),
        nav_dots_height: new FormControl(floor.nav_dots_height || 0),
        nav_dots_width_: new FormControl(floor.nav_dots_width_ || 0),
        nav_dots_height_: new FormControl(floor.nav_dots_height_ || 0),
        nav_dots_top: new FormControl(floor.nav_dots_top || 0),
        nav_dots_left: new FormControl(floor.nav_dots_left || 0),
        nav_dots_top_: new FormControl(floor.nav_dots_top_ || 0),
        nav_dots_left_: new FormControl(floor.nav_dots_left_ || 0),
        nav_dots_rotation: new FormControl(floor.nav_dots_rotation || 0),
        nav_dots_mirror_h: new FormControl(floor.nav_dots_mirror_h || false),
        nav_dots_mirror_v: new FormControl(floor.nav_dots_mirror_v || false),

        nd_width: new FormControl(floor.nd_width || 30),
        nd_height: new FormControl(floor.nd_height || 30),
        nd_resize_dx: new FormControl(floor.nd_resize_dx || 0),
        nd_resize_dy: new FormControl(floor.nd_resize_dy || 0),

        nd_move_dx: new FormControl(floor.nd_move_dx || 0),
        nd_move_dy: new FormControl(floor.nd_move_dy || 0),

        nd_clientx: new FormControl(floor.nd_clientx || 0),
        nd_clienty: new FormControl(floor.nd_clienty || 0),

        nd_delta: new FormControl(floor.nd_delta || 0),
        nd_deg: new FormControl(floor.nd_deg || 0),
      });
    }
    const fgs = this.data.floorNames.map((floor, index) => floorObject(floor, index));
    const formArray = new FormArray(fgs);

    this.form = new FormGroup({
      floors: formArray
    })
  }
  rotate(d, i) {
    const form = this.formArray.at(i)?.value;
    // const transformState = this.floorplanWrapper.nativeElement.style.transform.split(' (');
    this.formArray.at(i).patchValue({ nav_dots_rotation: d === 'r' ? form.nav_dots_rotation + 90 : form.nav_dots_rotation - 90 });
    // this.floorplanWrapper.nativeElement.style.transform = transformState[0] + ` rotate(${this.form.value.rotation})`;
    // console.log(this.floorplanWrapper.nativeElement.style.transform)
  }
  dragEnd($event, img, i) {
    const pos = this.floorplanWrapper.getCurrentOffset();
    this.formArray.at(i).patchValue({
      nav_dots_top: pos.y,
      nav_dots_left: pos.x,
      nav_dots_top_: (pos.y / img.offsetHeight) * 100,
      nav_dots_left_: (pos.x / img.offsetWidth) * 100
    })
  }
  resizeEnd($event, img, i) {
    this.formArray.at(i).patchValue({
      nav_dots_width: $event.size.width,
      nav_dots_height: $event.size.height,
      nav_dots_width_: ($event.size.width / img.offsetWidth) * 100,
      nav_dots_height_: ($event.size.height / img.offsetHeight) * 100,
    })
  }
  mirror(p, i) {
    const form = this.formArray.at(i).value;
    this.formArray.at(i).patchValue({ [`nav_dots_mirror_${p}`]: !form[`nav_dots_mirror_${p}`] })
  }

  getStyleForDot(p, i) {
    const form = this.formArray.at(i)?.value;
    // rotate(${-form.nav_dots_rotation}deg)
    const style = form ? {
      [form.nav_dots_mirror_v ? 'bottom' : 'top']: `calc(${p.x}%)`,
      [form.nav_dots_mirror_h ? 'right' : 'left']: `calc(${p.z}%)`,
      transform: `scale(${form.dots_size})`
    } : {};
    return style;
  }

  balance(width, height, rad) {
    const W = 'W';
    const H = 'H';
    let big, small;
    const isEqual = width === height;
    // Define big and small. What is bigger height or width
    // 20 > 30
    if (width > height) {
      big = W;
      small = H;
    } else {
      big = H;
      small = W;
    }
    return {}
    // big = H; small = W;
    // For how much reduce and decrease depend on angle
  }

  getStyleForDotsWrapper(el, i) {
    const form = this.formArray.at(i).value;
    const rad = form.nav_dots_rotation * Math.PI / 180;
    const percent = Math.abs(form.nav_dots_rotation) / 90 * 100;

    const diff = Math.abs(el.clientWidth - el.clientHeight);
    const diffOne = diff / 100;
    const newWidth = el.clientWidth + (diffOne * percent);
    const newHeight = el.clientHeight - (diffOne * percent);

    return {
      transform: `rotate(${rad}rad)`,
      // width: newWidth + 'px',
      // height: newHeight + 'px'
    };
  }

  fpMove($event, i) {
    this.formArray.at(i).patchValue({
      nd_move_dx: $event.elX,
      nd_move_dy: $event.elY,
    })
  }
  fpDrop($event, img, i) {
    this.formArray.at(i).patchValue({
      nd_move_dx: $event.elX,
      nd_move_dy: $event.elY,
      nav_dots_top_: ($event.y / img.offsetHeight) * 100,
      nav_dots_left_: ($event.x / img.offsetWidth) * 100
    })
  }
  fpResize($event, img, i) {
    this.formArray.at(i).patchValue({
      nd_width: $event.width,
      nd_height: $event.height,
      nav_dots_width: $event.width,
      nav_dots_height: $event.height,
      nav_dots_width_: ($event.width / img.offsetWidth) * 100,
      nav_dots_height_: ($event.height / img.offsetHeight) * 100,
    })
  }
  fpRotate($event, i) {
    if (this.prevRotate !== $event.delta) {
      //
    }
    this.prevRotate = $event.delta;
    this.formArray.at(i).patchValue({
      nd_delta: this.formArray.at(i).value.nd_delta + $event.delta,
      nd_deg: this.formArray.at(i).value.nd_deg + $event.deg,
      // nav_dots_rotation: this.form.value.nd_deg
    })
  }
  rotationChange($event, i) {
    /*
    if (false) {
      console.log($event.type);
      const form = this.formArray.at(i).value;
      const delta = form.nav_dots_rotation * Math.PI / 180;
      this.subjxWrapper.dragEl.exeRotate({ delta: -form.nd_delta });
      this.subjxWrapper.dragEl.exeRotate({ delta });
    }


     this.data.floorplanMap = this.data.floorplanMap.map(coord => {
      const percentX = form.nav_dots_width / 100;
      const percentH = form.nav_dots_height / 100;
      const newCoord = {
        x: (coord.x * percentX) + Math.cos(delta) * form.nav_dots_height,
        z: (coord.z * percentH)+ Math.sin(delta) * form.nav_dots_height
      };
      return newCoord;
    });
    */
    /*
    if ($event.type === 'input') {
      const delta = 1 * Math.PI/180;
      this.subjxWrapper.dragEl.exeRotate({delta});
    }*/

  }
  floorplanHeightChange() { /**/ }

  rotateCub(deg, i) {
    const delta = deg * Math.PI / 180;
    this.subjxWrapper.dragEl.exeRotate({ delta });
    this.formArray.at(i).patchValue({ nav_dots_rotation: this.formArray.at(i).value.nav_dots_rotation + deg })
  }
}
