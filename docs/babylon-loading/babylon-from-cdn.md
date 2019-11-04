# Babylon.js from a CDN

```html
<html>
<head>
    <title>Using Babylon from CDN</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babylonjs/4.0.3/babylon.js"></script>
    <script src="../babylon-scene/babylonscene.nobabylon.js"></script>


    <style>
        babylon-scene {
            width: 300px;
            height: 300px;
        }
    </style>

    <script>
        function onScene(stage) {
            const scene = stage.scene;
            const Babylon = stage.babylon;
            const cube = Babylon.MeshBuilder.CreateBox("box", {size: 5}, scene);
            cube.position.y = 1;
            cube.position.z = 5;
        }
    </script>
</head>
<body>

<babylon-scene onplaying="onScene(event.detail)"></babylon-scene>
</body>
</html>
```

[demo](babylon-from-cdn.html ':include :type=iframe width=100% height=400px')
