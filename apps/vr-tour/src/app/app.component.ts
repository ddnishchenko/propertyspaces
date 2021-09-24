import { HttpClient } from '@angular/common/http';
import { Component, NgZone, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GalleryComponent } from 'ng-gallery';
import { VirtualTourDirective } from '@propertyspaces/virtual-tour';
import { map } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Fullscreen } from './fullscreen';

function selectPanoramas(state) {
  if (state?.panoramas?.length) {
    const panoramas = state.panoramas
      .slice()
      .map((p, index) => ({ ...p, order: +p.order, floor: isNaN(+p.floor) ? 1 : +p.floor, index, transitionFrom: undefined }));

    const sortedFloors =
      panoramas
        .map(p => p.floor)
        .sort((a, b) => a - b);

    const floors = Array
      .from(new Set(sortedFloors))
      .map(
        floor => panoramas
          .filter(p => p.floor === floor)
          .sort((a, b) => +a.order - +b.order)
      )
      .reduce((prev, next) => prev.concat(next))
      .sort((a, b) => +a.index - +b.index)
      .map(
        (currentValue, index, arr) => {
          if (index > 0 && index < arr.length - 1) {
            const next = arr[index + 1];
            const prev = arr[index - 1];
            if (next.floor > currentValue.floor) {
              return {
                ...currentValue,
                transitionFrom: next.floor
              }
            }

            if (prev.floor < currentValue.floor) {
              return {
                ...currentValue,
                transitionFrom: prev.floor
              }
            }

          }
          return currentValue;
        }
      )
      .sort((a, b) => +a.floor - +b.floor);

    return floors;
  }
  return [];
}

function countCoordinates(state) {
  let floorNames = state.map(p => p.floor);
  floorNames = Array.from(new Set(floorNames));
  const panoFloors = floorNames.map(f => state.filter(p => p.floor === f));
  const panoFloorsCoord = panoFloors.map(f => {
    let xArray = f.map(p => +p.x);
    let zArray = f.map(p => +p.z);

    let xMin = Math.min(...xArray);
    let xMax = Math.max(...xArray);

    let zMin = Math.min(...zArray);
    let zMax = Math.max(...zArray);

    if (xMin < 0) {
      xArray = f.map(p => Math.abs(xMin) + +p.x);
      xMin = Math.min(...xArray);
      xMax = Math.max(...xArray);
    } else if (xMin > 0) {
      xArray = f.map(p => +p.x - Math.abs(xMin));
      xMin = Math.min(...xArray);
      xMax = Math.max(...xArray);
    }

    if (zMin < 0) {
      zArray = f.map(p => Math.abs(zMin) + +p.z);
      zMin = Math.min(...zArray);
      zMax = Math.max(...zArray);
    } else if (zMin > 0) {
      zArray = f.map(p => +p.z - Math.abs(zMin));
      zMin = Math.min(...zArray);
      zMax = Math.max(...zArray);
    }

    const xSide = xMax - (xMin);
    const zSide = zMax - (zMin);

    const floorplanMap = f.map((p, i) => ({
      name: p.name,
      index: p.index,
      order: p.order,
      floor: p.floor,
      z: (zArray[i] / zSide) * 100,
      x: (xArray[i] / xSide) * 100
    }));
    return floorplanMap;
    // const size = 50;

    // const floorplanArea = (xSide * zSide) * size;
    // const width = (zSide  + (zMin*2)) * size;
    // const height = (xSide  + (zMin*2)) * size;
  });


  return {
    _t: Date.now(),
    panoFloorsCoord,
    panoFloors,
    floorNames,
    panos: state
  }
}

const slideInAnimation = trigger('slideAnimation', [
  state('in', style({ transform: 'translateY(0)', opacity: 1 })),
  transition(':enter', [
    style({ transform: 'translateY(-100%)', opacity: 0 }),
    animate(400)
  ]),
  transition(':leave', [
    animate(400, style({ transform: 'translateY(-100%)', opacity: 0 }))
  ])
]);

@Component({
  selector: 'propertyspaces-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [slideInAnimation]
})
export class AppComponent {
  @ViewChild(VirtualTourDirective) virtualTour: VirtualTourDirective;
  @ViewChild(GalleryComponent) galleryCmp: GalleryComponent;
  title = 'vr-tour';
  modalContent;
  modalTitle;
  isGalleryOpened = false;
  textRecentlyCopied = false;
  data$ = this.http.get('assets/data.json').pipe(
    map(data => {
      const vrData = countCoordinates(selectPanoramas(data));
      return {
        ...data,
        ...vrData
      }
    })
  );
  copyBrandedLink;
  loading = true;;
  isFullscreenActive$ = Fullscreen.change$.pipe(
    map(active => ({ active }))
  );
  get shareFullscreen() {
    return location.href;
  }
  get embedCodeFullscreen() {
    return `<iframe src="${this.shareFullscreen}" width="100%" height="720px" frameborder="0" allowfullscreen></iframe>`;
  }
  constructor(
    private http: HttpClient,
    private zone: NgZone,
    public modalService: NgbModal
  ) { }
  tourInitiated(data) {
    console.log(data);
    this.loading = false;
  }
  changeActive($event, data) {
    console.log($event, data);
  }
  viewChange($event) {
    console.log($event);
  }

  openSectionModal(modalWrapper, content, modalTitle) {
    this.modalContent = content;
    this.modalTitle = modalTitle;
    const m = this.modalService.open(modalWrapper, {
      windowClass: 'fullscreen-modal',
      scrollable: true
    });

    m.result.then(
      r => {
        this.modalContent = null;
      },
      reason => {
        this.modalContent = null;
      }
    );
  }

  openShareModal(content) {
    this.modalService.open(content, { centered: true });
  }

  openImage(i, closeModal = false) {
    if (closeModal) {
      this.modalService.dismissAll();
    }
    this.isGalleryOpened = true;
    this.galleryCmp.galleryRef.set(i);
  }
  copyLink(f) {
    f.select();
    document.execCommand('copy');
    this.textRecentlyCopied = true;
  }
  closeGallery() {
    this.isGalleryOpened = false;
    this.resizeCanvas();
  }
  resizeCanvas() {
    this.zone.runOutsideAngular(() => window.dispatchEvent(new Event('resize')))
  }

  toggleFullscreen() {
    Fullscreen.toggle();
  }
}
