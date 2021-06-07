import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'propertyspaces-virtual-tour',
  templateUrl: './virtual-tour.component.html',
  styleUrls: ['./virtual-tour.component.scss']
})
export class VirtualTourComponent implements OnInit {
  isCollapsed = true;
  constructor() { }

  ngOnInit(): void {
  }

}
