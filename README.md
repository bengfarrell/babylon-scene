# <babylon-scene>
Babylon-Scene is a Web Component to easily spin up a Babylon.js instance simply by dropping the <babylon-scene> tag along with a single script dependency on your page.

There are a few ways to use it. Each of the following methods will get you a completely blank, default, dark blue background scene that's ready to go:

## Ways to load

##### As an ES6 Module
```sh
<script type="module" src="path/to/babylonscene/src/babylonscene.js"></script>
<babylon-scene></babylon-scene>
```
##### As a JS script include
```sh
<script src="babylonscene.full.js"></script>
<babylon-scene></babylon-scene>
```
##### BYOB (Bring your own Babylon)
```sh
<script src="../babylonscene.nobabylon.js"></script>
<script src="https://cdn.babylonjs.com/babylon.js"></script>
<babylon-scene useglobalbabylon></babylon-scene>
```
note that there are also ways to BYOB if using the ES6 Module method, refer to the "Stage" concept further on to learn.

## Adding stuff to your scene
Once the scene is ready to go, a "playing" event will be fired from the component. If not using ES6 modules, it's easy to trigger off of this event:

```sh
<script src="babylonscene.full.js"></script>
<babylon-scene onplaying="makeScene(event)"></babylon-scene>
<script>
        function makeScene(stage) {
            const scene = stage.scene;
            const Babylon = stage.babylon;
            const cube = Babylon.MeshBuilder.CreateBox("box", {size: 5}, scene);
            cube.position.y = 1;
            cube.position.z = 5;
        }
</script>
```

## Customizing your Scene Setup
The above method of waiting until your scene is ready to go is fine, but not everyone will want the exact same cameras, the exact same lighting, etc. There are two levels of customization: the Stage, and the Application.

##### Stages
Think of a "Stage" like a phyiscal, empty stage. It has lights, cameras, a place to perform, but no actors yet. This component provides you with a "DefaultStage" so you can override anything within.
In order of operation, it sets up:
- The Babylon.js Engine (setupEngine)
- The Babylon.js Scene (setupScene)
- A camera (setupCameras)
- A light (setupLights)

Any one of these (or even the master "setup") method can be overriden. But to do so, we must tell the <babylon-scene> component to wait before
it sets up the scene according to its existing defaults. This is done with a "customsetup" attribute. Of course, we need to be alerted
when its waiting so we can go in and modify stuff. For that we can use the "waiting" event.

Both attributes can be used like so:
```sh
<babylon-scene customsetup onwaiting="customStuff(event)></babylon-scene>
```

Again, note that inline functions only work if using the <babylon-scene> bundle, but not if using this project as an ES6 module. You must do element.addEventListener('waiting', customStuff) for that.

Next in the "customStuff" function, we can modify the Stage setup:

```sh
<babylon-scene customsetup onwaiting="customStuff(event)></babylon-scene>

<script>
function customStuff(e) {
    e.detail.stage.setupCameras = function (stage) {
        const Babylon = stage.babylon;
        const scene = stage.scene;
        const canvas = stage.canvas;
        const camera = new Babylon.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
        camera.setPosition(new BABYLON.Vector3(0, 0, 20));
        camera.attachControl(canvas, true);
        return [camera];
    };

    e.target.init();
}
</script>
```
Here we are grabbing the reference to the stage, and overwriting the "setupCameras" method to create an ArcRotateCamera instead of the Universal one, there by default.
After modifying, we then can tell the component to run the initialization that it was waiting patiently for. The "init" method is on the component
itself, which we can grab a reference to by "e.target".

##### Applications
While putting your logic in a script tag is fine, an ES6 class based entry point for your 3D application might be more organized.
By default, a "BaseApplication" is provided. It can be extended as needed. The "BaseApplication" constructor probably doesn't need to be overriden.
It runs the setup required for the "Stage". Changing the constructor could put this setup at risk.

Instead, an "onReady" handler is available once Stage setup is finished. We'll start with the same method of the "customsetup" flag. We'll follow with adding the event listener,
creating a custom application based on "BaseApplication" and add some custom stuff, like a cube:

```sh
<babylon-scene customsetup></babylon-scene>

<script type="module">
    import BaseApplication from '../src/baseapplication.js';

    class App extends BaseApplication {
        onReady() {
            const Babylon = this.stage.babylon;
            const cube = Babylon.MeshBuilder.CreateBox("cube", {height: 4, width: 4, depth: 4}, this.stage.scene);
            cube.position.y = 1;
            cube.position.z = 5;
        }
    }

    const b = document.querySelector('babylon-scene');
    new App(b);
</script>
```

## Options

There are only a few core options/attributes for the component itself.

- customsetup (boolean) - if true, will stop setup prior to scene creation to allow the developer to inject custom logic
- onwaiting (event) - "waiting" event fires when "customsetup" is set to true to allow the developer to inject custom logic. Not especially usable as an attribute when using <babylon-scene> as an ES6 module
- onplaying (event) - "playing" event fires when the scene is fully setup and ready for adding logic and 3d objects. Not especially usable as an attribute when using <babylon-scene> as an ES6 module

Beyond that, all attributes on component (except "style" and "class") will be added to a "config" object and added to the Stage setup result which is accessible from the application.
This means that any attribute added to the component will make its way through to the Stage or custom Application. The default stage, does listen to a few attributes itself.
Keep in mind, if you override the Stage, these attributes may not work.

- useglobalbabylon - if true, the Babylon instance defined on window.BABYLON will be used. Any built version included on a script tag, like on a CDN (https://cdn.babylonjs.com/babylon.js) will put this in place
- showdebuglayer - if true will automatically load the Babylon.js inspector UI at start
- backgroundcolor - when set to a hex color (#ff0000 for red as an example), the Babylon.js background color will be set to this color
