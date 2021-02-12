let width = window.innerWidth;
let height = window.innerHeight;
// setup GLBoost renderer
var canvas = document.getElementById("world");
var glBoostContext = new GLBoost.GLBoostMiddleContext(canvas);

var renderer = glBoostContext.createRenderer({
  clearColor: {
    red: 0.0,
    green: 0.0,
    blue: 0.0,
    alpha: 1
  }
});
renderer.resize(width, height);

// make a scene
var scene = glBoostContext.createScene();

var geometryCube = glBoostContext.createCube(new GLBoost.Vector3(3, 3, 3), new GLBoost.Vector4(1, 1, 1, 1));

// setup material
var material = glBoostContext.createPBRMetallicRoughnessMaterial();
material.shaderClass = GLBoost.PBRPrincipledShader;
// https://www.cgbookcase.com/textures/brick-wall-02
var urlBase = "https://rawcdn.githack.com/cx20/jsdo-static-contents/8cd7501598ce19e07fb3028b0d8ba4a29299c17a/";
var texture          = glBoostContext.createTexture(urlBase + 'textures/Brick_wall_02_1K_Base_Color.jpg');
var textureAO        = glBoostContext.createTexture(urlBase + 'textures/Brick_wall_02_1K_AO.jpg');
var textureNormal    = glBoostContext.createTexture(urlBase + 'textures/Brick_wall_02_1K_Normal.jpg');
//var textureNormal    = glBoostContext.createTexture(urlBase + 'textures/Brick_wall_02_1K_Normal_InvertY.jpg');
//var textureRoughness = glBoostContext.createTexture(urlBase + 'textures/Brick_wall_02_1K_Roughness.jpg');
var textureORM = glBoostContext.createTexture(urlBase + 'textures/Brick_wall_02_1K_ORM.jpg');
material.setTexture(texture);
material.setTexture(textureAO, GLBoost.TEXTURE_PURPOSE_OCCLUSION);
material.setTexture(textureNormal, GLBoost.TEXTURE_PURPOSE_NORMAL);
material.setTexture(textureORM, GLBoost.TEXTURE_PURPOSE_METALLIC_ROUGHNESS);

var meshCube = glBoostContext.createMesh(geometryCube, material);

scene.addChild(meshCube);

let pointLight = glBoostContext.createPointLight(new GLBoost.Vector3(1.0, 1.0, 1.0));
pointLight.translate = new GLBoost.Vector3(10, 10, 10);
scene.addChild(pointLight);

var directionalLight = glBoostContext.createDirectionalLight(new GLBoost.Vector3(1, 1, 1), new GLBoost.Vector3(90, 0, 0));
scene.addChild( directionalLight );

var camera = glBoostContext.createPerspectiveCamera({
  eye: new GLBoost.Vector3(0.0, 0.0, 2.7),
  center: new GLBoost.Vector3(0.0, 0.0, 0.0),
  up: new GLBoost.Vector3(0.0, 1.0, 0.0)
}, {
  fovy: 45.0,
  aspect: width/height,
  zNear: 0.1,
  zFar: 1000.0
});
camera.cameraController = glBoostContext.createCameraController();
scene.addChild(camera);

var expression = glBoostContext.createExpressionAndRenderPasses(1);
expression.renderPasses[0].scene = scene;
expression.prepareToRender();

var angle = 0;
var axis = new GLBoost.Vector3(0,1,0);

var render = function() {
  renderer.clearCanvas();
  renderer.draw(expression);

  meshCube.quaternion = GLBoost.Quaternion.axisAngle(axis, GLBoost.MathUtil.radianToDegree(angle));

  angle += 0.005;
    
  requestAnimationFrame(render);
};

render();