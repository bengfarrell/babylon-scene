import BaseApplication from '../../src/baseapplication.js';
import * as Babylon from '@babylonjs/core/Legacy/legacy';

export default class extends BaseApplication {
    static get Babylon() { return Babylon; }

    onReady() {
        const Babylon = this.stage.babylon;
        const cube = Babylon.MeshBuilder.CreateBox("cube", {height: 4, width: 4, depth: 4}, this.stage.scene);
        cube.position.y = 1;
        cube.position.z = 5;
    }
}
