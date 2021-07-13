import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, skip, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { VirtualTourDirective } from '@propertyspaces/virtual-tour';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { FloorplanEditorComponent } from './components/floorplan-editor/floorplan-editor.component';
import { select, Store } from '@ngrx/store';
import { selectHdrVirtualTourPanoramasDividerOnFloors, selectVirtualTourParams } from '../projects/state/projects.selectors';
import { loadPanoramas, updateAddressData, updateContacts, updatePanorama, updateProject } from '../projects/state/projects.actions';
import { Panorama } from '../interfaces/panorama';
import { changeOrderOfPhoto, loadProjectGallery, removeProjectGalleryPhoto, renamePhoto, uploadProjectGalleryPhoto } from '../projects/state/gallery/project-gallery.actions';
import { selectOrderedGallery } from '../projects/state/gallery/project-gallery.selectors';
import { dataURLtoFile, urlRegEx } from '../utils';
import { NgxMasonryComponent, NgxMasonryOptions } from 'ngx-masonry';
import { GalleryComponent } from 'ng-gallery';
import { GalleryEditorComponent } from '../shared/components/gallery-editor/gallery-editor.component';
import { slideInAnimation } from '../utils/animations';
import { combineLatest } from 'rxjs';
import { ConfirmationModalComponent } from '../shared/components/confirmation-modal/confirmation-modal.component';
import { ResizeEvent } from 'angular-resizable-element';
import { Fullscreen } from '../utils/fullscreen';

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
];

const titles = {
  allPoints: 'EDIT ALL NAV POINTS',
  activePoint: 'EDIT ACTIVE NAV POINT',
  floorplan: 'FLOOR PLAN OPTIONS',
  createGallery: 'CREATE PHOTO GALLERY',
  editGallery: 'EDIT PHOTO GALLERY',
  editLocation: 'EDIT MAP & STREET VIEW',
  editContact: 'EDIT CONTACT INFO',
  editPano: 'EDIT PANORAMA',
  changeMenu: 'CHANGE MENU VIEW',
  description: 'ADD DESCRIPTION'
};

