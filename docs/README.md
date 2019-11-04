> Babylon-Scene is a Web Component to easily create a [Babylon.js](https://www.babylonjs.com/) scene simply by dropping the **&lt;babylon-scene&gt;** tag along with a single script dependency onto your page. Custom application logic can be used by
providing **&lt;babylon-scene&gt;** with paths to ES6 modules. None of the documentation here will provide anything exciting. It will only take you as far
as creating a scene and adding a cube with simple mouse interaction to navigate the camera. It will be up to you to add better content, and [Babylon.js's documentation](https://doc.babylonjs.com/)
will be the ultimate reference for doing so.

```html
<babylon-scene
    app="my-application.js"
    stage="lights-cameras-etc-setup.js">
</babylon-scene>
```

> The "app" attribute is used to define an [application class](?id=custom-application-classes) to add content and orchestrate interaction in your scene.

> The "stage" attribute is used to override the [default initial scene setup](?id=the-stage-lights-cameras-etc) which includes lights, cameras, 3D engine, etc.

# Component Attributes

There are only a few core options/attributes for the component itself. The following three are used for customizing the application
when **not** using ES6 modules as explained in [Adding Content](?id=adding-content) and [Stage Customization](?id=customizing):

- **customsetup (boolean)** - if true, will stop setup prior to scene creation to allow the consumer to inject custom logic
- **onwaiting (event)** - "waiting" event fires when "customsetup" is set to true to allow the consumer to inject custom logic.
- **onplaying (event)** - "playing" event fires when the scene is fully setup and ready for adding logic and 3d objects.

Alternately, the "app" and "stage" attributes are the recommended way to customize your 3D application as explained in [Custom Application Classes](?id=custom-application-classes) and [ES6 Module Based Stage](?id=es6-module-based-stage):

- **app (string)** - path to application class module (relative to your HTML file)
- **stage (string)** - path to stage setup module (relative to your HTML file)

Beyond that, all attributes on the component (except "style" and "class") will be added to a "config" object and added to the [Stage](?id=the-stage-lights-cameras-etc) setup result which is accessible from the [application](?id=custom-application-classes).
This means that any attribute added to the component will make its way through to the **Stage** or custom application. The default **Stage**, does listen to a few attributes itself.
Keep in mind, if you override the **Stage**, these attributes may not work as they are part of the default setup code.

- **showdebuglayer** (in setupScene method) - if true will automatically load the Babylon.js inspector UI at start
- **backgroundcolor** (in setupScene method) - when set to a hex color (#ff0000 for red as an example), the Babylon.js background color will be set to this color
- **useglobalbabylon** (in setupBabylon method) - if true or not set, the Babylon instance defined on window.BABYLON (if found) will be used. Any built version included on a script tag, like from a CDN (https://cdn.babylonjs.com/babylon.js) will put this in place

The [BaseApplication](https://github.com/bengfarrell/babylon-scene/blob/master/src/baseapplication.js) class allows one attribute right now. As with the **Stage** level attributes, if another Application module is used that does not
extend the BaseApplication provided by this component, this attribute will not work

- **addons** - An optional comma separated list of addons to automatically use in your application. See [add-ons](?id=add-ons) for more details


# Core Concepts

The **&lt;babylon-scene&gt;** component is designed to be used as an ES6 module, where you provide your own modules on top to define
custom application behavior and custom scene setup.

However, as the ES6 module method is a bit more complex and requires extra files and even a special development server depending on how you load Babylon.js,
you'll first be introduced to some of the core concepts used with normal JS on a simple HTML page.


## Creating an Empty Scene
While the ways to use **&lt;babylon-scene&gt;** and automatically get a 3D scene created are listed here,
this section is *not* going to help you to add content to the scene. Essentially you'll be left with something
that simply looks like a square, blue canvas. See the section on [adding content](?id=adding-content) to continue once your
scene is created through these methods.

### Bundled Babylon.js

By far, the easiest way to get up and running is with the [Rollup](https://rollupjs.org/) bundled **&lt;babylon-scene&gt;** component.
The **babylonscene.full.js** file contains both the component that you may add to your page, as well as the full
Babylon.js library. Once you've included the **&lt;babylon-scene&gt;** component and script tag on your page, you
should be good to go and ready to add content.

```html
<script src="babylonscene.full.js"></script>
<babylon-scene></babylon-scene>
```

### BYOB (Bring your own Babylon)

Though it's very convenient to use the built-in Babylon.js library, there are a couple of reasons why you might not want
to do this. Bringing your own lets you switch between different versions easily if you need to use a preview version,
or even an older version. Secondly, **&lt;babylon-scene&gt;** might have a slightly outdated version for a short time as new versions
of Babylon.js are released.

```html
<script src="../babylonscene.nobabylon.js"></script>
<script src="https://cdn.babylonjs.com/babylon.js"></script>
<babylon-scene></babylon-scene>
```

### As an ES6 Module

The **&lt;babylon-scene&gt;** component can (and probably should) be consumed as an ES6 module. Below demonstrates this, but does
not consume the actual Babylon.js library as an ES6 module. That requires a bit more explanation which can be found [here](?id=babylon-as-es6).

```html
<script type="module" src="path/to/babylonscene/babylonscene.js"></script>
<script src="https://cdn.babylonjs.com/babylon.js"></script>
<babylon-scene></babylon-scene>
```

### Sizing and Positioning
The **&lt;babylon-scene&gt;** component can be sized and positioned like any other element. The component is
displayed as "inline-block".

```html
    <style>
        babylon-scene {
            width: 300px;
            height: 300px;
        }
        <babylon-scene></babylon-scene>
    </style>
```

## Adding Content

After creating an empty scene as above, you'll be left with a blank canvas with a solid blue colored background.
Not very exciting, but that just means you're ready to add content!

### Listen for Scene Playing

After **&lt;babylon-scene&gt;** is set up, a **playing** event is dispatched. This provides you with an opportunity
to add your own objects to the scene. The *ready* event can be listened to via JS or as an attribute.

```js
document.getQuerySelect('babylon-scene).addEventListener('ready', myFunction(event));
```

```html
<babylon-scene> onplaying="myFunction(event)"></babylon-scene>
```

Your function might create a cube and position it - looking something like the following:

```js
function myFunction(e) {
    const scene = e.detail.scene;
    const Babylon = e.detail.babylon;
    const cube = Babylon.MeshBuilder.CreateBox("cube", {height: 4, width: 4, depth: 4},);
    cube.position.y = 1;
    cube.position.z = 5;
}
```

> Note that in the above example, Babylon.js could be used globally, and if so usage could be through the
global **BABYLON** object. In this case, you would not have to get a Babylon reference at all, simply creating the
cube via **BABYLON.Meshbuilder**. That said, getting the Babylon reference from the event details works in all [loading scenarios](?id=loading-babylonjs).

[demo](/adding-content/adding-content)

### ES6 Module Based Application

The recommended way to add content and application logic is to create a class based module. Instead of waiting for
a **playing** event and using the **customsetup** attribute , you would assign your application directly to the **&lt;babylon-scene&gt;** tag.

```html
<babylon-scene
    app="my-application.js">
</babylon-scene>
```

Using the **app** attribute is documented extensively [here](?id=custom-application-classes).

[Demo](adding-content/adding-content-es6-modules)

## The Stage (Lights, Cameras, etc)

The **Stage** is not a Babylon.js concept, but instead invented for this project to create a clear separation of the **&lt;babylon-scene&gt;** component,
3D application logic, and scene/engine setup (the **stage**). Think of a 3D application like a theater or studio set.
3D meshes and objects are like the actors and props. Your custom application is much like the written script that tells
the actors what to do and say. What's missing is the stage where all of this takes place. While a theatrical stage and the **stage**
here holds common things like lights and cameras, the **&lt;babylon-scene&gt;** **stage** also holds some Babylon.js specific things. Everything contained
in the **&lt;babylon-scene&gt;** **stage** is as follows:

* **Lights** - Setus up one or many lights (a hemispheric light at x: 0, y: 1, z: -1 and intensity of 0.7 by default)

* **Cameras** - Sets up one or many cameras (a universal camera with mouse and keyboard controls at x: 0, y: 0, x: -10, pointing at x: 0, y: 0, z: 0 by default)

* **Scene** - Sets up the Babylon.js scene. By default, scene setup looks for two configuration attributes: **backgroundcolor** and
**showdebuglayer** which allows the 3D background color to be set and shows Babylons scene inspector. The **backgroundcolor** attribute
uses hex color format (ex: #RRGGBB), while **showdebuglayer** doesn't need to be set to a value...just present.

```html
    <babylon-scene
            backgroundcolor="#ff44aa"
            showdebuglayer>
    </babylon-scene>
```

* **Engine** - Sets up the Babylon.js engine

* **Babylon** - Finds Babylon.js for use in the rest of the stage setup and application

* **WebXR** - Coming Soon!

While defaults are great for getting started and playing around, you'll likely want to customize your **stage**
really quickly after adding content. As with adding custom content, there is a quick and easy way to customize the
**stage** covered here, but the recommended way is to use ES6 modules as covered [here](?id=es6-module-based-stage).

### Customizing

To get started, you'll need to make the **&lt;babylon-scene&gt;** component pause during setup for you to
inject your own logic and take over any **stage** setup elements you prefer. To allow this pause, set the **customsetup**
attribute on the component. Second, just as a **playing** event is used to listen for when the scene is ready and add custom content, we need to be notified
when the component is ready, but before the Babylon.js scene is created. Here is where we can customize the **stage**. This is accomplished by listening to the "waiting" event.

```html
<babylon-scene customsetup></babylon-scene>
<script>
    document.getQuerySelect('babylon-scene).addEventListener('waiting', myFunction(event));
</script>
```

```html
<babylon-scene customsetup onwaiting="myFunction(event)"></babylon-scene>
```

Let's say for example that we wanted to change the camera to an arc rotate camera, rather than one that moves
freely in any direction. Our custom function could look like the following:

```js
function myFunction(e) {
    e.detail.stage.setupCameras = function (stage) {
        const Babylon = stage.babylon;
        const scene = stage.scene;
        const canvas = stage.canvas;
        const camera = new Babylon.ArcRotateCamera("Camera", 0, 0, 10, new Babylon.Vector3(0, 0, 0), scene);
        camera.setPosition(new Babylon.Vector3(0, 0, 20));
        camera.attachControl(canvas, true);
        return [camera];
    };

    // resume setup from the paused state by calling **init**
    e.target.init();
}
```

[Demo](adding-content/adding-content)

Two things to note here. The first is that the camera is returned in an array here, as there may be multiple cameras.
Secondly, is to resume the setup after overriding the **stage** so that the custom setup finishes. Calling **init** on the
component takes care of this.

Keep in mind that everything set up in the **stage** is all normal Babylon.js code. Additionally, if there is anything
else that should be set up in the **stage**, the setup function can be overriden to do more.

All of the defaults can be found in the [defaultstage.js](/adding-content/defaultstage.md) module.



### ES6 Module based Stage

The best way to customize the **Stage** is to use an ES6 module which can override one or many setup methods like the lights or cameras.

Using a custom **Stage** module is easy. Simply set the **stage** attribute of the **&lt;babylon-scene&gt;** component to
the file path of your custom **Stage** module (relative to the HTML page). You'll likely want to customize the **stage** in combination
with a [custom application](?id=custom-application-classes).

```html
<babylon-scene
    app="sample-app.js"
    stage="custom-stage.js">
</babylon-scene>
```

Authoring the module, simply requires importing the **DefaultStage** and then overriding, as in this example where
the cameras and lights are overriden:

```js
import {DefaultStage} from '../babylon-scene/babylonscene.js';

DefaultStage.setupLights = function(stage) {
    const Babylon = stage.babylon;
    const light = new Babylon.HemisphericLight('light', new Babylon.Vector3(0, 1, -1), stage.scene);
    light.intensity = 0.1;
    return [light];
};

DefaultStage.setupCameras = function(stage) {
    const Babylon = stage.babylon;
    const camera = new Babylon.ArcRotateCamera("Camera", 0, 0, 10, new Babylon.Vector3(0, 0, -10), stage.scene);
    camera.setTarget(Babylon.Vector3.Zero());
    camera.attachControl(stage.canvas, true);
    return [camera];
};

export DefaultStage;
```

[Demo](adding-content/adding-content-es6-modules)

> To consume your **stage** class, the "stage" attribute is internally modified with a URL resolver to ensure
it is relative to your page. Without this, it would be relative to the component source, likely inside the
node_modules folder where its installed. If there is a use-case where the current behavior using the resolver
is not desirable, feedback is encouraged



# Loading Babylon.js

In addition to this component not always keeping up and including the latest Babylon.js, **&lt;babylon-scene&gt;** consumers
may want to try older versions, preview versions, etc. That's why despite including a full copy of Babylon for you to use, especially when
playing with Babylon.js, it's important to be able to bring your own Babylon library easily.

## Built-in Babylon
The **&lt;babylon-scene&gt;** component is packaged up two different ways (as well as being consumable as a pure ES6 module). Including the
**babylonscene.full.js** bundle on your page will load the **&lt;babylon-scene&gt;** component as well as the entire Babylon.js library.

> As the attribute "useglobalbabylon" is NOT specified, the presence of Babylon is detected by inspecting window.BABYLON. As it is present, the bundled Babylon.js instance is used.

```html
<script src="babylonscene.full.js"></script>
<babylon-scene></babylon-scene>
```

[Built-in Babylon Example](/babylon-loading/builtin-babylon)

## Babylon from a CDN

The best way to use the **&lt;babylon-scene&gt;** component is without Babylon.js built in. Though, there are some extra
steps, you have the freedom to use any version of Babylon.js from any source you choose. For example, Babylon could be
loaded from a CDN. Of course, it doesn't need to be from a CDN, it could just be a copy of Babylon
that you downloaded locally. Because you're bringing Babylon.js yourself, using the **babylonscene.nobabylon.js**
bundle is best here (otherwise you'd load Babylon twice over). Better yet, import **&lt;babylon-scene&gt;** as a (non-bundled)
ES6 module as described [here](?id=as-an-es6-module).

> As the attribute "useglobalbabylon" is NOT specified, the presence of Babylon is detected by inspecting window.BABYLON. As it is present when loading Babylon from a normal script tag, the loaded and global Babylon.js instance is used.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/babylonjs/4.0.3/babylon.js"></script>
<script src="../../babylonscene.nobabylon.js"></script>
<babylon-scene></babylon-scene>
```

[Babylon from a CDN example](/babylon-loading/babylon-from-cdn)


## Babylon as ES6

Babylon.js offers loading via [ES6 import modules](https://doc.babylonjs.com/features/es6_support). This is the most complex of the loading options, but allows importing
Babylon directly in your JS file. Additionally, loading via ES6 modules allow importing only exactly which pieces you need
(although not with "legacy", explained in a bit, as this imports everything at once). Instead of using the Node.js standard Babylon install, we're using "@babylonjs/core".

Given that ES6 imports are for Javascript modules, using Babylon.js in this way is not done through the component tag, but instead
the custom application class you'd be using. More on custom applications [here](?id=custom-application-classes).

These custom applications have a static Babylon getter as part of the class that you may override and provide the Babylon library.

Please note, as Babylon.js uses "bare module imports", a plain HTTP server will not be able to accommodate running Babylon.js this way.
Instead, <a href="https://open-wc.org/developing/es-dev-server.html">Open WC's ES Dev Server</a> is a great solution.
Alternately, the non-ES6 Babylon can be wrapped as an ES6 module by <a href="https://www.pika.dev/">Pika</a>. With that, a plain
HTTP server will work, and only the import needs to change to the Pika generated import.

### Legacy Mode

Legacy mode is Babylon's way of importing everything offered in one import statement. This is by far the easiest way to go,
but not really in the spirit of importing only exactly what you need. Nevertheless, an import could look like the following:

```javascript
    import BaseApplication from '../../src/baseapplication.js';
    import * as Babylon from '@babylonjs/core/Legacy/legacy';

    export default class extends BaseApplication {
        static get Babylon() { return Babylon; }
```

Because it's legacy and imports everything, Babylon.js is still added to the window.BABYLON variable.
Therefore, to turn off the auto-detection behavior and use this legacy ES6 module as it is imported, we explicitly set useglobalbabylon="false".

```html
<babylon-scene
    app="app-legacy-babylon.js"
    useglobalbabylon="false">
</babylon-scene>
```

[ES6 Babylon Module (legacy) Example](/babylon-loading/es6-babylon-module-legacy)


### Babylon Core

Importing each module separately is the most precise way to go, and also the most verbose. Like "legacy", your
application can provide a static getter method to provide Babylon. However, given that Babylon is broken up
into many ES6 imports, you'll need to feed the stage setup exactly what is needed. With the "defaultstage.js" module
provided as is, using the Universal Camera and Hemispheric Light, the "Engine", "Scene", "Vector3", "Color3" (if backgroundcolor is set), "UniversalCamera",
and "HemisphericLight" must be provided and wrapped up in and object. If this stage setup is customized in any way,
the appropriate modules will need to be imported and wrapped up in a similar fashion.

```javascript
import BaseApplication from '../../src/baseapplication.js';
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3, Color3 } from "@babylonjs/core/Maths/math";
import { UniversalCamera } from "@babylonjs/core/Cameras/UniversalCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder.js";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";

export default class extends BaseApplication {
    static get Babylon() {
        return {
            Engine: Engine,
            Scene: Scene,
            UniversalCamera: UniversalCamera,
            Vector3: Vector3,
            Color3: Color3,
            HemisphericLight: HemisphericLight
        };
    }

    onReady() {
        const Babylon = this.stage.babylon;
        const cube = MeshBuilder.CreateBox("cube", {height: 4, width: 4, depth: 4}, this.stage.scene);
        cube.position.y = 1;
        cube.position.z = 5;
    }
}
```

# Custom Application Classes

Importing a custom application class which extends **&lt;babylon-scene&gt;**'s internal default application is
the recommended approach for using this project.

Attaching your custom application (must be an ES6 class module) to **&lt;babylon-scene&gt;** is easy. Simply
set the "app" attribute of the tag to path of your application module. If using a relative path,
it will be relative to your HTML page.

```html
<script src="../../babylonscene.full.js"></script>
<babylon-scene app="path/to/my/app.js"></babylon-scene>
```

To make things easy here, the above snippet is using the bundle which includes **&lt;babylon-scene&gt;** and the
full Babylon library. However, it is reccommended to go all in on ES6 modules with both the component and
Babylon, as outlined in [Babylon as ES6](?id=babylon-as-es6).

> To consume your application class, the "app" attribute is internally modified with a URL resolver to ensure
it is relative to your page. Without this, it would be relative to the component source, likely inside the
node_modules folder where its installed. If there is a use-case where the current behavior using the resolver
is not desirable, feedback is encouraged

To actually create your custom application, simply create an ES6 class module that inherits from the "BaseApplication"
class module which is included with **&lt;babylon-scene&gt;**. Be sure to export your class as the "default" module:

```js
import BaseApplication from '../../src/baseapplication.js';

export default class extends BaseApplication {
    ...
}
```

> Note that extending **BaseApplication** is not *stricty* necessary, however, this would require your class to
handle *all* of the Babylon scene setup performed in the constructor. If you *do* chose to go this route, all of the
configuration options used by **BaseApplication** is passed to the constructor with a single parameter.

## Application Lifecycle

By extending **BaseApplication**, your custom Babylon application has a few methods you can use. Each of these empty
methods can be overriden for your 3D application.

* **onReady()** - Called when the Babylon scene is setup and ready to go. You are free to start adding application
logic here

* **onResize()** - Called when the browser window resizes causing the Babylon canvas to resize. You may want to take
action here if your application needs something to happen on resize

* **onRender(deltatime)** - Called each render frame. Game engines like Unity have the same type of method to override
and do custom logic like updating objects in your scene over time for interactivity and animation. The **deltatime** parameter is time
in milliseconds since the last **onRender** was called.

* **constructor(o)** - As **BaseApplication** is extended by your custom application, you'll need to call **super()**. The
constructor is a good place to hold initialization logic (if needed) that isn't related to scene setup. The **o** parameter
holds a reference to the **&lt;babylon-scene&gt;** component, of which **o.stage** and **o.config** properties can be
referenced, which hold the stage (scene/lights/cameras/etc) and configuration properties (including any and all attributes set).

* **static get Babylon()** - this static getter allows you to provide your own Babylon library, or collection of relevant ES6
modules if using Babylon.js [ES6 import modules](https://doc.babylonjs.com/features/es6_support). For more information on loading Babylon.js
see [Loading Babylon](?id=loading-babylonjs).

## Methods

* **addEventListener(eventtyype, callback)** - Add an event listener to an instance of your custom application. The **eventtype** parameter
is expected to be a string. The callback parameter is a function to be called when the event is triggered. Calling this method
returns a reference to the listener so that it can be cleaned up.

* **removeEventListener(listener)** - Remove a listener returned when using **addEventListener**.

* **triggerEvent(customevent)** - Trigger an event internally in the component that can be listened to elsewhere via **addEventListener**.
The **customevent** parameter should take the form of a [Custom Event](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent)

## Properties

* **this.stage** - Accesses the **stage** object which contains the scene, engine, lights, cameras, etc. For more details including
how to customize the stage, see [Customizing the Stage](?id=customizing)

* **this.config** - Accesses the **config** object which contains any attributes on the component tag, including user-defined
ones not supported by this project. The **config** object additionally holds the **stage** object as well as **babylonComponent**
which holds a reference to the component

## Events

Events are dispatched from the component and triggered by the application as [Custom Events](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent).

* **playing** - Triggered/dispatched by both the component and the application when the Babylon.js scene is set up, and content
is ready to be added. Event **details** object includes **canvas**, **stage**, **app**, and **config** references. To add a listener
from the component tag itself, **onplaying** can be used.

* **waiting** - Dispatched by the component only when the **customsetup** attribute is used. Event occurs before **stage** setup, giving an opportunity to override
any **stage** or **app** behavior with the callback. Event **details** object includes **canvas**, **stage**, and **config** references. To add a listener
from the component tag itself, **onwaiting** can be used.

```html
    <babylon-scene
            customsetup
            onwaiting="myFunction(event)"
            onplaying="myFunction(event)">
    </babylon-scene>
```

To use the **waiting** event to create custom **stage** and **app** logic, the **customsetup**
attribute must be used. Please see [Customizing the Stage](?id=customizing) to learn more

> Note that while using the above method to provide custom **stage** and **app** logic is quick and easy, the preferred
way for using this component is use ES6 modules. See [ES6 Module Based Stage](?id=es6-module-based-stage) and the top of this section on [Custom Application Classes](?id=custom-application-classes) to learn more

## Add-ons

Add-ons provide mix-in style functionality to your application (added in the BaseApplication). Currently, there is just one add-on.

Add-ons can be set up one of two ways. First is using the 'addon' attribute on the **&lt;babylon-scene&gt;** component:

```html
<babylon-scene
        addons="pointer"
        app="myapp.js">
</babylon-scene>
```

In this case, the add-ons attribute are a comma separated list of **&lt;babylon-scene&gt;** add-on names (currently, only "pointer") and/or
custom created ES6 module based add-ons.

Add-ons can also be set up in the ES6 class based application extended from **BaseApplication**.

```js
import {BaseApplication, AddOns} from 'babylonscene.js';

export default class extends BaseApplication {
    onReady() {
        AddOns.pointer.add(this);
```


### Pointer add-on
Adds **onPointer** and **onMeshPointer** handlers to your application.

- **onPointer(pointerInfo)** provides a general purpose handler to accept pointer (touch/mouse) input. A Bablyon.js [pointerInfo](https://doc.babylonjs.com/api/classes/babylon.pointerinfo)
object is passed as the first and only parameter to the handler which provides the type of pointer event in addition to plenty of other pointer related info.

- **onMeshPointer(pick, pointerInfo)** is only called when the the pointer event fires when hovered or clicking on a 3D object in your scene. The first parameter is a Babylon.js [pickInfo](https://doc.babylonjs.com/api/classes/babylon.pickinginfo) object
and the second parameter is a Bablyon.js [pointerInfo](https://doc.babylonjs.com/api/classes/babylon.pointerinfo) object.

[Pointer Add-on Example](/addons/pointerinput)
