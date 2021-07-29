import { AfterViewInit, Directive, ElementRef, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import * as SvgPanZoom from 'svg-pan-zoom';
import * as Hammer from 'hammerjs';


@Directive({
  selector: 'svg[propertyspacesSvgzoompan], object[propertyspacesSvgzoompan], embed[propertyspacesSvgzoompan]'
})
export class SvgZoomPanDirective implements OnInit, AfterViewInit, OnDestroy {
  @Input() propertyspacesSvgzoompan: SvgPanZoom.Options = {};
  svg: SvgPanZoom.Instance;
  constructor(
    private el: ElementRef,
    private ngZone: NgZone
  ) { }

  ngOnInit() {}

  ngAfterViewInit() {
    const eventsHandler = {
      haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel']
    , init: function(options) {
        const instance = options.instance;
          let initialScale = 1
          , pannedX = 0
          , pannedY = 0

        // Init Hammer
        // Listen only for pointer and touch events
        const SUPPORT_POINTER_EVENTS = Hammer.prefixed(window, 'PointerEvent') !== undefined;
        this.hammer = new Hammer(options.svgElement, {
          inputClass: SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
        })

        // Enable pinch
        this.hammer.get('pinch').set({enable: true})

        // Handle double tap
        this.hammer.on('doubletap', function(ev){
          instance.zoomIn()
        })

        // Handle pan
        this.hammer.on('panstart panmove', function(ev){
          // On pan start reset panned variables
          if (ev.type === 'panstart') {
            pannedX = 0
            pannedY = 0
          }

          // Pan only the difference
          instance.panBy({x: ev.deltaX - pannedX, y: ev.deltaY - pannedY})
          pannedX = ev.deltaX
          pannedY = ev.deltaY
        })

        // Handle pinch
        this.hammer.on('pinchstart pinchmove', function(ev){
          // On pinch start remember initial zoom
          if (ev.type === 'pinchstart') {
            initialScale = instance.getZoom();
            instance.zoomAtPoint(initialScale * ev.scale, {x: ev.center.x, y: ev.center.y});
          }

          instance.zoomAtPoint(initialScale * ev.scale, {x: ev.center.x, y: ev.center.y});
        })

        // Prevent moving the page on some devices when panning over SVG
        options.svgElement.addEventListener('touchmove', function(e){ e.preventDefault(); });
      }

    , destroy: function(){
        this.hammer.destroy()
      }
    }
    setTimeout(() => {
      this.svg = SvgPanZoom(this.el.nativeElement, this.propertyspacesSvgzoompan || {
        zoomEnabled: true,
        controlIconsEnabled: true,
        fit: true,
        center: true,
        customEventsHandler: eventsHandler,
        refreshRate: 30
      });
    }, 1000);
  }

  ngOnDestroy() {
    if (this.svg) {
      this.ngZone.runOutsideAngular(() => {
        this.svg.destroy();
      })
    }

  }

}
