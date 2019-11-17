import EventListener from './eventlistener.js';
import * as Addons from './addons.js';
import {urlResolve} from "./url-resolver.js";

export default class BaseApplication extends EventListener {

    static get Babylon() { return null; }

    constructor(o) {
        super();
        if (o.stage) {
            o.stage.setup(o.canvas, o.config, this).then( stage => {
                stage.application = this;
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
        if (path.toLowerCase().indexOf('.js') === -1) {
            // path is a built-in name
            Addons[path].add(this);
        } else {
            const absPath = urlResolve(path);
            const a = await import(path);
            a.default.add(this);
        }
    }

    onRender(deltaTime) {}
    onResize() {}
    onReady() {}
}
