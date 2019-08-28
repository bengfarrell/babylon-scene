import EventListener from './eventlistener.js';

export default class BaseApplication extends EventListener {
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
