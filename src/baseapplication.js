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

    onRender(deltaTime) {}
    onResize() {}
    onReady() {}
}
