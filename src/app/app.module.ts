import { ThreeOrbitControlsModule } from "@angular-three/controls/orbit-controls";
import {
  ThreeColorPipeModule,
  ThreeCoreModule,
  ThreeFogPipeModule,
  ThreeMathConstantPipeModule,
} from "@angular-three/core";
import { ThreePlaneBufferGeometryModule } from "@angular-three/core/geometries";
import { ThreeGridHelperModule } from "@angular-three/core/helpers";
import {
  ThreeDirectionalLightModule,
  ThreeHemisphereLightModule,
} from "@angular-three/core/lights";
import { ThreeMeshPhongMaterialModule } from "@angular-three/core/materials";
import { ThreeMeshModule } from "@angular-three/core/meshes";
import { ThreeStatsModule } from "@angular-three/core/stats";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent, SceneComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent, SceneComponent],
  imports: [
    BrowserModule,
    ThreeCoreModule,
    ThreeColorPipeModule,
    ThreeFogPipeModule,
    ThreeHemisphereLightModule,
    ThreeDirectionalLightModule,
    ThreeMeshModule,
    ThreeMathConstantPipeModule,
    ThreePlaneBufferGeometryModule,
    ThreeMeshPhongMaterialModule,
    ThreeGridHelperModule,
    ThreeOrbitControlsModule,
    ThreeStatsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
