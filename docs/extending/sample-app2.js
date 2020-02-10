import {BaseApplication} from '../babylon-scene/babylonscene.js';
export default class extends BaseApplication {
    onReady() {
        const Babylon = this.stage.babylon;
        const sphere = Babylon.MeshBuilder.CreateSphere("sphere", {diameter: 4}, this.stage.scene);
        sphere.position.y = 1;
        sphere.position.z = 5;
    }
}
