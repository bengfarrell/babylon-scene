import BaseApplication from '../../src/baseapplication.js';

export default class extends BaseApplication {
    onReady() {
        const Babylon = this.stage.babylon;
        const cube = Babylon.MeshBuilder.CreateBox("cube", {height: 4, width: 4, depth: 4}, this.stage.scene);
        cube.position.y = 1;
        cube.position.z = 5;
    }

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
        console.log(type);
    }

    onMeshPointer(pick, pointerInfo) {
        //console.log(pick, pointerInfo)
    }
}
