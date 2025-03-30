
const createScene = function() {
    // Create a basic scene
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.2, 0.2, 0.3);

    // Add a camera
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 3, 10, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 5;
    camera.upperRadiusLimit = 20;

    //Light direction is up and left
    var movingLight = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0, 1, 0), scene);
    movingLight.intensity = 10;

    // ライトの位置を示す球体
    const lightSphere = BABYLON.MeshBuilder.CreateSphere("lightSphere", {diameter: 0.5}, scene);
    lightSphere.position = movingLight.position;
    
    const lightMaterial = new BABYLON.StandardMaterial("lightMaterial", scene);
    lightMaterial.emissiveColor = new BABYLON.Color3(1, 0.7, 0.3);
    lightSphere.material = lightMaterial;
    
    // Create a ground
    const ground = BABYLON.MeshBuilder.CreateGround("ground", {
        width: 10, 
        height: 10,
        subdivisions: 20
    }, scene);
    
    // Create PBR Material
    const pbr = new BABYLON.PBRMaterial("desertMaterial", scene);

    const urlBase = "../../../assets/textures/desert_ground/";

    // Load textures
    const baseTexture     = new BABYLON.Texture(urlBase + "desert_ground_1K_Base_Color.png", scene);
    const normalTexture   = new BABYLON.Texture(urlBase + "desert_ground_1K_Normal.png", scene);
    //const normalTexture   = new BABYLON.Texture(urlBase + "desert_ground_1K_Normal_InvertY.png", scene);
    const aoTexture       = new BABYLON.Texture(urlBase + "desert_ground_1K_AO.png", scene);
    const mrTexture       = new BABYLON.Texture(urlBase + "desert_ground_1K_MetallicRoughness.png", scene);
    const emissiveTexture = new BABYLON.Texture(urlBase + "desert_ground_1K_Emissive.png", scene);
    
    normalTexture.invertY = true;
    
    // Configure material
    pbr.albedoTexture = baseTexture;
    pbr.bumpTexture = normalTexture;
    pbr.ambientTexture = aoTexture;
    pbr.metallicTexture = mrTexture;
    pbr.useRoughnessFromMetallicTextureGreen = true;
    pbr.useMetallicFromMetallicTextureBlue = true;
    pbr.useAmbientOcclusionFromMetallicTextureRed = false;
    pbr.emissiveTexture = emissiveTexture;
    //pbr.emissiveIntensity = 1.0;
    
    // Enhance the normal map effect
    pbr.bumpTexture.level = 2.0;
    
    // Set texture scaling for tiling effect
    const textureScale = 5;
    baseTexture.uScale = textureScale;
    baseTexture.vScale = textureScale;
    normalTexture.uScale = textureScale;
    normalTexture.vScale = textureScale;
    aoTexture.uScale = textureScale;
    aoTexture.vScale = textureScale;
    mrTexture.uScale = textureScale;
    mrTexture.vScale = textureScale;
    emissiveTexture.uScale = textureScale;
    emissiveTexture.vScale = textureScale;
    
    // Assign material to ground
    ground.material = pbr;
    
    // Add environment for reflections
    const envTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("https://assets.babylonjs.com/environments/environmentSpecular.env", scene);
    scene.environmentTexture = envTexture;
    
    // Optional: Add some slight movement to simulate heat waves
    scene.registerBeforeRender(function() {
        const time = performance.now() * 0.0005;
        pbr.emissiveIntensity = 0.5 + Math.sin(time) * 0.1;
    });
    
    scene.debugLayer.show()

    // ライトを動かすアニメーション
    scene.registerBeforeRender(function() {
        const time = performance.now() * 0.001;
        movingLight.position.x = 3 * Math.cos(time);
        movingLight.position.z = 3 * Math.sin(time);
    });

    scene.registerBeforeRender(function() {
        lightSphere.position = movingLight.position;
    });
    
    return scene;
};

var canvas = document.querySelector("#renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
engine.enableOfflineSupport = false; // Suppress manifest reference
var scene = createScene(engine);

engine.runRenderLoop(function () {
    scene.render();
});

window.addEventListener('resize', function(){
    engine.resize();
});