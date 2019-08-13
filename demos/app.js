import BaseApplication from '../src/baseapplication.js';

export default class extends BaseApplication {
    onReady() {
        const Babylon = this.stage.babylon;
        const cube = Babylon.MeshBuilder.CreateBox("cube", {height: 4, width: 4, depth: 4}, this.stage.scene);
        cube.position.y = 1;
        cube.position.z = 5;
    }
}
