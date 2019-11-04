import BaseApplication from '../../src/baseapplication.js';
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3, Color3 } from "@babylonjs/core/Maths/math";
import { UniversalCamera } from "@babylonjs/core/Cameras/UniversalCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder.js";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";

export default class extends BaseApplication {
    static get Babylon() {
        return {
            Engine: Engine,
            Scene: Scene,
            UniversalCamera: UniversalCamera,
            Vector3: Vector3,
            Color3: Color3,
            HemisphericLight: HemisphericLight
        };
    }

    onReady() {
        const Babylon = this.stage.babylon;
        const cube = MeshBuilder.CreateBox("cube", {height: 4, width: 4, depth: 4}, this.stage.scene);
        cube.position.y = 1;
        cube.position.z = 5;
    }
}
