import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, skip, tap } from 'rxjs/operators';
import { VirtualTourDirective } from '@propertyspaces/virtual-tour';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { FloorplanEditorComponent } from './components/floorplan-editor/floorplan-editor.component';
import { select, Store } from '@ngrx/store';
import { selectProject, selectProjectHdrPanoramasFloors } from '../projects/state/projects.selectors';
import { addGalleryItem, deleteGalleryItem, loadProject, updateContacts, updateGalleryItem, updatePanorama, updateProject } from '../projects/state/projects.actions';
import { Panorama } from '../interfaces/panorama';
// import { changeOrderOfPhoto, loadProjectGallery, removeProjectGalleryPhoto, renamePhoto, uploadProjectGalleryPhoto } from '../projects/state/gallery/project-gallery.actions';

import { urlRegEx } from '../utils';
import { GalleryComponent } from 'ng-gallery';
import { GalleryEditorComponent } from '../shared/components/gallery-editor/gallery-editor.component';
import { slideInAnimation } from '../utils/animations';
import { ConfirmationModalComponent } from '../shared/components/confirmation-modal/confirmation-modal.component';
import { ResizeEvent } from 'angular-resizable-element';
import { Editor, toHTML, toDoc } from 'ngx-editor';
import { Fullscreen } from '../utils/fullscreen';
import { combineLatest } from 'rxjs';

function sanitazePanorama(pano) {
  const exclude = ['index', 'loaded', 'object', 'transitionFrom', 'updatedAt'];
  const panorama: Panorama = {};
  Object
    .keys(pano)
    .filter(k => !exclude.includes(k))
    .forEach(k => panorama[k] = pano[k]);
  return pano;
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
];

