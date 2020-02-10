import BabylonScene from './src/babylonscene.js';
import BaseApplication from './src/baseapplication.js';
import DefaultStage from './src/defaultstage.js';
import * as AddOns from './src/addons.js';

const defineCustomScene = function(tagname, app, stage, baseclass) {
    // usually the baseclass will be BabylonScene,
    // but just BabylonScene needs to be built on top of to then extend off of
    const Base = baseclass ? baseclass : BabylonScene;
    const CustomScene = class extends Base {
        constructor() {
            super();
            this.stage = stage;
            this.app = app;
        }
    };
    customElements.define(tagname, CustomScene);
};

export {BabylonScene, BaseApplication, DefaultStage, AddOns, defineCustomScene};

