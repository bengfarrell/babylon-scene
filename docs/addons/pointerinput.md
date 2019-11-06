# Babylon-Scene Add-ons

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Pointer Add-on Demo</title>

    <!-- Load Babylon from CDN -->
    <script src="https://cdn.babylonjs.com/babylon.js"></script>

    <!-- Load Babylon Scene Component as ES6 Module -->
    <script type="module" src="../../babylonscene.js"></script>

    <style>
        body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
        }
        
        babylon-scene {
            width: 100vw;
            height: calc(100% - 100px);
        }

        #log {
            padding: 30px;
        }
    </style>

</head>
<body>

<!-- Use "pointer" add-on in an ES6 class based application provided from mouseinputapp.js -->
<!-- Using the addons attribute is not required, instead look at the "mouseinputapp.js" onReady method to see how to use the add-on with just JS -->
<babylon-scene
        addons="pointer"
        app="pointerinputapp.js">
</babylon-scene>

<span id="log"></span>
</body>
</html>
```

```js
import {BaseApplication, AddOns} from '../../babylonscene.js';

export default class extends BaseApplication {
    onReady() {
        /* Manually import and use add-on if setting "addon" attribute is not desired */
        // AddOns.pointer.add(this);

        // Get a Babylon.js reference
        const Babylon = this.stage.babylon;

        // Create a cube
        const cube = Babylon.MeshBuilder.CreateBox("cube", {height: 4, width: 4, depth: 4}, this.stage.scene);
        cube.position.y = 1;
        cube.position.z = 5;
    }

    /**
     * provided by Pointer Add-On
     * @param pointerInfo
     *
     * pointerinfo includes eventtype, mouse info, and Babylon.js pickInfo object
     */
    onPointer(pointerInfo) {
        const Babylon = this.stage.babylon;
        let type;
        switch (pointerInfo.type) {
            case Babylon.PointerEventTypes.POINTERDOWN:
                type = 'pointerdown';
                break;
            case Babylon.PointerEventTypes.POINTERUP:
                type = 'pointerup';
                break;
            case Babylon.PointerEventTypes.POINTERMOVE:
                type = 'pointermove';
                break;
            case Babylon.PointerEventTypes.POINTERWHEEL:
                type = 'pointerwheel';
                break;
            case Babylon.PointerEventTypes.POINTERPICK:
                type = 'pointerpick';
                break;
            case Babylon.PointerEventTypes.POINTERTAP:
                type = 'pointertap';
                break;
            case Babylon.PointerEventTypes.POINTERDOUBLETAP:
                type = 'pointerdoubletap';
                break;
        }
        document.getElementById('log').innerText = `${type} (${pointerInfo.event.clientX},${pointerInfo.event.clientY})`;
        if (pointerInfo.pickInfo.pickedMesh) {
            document.getElementById('log').innerText += ` - ${pointerInfo.pickInfo.pickedMesh.id}`;
        }
        console.log(type, pointerInfo);
    }

    /**
     * provided by Pointer Add-On
     * @param pick
     * @param pointerInfo
     *
     * Used when pointer info is not imporant except when clicking/hovering over an actual mesh
     */
    onMeshPointer(pick, pointerInfo) {
      //  console.log(pick, pointerInfo)
    }
}

```

[demo](pointerinput.html ':include :type=iframe width=100% height=500px')
