import { Component, OnInit } from '@angular/core';
import { ProjectsService } from './projects/service/projects.service';

@Component({
  selector: 'propertyspaces-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private ps: ProjectsService) { }
  ngOnInit() {
    this.ps.aws();
  }
}
