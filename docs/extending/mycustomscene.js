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
