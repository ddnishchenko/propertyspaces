import { Directive, ElementRef, OnInit } from '@angular/core';

import subjx from 'subjx';

@Directive({
  selector: '[propertyspacesSubjx]'
})
export class SubjxDirective implements OnInit {

  subjxEl;
  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.subjxEl = subjx(this.el.nativeElement);
    this.subjxEl.drag({
      rotatable: true,
      snap: {x: 1, y: 1, angle: 1},
      onInit(el) {
        // fires on tool activation
        console.log(el);
      },
      onMove({ clientX, clientY, dx, dy, transform }) {
          // fires on moving
          // console.log(clientX, clientY, dx, dy, transform);
      },
      onResize({ clientX, clientY, dx, dy, transform, width, height }) {
          // fires on resizing
          // console.log(clientX, clientY, dx, dy, transform, width, height);
      },
      onRotate({ clientX, clientY, delta, transform }) {
          // fires on rotation
          console.log(clientX, clientY, delta, transform);
      },
      onDrop({ clientX, clientY }) {
          // fires on drop
          // console.log(clientX, clientY);
      },
      onDestroy(el) {
          // fires on tool deactivation
          // console.log(el);
      }
    });
  }

}
