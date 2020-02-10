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
