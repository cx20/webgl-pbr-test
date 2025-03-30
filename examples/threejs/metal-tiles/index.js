var container;
var camera, scene, renderer;
var meshSphere;

// dat.gui
var gui;
var ROTATE = true;

init();
animate();

function init() {
    container = document.getElementById('container');
    gui = new dat.GUI();
    
    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 3;
    scene = new THREE.Scene();
    
    var loader = new THREE.TextureLoader();
    loader.setCrossOrigin( 'anonymous' );
    var urlBase = "../../../assets/textures/metal_tiles_03/";

    // https://www.cgbookcase.com/textures/metal-tiles-03
    var textureAO         = loader.load(urlBase + 'Metal_tiles_03_1K_AO.jpg');
    var textureBase_Color = loader.load(urlBase + 'Metal_tiles_03_1K_Base_Color.jpg');
    var textureHeight     = loader.load(urlBase + 'Metal_tiles_03_1K_Height.jpg');
    var textureMetallic   = loader.load(urlBase + 'Metal_tiles_03_1K_Metallic.jpg');
    //var textureNormal     = loader.load(urlBase + 'Metal_tiles_03_1K_Normal.jpg');
    var textureNormal     = loader.load(urlBase + 'Metal_tiles_03_1K_Normal_InvertY.jpg');
    var textureRoughness  = loader.load(urlBase + 'Metal_tiles_03_1K_Roughness.jpg');
    
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshStandardMaterial( {
      map: textureBase_Color,
      bumpMap: textureHeight,
      normalMap: textureNormal,
      normalScale: new THREE.Vector2(1, 1),
      metalnessMap: textureMetallic,
      roughnessMap: textureRoughness
    } );
    
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
    controls.autoRotate = ROTATE;     //true:自動回転する,false:自動回転しない
    controls.autoRotateSpeed = 2.0;    //自動回転する時の速度
    
    var guiRotate = gui.add(window, 'ROTATE').name('Rotate');
    guiRotate.onChange(function (value) {
        controls.autoRotate = value;
    });
    
    const hdrUrls = [
        'specular_right_0.hdr',
        'specular_left_0.hdr',
        'specular_top_0.hdr',
        'specular_bottom_0.hdr',
        'specular_front_0.hdr',
        'specular_back_0.hdr'
    ];
    hdrCubeMap = new THREE.HDRCubeTextureLoader()
        .setPath( 'https://rawcdn.githack.com/ux3d/glTF-Sample-Environments/4eace30f795fa77f6e059e3b31aa640c08a82133/papermill/specular/' )
        .setDataType( THREE.UnsignedByteType )
        .load( hdrUrls, function () {

            let pmremGenerator = new THREE.PMREMGenerator( renderer );
            pmremGenerator.compileCubemapShader();

            hdrCubeRenderTarget = pmremGenerator.fromCubemap( hdrCubeMap );

            hdrCubeMap.magFilter = THREE.LinearFilter;
            hdrCubeMap.needsUpdate = true;

            renderTarget = hdrCubeRenderTarget;
            cubeMap = hdrCubeMap;

            let newEnvMap = renderTarget ? renderTarget.texture : null;
            applyEnvMap(scene, newEnvMap);
        } );
}

function applyEnvMap(object, envMap) {
    object.traverse( function( node ) {
        if ( node.isMesh ) {
            let materials = Array.isArray( node.material ) ? node.material : [ node.material ];
            materials.forEach( function( material ) {
                // MeshBasicMaterial means that KHR_materials_unlit is set, so reflections are not needed.
                if ( 'envMap' in material && !material.isMeshBasicMaterial ) {
                    material.envMap = envMap;
                    material.needsUpdate = true;
                }
            } );
        }
    } );
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

var rad = 0.0;
function render() {
    rad += Math.PI * 1.0 / 180.0

    renderer.render(scene, camera);

    controls.update();
}
