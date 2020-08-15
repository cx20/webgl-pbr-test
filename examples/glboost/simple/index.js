
// forked from cx20's "[WebGL] GLBoost のプリミティブ型を試してみるテスト" http://jsdo.it/cx20/MaoR
// forked from cx20's "[WebGL] GLBoost を試してみるテスト（組み込み関数編）（その４）" http://jsdo.it/cx20/yy3I
// forked from cx20's "[WebGL] GLBoost を試してみるテスト（組み込み関数編）（その３）（仮）" http://jsdo.it/cx20/WlZW
// forked from cx20's "[WebGL] GLBoost を試してみるテスト（組み込み関数編）（その２）（仮）" http://jsdo.it/cx20/8PA0
// forked from cx20's "[WebGL] GLBoost を試してみるテスト（組み込み関数編）（仮）" http://jsdo.it/cx20/g9yj
// forked from cx20's "[WebGL] GLBoost を試してみるテスト（standalone編）" http://jsdo.it/cx20/KXXM
// forked from cx20's "[WebGL] GLBoost を試してみるテスト（phina.js編）" http://jsdo.it/cx20/SmrF
// forked from cx20's "[WebGL] GLBoost を試してみるテスト" http://jsdo.it/cx20/SWec
// forked from cx20's "[簡易版] 30行で WebGL を試してみるテスト" http://jsdo.it/cx20/oaQC

let width = window.innerWidth;
let height = window.innerHeight;
// setup GLBoost renderer
let canvas = document.getElementById("world");
let glBoostContext = new GLBoost.GLBoostMiddleContext(canvas);

let renderer = glBoostContext.createRenderer({
  clearColor: {
    red: 0.0,
    green: 0.0,
    blue: 0.0,
    alpha: 1
  }
});
renderer.resize(width, height);

// make a scene
let scene = glBoostContext.createScene();

// createSphere(radius, widthSegments, heightSegments, vertexColor)
let geometrySphere = glBoostContext.createSphere(0.5, 24, 24, null);


// ・縦軸
//   [Metal]
//      ↑
//      ↓
//   [Non-metal]
// 
// ・横軸
//   [Smooth]←→[Rough]
//
for(let r = 0.0; r <= 1.0; r += 0.25) {
    for(let m = 0.0; m <= 1.0; m += 0.25) {
        // setup material
        let material = glBoostContext.createPBRMetallicRoughnessMaterial();
        //let texture = glBoostContext.createTexture('http://jsrun.it/assets/U/L/K/7/ULK7v.jpg');
        //material.setTexture(texture);
        material.baseColor = new GLBoost.Vector3(1.0, 1.0, 1.0);
        material.metallic = m;
        material.roughness = r;
        
        let meshSphere = glBoostContext.createMesh(geometrySphere, material);
        meshSphere.translate = new GLBoost.Vector3((r-0.5)*4, (m-0.5)*4, 0);
        
        scene.addChild(meshSphere);
    }
}


//let directionalLight = glBoostContext.createDirectionalLight(new GLBoost.Vector3(1, 1, 1), new GLBoost.Vector3(0, 0, -1));
let directionalLight = glBoostContext.createDirectionalLight(new GLBoost.Vector3(1, 1, 1), new GLBoost.Vector3(90, 0, 0));
//directionalLight.rotate = new GLBoost.Vector3(90,0,0);
scene.addChild( directionalLight );

let camera = glBoostContext.createPerspectiveCamera({
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

let expression = glBoostContext.createExpressionAndRenderPasses(1);
expression.renderPasses[0].scene = scene;
expression.prepareToRender();

let angle = 0;
let axis = new GLBoost.Vector3(0,1,0);

let render = function() {
  renderer.clearCanvas();
  renderer.draw(expression);

  //meshSphere.quaternion = GLBoost.Quaternion.axisAngle(axis, GLBoost.MathUtil.radianToDegree(angle));

  angle += 0.02;
    
  requestAnimationFrame(render);
};

render();