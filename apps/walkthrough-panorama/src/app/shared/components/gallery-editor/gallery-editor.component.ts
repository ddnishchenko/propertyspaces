import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Output() nameChange: EventEmitter<any> = new EventEmitter();
  @Output() moveToTrash: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  onDragStart ($event) {}
  onDragEnd($event) {}
  onDrop( event:DndDropEvent, list?:any[] ) {
    console.log('Drop');
    const listCopy = [...list];
    if( list
      && (event.dropEffect === "copy"
        || event.dropEffect === "move") ) {

      let index = event.index;

      if( typeof index === "undefined" ) {

        index = listCopy.length;
      }
      listCopy.splice( index, 0, event.data );
      list = listCopy;
      this.items = list;
      console.log(list);
    }
  }

  onDragged( item:any, list:any[], effect: DropEffect ) {
    console.log('dragged')
    const listCopy = [...list];
    if( effect === "move" ) {

      const index = list.indexOf( item );
      listCopy.splice( index, 1 );
      list = listCopy;
    }
    this.items = list;
    console.log(list);
    this.sortChange.emit(this.items);
  }

  saveTitle($event, d, i) {
    console.log($event.target.value);
    const oldName = d.name;
    const newName = $event.target.value;
    this.nameChange.emit({oldName, newName, items: this.items});
    this.items = this.items.map((item, index) => index === i ? ({...item, name: newName }) : item);
    this.toggleEditMode(i, false);
  }

  removeItem(d, i) {
    this.moveToTrash.emit({item: d, index: i});
  }

  toggleEditMode(index, value) {
    this.items = this.items.map((item, i) => i === index ? ({...item, nameEditing: value}) : item );
  }

}
