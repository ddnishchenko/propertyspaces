import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '@propertyspaces/api-interfaces';

@Component({
  selector: 'propertyspaces-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  models$ = this.http.get(`./assets/models/list.json`);
  constructor(private http: HttpClient) {}
}
