import BabylonScene from './babylonscene.js';

export default {
    async setup(canvas, config, clazz) {
        const stage = {
            canvas: canvas,
            config: config,
            app: clazz,
        };
        stage.babylon = this.setupBabylon(stage);
        stage.engine = this.setupEngine(stage);
        stage.scene = this.setupScene(stage);

        const cameras = this.setupCameras(stage);
        if (!Array.isArray(cameras))  {
            stage.cameras = [cameras];
        }  else {
            stage.cameras = cameras;
        }

        const lights = this.setupLights(stage);
        if (!Array.isArray(lights))  {
            stage.lights = [lights];
        }  else {
            stage.lights = lights;
        }
        stage.lights = lights;

        if (config.usewebxr) {
            stage.webxr = this.setupWebXR(stage);
        }

        return stage;
    },

    setupBabylon(stage) {
        // if user does not specify, auto-detect if BABYLON is present
        if (!stage.config.useglobalbabylon) {
            if (window.BABYLON) { return window.BABYLON; }
        }

        // if user does specify with true or no value, use BABYLON, error if not present
        if (stage.config.useglobalbabylon === true || stage.config.useglobalbabylon === "true") {
            if (window.BABYLON) {
                return window.BABYLON;
            } else {
                throw new Error('Babylon is not loaded, setup cannot continue, ensure that window.BABYLON exists')
            }
        }

        // Babylon provided by application?
        if (stage.app.constructor.Babylon) {
            return stage.app.constructor.Babylon;
        }
    },

    setupCameras(stage) {
        const Babylon = stage.babylon;
        const camera = new Babylon.UniversalCamera("UniversalCamera", new Babylon.Vector3(0, 0, -10), stage.scene);
        camera.setTarget(Babylon.Vector3.Zero());
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
            scene.clearColor = Babylon.Color3.FromHexString(stage.config.backgroundcolor);
        }

        return scene;
    },

    setupLights(stage) {
        const Babylon = stage.babylon;
        const light = new Babylon.HemisphericLight('light', new Babylon.Vector3(0, 1, -1), stage.scene);
        light.intensity = 0.7;
        return [light];
    },


    setupWebXR(stage) {
        console.log('webxr', navigator);
        if(navigator.xr && !navigator.xr.supportsSession) {
            navigator.xr.supportsSession = navigator.xr.supportsSessionMode;
            let originalRequestSession = navigator.xr.requestSession;
            // change signature
            navigator.xr.requestSession = function(mode, options) {
                return originalRequestSession.call(this, {mode: mode}, options).then((session) => {
                    let requestReferenceSpace = session.requestReferenceSpace;
                    // change signature
                    session.requestReferenceSpace = function(type) {
                        return requestReferenceSpace.call(this, {type: "identity"});
                    };
                    return session;
                });
            };
        }
    }

    /*async setupWebXR(stage) {
        // missing function?
        if(navigator.xr && !navigator.xr.supportsSession) {
            navigator.xr.supportsSession = navigator.xr.supportsSessionMode;

            let originalRequestSession = navigator.xr.requestSession;
            // change signature
            navigator.xr.requestSession = function(mode, options) {
                return originalRequestSession.call(this, {mode: mode}, options).then((session) => {
                    let requestReferenceSpace = session.requestReferenceSpace;

                    // change signature
                    session.requestReferenceSpace = function(type) {
                        return requestReferenceSpace.call(this, {type: "identity"});
                    };

                    return session;
                });
            };
        }

    }*/

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
