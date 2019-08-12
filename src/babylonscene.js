import DefaultApplication from './baseapplication.js';
import DefaultStage from './defaultstage.js';

export default class BabylonScene extends HTMLElement {
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

    connectedCallback() {
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

        if (!this.config.customsetup) {
            this.init();
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
