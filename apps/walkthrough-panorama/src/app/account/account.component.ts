import { Component, OnInit } from '@angular/core';
import { routes } from './account-routing.module';

@Component({
  selector: 'propertyspaces-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  routes = routes[0].children;
  constructor() { }

  ngOnInit(): void {
  }

}