@Component({
  selector: 'propertyspaces-panorama-player',
  templateUrl: './panorama-player.component.html',
  styleUrls: ['./panorama-player.component.scss'],
  animations: [slideInAnimation]
})
export class PanoramaPlayerComponent implements OnInit {
  isFullscreenAvailable = Fullscreen.isAvailable;
  isFullscreenActive$ = Fullscreen.change$.pipe(
    map(active => ({active})),
    tap(() => setTimeout(() =>this.resizeCanvas(), 100) ),
  );
  isCollapsed = true;
  @ViewChild(VirtualTourDirective) virtualTour;
  @ViewChild(GalleryComponent) galleryCmp: GalleryComponent;
  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  public masonryOptions: NgxMasonryOptions = {
    gutter: 0,
    columnWidth: 200,
    fitWidth: true
  };
  isGalleryOpened = false;
  activePoint = 0;
  activeFloor = 0;
  aspectRatio = null;
  aspects = aspectRations;
  data$;
  form;
  mapForm;
  vrTourSettingsForm;
  profileForm;
  companyForm;
  isEdit = false;
  rotationAngle = 0;
  defaultZoom = 0;
  floors$;
  modalContent = null;
  modalTitle = null;
  gallery$;
  styleDeSidbar = {};
  editTitles = titles;
  editProperties = {
    allPoints: 'allPoints',
    activePoint: 'activePoint',
    floorplan: 'floorplan',
    createGallery: 'createGallery',
    editGallery: 'editGallery',
    editLocation: 'editLocation',
    editContact: 'editContact',
    editPano: 'editPano',
    changeMenu: 'changeMenu',
    description: 'description'
  };
  activeEditProperty = '';
  isStreetViewVisible = true;
  sidebarSide = 'l';
  textRecentlyCopied;
  embedCode = `<iframe src="${this.shareLink}" width="100%" height="720px" frameborder="0" allowfullscreen></iframe>`
  get shareLink() {
    const link = location.origin + '/projects/vr-tour-embed/1422';
    return this.copyBrandedLink ? link + '?b=1' : link;
  }
  copyBrandedLink = false;
  get activeEditTitle() {
    return this.editTitles[this.activeEditProperty];
  }
  get modalEditing() {
    if (this.form) {
      const { editGallery, editContact, editLocation
        } = this.editProperties;
      const modalEdit = [editGallery, editContact, editLocation];
      return modalEdit.includes(this.activeEditProperty);
    }
    return false;
  }
  get isSaveButton() {
    const { editContact, editLocation
      } = this.editProperties;
    const modalEdit = [editContact, editLocation];
    return modalEdit.includes(this.activeEditProperty);
  }
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private store: Store,
    private zone: NgZone
  ) { }

  ngOnInit(): void {
    const projectId = this.route.snapshot.params.id;
    this.isEdit = this.router.url.includes('model');
    this.createForm();
    this.store.dispatch(loadProjectGallery({ projectId }));
    this.store.dispatch(loadPanoramas({ projectId }));
    this.gallery$ = this.store.pipe(select(selectOrderedGallery));

    this.data$ = combineLatest([
      this.store.pipe(select(selectVirtualTourParams)),
      this.store.pipe(select(selectHdrVirtualTourPanoramasDividerOnFloors))
    ]).pipe(
      map(([project, panoFloors]) => ({...project, ...panoFloors})),
      skip(1)
    )
  }

  createForm() {
    this.form = new FormGroup({
      aspectRatio: new FormControl(''),
      customRatio: new FormControl(''),
    });

    this.vrTourSettingsForm = new FormGroup({
      rotationY: new FormControl(''),
      zoom: new FormControl(0),
      panoZoom: new FormControl(0),
      panoCameraStartAngle: new FormControl(''),
    });

    this.mapForm = new FormGroup({
      mapEnabled: new FormControl(false),
      streetViewEnabled: new FormControl(false),
      map: new FormControl('', [Validators.pattern(urlRegEx)]),
      streetView: new FormControl('', [Validators.pattern(urlRegEx)]),
      address: new FormControl(''),
      latitude: new FormControl(0),
      longitude: new FormControl()
    });

    this.profileForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      showInBranded: new FormControl(false)
    });

    this.companyForm = new FormGroup({
      name: new FormControl(''),
      address: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      fax: new FormControl(''),
      companyLogo: new FormControl(''),
      showInBranded: new FormControl(false)
    });
  }

  calcRatio(ratio) {
    if (ratio) {

    }
  }

  vrInit(data) {
    this.mapForm.patchValue({
      mapEnabled: data.additional_data.hasOwnProperty('mapEnabled') ? true : data.additional_data.mapEnabled,
      streetViewEnabled: !data.additional_data.hasOwnProperty('streetViewEnabled') ? true : data.additional_data.streetViewEnabled,
      map: data.additional_data.map,
      streetView: data.additional_data.streetView,
      address: data.project.address,
      latitude: +data.project.latitude,
      longitude: +data.project.longitude
    })
    this.vrTourSettingsForm.patchValue({
      rotationY: +this.virtualTour.virtualTourService.defaultY,
      zoom: this.virtualTour.virtualTourService.defaultZoom
    });
    if (data.additional_data.profile && data.additional_data.profile !== 'profile') {
      this.profileForm.patchValue(JSON.parse(data.additional_data.profile));
    }

    if (data.additional_data.company && data.additional_data.company !== 'company') {
      const d = JSON.parse(data.additional_data.company);
      this.companyForm.patchValue({
        ...d,
        companyLogo: data.additional_data.companyLogo
      });
    }


    this.rotationAngle = this.virtualTour.virtualTourService.OrbitControls.getPolarAngle() - +this.virtualTour.virtualTourService.mesh.rotation.y;
    this.defaultZoom = this.virtualTour.virtualTourService.OrbitControls.object.fov;
    this.activePoint = this.virtualTour.virtualTourService.activeIndex;
  }

  editModeSwitch(editMode) {
    this.virtualTour.virtualTourService.toggleNavMode(editMode);
  }

  rotationYChange() {
    this.virtualTour.virtualTourService.changeMeshRotation(this.vrTourSettingsForm.value.rotationY);
  }

  panoCameraStartAngleChange() {
    this.virtualTour.virtualTourService.changeMeshRotationForCurrentPano(this.vrTourSettingsForm.value.panoCameraStartAngle);
  }
  panoZoomChange() {
    this.virtualTour.virtualTourService.changeZoomForCurrentPano(+this.vrTourSettingsForm.value.panoZoom);
  }

  saveY(projectId) {
    const data = { zoom: this.vrTourSettingsForm.value.zoom, rotation_y: this.vrTourSettingsForm.value.rotationY };
    this.store.dispatch(updateProject({ projectId, data }))
  }

  updatePanoSettings() {
    const {panoramas, name}: Panorama = this.virtualTour.virtualTourService.currentPanorama;
    const panorama = {panoramas, name};
    this.store.dispatch(updatePanorama({
      projectId: this.route.snapshot.params.id,
      panorama
    }))
  }

  saveSettings(projectId) {
    if (this.editProperties.allPoints === this.activeEditProperty) {
      const modal = this.modalService.open(ConfirmationModalComponent);
      modal.componentInstance.msg = 'Settings of Panoramas will be lost and default setting will be applied after saving defaults. Proceed?';

      modal.result.then(answer => {
        if (answer) {
          const data = {
            zoom: this.vrTourSettingsForm.value.zoom,
            rotation_y: this.vrTourSettingsForm.value.rotationY
          };
          this.vrTourSettingsForm.patchValue({
            panoZoom: 0,
            panoCameraStartAngle: 0,
          });

          const changedPanos = this.virtualTour.virtualTourService.panos.filter(
            p => !isNaN(parseInt(p.panoramas.zoom, 10))  || !isNaN(parseInt(p.panoramas.panoCameraStartAngle, 10))
          );
          const resetPano = p => {

            return {
              ...p,
              panoramas: {
                ...p.panoramas,
                zoom: undefined,
                panoCameraStartAngle: undefined
              }
            }

          };
          this.virtualTour.virtualTourService.panos = this.virtualTour.virtualTourService.panos.map(resetPano);
          const resetedPanos = changedPanos.map(resetPano).map(({name, panoramas}) => ({name, panoramas}));

          this.virtualTour.virtualTourService.defaultY = data.rotation_y;
          this.virtualTour.virtualTourService.defaultZoom = data.zoom;
          this.store.dispatch(updateProject({projectId, data}));
          resetedPanos.forEach(panorama => {
            this.store.dispatch(updatePanorama({projectId, panorama}));
          })

        }
      });
    } else {
      this.updatePanoSettings();
    }

  }

  saveContacts(projectId) {
    const data = {
      profile: this.profileForm.value,
      company: {...this.companyForm.value, companyLogo: undefined},
      companyLogo: this.companyForm.value.companyLogo
    };
    this.store.dispatch(updateContacts({projectId, data}));
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
    this.vrTourSettingsForm.patchValue({
      panoCameraStartAngle: this.virtualTour.virtualTourService.currentPano.panoramas.panoCameraStartAngle || 0,
      panoZoom: this.virtualTour.virtualTourService.currentPano.panoramas.zoom || 0
    })
  }
  zoomChange($event?) {
    const val = $event || +this.vrTourSettingsForm.value.zoom;
    this.virtualTour.virtualTourService.changeZoom(val);
  }

  viewChange($event) {
    // this.vrTourSettingsForm.get('zoom').patchValue($event.object.fov);
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
    // this.virtualTour.virtualTourService.resize();
    // this.updateMasonty();
    this.zone.runOutsideAngular(() => {
      window.dispatchEvent(new Event('resize'));
    })
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

  onResizeEnd(event: ResizeEvent): void {
    this.styleDeSidbar = {
      // position: 'fixed',
      // left: `${event.rectangle.left}px`,
      // top: `${event.rectangle.top}px`,
      width: `${event.rectangle.width}px`,
      // height: `${event.rectangle.height}px`
    };
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

  panelActiveClass(ids, id) {
    if (ids.length) {
      return ids.includes(id) ? 'active' : '';
    }
    return '';

  }

  public beforeChange($event: NgbPanelChangeEvent) {

    if ($event.panelId === 'preventchange-2') {
      $event.preventDefault();
    }

    if ($event.panelId === 'preventchange-3' && $event.nextState === false) {
      $event.preventDefault();
    }
  }

  crementControl(field, val) {
    this.vrTourSettingsForm.patchValue({[field]: this.vrTourSettingsForm.value[field] + val });
  }
  checkForReset(val) {
    this.isCollapsed = true;
    if (val === this.activeEditProperty) {
      // TODO: Refactor
      setTimeout(() => this.activeEditProperty = '')
    }
  }
  closeModal() {
    this.activeEditProperty = '';
  }

  onAutocomplete($event) {
    this.isStreetViewVisible = false;
    this.mapForm.patchValue({
      address: $event.formatted_address,
      latitude: $event.geometry.location.lat(),
      longitude: $event.geometry.location.lng()
    });

    setTimeout(() => {
      this.isStreetViewVisible = true;
    }, 300);
  }

  filterPaste($event) {
    // @ts-ignore
    let paste = ($event.clipboardData || window.clipboardData).getData('text');
    let url;
    try {
      url = new URL(paste);
      url = url.href;
    } catch (e) {
      const div = document.createElement('div');
      div.innerHTML = paste;
      const iframe = div.querySelector('iframe');
      if (!iframe?.src) {
        alert('Invalid embed code or url');
      } else {
        url = iframe.src;
      }
      div.remove();
    }
    const field = $event.target.getAttribute('formcontrolname');
    this.mapForm.patchValue({[field]: url});
    $event.preventDefault();
  }

  saveModal(projectId) {
    switch(this.activeEditProperty) {
      case this.editProperties.editLocation:
        this.store.dispatch(updateAddressData({ projectId, data: this.mapForm.value }));
        break;
      case this.editProperties.editContact:
        this.saveContacts(projectId);
    }
  }
  toggleFullscreen() {
    Fullscreen.toggle();
  }

  openShareModal(content) {
    this.modalService.open(content, {centered: true});
  }
  copyLink(f) {
    f.select();
    document.execCommand('copy');
    this.textRecentlyCopied = true;
  }
  showCompanyLogo(root, logo) {
    if (logo && logo.includes('companyLogo')) {
      return `url(${root}${logo})`
    } else if (logo) {
      return `url(${logo})`;
    }
    return '';
  }
}
