import { AfterViewInit, Directive, ElementRef, HostListener, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import * as SvgPanZoom from 'svg-pan-zoom';

@Directive({
  selector: 'object[propertyspacesSvgzoompan], embed[propertyspacesSvgzoompan]'
})
export class SvgZoomPanDirective implements OnInit, AfterViewInit, OnDestroy {
  @Input() propertyspacesSvgzoompan: SvgPanZoom.Options = {};
  svg: SvgPanZoom.Instance;
  constructor(
    private el: ElementRef,
    private ngZone: NgZone
  ) { }

  ngOnInit() {

    this.el.nativeElement.addEventListener('load', () => {
      this.svg = SvgPanZoom(this.el.nativeElement, this.propertyspacesSvgzoompan);
    })
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    if (this.svg) {
      this.ngZone.runOutsideAngular(() => {
        this.svg.destroy();
      })
    }

  }

}
