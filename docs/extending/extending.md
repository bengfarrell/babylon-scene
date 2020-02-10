# Extending Babylon-Scene

The following example demonstrates creating two separate custom components that each have different
custom application logic. Aside from automatically populating both the stage and application logic,
everything else about this new component will match the &lt;babylon-scene&gt; API

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <!-- Importing babylonscene.full.js is a bit redundant here, but it's here just to import babylon without needing es-dev-server to use Babylon as ES6 modules -->
    <script src="../babylon-scene/babylonscene.full.js"></script>
    <script type="module">
        import {defineCustomScene} from "../babylon-scene/babylonscene.js";
        import SampleApp from './sample-app.js';
        import CustomStage from './custom-stage.js';
        defineCustomScene('my-custom-scene', SampleApp, CustomStage);
        defineCustomScene('my-custom-scene2', SampleApp2, CustomStage);
    </script>
</head>
<body>
    <my-custom-scene></my-custom-scene>
    <my-custom-scene2></my-custom-scene2>
</body>
</html>
```

### Sample App
```js
import {BaseApplication} from '../babylon-scene/babylonscene.js';
export default class extends BaseApplication {
    onReady() {
        const Babylon = this.stage.babylon;
        const cube = Babylon.MeshBuilder.CreateBox("cube", {height: 4, width: 4, depth: 4}, this.stage.scene);
        cube.position.y = 1;
        cube.position.z = 5;
    }
}
```

### Sample App 2
```js
import {BaseApplication} from '../babylon-scene/babylonscene.js';
export default class extends BaseApplication {
    onReady() {
        const Babylon = this.stage.babylon;
        const sphere = Babylon.MeshBuilder.CreateSphere("sphere", {diameter: 4}, this.stage.scene);
        sphere.position.y = 1;
        sphere.position.z = 5;
    }
}
```

### Custom Stage
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

export default DefaultStage;
```

[demo](automatic.html ':include :type=iframe width=100% height=500px')

# Manually Extending

The above function to create a custom &lt;babylon-scene&gt; based element is equivalent to doing the same as
the following (which also works):

```js
import {BabylonScene} from "../../babylonscene.js";
import CustomStage from "./custom-stage.js";
import SampleApp from "./sample-app.js";

export default class MyCustomScene extends BabylonScene {
    constructor() {
        super();
        this.stage = CustomStage;
        this.app = SampleApp;
    }
}

if (!customElements.get('my-custom-scene')) {
    customElements.define('my-custom-scene', MyCustomScene);
}

```
