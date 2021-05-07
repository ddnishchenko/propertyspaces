import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from '../projects/service/projects.service';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { VirtualTourDirective } from '@propertyspaces/virtual-tour';
import { FormControl, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FloorplanEditorComponent } from './components/floorplan-editor/floorplan-editor.component';

function parseModel(model) {

  const allPanos = model.data;
  var panos = allPanos.filter(t => !t.name.includes('_'));
  var panosHDR = panos.map(p => {
    return {
        ...p,
        dark_pano: allPanos.find(t => t.name.includes(`${p.name}_dark`)),
        light_pano: allPanos.find(t => t.name.includes(`${p.name}_light`)),
        hdr_pano: allPanos.find(t => t.name.includes(`${p.name}_hdr`)),
    };
  });

  let xArray = panosHDR.map(p => +p.panoramas.x);
  let zArray = panosHDR.map(p => +p.panoramas.z);

  let xMin = Math.min(...xArray);
  let xMax = Math.max(...xArray);

  let zMin = Math.min(...zArray);
  let zMax = Math.max(...zArray);

  if (xMin < 0) {
    xArray = panosHDR.map(p => Math.abs(xMin) + +p.panoramas.x);
    xMin = Math.min(...xArray);
    xMax = Math.max(...xArray);
  } else if (xMin > 0) {
    xArray = panosHDR.map(p => +p.panoramas.x - Math.abs(xMin));
    xMin = Math.min(...xArray);
    xMax = Math.max(...xArray);
  }

  if (zMin < 0) {
    zArray = panosHDR.map(p => Math.abs(zMin) + +p.panoramas.z);
    zMin = Math.min(...zArray);
    zMax = Math.max(...zArray);
  } else if (zMin > 0) {
    zArray = panosHDR.map(p => +p.panoramas.z - Math.abs(zMin));
    zMin = Math.min(...zArray);
    zMax = Math.max(...zArray);
  }

  const xSide = xMax - (xMin);
  const zSide = zMax - (zMin);

  const floorplanMap = panosHDR.map((p,i) => ({
    z: (zArray[i] / zSide) * 100,
    x: (xArray[i] / xSide) * 100
  }));

  const size = 50;

  const floorplanArea = (xSide * zSide) * size;
  const width = (zSide  + (zMin*2)) * size;
  const height = (xSide  + (zMin*2)) * size;
  console.log(floorplanMap);



  return {
    ...model,
    _t: Date.now(),
    panos: panosHDR,
    floorplanMap,
    floorplanArea,
    width,
    height,
    hostname: environment.apiHost,
    floorplanPath: environment.apiHost + model.path + model.additional_data['floorplan.svg']
  }
}

const aspectRations = [
  {
    name: 'Choose Aspect Ration',
    value: ''
  },
  {
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
  }
]

@Component({
  selector: 'propertyspaces-panorama-player',
  templateUrl: './panorama-player.component.html',
  styleUrls: ['./panorama-player.component.scss']
})
export class PanoramaPlayerComponent implements OnInit {

  @ViewChild(VirtualTourDirective) virtualTour;

  activePoint = 0;
  aspectRatio = null;
  aspects = aspectRations;
  data$;
  form;
  isEdit = false;
  rotationAngle = 0;
  constructor(
    private projcetService: ProjectsService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.isEdit = this.router.url.includes('model');
    this.createForm();
    this.data$ = this.route.data.pipe(
      map(data => data.model),
      map(model => {
        const parsedData = parseModel(model);
        console.log(this.route,this.router);
        if (this.route.snapshot.params.floorplan) {
          this.openFloorplanEditor(parsedData);
        }
        return parsedData;
      })
    );
  }

  createForm() {
    this.form = new FormGroup({
      rotationY: new FormControl(''),
      editMode: new FormControl(false),
      zoom: new FormControl(0),
      aspectRatio: new FormControl('')
    });
  }

  vrInit() {
    this.form.patchValue({
      rotationY: +this.virtualTour.virtualTourService.mesh.rotation.y,
      zoom: this.virtualTour.virtualTourService.OrbitControls.object.fov
    });
    this.rotationAngle = this.virtualTour.virtualTourService.OrbitControls.getPolarAngle() - +this.virtualTour.virtualTourService.mesh.rotation.y;
  }

  editModeSwitch() {
    this.virtualTour.virtualTourService.toggleNavMode(this.form.value.editMode);
  }

  rotationYChange() {
    this.virtualTour.virtualTourService.changeMeshRotation(this.form.value.rotationY);
  }

  saveY(id) {
    const updateY = this.projcetService.updateRotationProject(id, this.form.value.rotationY);
    const updateData = this.projcetService.updateDataProject(id, {zoom: this.form.value.zoom, rotation_y: this.form.value.rotationY});

    forkJoin([updateY, updateData]).subscribe(res => {
      alert('saved');
    });
  }

  navTo(i) {
    this.activePoint = i;
    this.virtualTour.virtualTourService.moveMark(i);
  }

  changeActive($event) {
    this.activePoint = $event;
  }
  zoomChange() {
    this.virtualTour.virtualTourService.changeZoom(+this.form.value.zoom)
  }
  viewChange($event) {
    this.form.get('zoom').patchValue($event.object.fov);
    this.rotationAngle = this.virtualTour.virtualTourService.OrbitControls.getAzimuthalAngle() - +this.virtualTour.virtualTourService.mesh.rotation.y;
  }

  openFloorplanEditor(data) {
    const modalRef = this.modalService.open(FloorplanEditorComponent, {
      windowClass: 'floorplan-modal',
    });
    modalRef.componentInstance.data = data;
    modalRef.result.then(v => {
      if (v) {
        this.data$ = this.projcetService.getPanoramas(data.project_id)
        .pipe(
          map(model => parseModel(model))
        );
      }
    })
  }
  scaleDots(data) {
    return {
      width: `calc(${data.nav_dots_width_}%)`,
      height: `calc(${data.nav_dots_height_}%)`,
      transform: `rotate(${data.nav_dots_rotation}deg)`,
      top: `${data.nav_dots_top_}%`,
      left: `${data.nav_dots_left_}%`
    }
  }
  getStyleForDot(data, p) {
    return {
      [data.nav_dots_mirror_v ? 'bottom' : 'top']: `calc(${p.x}%)`,
      [data.nav_dots_mirror_h ? 'right' : 'left']: `calc(${p.z}%)`,
      transform: `rotate(${-data.nav_dots_rotation}deg)`
    }
  }
  takeScreenshot() {
    this.virtualTour.virtualTourService.takeScreenshot()
  }

  updateCanvasSize() {
    setTimeout(() => this.virtualTour.virtualTourService.resize())
  }
}
