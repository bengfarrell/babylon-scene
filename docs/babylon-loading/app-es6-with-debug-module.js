import BaseApplication from '../../src/baseapplication.js';
import * as Core from '@babylonjs/core';
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder.js";

export default class extends BaseApplication {
    static get Babylon() {
        // When using ES6 modules and the debug layer, Babylon essentially needs
        // the entirety of Babylon Core (otherwise missing modules throw errors when used)
        return {
            ...Core,

            // this is a duplicate export, but if we were using the debug layer temporarily,
            // we could make the Core import go away when we didn't need it anymore.
            // Otherwise, we could access MeshBuilder from Core.MeshBuilder
            MeshBuilder
        };
    }

    onReady() {
        const Babylon = this.stage.babylon;
        const cube = MeshBuilder.CreateBox("cube", {height: 4, width: 4, depth: 4}, this.stage.scene);
        cube.position.y = 1;
        cube.position.z = 5;
    }
}
