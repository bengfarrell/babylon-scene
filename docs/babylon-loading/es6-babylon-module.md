# ES6 Babylon Module

```html
<html>
<head>
    <title>Use Babylon as ES6 module</title>
    <script src="../../babylonscene.js" type="module"></script>


    <style>
        babylon-scene {
            width: 300px;
            height: 300px;
        }
    </style>
</head>
<body>
<babylon-scene app="app-es6-module.js"></babylon-scene>
</body>
</html>

```
```js
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

```

> A running demo provided in this directory at **babylon-loading/es6-babylon-module-legacy.html** requires [es-dev-server](https://www.npmjs.com/package/es-dev-server) or another solution
to handle bare module imports. To use es-dev-server and run the demo, simply go to the
root of this project, and run **npm run dev** (assuming you've already run **npm install**). The command will automatically open a demo page
running on the server.
