import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';

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
    // this.gallery$ = this.store.pipe(select(selectGallery));
  }

  uploadImage($event) {
    if ($event.target.files.length) {
      const file = $event.target.files[0];
      // this.store.dispatch(uploadProjectGalleryPhoto({projectId: this.project_id, file}));
    }

  }

  submit(form) {
    // this.store.dispatch(uploadProjectGalleryPhoto({form}));
  }
  removeImage(name) {
    // this.store.dispatch(removeProjectGalleryPhoto({projectId: this.project_id, image_id: [name]}));
  }
}
