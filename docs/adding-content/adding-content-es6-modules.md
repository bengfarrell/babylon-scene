```html
<html>
<head>
    <title>Adding Content</title>
    <script src="../babylon-scene/babylonscene.full.js"></script>

    <style>
        body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
        }

        babylon-scene {
            width: 100%;
            height: 100vh;
        }
    </style>
</head>
<body>
<babylon-scene
        app="sample-app.js"
        stage="custom-stage.js">
</babylon-scene>
</body>
</html>
```

Stage Customization
--------------------

```js
import {DefaultStage} from '../babylon-scene/babylonscene.js';

DefaultStage.setupLights = function(stage) {
    const Babylon = stage.babylon;
    const light = new Babylon.HemisphericLight('light', new Babylon.Vector3(0, 1, -1), stage.scene);
    light.intensity = 0.1;
    return [light];
};

DefaultStage.setupCameras = function(stage) {
    const Babylon = stage.babylon;
    const camera = new Babylon.ArcRotateCamera("Camera", 0, 0, 10, new Babylon.Vector3(0, 0, -10), stage.scene);
    camera.setTarget(Babylon.Vector3.Zero());
    camera.attachControl(stage.canvas, true);
    return [camera];
};

export default Stage;

```

Custom Application
-------------------

```js
import {BaseApplication} from '../babylon-scene/babylonscene.js';
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

[demo](adding-content-es6-modules.html ':include :type=iframe width=100% height=400px')

