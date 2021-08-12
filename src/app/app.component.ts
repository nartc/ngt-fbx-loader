import { LoaderService } from "@angular-three/core";
import { Component } from "@angular/core";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

const clock = new THREE.Clock();

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

      <ng-container *ngIf="samba$ | async as samba">
        <ngt-primitive
          o3d
          [object]="samba"
          (ready)="onSambaReady(samba)"
          (animateReady)="onSambaAnimateReady()"
        ></ngt-primitive>
      </ng-container>
    </ngt-canvas>
  `,
  styles: [],
})
export class AppComponent {
  samba$ = this.loaderService.use(FBXLoader, "assets/Samba-Dancing.fbx");
  mixer?: THREE.AnimationMixer;

  constructor(private loaderService: LoaderService) {}

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

  onSambaReady(samba: THREE.Group) {
    this.mixer = new THREE.AnimationMixer(samba);
    this.mixer.clipAction(samba.animations[0]).play();
    samba.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  onSambaAnimateReady() {
    const clockDelta = clock.getDelta();
    if (this.mixer) {
      this.mixer.update(clockDelta);
    }
  }
}
