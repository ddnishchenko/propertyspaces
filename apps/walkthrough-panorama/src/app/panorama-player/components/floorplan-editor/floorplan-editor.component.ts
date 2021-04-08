import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'propertyspaces-floorplan-editor',
  templateUrl: './floorplan-editor.component.html',
  styleUrls: ['./floorplan-editor.component.scss']
})
export class FloorplanEditorComponent implements OnInit {
  data;
  form;
  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = new FormGroup({
      scale: new FormControl(1),
      offsetTop: new FormControl(0),
      offsetLeft: new FormControl(0),
      rotation: new FormControl(0)
    })
  }
  submit() {}
}
