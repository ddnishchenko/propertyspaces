import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { ProjectsService } from '../../service/projects.service';
import { loadProjectGallery, removeProjectGalleryPhoto, uploadProjectGalleryPhoto } from '../../state/gallery/project-gallery.actions';
import { selectGallery } from '../../state/gallery/project-gallery.selectors';

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
    private store: Store
  ) { }

  ngOnInit(): void {
    this.store.dispatch(loadProjectGallery({projectId: this.project_id}));
    this.gallery$ = this.store.pipe(select(selectGallery));
  }

  uploadImage(form) {
    this.store.dispatch(uploadProjectGalleryPhoto({form}));
  }

  submit(form) {
    // this.store.dispatch(uploadProjectGalleryPhoto({form}));
  }
  removeImage(name) {
    this.store.dispatch(removeProjectGalleryPhoto({projectId: this.project_id, image_id: [name]}));
  }
}
