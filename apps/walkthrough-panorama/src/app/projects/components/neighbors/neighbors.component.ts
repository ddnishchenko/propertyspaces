import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'propertyspaces-neighbors',
  templateUrl: './neighbors.component.html',
  styleUrls: ['./neighbors.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NeighborsComponent),
      multi: true
    }
  ]
})
export class NeighborsComponent implements OnInit, ControlValueAccessor {
  arrayNeighbors = new FormArray([]);
  neighbors = ['Neightboar'];
  private propagateChange = (_: any) => {};
  constructor() { }

  ngOnInit(): void {
  }

  writeValue(value) {
    if (Array.isArray(value)) {
      this.neighbors = value.length ? value : [''];
      this.arrayNeighbors = new FormArray(this.neighbors.map(n => new FormGroup({name: new FormControl(n)})));
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn) {
    this.propagateChange = fn;
  }

  changeField($event) {
    console.log(this.neighbors);
  }

  addNeighbor() {
    this.neighbors.push('');
  }

}
