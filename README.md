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

Documentation for **&lt;babylon-scene&gt;** can be found at
[https://bengfarrell.github.io/babylon-scene/docs](https://bengfarrell.github.io/babylon-scene/docs)
