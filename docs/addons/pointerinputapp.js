import {BaseApplication, AddOns} from '../babylon-scene/babylonscene.js';

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
