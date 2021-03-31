import { Injectable, ElementRef, OnDestroy, NgZone } from '@angular/core';
import * as THREE from 'three';
import { Subject } from 'rxjs';
import { OrbitControls } from './orbit-control';
import { DeviceOrientationControls } from './device-control';
import { Project } from '../interfaces/project';
import { environment } from '../../environments/environment';

const host = environment.apiHost;

function ringsShape() {
  const outerRingGeometry = new THREE.RingGeometry( 1.90, 2, 30, 1, 0 );
  const outerRingMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } );
  const outerRingMesh = new THREE.Mesh( outerRingGeometry, outerRingMaterial );

  const innerRingGeometry = new THREE.RingGeometry( 1.5, 1.8, 30, 1, 0 );
  const innerRingMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } );
  const innerRingMesh = new THREE.Mesh( innerRingGeometry, innerRingMaterial );

  const circleGeometry = new THREE.CircleGeometry( 2, 30 );
  const circleMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, transparent: true, opacity: 0 } );
  const circleMesh = new THREE.Mesh( circleGeometry, circleMaterial );

  const group = new THREE.Group();
  group.add(outerRingMesh);
  group.add(innerRingMesh);
  group.add(circleMesh);

  group.rotation.set(11, 0, 0);

  return group;
}

@Injectable({
  providedIn: 'root'
})
export class PanoramaPlayerService {
  private panos: any[];
  private loadedTextures: any[];

  private OrbitControls;
  private DeviceOrientationControls;
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private cameraFrustum: THREE.Frustum;
  private cameraViewProjectionMatrix: THREE.Matrix4;
  private scene: THREE.Scene;
  private light: THREE.AmbientLight;

  private cube: THREE.Mesh;

  private frameId: number = null;

  //
  private loaderModel;
  private sphereGeometryModel;
  private meshModel;

  //
  private transitionMesh;

  //
  private panoScaleFactor = 10;
  private currentPano;
  private currentPanoId = 0;
  private transition = {
    state: 1,
    startPos: null,
    endPos: null,
    texture: null
  };

  private raycasterModel = new THREE.Raycaster();
  private mouseModel = new THREE.Vector2();
  private element;
  private controlsTarget;

  // Observable string sources
  private dotSource = new Subject<string>();
  private modelSource = new Subject<Project>();
  // Observable string streams
  dotInfo$ = this.dotSource.asObservable();
  modelData$ = this.modelSource.asObservable();

  constructor(private ngZone: NgZone) { }

  destroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
    this.modelSource.next(null);
  }

  changeMeshY(y: number) {
    this.meshModel.rotation.y = y;
    this.transitionMesh.rotation.y = y;
  }

  goToDot(dotInfo) {
    this.moveMark(dotInfo);
  }

  runTransition() {
    let currPos = {
      x: this.transition.startPos.x + (this.transition.endPos.x - this.transition.startPos.x) * this.transition.state,
      y: this.transition.startPos.y + (this.transition.endPos.y - this.transition.startPos.y) * this.transition.state,
      z: this.transition.startPos.z + (this.transition.endPos.z - this.transition.startPos.z) * this.transition.state
    }

    this.camera.position.set(currPos.x, currPos.y + 0.1, currPos.z)
    if (this.OrbitControls) {
      let pangle = this.OrbitControls.getPolarAngle();
      let aangle = this.OrbitControls.getAzimuthalAngle();
      this.OrbitControls.target.set(currPos.x, currPos.y, currPos.z)

      this.OrbitControls.minPolarAngle = pangle;
      this.OrbitControls.minAzimuthAngle = aangle;
      this.OrbitControls.maxAzimuthAngle = aangle;
      this.OrbitControls.update();
      this.OrbitControls.minAzimuthAngle = -Infinity;
      this.OrbitControls.maxAzimuthAngle = Infinity;
      this.OrbitControls.minPolarAngle = 0;
    }

    this.transitionMesh.material.opacity = this.transition.state
    this.meshModel.material.opacity = 1 - this.transition.state
    if (this.transition.state == 1) {
      this.meshModel.material.map = this.transition.texture
      this.meshModel.material.opacity = 1
      this.meshModel.position.set(currPos.x, currPos.y, currPos.z)
      this.transitionMesh.visible = false
      this.panos.forEach((pano, index) => {
          pano.object.visible = true; //this.currentPanoId !== index;
      })
    }
    this.meshModel.material.needsUpdate = true
    this.transitionMesh.material.needsUpdate = true
  }

  renderCallback() {
    if (this.transition.state < 1) {
      this.transition.state += .03
      if (this.transition.state > 1) this.transition.state = 1
      this.runTransition()
    }
    this.controlsTarget = {x: this.OrbitControls.target.x, y: this.OrbitControls.target.y, z: this.OrbitControls.target.z};
  };

  updateDotInfo(dotInfo: any) {
    this.dotSource.next(dotInfo);
  }

  setSettingsControls() {
    // this.OrbitControls.enableDamping = true;
    // this.OrbitControls.minDistance = 1;
    // this.OrbitControls.maxDistance = Infinity;
    /*

    this.OrbitControls.dampingFactor = 0.25;

    this.OrbitControls.rotateSpeed = 0.3;

    if (this.controlsTarget) {
      this.OrbitControls.target.set(this.controlsTarget.x, this.controlsTarget.y, this.controlsTarget.z);
    } else {
      this.OrbitControls.minAzimuthAngle = 0.5;
      this.OrbitControls.maxAzimuthAngle = 0.5;
    }
    this.OrbitControls.update();
    this.OrbitControls.minAzimuthAngle = -Infinity;
    this.OrbitControls.maxAzimuthAngle = Infinity;
    */
    // @ts-ignore
    // this.OrbitControls.name = 'orbit';
    // this.OrbitControls.minDistance = 1;
    // @ts-ignore
    // this.OrbitControls.noPan = true;

    // Observable
    this.updateDotInfo(this.currentPanoId);
    this.moveMark(this.currentPanoId);
  }

  getPanoId(event) {
    let boundBox = this.element.getBoundingClientRect();
    const isTouch = event.changedTouches && event.changedTouches.length;
    const x = isTouch ? event.changedTouches[0].pageX : event.pageX;
    const y = isTouch ? event.changedTouches[0].pageY : event.pageY;
    this.mouseModel.x = ( (x - boundBox.x) / boundBox.width ) * 2 - 1;
    this.mouseModel.y = - ( (y - boundBox.y) / boundBox.height ) * 2 + 1;
    this.raycasterModel.setFromCamera( this.mouseModel, this.camera );

    let intersects = this.raycasterModel.intersectObjects( this.scene.children, true );
    let target = null
    intersects.forEach((item) => {
      if (item.distance > 200) { //panorama sphere
        return
      }

      for (let i = 0; i < this.panos.length; i++) {
        const panoUuids = this.panos[i].object.children.map(m => m.uuid);
        if (panoUuids.includes(item.object.uuid)) {
          target = i
        }
      }
    });
    return target
  }

  moveMark(panoId) {
    this.panos.forEach((pano, index) => {
      pano.object.visible = false
    })

    let pano = this.panos[panoId]
    this.currentPano = pano
    let cameraPos = this.scaleToModel(pano.position)
    this.transition.state = 0;
    let camPos = this.camera.position

    this.transition.startPos = {x: camPos.x, y: camPos.y, z: camPos.z}
    this.transition.endPos = cameraPos
    this.transition.texture = this.loadedTextures[panoId];

    this.transitionMesh.position.set(cameraPos.x, cameraPos.y, cameraPos.z)
    this.transitionMesh.material.map = this.transition.texture
    this.transitionMesh.material.needsUpdate = true
    this.transitionMesh.visible = true
  }

  scaleToModel(pos) {
    let result = { x: pos.x, y: pos.y, z: pos.z };
    result.x *= this.panoScaleFactor;
    // result.y;
    result.z *= this.panoScaleFactor;
    return result;
  }

  loadTextures(project) {
    const loader = new THREE.TextureLoader();
    this.loadedTextures = this.panos.map((pano) => loader.load(`${host}${project.path}${pano.name}`));

  }

  addPanosMarks() {
    this.panos.forEach((pano) => {
      if (!pano.object) {
        const mesh = ringsShape();
        pano.object = mesh;
        this.scene.add(mesh);

      }
      const pos = this.scaleToModel(pano.position);
      const yCef = 13.25; // this is for moving dot to floor
      pano.object.position.set(pos.x, pos.y - yCef, pos.z);
    });
  }

  addNavPoints(model: Project) {
    this.panos = model.data.filter(p => p.name).map(p => ({...p, position: p.panoramas}));
    this.loadTextures(model);
    this.addPanosMarks();
  }

  onDocumentMouseDown(event) {
    let panoId = this.getPanoId(event)
    if (panoId !== null) {
      this.currentPanoId = panoId;
      this.moveMark(this.currentPanoId);
      // Observable
      this.updateDotInfo(this.currentPanoId);
    }
  }

  onDocumentMouseMove(event) {
    this.panos.forEach(pano => {
      // pano.object.material.opacity = 0.25
      pano.object.children.forEach(mesh => {
        if (mesh.geometry !== 'CircleGeometry') {
          mesh.material.opacity = 0.25;
        }

      });
    })
    let panoId = this.getPanoId(event)
    if (panoId !== null) {
      // this.panos[panoId].object.material.opacity = 0.5
      this.panos[panoId].object.children.forEach(mesh => {
        if (mesh.geometry !== 'CircleGeometry') {
          mesh.material.opacity = 0.5;
        }

      });
    }
  }

  /**
   * Repainting on window resizing
   */
  resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( width, height );
  }

  /**
   * Rendering process
   */
  render(): void {
    this.renderCallback();
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });
    // Rendering start
    this.OrbitControls.update();
    // end
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Initialiaztion of the scene
   *
   * @param canvas ElementRef<HTMLCanvasElement>
   * @param model ModelData
   */
  createScene(canvas: ElementRef<HTMLCanvasElement>, model: Project): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    // Create the renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // transparent background
      antialias: true // smooth edges
    });
    this.element = this.renderer.domElement;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( this.element.clientWidth, this.element.clientHeight );
    this.renderer.setClearColor( 0x000000, 1 );
    this.renderer.autoClear = false;
    this.renderer.sortObjects = false;

    // create the scene
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(60, this.element.clientWidth / this.element.clientHeight, 1, 1000);
    this.cameraFrustum = new THREE.Frustum();
    this.cameraViewProjectionMatrix = new THREE.Matrix4();
    // @ts-ignore
    // this.camera.target = new THREE.Vector3(0, 0, 0);
    const firstPano = model.data[0].panoramas
    // 3.265433684854263, y: 1.3049540485298539, z: 1.6590141718188454
    // this.camera.position.z = 1.6590141718188454;
    // this.camera.position.x = 3.265433684854263;
    // this.camera.position.y = 1.3049540485298539;

    this.OrbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    // @ts-ignore
    this.OrbitControls.id = 'orbit';
    this.OrbitControls.minDistance = 1;
    // @ts-ignore
    this.OrbitControls.noPan = true;
    this.OrbitControls.autoRotate = false;
    this.OrbitControls.autoRotateSpeed = 2.0;
    // this.OrbitControls.object.position.z = 1;

    this.DeviceOrientationControls = new DeviceOrientationControls( this.camera, this.renderer.domElement );
    // @ts-ignore
    this.DeviceOrientationControls.name = 'device-orientation';
    this.DeviceOrientationControls.enabled = false;
    // this.camera.position.z = 1;

    const defaultY = 3.5;
    const y = model.rotation_y || defaultY;
    // 1
    this.loaderModel = new THREE.TextureLoader();
    this.sphereGeometryModel = new THREE.SphereGeometry(360, 60, 40);
    this.sphereGeometryModel.scale(-1, 1, 1);
    this.meshModel = new THREE.Mesh(this.sphereGeometryModel, new THREE.MeshBasicMaterial({transparent: true, opacity: 1}));
    // this.meshModel.rotation.y = y;
    this.scene.add(this.meshModel);
    this.meshModel.position.set(0, 0, 0);

    // 2
    let tSphereGeometryModel = new THREE.SphereGeometry(360, 60, 40);
    tSphereGeometryModel.scale(-1, 1, 1);
    this.transitionMesh = new THREE.Mesh(tSphereGeometryModel, new THREE.MeshBasicMaterial({transparent: true, opacity: 0}));
    // this.transitionMesh.rotation.y = y;
    this.scene.add(this.transitionMesh);
    this.addNavPoints(model);
    this.setSettingsControls();

    console.log(this.OrbitControls);
    this.OrbitControls.addEventListener('end', (e) => {
      console.log(e);
      console.log(e.target.object.position);
      console.log(e.target.object.rotation);
      // this.meshModel.rotation.y = e.target.object.rotation.y * 1.2;
      // this.transitionMesh.rotation.y = e.target.object.rotation.y + defaultY;
    });
    this.modelSource.next(model);
  }

  /**
   * Start rendering player
   */
  animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => this.render());
      }

      window.addEventListener('resize', () => this.resize());

      document.addEventListener( 'mousedown', (event) => this.onDocumentMouseDown(event), { passive: false } );
      document.addEventListener( 'touchend', (event) => this.onDocumentMouseDown(event), false );
      document.addEventListener( 'mousemove', (event) => this.onDocumentMouseMove(event), { passive: false } );

    });
  }
}
