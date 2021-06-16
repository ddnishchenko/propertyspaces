import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DndDropEvent, DropEffect } from 'ngx-drag-drop';

@Component({
  selector: 'propertyspaces-gallery-editor',
  templateUrl: './gallery-editor.component.html',
  styleUrls: ['./gallery-editor.component.scss']
})
export class GalleryEditorComponent implements OnInit {
  @Input() items = [
    {name: 'Uruguay', url: 'https://source.unsplash.com/433x649/?Uruguay'},
    {name: 'Jamaica', url: 'https://source.unsplash.com/530x572/?Jamaica'},
    {name: 'Kuwait', url: 'https://source.unsplash.com/531x430/?Kuwait'},
    {name: 'Bermuda', url: 'https://source.unsplash.com/586x1073/?Bermuda'},
    {name: 'Ecuador', url: 'https://source.unsplash.com/500x571/?Ecuador'},
    {name: 'Virgin Islands', url: 'https://source.unsplash.com/579x518/?Virgin Islands (British)'},
    {name: 'Angola', url: 'https://source.unsplash.com/503x548/?Angola'},
    {name: 'Mauritania', url: 'https://source.unsplash.com/511x630/?Mauritania'},
    {name: 'Sri Lanka', url: 'https://source.unsplash.com/414x767/?Sri Lanka'},
    {name: 'St. Helena', url: 'https://source.unsplash.com/443x704/?St. Helena'},
    {name: 'Namibia', url: 'https://source.unsplash.com/441x1145/?Namibia'},
    {name: 'Samoa', url: 'https://source.unsplash.com/491x1097/?Samoa'},
  ];
  @Output() sortChange: EventEmitter<any[]> = new EventEmitter();
  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

  drop($event: CdkDragDrop<any[]>) {
    moveItemInArray(this.items, $event.previousIndex, $event.currentIndex);
    this.sortChange.emit(this.items);
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
    this.sortChange.emit(this.items);
  }

  onDragged( item:any, list:any[], effect: DropEffect ) {


    if( effect === "move" ) {

      const index = list.indexOf( item );
      list.splice( index, 1 );
    }
  }

}