const titles = {
  allPoints: 'EDIT ALL NAV POINTS',
  activePoint: 'EDIT ACTIVE NAV POINT',
  floorplan: 'FLOOR PLAN OPTIONS',
  dollhouse: 'EDIT DOLLHOUSE',
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
export class PanoramaPlayerComponent implements OnInit, OnDestroy {
  @ViewChild(VirtualTourDirective) virtualTour;
  @ViewChild(GalleryComponent) galleryCmp: GalleryComponent;
  @ViewChild(FloorplanEditorComponent) floorplanEditor: FloorplanEditorComponent;

  isFullscreenAvailable = Fullscreen.isAvailable;
  isFullscreenActive$ = Fullscreen.change$.pipe(
    map(active => ({ active })),
    tap(() => setTimeout(() => this.resizeCanvas(), 100)),
  );
  loading = true;
  isCollapsed = true;
  isOneAccActive = false;
  editor: Editor;
  isGalleryOpened = false;
  activePoint = 0;
  currentPanorama;
  activeFloor = 0;
  aspectRatio = null;
  aspects = aspectRations;
  project$;
  form;
  mapForm;
  vrTourSettingsForm;
  profileForm;
  companyForm;
  panoForm;
  descriptionFrom;
  dollhouseForm;
  isEdit = false;
  rotationAngle = 0;
  defaultZoom = 0;
  modalContent = null;
  modalTitle = null;
  styleDeSidbar = {};
  editTitles = titles;
  editProperties = {
    allPoints: 'allPoints',
    activePoint: 'activePoint',
    floorplan: 'floorplan',
    dollhouse: 'dollhouse',
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
  get description() {
    return this.descriptionFrom?.value ? toHTML(this.descriptionFrom?.value.description) : this.descriptionFrom?.value.description;
  }
  get embedCode() {
    return `<iframe src="${this.shareLink}" width="100%" height="720px" frameborder="0" allowfullscreen></iframe>`;
  };
  get embedCodeFullscreen() {
    return `<iframe src="${this.shareFullscreen}" width="100%" height="720px" frameborder="0" allowfullscreen></iframe>`;
  }
  isQueryFullscreen;
  get shareLink() {
    const link = location.origin + '/projects/vr-tour-embed/' + this.route.snapshot.params.id;;
    return this.copyBrandedLink ? link + '?b=1' : link;
  }
  get shareFullscreen() {
    const projectId = this.route.snapshot.params.id;
    const link = location.origin + `/projects/vr-tour-embed/${projectId}?fullscreen=true`;
    return this.copyBrandedLink ? link + '&b=1' : link;
  }
  copyBrandedLink = false;
  get activeEditTitle() {
    return this.editTitles[this.activeEditProperty];
  }
  get modalEditing() {
    if (this.form) {
      const { floorplan, dollhouse, editGallery, editContact, editLocation, editPano, changeMenu, description
      } = this.editProperties;
      const modalEdit = [floorplan, dollhouse, editGallery, editContact, editLocation, editPano, changeMenu, description];
      return modalEdit.includes(this.activeEditProperty);
    }
    return false;
  }
  get isSaveButton() {
    const {
      editContact, editLocation, editPano, description, floorplan, dollhouse
    } = this.editProperties;
    const modalEdit = [editContact, editLocation, editPano, description, floorplan, dollhouse];
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
    this.editor = new Editor();
    const projectId = this.route.snapshot.params.id;
    this.isQueryFullscreen = this.route.snapshot.queryParams.fullscreen == 'true';
    this.isEdit = this.router.url.includes('model');
    this.createForm();
    this.store.dispatch(loadProject({ projectId }));

    this.project$ = combineLatest([
      this.store.pipe(select(selectProject)),
      this.store.pipe(select(selectProjectHdrPanoramasFloors))
    ]).pipe(
      map(
        ([project, floors]) => ({
          ...floors,
          ...project
        })
      ),
      skip(1)
    );
  }

  ngOnDestroy() {
    this.editor.destroy();
  }

  createForm() {

    const validators = [
      Validators.required
    ];

    this.form = new FormGroup({
      aspectRatio: new FormControl(''),
      customRatio: new FormControl(''),
    });

    this.vrTourSettingsForm = new FormGroup({
      rotationY: new FormControl(''),
      zoom: new FormControl(0),
      panoZoom: new FormControl(0),
      panoCameraStartAngle: new FormControl(''),
      visibilityRadius: new FormControl(0),
      panoVisibilityRadius: new FormControl(0),
      neighborsFiltering: new FormControl(false)
    });

    this.mapForm = new FormGroup({
      mapEnabled: new FormControl(true),
      streetViewEnabled: new FormControl(true),
      mapUrl: new FormControl('', [Validators.pattern(urlRegEx)]),
      streetViewUrl: new FormControl('', [Validators.pattern(urlRegEx)]),
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
      logoUrl: new FormControl(''),
      logoKey: new FormControl(''),
      showInBranded: new FormControl(false)
    });

    this.panoForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      x: new FormControl('', validators),
      y: new FormControl('', validators),
      z: new FormControl('', validators),
      floor: new FormControl('', validators),
      order: new FormControl(''),
      url: new FormControl(''),
    });

    this.descriptionFrom = new FormGroup({
      description: new FormControl()
    });

    this.dollhouseForm = new FormGroup({
      dollhouse: new FormControl('')
    });
  }

  vrInit(data) {
    const { addr, description, dollhouse, profile, company } = data;
    if (addr) {
      this.mapForm.patchValue({
        ...addr,
        mapEnabled: addr.mapEnabled,
        streetViewEnabled: addr.streetViewEnabled,
      })
    }

    this.vrTourSettingsForm.patchValue({
      rotationY: +this.virtualTour.virtualTourService.defaultY,
      zoom: this.virtualTour.virtualTourService.defaultZoom,
      neighborsFiltering: this.virtualTour.virtualTourService.neighborsFiltering,
      visibilityRadius: this.virtualTour.virtualTourService.defaultVisibilityRadius
    });
    this.profileForm.patchValue(profile);
    this.companyForm.patchValue(company);

    this.descriptionFrom.patchValue({ description });
    this.dollhouseForm.patchValue({ dollhouse });

    this.rotationAngle = this.virtualTour.virtualTourService.OrbitControls.getPolarAngle() - +this.virtualTour.virtualTourService.mesh.rotation.y;
    this.defaultZoom = this.virtualTour.virtualTourService.OrbitControls.object.fov;
    this.activePoint = this.virtualTour.virtualTourService.activeIndex;
    this.currentPanorama = this.virtualTour.virtualTourService.currentPano;
    this.loading = false;
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

  zoomChange($event?) {
    const val = $event || +this.vrTourSettingsForm.value.zoom;
    this.virtualTour.virtualTourService.changeZoom(val);
  }

  panoZoomChange($event?) {
    const val = $event || +this.vrTourSettingsForm.value.panoZoom;
    this.virtualTour.virtualTourService.changeZoomForCurrentPano(val);
  }

  visibilityRadiusChange() {
    this.virtualTour.virtualTourService.changeVisibilityRadius(+this.vrTourSettingsForm.value.visibilityRadius);
  }
  panoVisibilityRadiusChange() {
    this.virtualTour.virtualTourService.changeVisibilityRadius(+this.vrTourSettingsForm.value.panoVisibilityRadius, true);
  }

  changeNeighborsFiltering() {
    this.virtualTour.virtualTourService.changeNeighborsFiltering(this.vrTourSettingsForm.value.neighborsFiltering);
  }

  updatePanoSettings() {
    const { currentPanorama } = this.virtualTour.virtualTourService;
    this.store.dispatch(updatePanorama({
      projectId: this.route.snapshot.params.id,
      panorama: sanitazePanorama(currentPanorama)
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
            rotationY: this.vrTourSettingsForm.value.rotationY,
            visibilityRadius: this.vrTourSettingsForm.value.visibilityRadius,
            neighborsFiltering: this.vrTourSettingsForm.value.neighborsFiltering,
          };
          this.vrTourSettingsForm.patchValue({
            panoZoom: 0,
            panoCameraStartAngle: 0,
            panoVisibilityRadius: 0
          });

          const changedPanos = this.virtualTour.virtualTourService.panos.filter(
            p => !isNaN(parseInt(p.zoom, 10))
              ||
              !isNaN(parseInt(p.panoCameraStartAngle, 10))
              ||
              !isNaN(parseInt(p.visibilityRadius, 10))
          );
          const resetPano = p => {
            return {
              ...p,
              zoom: undefined,
              panoCameraStartAngle: undefined,
              visibilityRadius: undefined
            }

          };
          this.virtualTour.virtualTourService.panos = this.virtualTour.virtualTourService.panos.map(resetPano);
          const resetedPanos = changedPanos.map(resetPano);

          this.virtualTour.virtualTourService.defaultY = data.rotationY;
          this.virtualTour.virtualTourService.defaultZoom = data.zoom;
          this.virtualTour.virtualTourService.visibilityRadius = data.visibilityRadius;
          this.virtualTour.virtualTourService.neighborsFiltering = data.neighborsFiltering;
          this.store.dispatch(updateProject({ projectId, project: { settings: data } }));
          resetedPanos.forEach(panorama => {
            this.store.dispatch(updatePanorama({ projectId, panorama: sanitazePanorama(panorama) }));
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
      company: this.companyForm.value
    };
    this.store.dispatch(updateProject({ projectId, project: data }));
  }

  navTo(index) {
    this.activePoint = index;
    this.virtualTour.virtualTourService.moveMark(index);
  }

  changeActive($event, data) {
    this.activePoint = $event;
    const pano = data.panos.find(p => p.index === $event);
    this.currentPanorama = pano;
    const floor = pano.floor;
    this.activeFloor = floor;

    this.panoForm.patchValue(pano);
    this.vrTourSettingsForm.patchValue({
      panoCameraStartAngle: this.virtualTour.virtualTourService.currentPano.panoCameraStartAngle || 0,
      panoZoom: this.virtualTour.virtualTourService.currentPano.zoom || 0,
      panoVisibilityRadius: this.virtualTour.virtualTourService.currentPano.visibilityRadius || 0,
      // neighborsFiltering: this.virtualTour.virtualTourService.currentPano.neighborsFiltering || false
    });
  }


  viewChange($event) {
    // this.vrTourSettingsForm.get('zoom').patchValue($event.object.fov);
    // this.defaultZoom = $event.object.fov;
    this.rotationAngle = this.virtualTour.virtualTourService.OrbitControls.getAzimuthalAngle() - +this.virtualTour.virtualTourService.mesh.rotation.y;
  }

  openFloorplanEditor(data) {
    const modalRef = this.modalService.open(FloorplanEditorComponent, {
      windowClass: 'fullscreen-modal',
      scrollable: true
    });
    modalRef.componentInstance.data = data;
    modalRef.result.then(project => {
      if (data) {
        const projectId = this.route.snapshot.params.id;
        this.store.dispatch(updateProject({ projectId, project }))
      }
    });
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
    const photo = {
      url: screenshot.dataUrl,
      name: screenshot.name
    };
    this.store.dispatch(addGalleryItem({ projectId: this.route.snapshot.params.id, photo }));
  }

  updateCanvasSize() {
    setTimeout(() => this.virtualTour.virtualTourService.resize())
  }
  navFloor($event, floors, panos) {
    const pano = floors[$event.nextId][0]
    this.navTo(pano.index);
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

  openGalleryEditor(photos) {
    const modal = this.modalService.open(GalleryEditorComponent, {
      windowClass: 'fullscreen-modal',
      scrollable: true
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
  openImage(i, closeModal = false) {
    if (closeModal) {
      this.modalService.dismissAll();
    }
    this.isGalleryOpened = true;
    this.galleryCmp.galleryRef.set(i);
  }
  closeGallery() {
    this.isGalleryOpened = false;
    this.resizeCanvas();
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
    this.store.dispatch(updateGalleryItem({ projectId, photo: $event }));
  }
  sortChanged($event, projectId) {
    const gallerySort: string[] = $event.map(item => item.id);
    this.store.dispatch(updateProject({ projectId, project: { gallerySort } }))
  }
  deleteGalleryImage($event, projectId) {
    this.store.dispatch(deleteGalleryItem({ projectId, photos: [$event.item] }));
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

  checkForReset(val) {
    this.isCollapsed = true;
    if (val === this.activeEditProperty) {
      // TODO: Refactor
      setTimeout(() => this.activeEditProperty = '')
    } else {
      switch (this.activeEditProperty) {
        case this.editProperties.editPano:

          break;
      }
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

  filterPaste($event, form: FormGroup) {
    // eslint-disable-next-line
    let paste = $event.clipboardData.getData('text');
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
    form.patchValue({ [field]: url });
    $event.preventDefault();
  }

  updatePano(projectId) {
    const p = {
      ...this.currentPanorama,
      ...this.panoForm.value
    };
    this.store.dispatch(updatePanorama({ projectId, panorama: sanitazePanorama(p) }))
  }

  saveModal(projectId) {
    switch (this.activeEditProperty) {
      case this.editProperties.editLocation:
        this.store.dispatch(updateProject({ projectId, project: { addr: this.mapForm.value } }));
        break;
      case this.editProperties.editContact:
        this.saveContacts(projectId);
        break;
      case this.editProperties.editPano:
        this.updatePano(projectId);
        break;
      case this.editProperties.description:
        this.store.dispatch(updateProject({ projectId, project: this.descriptionFrom.value }));
        break;
      case this.editProperties.floorplan:
        this.store.dispatch(updateProject({ projectId, project: this.floorplanEditor.form.value }));
        break;
      case this.editProperties.dollhouse:
        this.store.dispatch(updateProject({ projectId, project: this.dollhouseForm.value }));
        break;
    }
  }
  toggleFullscreen() {
    Fullscreen.toggle();
  }

  openShareModal(content) {
    this.modalService.open(content, { centered: true });
  }
  copyLink(f) {
    f.select();
    document.execCommand('copy');
    this.textRecentlyCopied = true;
  }
  postToFacebook() {
    const app_id = 1973653629466963;
    const url = `https://www.facebook.com/dialog/share?app_id=${app_id}&href=${this.shareLink}`;
    this.openSocialMedia(url);
  }
  postToLinkedIn() {
    const url = `http://www.linkedin.com/shareArticle?url=${this.shareLink}`;
    this.openSocialMedia(url);
  }
  postToTwiiter(input) {
    const tweet = encodeURIComponent(input.value + '\n' + this.shareLink);
    const url = `http://twitter.com/intent/tweet?text=${tweet}`;
    this.openSocialMedia(url);
  }
  openSocialMedia(url) {
    const width = 400;
    const height = 600;
    const left = window.screenX + window.outerWidth / 2 - width / 2;
    const top = window.screenY + window.outerHeight / 2 - height / 2;
    const options = `${left > 0 && top > 0 ? `left=${left},top=${top},` : ''}width=${width},height=${height},toolbar=0,resizable=0`;
    window.open(url, '', options).moveTo(left, top);
  }
}
