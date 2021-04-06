import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { fileToBase64 } from '../../../utils';

@Component({
  selector: 'propertyspaces-floorplan-form',
  templateUrl: './floorplan-form.component.html',
  styleUrls: ['./floorplan-form.component.scss']
})
export class FloorplanFormComponent implements OnInit {
  form: FormGroup;
  title = 'Floorplan';
  loading = false;
  floorplan = '';
  mediaPath = '';
  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.form = new FormGroup({
      floorplan: new FormControl(this.floorplan)
    })
  }

  async uploadImage($event) {
    if ($event.target.files.length) {
      this.loading = true;
      const floorplan = await fileToBase64($event.target.files[0]);
      this.form.patchValue({floorplan});
      this.loading = false;
    }
  }
  submit() {
    this.activeModal.close(this.form.value.floorplan);
  }
}
