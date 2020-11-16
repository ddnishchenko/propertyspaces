import { Injectable, ElementRef, OnDestroy, NgZone } from '@angular/core';
import * as THREE from 'three';
import { Subject } from 'rxjs';
import { OrbitControls } from './orbit-control';
import { DeviceOrientationControls } from './device-control';
import { ModelData } from '../model-data.resolver';

@Injectable({
  providedIn: 'root'
})
export class PanoramaPlayerService implements OnDestroy {
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
  // Observable string streams
  dotInfo$ = this.dotSource.asObservable();

  constructor(private ngZone: NgZone) { }

  ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
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
      this.panos.forEach(pano => {
        if (this.currentPano.neighbors.indexOf(pano.uuid) != -1) {
          pano.object.visible = true
        }
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
    this.mouseModel.x = ( (event.pageX - boundBox.x) / boundBox.width ) * 2 - 1;
    this.mouseModel.y = - ( (event.clientY - boundBox.y) / boundBox.height ) * 2 + 1;
    this.raycasterModel.setFromCamera( this.mouseModel, this.camera );

    let intersects = this.raycasterModel.intersectObjects( this.scene.children, true );
    let target = null
    intersects.forEach((item) => {
      if (item.distance > 200) { //panorama sphere
        return
      }

      for (let i = 0; i < this.panos.length; i++) {
        if (this.panos[i].object.uuid == item.object.uuid) {
          target = i
        }
      }
    });
    return target
  }

  moveMark(panoId) {
    this.panos.forEach(pano => {
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
    result.y;
    result.z *= this.panoScaleFactor;
    return result;
  }

  loadTextures(model) {
    this.loadedTextures = this.panos.map((sweep) => THREE.ImageUtils.loadTexture(`./assets/models/${model.sid}/${sweep.index}.jpg`));
  }

  addPanosMarks() {
    this.panos.forEach((pano) => {
      if (!pano.object) {
        let s = new THREE.Mesh(
          new THREE.SphereGeometry(.8, 8, 8),
          new THREE.MeshBasicMaterial( {color: 0x00ff00, transparent: true, opacity: 0.25} ),
        );
        pano.object = s;
        this.scene.add(s);
      }
      let pos = this.scaleToModel(pano.position);
      if (!pano.index) {
        pano.object.position.set(pos.x, pos.y - 13.25, pos.z);
      } else {
        pano.object.position.set(pos.x, pos.y - 13.25, pos.z);
      }
      
    });
  }

  addNavPoints(model: ModelData) {
    this.panos = model.sweeps;
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
      pano.object.material.opacity = 0.25
    })
    let panoId = this.getPanoId(event)
    if (panoId !== null) {
      this.panos[panoId].object.material.opacity = 0.5
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
  createScene(canvas: ElementRef<HTMLCanvasElement>, model: ModelData): void {
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
    // this.camera.position.set(0, 0, 10);

    this.OrbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    // @ts-ignore
    this.OrbitControls.id = 'orbit';
    this.OrbitControls.minDistance = 1;
    // @ts-ignore
    this.OrbitControls.noPan = true;
    this.OrbitControls.autoRotate = false;
    this.OrbitControls.autoRotateSpeed = 2.0;

    this.DeviceOrientationControls = new DeviceOrientationControls( this.camera, this.renderer.domElement );
    // @ts-ignore
    this.DeviceOrientationControls.name = 'device-orientation';
    this.DeviceOrientationControls.enabled = false;
    this.camera.position.z = 1;

    let y = -1.65;
    // 1
    this.loaderModel = new THREE.TextureLoader();
    this.sphereGeometryModel = new THREE.SphereGeometry(360, 60, 40);
    this.sphereGeometryModel.scale(-1, 1, 1);
    this.meshModel = new THREE.Mesh(this.sphereGeometryModel, new THREE.MeshBasicMaterial({transparent: true, opacity: 1}));
    this.meshModel.rotation.y = y;
    this.scene.add(this.meshModel);
    this.meshModel.position.set(0, 0, 0);

    // 2
    let tSphereGeometryModel = new THREE.SphereGeometry(360, 60, 40);
    tSphereGeometryModel.scale(-1, 1, 1);
    this.transitionMesh = new THREE.Mesh(tSphereGeometryModel, new THREE.MeshBasicMaterial({transparent: true, opacity: 0}));
    this.transitionMesh.rotation.y = y;
    this.scene.add(this.transitionMesh);
    this.addNavPoints(model);
    this.setSettingsControls();

    console.log(this.OrbitControls);
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

      document.addEventListener( 'click', (event) => this.onDocumentMouseDown(event), false );
      document.addEventListener( 'mousemove', (event) => this.onDocumentMouseMove(event), false );
      this.OrbitControls.addEventListener('mousewheel', event => {
        console.log(this.OrbitControls);
      })

    });
  }
}
