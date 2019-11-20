import DefaultApplication from './baseapplication.js';
import DefaultStage from './defaultstage.js';
import {urlResolve} from "./url-resolver.js";

/**
 * Babylon Scene Description
 *
 * @element babylon-scene
 *
 * @fires waiting - Use in combination with the "customsetup" attribute to listen for a pause where you can manipulate the stage
 * @fires playing - Fired when the 3D scene is set up and ready for content and interactivity to be added
 *
 * Core Component Attributes
 * @attr {Boolean} customsetup - if true, will stop setup prior to scene creation to allow the consumer to inject custom logic
 * @attr {CustomEvent} onwaiting - "waiting" event fires when "customsetup" is set to true to allow the consumer to inject custom logic.
 * @attr {CustomEvent} onplaying - "playing" event fires when the scene is fully setup and ready for adding logic and 3d objects.
 * @attr {String} app - path to application class module (relative to your HTML file)
 * @attr {String} stage - path to stage setup module (relative to your HTML file)
 *
 * Stage Attributes
 * @attr {Boolean} showdebuglayer - if true will automatically load the Babylon.js inspector UI at start
 * @attr {String} backgroundcolor - when set to a hex color (#ff0000 for red as an example), the Babylon.js background color will be set to this color
 * @attr {Boolean} useglobalbabylon - if true or not set, the Babylon instance defined on window.BABYLON (if found) will be used. Any built version included on a script tag, like from a CDN (https://cdn.babylonjs.com/babylon.js) will put this in place
 *
 * Base Application Attributes
 * @attr {String} addons - An optional comma separated list of addons to automatically use in your application. See add-ons for more details
 *
 * @prop {HTMLCanvasElement} canvas - Canvas used to render 3D scene
 * @prop {Stage} stage - Stage, or scene configuration containing lights, cameras, etc
 * @prop {Object} config - Object containing configuration options for component, stage, and application
 */


export default class BabylonScene extends HTMLElement {

    static get CUSTOM_SETUP() {
        return 'customsetup';
    }

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.canvas = document.createElement('canvas');
        this.shadowRoot.appendChild(this.canvas);
    }

    init(app) {
        if (!app) {
            this.application = new DefaultApplication(this);
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
            const absPath = urlResolve(this.config.stage).href;
            const {default: CustomStage} = await import(absPath);
            this._stage = CustomStage;
        } else {
            this._stage = DefaultStage;
        }

        if (this.config.app) {
            const absPath = urlResolve(this.config.app).href;
            const {default: App} = await import(absPath);
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
