import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

import subjx from 'subjx';

@Directive({
  selector: '[propertyspacesSubjx]'
})
export class SubjxDirective implements AfterViewInit {
  @Input() initMove;
  @Input() initResize;
  @Input() initRotate;
  @Output() init = new EventEmitter();
  @Output() destroy = new EventEmitter();
  @Output() move = new EventEmitter();
  @Output() resizeEvent = new EventEmitter();
  @Output() rotate = new EventEmitter();
  @Output() dropEvent = new EventEmitter();
  subjxEl;
  dragEl;
  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    const ref = this;
    setTimeout(() => {

      this.subjxEl = subjx(this.el.nativeElement);
      const dragEls = this.subjxEl.drag({
        rotatable: true,
        rotatorOffset: 0,
        snap: {x: 1, y: 1, angle: 1},
        onInit(el) {
          ref.init.emit(this);
        },
        onDestroy(el) {
          ref.destroy.emit(this);
        }
      });
      this.dragEl = dragEls[0];
      this.initDefault();

      this.dragEl.on('dragEnd', function(event) {
        console.log('dragEnd', this.storage.center);
        ref.dropEvent.emit(this.storage.center);
      });
      this.dragEl.on('drag', function(event) {
        console.log('drag', this.storage.center);
        ref.dropEvent.emit(this.storage.center);
      });
      this.dragEl.on('resizeEnd', function(event) {
        console.log('dragEnd', this.storage.bBox);
        ref.resizeEvent.emit(this.storage.bBox);
      });

      let lastDelta;
      this.dragEl.on('rotate', function(event) {
        console.log('rotate', this.storage.pressang, event.delta);
        lastDelta = event.delta;
        ref.rotate.emit({delta: event.delta, deg: Math.floor(event.delta * 180 / Math.PI)});
      });

      this.dragEl.on('rotateEnd', function(event) {
        console.log('rotateEnd', this.storage.pressang, event.delta);
        ref.rotate.emit({delta: lastDelta, deg: Math.floor(lastDelta * 180 / Math.PI)});
      });
      console.log(this.dragEl);

    }, 1000);

  }

  initDefault() {
    if (this.initResize) {
      this.dragEl.exeResize(this.initResize);
    }

    if (this.initMove) {
      this.dragEl.exeDrag(this.initMove);
    }

    if (this.initRotate) {
      this.dragEl.exeRotate({delta: this.initRotate.delta * Math.PI/180});
    }
  }

}
