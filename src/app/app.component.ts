import {
  AnimationStore,
  CanvasStore,
  LoaderService,
} from "@angular-three/core";
import {
  ChangeDetectionStrategy,
  Component,
  NgZone,
  OnInit,
} from "@angular/core";
import { filter, switchMap, take, tap, withLatestFrom } from "rxjs/operators";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

@Component({
  selector: "app-root",
  template: `
    <ngt-canvas
      [camera]="{ fov: 45, near: 1, far: 2000, position: [100, 200, 300] }"
      [scene]="{
        background: ['#a0a0a0'] | color,
        fog: ['#a0a0a0', 200, 1000] | fog
      }"
      [shadows]="true"
      [linear]="true"
    >
      <ngt-stats></ngt-stats>
      <app-scene></app-scene>
    </ngt-canvas>
  `,
  styles: [],
})
export class AppComponent {
  title = "ngt-fbx-loader";
}

const clock = new THREE.Clock();

@Component({
  selector: "app-scene",
  template: `
    <ngt-orbit-controls
      (ready)="onOrbitControlsReady($event)"
    ></ngt-orbit-controls>

    <ngt-hemisphere-light
      o3d
      [args]="['#ffffff', '#444444']"
      [position]="[0, 200, 0]"
    ></ngt-hemisphere-light>

    <ngt-directional-light
      o3d
      [args]="['#ffffff']"
      [position]="[0, 200, 100]"
      [castShadow]="true"
      (ready)="onDirectionalLightReady($event)"
    ></ngt-directional-light>

    <ngt-mesh
      o3d
      [rotation]="[-(1 | mathConst: 'PI') / 2, 0, 0]"
      [receiveShadow]="true"
    >
      <ngt-plane-geometry [args]="[2000, 2000]"></ngt-plane-geometry>
      <ngt-mesh-phong-material
        [parameters]="{ color: '#999999', depthWrite: false }"
      ></ngt-mesh-phong-material>
    </ngt-mesh>

    <ngt-grid-helper
      o3d
      [args]="[2000, 20, '#000000', '#000000']"
      (ready)="onGridHelperReady($event)"
    ></ngt-grid-helper>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SceneComponent implements OnInit {
  mixer?: THREE.AnimationMixer;

  constructor(
    private loaderService: LoaderService,
    private ngZone: NgZone,
    private canvasStore: CanvasStore,
    private animationStore: AnimationStore
  ) {}

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.canvasStore.active$
        .pipe(
          filter((active) => active),
          switchMap(() =>
            this.loaderService.use(FBXLoader, "assets/Samba-Dancing.fbx")
          ),
          withLatestFrom(this.canvasStore.scene$),
          tap(([group, scene]) => {
            this.mixer = new THREE.AnimationMixer(group);
            this.mixer.clipAction(group.animations[0]).play();
            group.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });

            this.animationStore.registerAnimation(() => {
              const delta = clock.getDelta();
              if (this.mixer) {
                this.mixer.update(delta);
              }
            });

            if (scene) {
              scene.add(group);
            }
          }),
          take(1)
        )
        .subscribe();
    });
  }

  onDirectionalLightReady(dirLight: THREE.DirectionalLight) {
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = -100;
    dirLight.shadow.camera.left = -120;
    dirLight.shadow.camera.right = 120;
  }

  onGridHelperReady(gridHelper: THREE.GridHelper) {
    (gridHelper.material as THREE.Material).opacity = 0.2;
    (gridHelper.material as THREE.Material).transparent = true;
  }

  onOrbitControlsReady(orbitControls: OrbitControls) {
    orbitControls.target.set(0, 100, 0);
    orbitControls.update();
  }
}
