var babylonscene = (function () {
    'use strict';

    class EventListener {
        constructor() {
            /**
             * event listeners
             * @type {Array}
             * @private
             */
            this._listeners = [];
        }

        /**
         * add event listener
         * @param type
         * @param cb
         * @returns {{type: *, callback: *}}
         */
        addEventListener(type, cb) {
            let listener = { type: type, callback: cb };
            this._listeners.push(listener);
            return listener;
        }

        /**
         * remove event listener
         * @param listener
         */
        removeEventListener(listener) {
            for (let c = 0; c < this._listeners.length; c++) {
                if (listener === this._listeners[c]) {
                    this._listeners.splice(c, 0);
                    return;
                }
            }
        }

        /**
         * trigger event
         * @param custom event
         */
        triggerEvent(ce) {
            this._listeners.forEach( function(l) {
                if (ce.type === l.type) {
                    l.callback.apply(this, [ce]);
                }
            });
        }
    }

    class BaseApplication extends EventListener {
        constructor(o) {
            super();
            if (o.stage) {
                o.stage.setup(o.canvas, o.config).then( stage => {
                    this.stage = stage;
                    this.config = o.config;
                    this.stage.engine.runRenderLoop(() => {
                        this.stage.scene.render();
                        this.onRender(this.stage.engine.getDeltaTime());
                    });

                    if (this.config.addons) {
                        this.config.addons.split(',').forEach(addon => {
                            this.processAddon(addon);
                        });
                    }

                    this.stage.engine.resize();

                    window.addEventListener('resize', () => {
                        this.stage.engine.resize();
                        this.onResize();
                    });

                    this.triggerEvent(new CustomEvent('ready'));
                    this.onReady();
                });
            }
        }

        async processAddon(path) {
            const a = await import(path);
            a.default.add(this);
        }

        onRender(deltaTime) {}
        onResize() {}
        onReady() {}
    }

    var DefaultStage = {
        async setup(canvas, config) {
            if (config.useglobalbabylon) {
                this.babylon = window.BABYLON;
            }
            if (!this.babylonVersion) {
                const babylonPath = config.babylon ? config.babylon : '../web_modules/babylonjs.js';
                const {default: DefaultBabylon} = await import(babylonPath);
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

    class BabylonScene extends HTMLElement {
        static get CUSTOM_SETUP() {
            return 'customsetup';
        }

        constructor() {
            super();
            this.root = this;

            this.attachShadow({mode: 'open'});
            this.canvas = document.createElement('canvas');
            this.shadowRoot.appendChild(this.canvas);
            this._stage = DefaultStage;

        }

        init(app) {
            if (!app) {
                this.application = new BaseApplication(this);
            } else {
                this.application = app;
            }

            const listener = this.application.addEventListener('ready', () => {
                this.application.removeEventListener(listener);
                this.onSceneCreated();
            });
        }

        set stage(val) {
            this._stage = val;
            this.init(app);
        }

        get stage() {
            return this._stage;
        }

        onSceneCreated() {
            const ce = new CustomEvent('playing', {
                bubbles: true,
                detail: this.application.stage
            });
            this.dispatchEvent(ce);
            this.sceneIsReady = true;
        }

        async connectedCallback() {
            // when using show debug layer, component gets reparented and this is called twice
            if (this._connectedCallbackFired) { return; }
            this._connectedCallbackFired = true;

            this.style.display = 'inline-block';
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';

            this.config = {};
            this.getAttributeNames().forEach( attr => {
                const val = this.getAttribute(attr) ? this.getAttribute(attr) : true;
                if (attr !== 'style' && attr !== 'class') {
                    this.config[attr] = val;
                }
            });
            this.config.babylonComponent = this;

            if (this.config.stage) {
                this._stage = await import(this.config.stage);
            }

            if (this.config.app) {
                const {default: App} = await import(this.config.app);
                this.init(new App(this));
                return;
            }

            if (!this.config.customsetup) {
                this.init();
                return;
            }

            const ce = new CustomEvent('waiting', {
                bubbles: true,
                detail: {
                    canvas: this.canvas,
                    stage: DefaultStage,
                    config: this.config
                }});
            this.dispatchEvent(ce);
        }
    }

    if (!customElements.get('babylon-scene')) {
        customElements.define('babylon-scene', BabylonScene);
    }

    return BabylonScene;

}());
//# sourceMappingURL=babylonscene.nobabylon.js.map
