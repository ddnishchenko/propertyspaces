import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'propertyspaces-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  today = new Date();
  constructor() { }

  ngOnInit(): void {
  }

}
