# ES6 Babylon Module (Legacy)

```html
<html>
<head>
    <title>Use Babylon as ES6 legacy module</title>
    <script src="../babylon-scene/babylonscene.js" type="module"></script>


    <style>
        babylon-scene {
            width: 300px;
            height: 300px;
        }
    </style>
</head>
<body>

<babylon-scene app="app-legacy-babylon.js" useglobalbabylon="false"></babylon-scene>
</body>
</html>
```
```js
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
```

> A running demo provided in this directory at **babylon-loading/es6-babylon-module-legacy.html** requires [es-dev-server](https://www.npmjs.com/package/es-dev-server) or another solution
to handle bare module imports. To use es-dev-server and run the demo, simply go to the
root of this project, and run **npm run dev** (assuming you've already run **npm install**). The command will automatically open a demo page
running on the server.
