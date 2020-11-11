import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '@propertyspaces/api-interfaces';

@Component({
  selector: 'propertyspaces-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  models = ['HXjD8g5pMev', 'RE249ed7S7A']
  constructor(private http: HttpClient) {}
}
