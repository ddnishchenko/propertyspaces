import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
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
  constructor(
    private el: ElementRef<HTMLCanvasElement>,
    public virtualTourService: VirtualTourService
  ) {}

  ngOnInit() {
    this.virtualTourService.createScene(this.el, this.propertyspacesVirtualTour);
    this.virtualTourService.animate();
    this._virtualTourEvents = this.virtualTourService.events.subscribe( e => {
      switch(e.type) {
        case VirtualTourService.EVENTS.INIT:
          this.init.emit();
          break;
        case VirtualTourService.EVENTS.NAV_TO:
          this.navigationChange.emit(e.data);
      }
    });
  }

  ngOnDestroy() {
    this.virtualTourService.destroy();
    this._virtualTourEvents?.unsubscribe();
  }
}
