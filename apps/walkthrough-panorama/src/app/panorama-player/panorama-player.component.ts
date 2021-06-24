import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from '../projects/service/projects.service';
import { map, skip, skipUntil, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { VirtualTourDirective } from '@propertyspaces/virtual-tour';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FloorplanEditorComponent } from './components/floorplan-editor/floorplan-editor.component';
import { select, Store } from '@ngrx/store';
import { selectHdrVirtualTourPanoramasDividerOnFloors, selectProjectsState, selectVirtualTourPanoramas, selectVirtualTourParams } from '../projects/state/projects.selectors';
import { loadPanoramas, updatePanorama, updateProject } from '../projects/state/projects.actions';
import { Panorama } from '../interfaces/panorama';
import { changeOrderOfPhoto, loadProjectGallery, removeProjectGalleryPhoto, renamePhoto, uploadProjectGalleryPhoto } from '../projects/state/gallery/project-gallery.actions';
import { selectOrderedGallery } from '../projects/state/gallery/project-gallery.selectors';
import { dataURLtoFile } from '../utils';
import { NgxMasonryComponent, NgxMasonryOptions } from 'ngx-masonry';
import { GalleryComponent } from 'ng-gallery';
import { GalleryEditorComponent } from '../shared/components/gallery-editor/gallery-editor.component';
import { slideInAnimation } from '../utils/animations';
import { combineLatest } from 'rxjs';

function parseModel(model) {
  if (!model) {
    return false;
  }
  const allPanos = model.data;
  let panos = allPanos.filter(t => !t.name.includes('_'));
  let panosHDR = panos.map((p, i) => {
    return {
      ...p,
      panoramas: {
        ...p.panoramas,
        floor: isNaN(p.panoramas.floor) ? 1 : p.panoramas.floor,
      },
      dark_pano: allPanos.find(t => t.name.includes(`${p.name}_dark`)),
      light_pano: allPanos.find(t => t.name.includes(`${p.name}_light`)),
      hdr_pano: allPanos.find(t => t.name.includes(`${p.name}_hdr`)),
    };
  }).sort((a, b) => a.floor - b.floor);
  let floors: number[] = panosHDR.map(p => p.panoramas.floor);
  floors = Array.from(new Set(floors)).sort((a, b) => a - b);
  let panoFloors = floors.map(f => panosHDR.filter(p => p.panoramas.floor === f));
  let panoFloorsCoord = panoFloors.map(f => {
    let xArray = f.map(p => +p.panoramas.x);
    let zArray = f.map(p => +p.panoramas.z);

    let xMin = Math.min(...xArray);
    let xMax = Math.max(...xArray);

    let zMin = Math.min(...zArray);
    let zMax = Math.max(...zArray);

    if (xMin < 0) {
      xArray = f.map(p => Math.abs(xMin) + +p.panoramas.x);
      xMin = Math.min(...xArray);
      xMax = Math.max(...xArray);
    } else if (xMin > 0) {
      xArray = f.map(p => +p.panoramas.x - Math.abs(xMin));
      xMin = Math.min(...xArray);
      xMax = Math.max(...xArray);
    }

    if (zMin < 0) {
      zArray = f.map(p => Math.abs(zMin) + +p.panoramas.z);
      zMin = Math.min(...zArray);
      zMax = Math.max(...zArray);
    } else if (zMin > 0) {
      zArray = f.map(p => +p.panoramas.z - Math.abs(zMin));
      zMin = Math.min(...zArray);
      zMax = Math.max(...zArray);
    }

    const xSide = xMax - (xMin);
    const zSide = zMax - (zMin);

    const floorplanMap = f.map((p, i) => ({
      name: p.name,
      z: (zArray[i] / zSide) * 100,
      x: (xArray[i] / xSide) * 100
    }));
    return floorplanMap;
    // const size = 50;

    // const floorplanArea = (xSide * zSide) * size;
    // const width = (zSide  + (zMin*2)) * size;
    // const height = (xSide  + (zMin*2)) * size;
    // console.log(floorplanMap);
  });


  return {
    ...model,
    _t: Date.now(),
    panos: panosHDR,
    panoFloorsCoord,
    panoFloors,
    floors,
    hostname: environment.apiHost,
    projectFolder: environment.apiHost + model.path
  }
}

