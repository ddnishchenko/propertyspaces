import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DndDropEvent, DropEffect } from 'ngx-drag-drop';

@Component({
  selector: 'propertyspaces-gallery-editor',
  templateUrl: './gallery-editor.component.html',
  styleUrls: ['./gallery-editor.component.scss']
})
export class GalleryEditorComponent implements OnInit {
  @Input() items = [];
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
