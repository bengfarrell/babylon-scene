# ES6 Babylon Module (with debug layer)

```html
<html>
<head>
    <title>Use Babylon as ES6 module (with debug layer)</title>
    <script src="../../babylonscene.js" type="module"></script>


    <style>
        babylon-scene {
            width: 300px;
            height: 300px;
        }
    </style>
</head>
<body>
<babylon-scene showdebuglayer  app="app-es6-with-debug-module.js"></babylon-scene>
</body>
</html>

```
```js
import * as Core from '@babylonjs/core';

export default class extends BaseApplication {
    static get Babylon() {
        // When using ES6 modules and the debug layer, Babylon essentially needs
        // the entirety of Babylon Core (otherwise missing modules throw errors when running)
        return { ...Core };
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
