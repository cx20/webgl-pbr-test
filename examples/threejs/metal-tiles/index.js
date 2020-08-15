// forked from cx20's "[WebGL] three.jsで PBR を試してみるテスト（その２）（調整中）" http://jsdo.it/cx20/ujl9
// forked from cx20's "[WebGL] three.jsで PBR を試してみるテスト（調整中）" http://jsdo.it/cx20/qCps
// forked from cx20's "[WebGL] three.js  のプリミティブ型を試してみるテスト" http://jsdo.it/cx20/OjZ8
// forked from cx20's "[WebGL] three.js を試してみるテスト（組み込み関数編）（その４）" http://jsdo.it/cx20/dutP
// forked from cx20's "[WebGL] three.js を試してみるテスト（組み込み関数編）（その３）" http://jsdo.it/cx20/kwGs
// forked from cx20's "[WebGL] three.js を試してみるテスト（組み込み関数編）（その２）" http://jsdo.it/cx20/d11S
// forked from cx20's "[WebGL] three.js を試してみるテスト（組み込み関数編）" http://jsdo.it/cx20/vvCa
// forked from cx20's "[WebGL] three.js を試してみるテスト（BufferGeometry編）" http://jsdo.it/cx20/yCyD
// forked from cx20's "[簡易版] 30行で WebGL を試してみるテスト" http://jsdo.it/cx20/oaQC

var container;
var camera, scene, renderer;
var meshSphere;

init();
animate();

function init() {
    container = document.getElementById('container');
    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 3;
    scene = new THREE.Scene();
    
    var hemispheric = new THREE.HemisphereLight( 0xffffff, 0x222222, 1.0 );
    scene.add(hemispheric);

    var ambient = new THREE.AmbientLight( 0xffffff, 0.3 );
    scene.add( ambient );

/*
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 1).normalize();
    scene.add( light );
*/
    var loader = new THREE.TextureLoader();
    loader.setCrossOrigin( 'anonymous' );
    var urlBase = "https://rawcdn.githack.com/cx20/jsdo-static-contents/2e26d2e3787eef8301ec72393978d3d835024a3c/";
/*
    // https://www.cgbookcase.com/textures/brick-wall-02
    var textureAO         = loader.load(urlBase + 'textures/Brick_wall_02_1K_AO.jpg');
    var textureBase_Color = loader.load(urlBase + 'textures/Brick_wall_02_1K_Base_Color.jpg');
    var textureHeight     = loader.load(urlBase + 'textures/Brick_wall_02_1K_Height.jpg');
    var textureNormal     = loader.load(urlBase + 'textures/Brick_wall_02_1K_Normal.jpg');
    var textureRoughness  = loader.load(urlBase + 'textures/Brick_wall_02_1K_Roughness.jpg');
*/
    // https://www.cgbookcase.com/textures/metal-tiles-03
    var textureAO         = loader.load(urlBase + 'textures/Metal_tiles_03_1K_AO.jpg');
    var textureBase_Color = loader.load(urlBase + 'textures/Metal_tiles_03_1K_Base_Color.jpg');
    var textureHeight     = loader.load(urlBase + 'textures/Metal_tiles_03_1K_Height.jpg');
    var textureMetallic   = loader.load(urlBase + 'textures/Metal_tiles_03_1K_Metallic.jpg');
    var textureNormal     = loader.load(urlBase + 'textures/Metal_tiles_03_1K_Normal.jpg');
    var textureRoughness  = loader.load(urlBase + 'textures/Metal_tiles_03_1K_Roughness.jpg');
    
    var envMap = getEnvMap();
    
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    //var geometry = new THREE.BoxGeometry(1, 1, 1, 256, 256, 256); // displacementMap を使用する場合 
    var material = new THREE.MeshStandardMaterial( {
      //color: 0xffffff,
      //aoMap: textureAO,
      map: textureBase_Color,
      bumpMap: textureHeight,
      //bumpMapScale: 0.5,
      //displacementMap: textureHeight,
      //displacementScale: 0.1,
      normalMap: textureNormal,
      normalScale: new THREE.Vector2(-1, -1),
      metalnessMap: textureMetallic,
      roughnessMap: textureRoughness,
      envMap: envMap
    } );
    
    scene.background = envMap;
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.userPan = false;
    controls.userPanSpeed = 0.0;
    controls.maxDistance = 5000.0;
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.autoRotate = true;     //true:自動回転する,false:自動回転しない
    controls.autoRotateSpeed = 2.0;    //自動回転する時の速度

}

// https://github.com/mrdoob/three.js/tree/dev/examples/textures/cube/skybox
function getEnvMap() {
    var path = 'https://rawcdn.githack.com/cx20/gltf-test/7c5f5eddf9e204d9bcbbc6ac06e610bc261fecc1/textures/cube/skybox/';
    var format = '.jpg';
    var urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
    ];
    var loader = new THREE.CubeTextureLoader();
    loader.setCrossOrigin( 'anonymous' );
    var envMap = loader.load( urls );
    envMap.format = THREE.RGBFormat;
    return envMap;
}


function animate() {
    requestAnimationFrame(animate);
    render();
}

var rad = 0.0;
function render() {
    rad += Math.PI * 1.0 / 180.0

    //meshSphere.rotation.y = rad;

    renderer.render(scene, camera);

    controls.update();
}
