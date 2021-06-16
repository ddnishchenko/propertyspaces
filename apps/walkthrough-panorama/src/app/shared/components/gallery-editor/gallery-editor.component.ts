import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { DndDropEvent, DropEffect } from 'ngx-drag-drop';

@Component({
  selector: 'propertyspaces-gallery-editor',
  templateUrl: './gallery-editor.component.html',
  styleUrls: ['./gallery-editor.component.scss']
})
export class GalleryEditorComponent implements OnInit {
  gallery: any[] = [];
  dummyPictures = [
    {name: 'Uruguay', src: 'https://source.unsplash.com/433x649/?Uruguay'},
    {name: 'Jamaica', src: 'https://source.unsplash.com/530x572/?Jamaica'},
    {name: 'Kuwait', src: 'https://source.unsplash.com/531x430/?Kuwait'},
    {name: 'Bermuda', src: 'https://source.unsplash.com/586x1073/?Bermuda'},
    {name: 'Ecuador', src: 'https://source.unsplash.com/500x571/?Ecuador'},
    {name: 'Virgin Islands', src: 'https://source.unsplash.com/579x518/?Virgin Islands (British)'},
    {name: 'Angola', src: 'https://source.unsplash.com/503x548/?Angola'},
    {name: 'Mauritania', src: 'https://source.unsplash.com/511x630/?Mauritania'},
    {name: 'Sri Lanka', src: 'https://source.unsplash.com/414x767/?Sri Lanka'},
    {name: 'St. Helena', src: 'https://source.unsplash.com/443x704/?St. Helena'},
    {name: 'Namibia', src: 'https://source.unsplash.com/441x1145/?Namibia'},
    {name: 'Samoa', src: 'https://source.unsplash.com/491x1097/?Samoa'},
  ];
  constructor(
    public activeModal: NgbActiveModal,
    private store: Store
  ) { }

  ngOnInit(): void {
  }

  drop($event: CdkDragDrop<any[]>) {
    moveItemInArray(this.dummyPictures, $event.previousIndex, $event.currentIndex);
  }

  onDrop( event:DndDropEvent, list?:any[] ) {

    if( list
      && (event.dropEffect === "copy"
        || event.dropEffect === "move") ) {

      let index = event.index;

      if( typeof index === "undefined" ) {

        index = list.length;
      }

      list.splice( index, 0, event.data );
    }
  }

  onDragged( item:any, list:any[], effect: DropEffect ) {


    if( effect === "move" ) {

      const index = list.indexOf( item );
      list.splice( index, 1 );
    }
  }

}
