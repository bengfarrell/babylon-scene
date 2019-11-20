# WebXR (but really WebVR right now)

```html
<html>
<head>
    <title>Babylon in a VR Headset</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babylonjs/4.1.0-alpha.23/babylon.js"></script>
        <script src="../babylon-scene/babylonscene.nobabylon.js"></script>
    
        <style>
            body {
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
            }
    
            babylon-scene {
                width: 100%;
                height: 100vh;
            }
        </style>
    
        <script>
            function onScene(e) {
                const scene = e.detail.scene;
                const Babylon = e.detail.babylon;
                const cube = Babylon.MeshBuilder.CreateBox("box", {size: 5}, scene);
                cube.position.y = 1;
                cube.position.z = 5;
    
                e.detail.application.onControllerInteraction = function(eventtype, pick, button, controller) {
                    console.log(eventtype, pick, button, controller)
                };
            }
        </script>
    </head>
    <body>
    
    <babylon-scene
            usewebxr
            addons="xrcontrollers"
            onplaying="onScene(event)">
    </babylon-scene>
    </body>
    </html>
```

> WARNING: This WebXR feature is experimental. So experimental, in fact, that we're still using
the WebVR spec with WebXR coming soon.

[demo](webxr.html ':include :type=iframe width=100% height=500px')
