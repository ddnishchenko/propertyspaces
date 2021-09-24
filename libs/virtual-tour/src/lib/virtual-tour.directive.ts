import { Directive, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from "@angular/core";
import { Subscription } from "rxjs";
import { VirtualTourService } from './virtual-tour.service';

@Directive({
  selector: 'canvas[propertyspacesVirtualTour]',
  providers: [VirtualTourService]
})
export class VirtualTourDirective implements OnInit, OnDestroy {
  private _virtualTourEvents: Subscription;
  @Input() propertyspacesVirtualTour;
  @Output() init = new EventEmitter();
  @Output() navigationChange = new EventEmitter();
  @Output() change = new EventEmitter();
  @Output() zoom = new EventEmitter();
  constructor(
    private el: ElementRef<HTMLCanvasElement>,
    private ngZone: NgZone,
    public virtualTourService: VirtualTourService
  ) { }

  ngOnInit() {
    this.virtualTourService.createScene(this.el.nativeElement, this.propertyspacesVirtualTour, e => {
      switch (e.type) {
        case VirtualTourService.EVENTS.INIT:
          this.init.emit();
          break;
        case VirtualTourService.EVENTS.NAV_TO:
          this.navigationChange.emit(e.data);
          break;
        case VirtualTourService.EVENTS.CHANGE:
          this.change.emit(e.data);
          break;
        case VirtualTourService.EVENTS.ZOOM:
          this.zoom.emit(e.data);
      }
    });
    this.ngZone.runOutsideAngular(() => this.virtualTourService.animate());

    // this._virtualTourEvents = this.virtualTourService.events.subscribe();
  }

  ngOnDestroy() {
    this.virtualTourService.destroy();
    this._virtualTourEvents?.unsubscribe();
  }
}
