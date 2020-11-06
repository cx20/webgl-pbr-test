var plane;
var cube;
var sphere;
var circle;
var cylinder;
var cone;
var knot;
var torus;
var octa;

var createScene = function(engine) {
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera("camera", 0, 1, 5, BABYLON.Vector3.Zero(), scene);
    camera.setPosition( new BABYLON.Vector3(0, 0, -6.5) );
    camera.attachControl(canvas, false, false);
    scene.activeCamera = camera;
    scene.clearColor = new BABYLON.Color3(0, 0, 0);

    var light0 = new BABYLON.DirectionalLight("Dir0", new BABYLON.Vector3(0, 0, 1), scene);
    light0.diffuse = new BABYLON.Color3(1, 1, 1);
    light0.specular = new BABYLON.Color3(1, 1, 1);

    for(var r = 0.0; r <= 1.0; r += 0.25) {
        for(var m = 0.0; m <= 1.0; m += 0.25) {
            // CreateSphere(name, {segments:24.0, diameter:1.0}, scene, updatable, sideOrientation)
            sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {segments:24.0, diameter:1.0}, scene);
            sphere.position = new BABYLON.Vector3((r-0.5)*4, (m-0.5)*4, 0); 
            
            var pbr = new BABYLON.PBRMaterial("pbr", scene);
            pbr.albedoColor = new BABYLON.Color3(1.0, 1.0, 1.0);
            
            pbr.metallic = m;
            pbr.roughness = r;

            sphere.material = pbr;
        }
    }

    return scene;
}

var canvas = document.querySelector("#renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
var scene = createScene(engine);

var rad = 0.0;
engine.runRenderLoop(function () {
    rad += Math.PI * 1.0 / 180.0;

    //sphere.rotation.y = rad;

    scene.render();
});

window.addEventListener('resize', function(){
    engine.resize();
});