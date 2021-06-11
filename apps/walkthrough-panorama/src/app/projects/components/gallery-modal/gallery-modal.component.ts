import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectsService } from '../../service/projects.service';

@Component({
  selector: 'propertyspaces-gallery-modal',
  templateUrl: './gallery-modal.component.html',
  styleUrls: ['./gallery-modal.component.scss']
})
export class GalleryModalComponent implements OnInit {
  testImgs = [];
  project_id;
  gallery$;
  constructor(
    public activeModal: NgbActiveModal,
    private projectService: ProjectsService
  ) { }

  ngOnInit(): void {
    this.gallery$ = this.projectService.loadGallery(this.project_id);
  }

  submit(form) {
    this.projectService.uploadGalleryPhoto(form).subscribe(res => {
      console.log(res);
      this.gallery$ = this.projectService.loadGallery(this.project_id);
    });
  }

}
