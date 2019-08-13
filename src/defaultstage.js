import BabylonScene from './babylonscene.js';
export default {
    async setup(canvas, config) {
        if (config.useglobalbabylon) {
            this.babylon = window.BABYLON;
        }
        if (!this.babylonVersion) {
            const {default: DefaultBabylon} = await import('../web_modules/babylonjs.js');
            this.babylonVersion = DefaultBabylon;
        }
        const stage = {
            canvas: canvas,
            babylon: this.babylonVersion,
            config: config
        };
        stage.engine = this.setupEngine(stage);
        stage.scene = this.setupScene(stage);
        stage.cameras = this.setupCameras(stage);
        stage.lights = this.setupLights(stage);

        /*if (config.usewebxr) {
            stage.webxr = this.setupWebXR(stage);
        }

        // use webvr as solo option, or fallback when WebXR isn't available
        if (config.usewebvr && (!config.usewebxr || stage.webxr === 'failed')) {
            stage.webvr = this.setupWebVR(stage);
        }*/
        return stage;
    },

    set babylon(b) {
        this.babylonVersion = b;
    },

    setupCameras(stage) {
        const Babylon = stage.babylon;
        const camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -10), stage.scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(stage.canvas, true);
        return [camera];
    },

    setupEngine(stage) {
        const Babylon = stage.babylon;
        const engine = new Babylon.Engine(stage.canvas, true);
        engine.enableOfflineSupport = false;
        return engine;
    },

    setupScene(stage) {
        const Babylon = stage.babylon;
        const scene = new Babylon.Scene(stage.engine);

        if (stage.config.showdebuglayer) {
            scene.debugLayer.show( {
                globalRoot: document.body,
                handleResize: true
            });
        }

        if (stage.config.backgroundcolor) {
            scene.clearColor = BABYLON.Color3.FromHexString(stage.config.backgroundcolor);
        }

        return scene;
    },

    setupLights(stage) {
        const Babylon = stage.babylon;
        const light = new Babylon.HemisphericLight('light', new Babylon.Vector3(0, 1, -1), stage.scene);
        light.intensity = 0.7;
        return [light];
    },

    /*async setupWebXR(stage) {
        const xrHelper = await scene.createDefaultXRExperienceAsync();
        if (!await xrHelper.baseExperience.sessionManager.supportsSessionAsync("immersive-vr")) {
            return 'failed';
        }

        xrHelper.baseExperience.onStateChangedObservable.add((state)=>{
            if(state === Babylon.WebXRState.IN_XR){
                // When entering webXR, position the user's feet at 0,0,-1
                xrHelper.baseExperience.setPositionOfCameraUsingContainer(new Babylon.Vector3(0,xrHelper.baseExperience.camera.position.y,-1))
            }
        });

        xrHelper.input.onControllerAddedObservable.add((controller)=>{
            stage.controller = controller;
        });

        return xrHelper;
    },

    setupWebVR(stage) {
        const vrHelper = scene.createDefaultVRExperience();
        vrHelper.enableInteractions();
        vrHelper.onControllerMeshLoadedObservable.add((controller)=>{
            stage.controller = controller;
        });

        return vrHelper;
    }*/
};