const aspectRations = [
  {
    name: 'Choose Aspect Ration',
    value: ''
  },
  {
    name: 'Landscape',
    value: 566 / 1080,
  },
  {
    name: 'Portrait',
    value: 1080 / 1350
  },
  {
    name: 'Square',
    value: 1080 / 1080
  },
  {
    name: 'Custom',
    value: 'custom'
  }
  /* {
    name: 'SVGA / XGA (4:3)',
    value: 0.75,
  },
  {
    name: 'WSVGA (~17:3)',
    value: 0.5860010851871947,
  },
  {
    name: '4K / HD / FHD (16:9)',
    value: 0.5625,
  },
  {
    name: 'WXGA (5:3)',
    value: 0.6,
  },
  {
    name: 'SXGA (5:4)',
    value: 0.8,
  },
  {
    name: 'WXGA+ / WSXGA+ (16:10)',
    value: 0.625,
  },
  {
    name: 'Square (1:1)',
    value: 1
  },
  {
    name: 'iPhone X',
    value: 2.1653333333333333
  } */
]

@Component({
  selector: 'propertyspaces-panorama-player',
  templateUrl: './panorama-player.component.html',
  styleUrls: ['./panorama-player.component.scss'],
  animations: [slideInAnimation]
})
export class PanoramaPlayerComponent implements OnInit {
  isCollapsed = true;
  @ViewChild(VirtualTourDirective) virtualTour;
  @ViewChild(GalleryComponent) galleryCmp: GalleryComponent;
  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  public masonryOptions: NgxMasonryOptions = {
    gutter: 20,
  };
  isGalleryOpened = false;
  activePoint = 0;
  activeFloor = 0;
  aspectRatio = null;
  aspects = aspectRations;
  data$;
  form;
  isEdit = false;
  rotationAngle = 0;
  defaultZoom = 0;
  floors$;
  modalContent = null;
  modalTitle = null;
  gallery$;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private store: Store
  ) { }

  ngOnInit(): void {
    const projectId = this.route.snapshot.params.id;
    this.isEdit = this.router.url.includes('model');
    this.createForm();
    this.store.dispatch(loadProjectGallery({ projectId }));
    this.store.dispatch(loadPanoramas({ projectId }));
    this.gallery$ = this.store.pipe(
      select(selectOrderedGallery),
      tap(() => setTimeout(() => this.updateMasonty(), 100))
    );
    /*
    this.data$ = this.store.pipe(
      select(selectVirtualTourParams),
      // tap(data => console.log(data))
      map(data => {
        console.log(data);
        const parsedData = parseModel(data);
        if (this.route.snapshot.params.floorplan && this.isEdit && parsedData) {
          this.openFloorplanEditor(parsedData);
        }
        return parsedData;
      })
    ); */

    this.data$ = combineLatest([
      this.store.pipe(select(selectVirtualTourParams)),
      this.store.pipe(select(selectHdrVirtualTourPanoramasDividerOnFloors))
    ]).pipe(
      map(([project, panoFloors]) => {
        return {...project, ...panoFloors};
      }),
      skip(1)
    )
  }

  createForm() {
    this.form = new FormGroup({
      rotationY: new FormControl(''),
      panoCameraStartAngle: new FormControl(''),
      editMode: new FormControl(false),
      zoom: new FormControl(0),
      panoZoom: new FormControl(0),
      aspectRatio: new FormControl(''),
      customRatio: new FormControl(''),
      sidebarSide: new FormControl('l')
    });
  }

  calcRatio(ratio) {
    if (ratio) {

    }
  }

  vrInit(data) {
    this.form.patchValue({
      rotationY: +this.virtualTour.virtualTourService.defaultY,
      zoom: this.virtualTour.virtualTourService.defaultZoom
    });
    this.rotationAngle = this.virtualTour.virtualTourService.OrbitControls.getPolarAngle() - +this.virtualTour.virtualTourService.mesh.rotation.y;
    this.defaultZoom = this.virtualTour.virtualTourService.OrbitControls.object.fov;
    this.activePoint = this.virtualTour.virtualTourService.activeIndex;
  }

  editModeSwitch() {
    this.virtualTour.virtualTourService.toggleNavMode(this.form.value.editMode);
  }

  rotationYChange() {
    this.virtualTour.virtualTourService.changeMeshRotation(this.form.value.rotationY);
  }

  panoCameraStartAngleChange() {
    this.virtualTour.virtualTourService.changeMeshRotationForCurrentPano(this.form.value.panoCameraStartAngle);
  }
  panoZoomChange() {
    this.virtualTour.virtualTourService.changeZoomForCurrentPano(+this.form.value.panoZoom);
  }

  saveY(projectId) {
    const data = { zoom: this.form.value.zoom, rotation_y: this.form.value.rotationY };
    this.store.dispatch(updateProject({ projectId, data }))
  }

  updatePanoSettings() {
    const { name, panoramas } = this.virtualTour.virtualTourService.currentPanorama;
    const panorama: Panorama = {
      name, panoramas
    };
    this.store.dispatch(updatePanorama({
      projectId: this.route.snapshot.params.id,
      panorama
    }))
  }

  saveSettings(projectId) {

    const data = {
      zoom: this.form.value.zoom,
      rotation_y: this.form.value.rotationY
    };
    this.virtualTour.virtualTourService.defaultY = data.rotation_y;
    this.virtualTour.virtualTourService.defaultZoom = data.zoom;
    this.store.dispatch(updateProject({ projectId, data }))
  }

  navTo(index) {
    this.activePoint = index;
    this.virtualTour.virtualTourService.moveMark(index);
  }

  changeActive($event, panos) {
    this.activePoint = $event;
    const pano = panos.find(p => p.panoramas.index === $event);
    const floor = pano.panoramas.floor;
    this.activeFloor = floor;
    this.form.patchValue({
      panoCameraStartAngle: this.virtualTour.virtualTourService.currentPano.panoramas.panoCameraStartAngle || 0,
      panoZoom: this.virtualTour.virtualTourService.currentPano.panoramas.zoom || 0
    })
  }
  zoomChange() {
    this.virtualTour.virtualTourService.changeZoom(+this.form.value.zoom)
  }

  viewChange($event) {
    // this.form.get('zoom').patchValue($event.object.fov);
    // this.defaultZoom = $event.object.fov;
    this.rotationAngle = this.virtualTour.virtualTourService.OrbitControls.getAzimuthalAngle() - +this.virtualTour.virtualTourService.mesh.rotation.y;
  }

  openFloorplanEditor(data) {
    const modalRef = this.modalService.open(FloorplanEditorComponent, {
      windowClass: 'fullscreen-modal',
    });
    modalRef.componentInstance.data = data;
    modalRef.result.then(data => {
      if (data) {
        const projectId = this.route.snapshot.params.id;
        this.store.dispatch(updateProject({ projectId, data }))
      }
    }).catch(e => {
      console.log('Dismissed');
    })
  }
  scaleDots(data) {
    return {
      width: `calc(${data.nav_dots_width_}%)`,
      height: `calc(${data.nav_dots_height_}%)`,
      // transform: `rotate(${-data.nav_dots_rotation}deg)`,
      top: `${data.nav_dots_top_}%`,
      left: `${data.nav_dots_left_}%`
    }
  }
  getStyleForDot(data, p) {
    return data ? {
      [data.nav_dots_mirror_v ? 'bottom' : 'top']: `calc(${p.x}%)`,
      [data.nav_dots_mirror_h ? 'right' : 'left']: `calc(${p.z}%)`,
      transform: `rotate(${data.nav_dots_rotation}deg)`
    } : {}
  }
  takeScreenshot() {
    const screenshot = this.virtualTour.virtualTourService.takeScreenshot();
    ;
    const file = dataURLtoFile(screenshot.dataUrl, screenshot.name);
    this.store.dispatch(uploadProjectGalleryPhoto({ projectId: this.route.snapshot.params.id, file }));
  }

  updateCanvasSize() {
    setTimeout(() => this.virtualTour.virtualTourService.resize())
  }
  navFloor($event, floors, panos) {
    console.log(floors[$event.nextId]);
    const pano = floors[$event.nextId][0]
    this.navTo(pano.panoramas.index);
  }
  resizeCanvas() {
    this.virtualTour.virtualTourService.resize();
  }

  openSectionModal(modalWrapper, content, modalTitle) {
    this.modalContent = content;
    this.modalTitle = modalTitle;
    const m = this.modalService.open(modalWrapper, {
      windowClass: 'fullscreen-modal',
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

  openGalleryEditor(photos) {
    const modal = this.modalService.open(GalleryEditorComponent, {
      windowClass: 'fullscreen-modal'
    });
    modal.componentInstance.items = photos;
  }

  canvasAspect(sceneWrapper) {
    if (this.form.value.aspectRatio !== 'custom') {
      return this.form.value.aspectRatio
        ? sceneWrapper.offsetHeight / this.form.value.aspectRatio + 'px'
        : '100%'
    } else {
      return sceneWrapper.offsetHeight / this.form.value.customRatio + 'px';
    }

  }
  openImage(i) {
    this.isGalleryOpened = true;
    this.galleryCmp.galleryRef.set(i);
  }
  closeGallery() {
    this.isGalleryOpened = false;
    this.resizeCanvas();
  }
  updateMasonty() {
    if (this.masonry) {
      this.masonry.reloadItems();
      this.masonry.layout();
    }
  }

  imageNameChanged($event, projectId) {
    console.log({ ...$event, projectId });
    this.store.dispatch(renamePhoto({ ...$event, projectId }));
  }
  sortChanged($event, projectId) {
    console.log({ projectId, photos: $event });
    this.store.dispatch(changeOrderOfPhoto({ projectId, photos: $event.map(item => item.name) }))
  }
  deleteGalleryImage($event, projectId) {
    this.store.dispatch(removeProjectGalleryPhoto({ projectId, image_id: [$event.item.name] }));
  }


}
