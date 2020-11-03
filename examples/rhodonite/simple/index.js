function generateEntity() {
    const repo = Rn.EntityRepository.getInstance();
    const entity = repo.createEntity([Rn.TransformComponent, Rn.SceneGraphComponent, Rn.MeshComponent, Rn.MeshRendererComponent]);
    return entity;
}

function readySphereVerticesData() {
    //let modelMaterial = Rn.MaterialHelper.createClassicUberMaterial();

    let isMorphing = false;
    let isSkinning = false;
    let isLighting = true;
    let alphaMode = {index:0, str: "OPAQUE"};
    let additionalName = undefined;
    let maxMaterialInstanceNumber = 1;
    let modelMaterial = Rn.MaterialHelper.createPbrUberMaterial({
        isMorphing, isSkinning, isLighting, alphaMode,
        additionalName: additionalName, maxInstancesNumber: maxMaterialInstanceNumber
    });

    let metallicFactor = 1.0;
    let roughnessFactor = 1.0;
    modelMaterial.setParameter(Rn.ShaderSemantics.MetallicRoughnessFactor, new Rn.Vector2(metallicFactor, roughnessFactor));
    modelMaterial.setParameter(Rn.ShaderSemantics.BaseColorFactor, new Rn.Vector4(1.0, 1.0, 1.0, 1.0));

    const primitive = new Rn.Sphere();
    primitive.generate({ radius: 1, widthSegments: 40, heightSegments: 40, material: modelMaterial });

/*
    const texture = new Rn.Texture();
    //texture.generateTextureFromUri('../../../assets/textures/earth.jpg');
    texture.generateTextureFromUri('https://cx20.github.io/webgl-test/assets/textures/earth.jpg');
    primitive.material.setTextureParameter(Rn.ShaderSemantics.BaseColorTexture, texture);
*/
    return primitive;
}

const promise = Rn.ModuleManager.getInstance().loadModule('webgl');
promise.then(function() {
    const system = Rn.System.getInstance();
    const c = document.getElementById('world');
    //const gl = system.setProcessApproachAndCanvas(Rn.ProcessApproach.FastestWebGL1, c);
    const gl = system.setProcessApproachAndCanvas(Rn.ProcessApproach.UniformWebGL1, c);
    gl.enable(gl.DEPTH_TEST);

    resizeCanvas();
    
    window.addEventListener("resize", function(){
        resizeCanvas();
    });
    
    function resizeCanvas() {
        c.width = window.innerWidth;
        c.height = window.innerHeight;
        gl.viewport(0, 0, c.width, c.height);
    }
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const primitiveSphere = readySphereVerticesData();

    Rn.MeshRendererComponent.manualTransparentSids = [];

    const entities = [];
    const mesh = new Rn.Mesh();
    mesh.addPrimitive(primitiveSphere);
    const entity = generateEntity();

    entities.push(entity);
    const meshComponent = entity.getComponent(Rn.MeshComponent);

    meshComponent.setMesh(mesh);
    entity.getTransform().toUpdateAllTransform = false;
    //entity.getTransform().translate = new Rn.Vector3(1.5, 0, 0);

    const startTime = Date.now();
    let p = null;
    let count = 0

    // camera
    const cameraComponent = createCameraComponent();
    cameraComponent.zNear = 0.1;
    cameraComponent.zFar = 1000;
    cameraComponent.setFovyAndChangeFocalLength(45);
    cameraComponent.aspect = window.innerWidth / window.innerHeight;
    const cameraEntity = cameraComponent.entity;
    cameraEntity.getTransform().translate = new Rn.Vector3(0, 0, 8);

    // Lights
    const entityRepository = Rn.EntityRepository.getInstance();

    // Lights
/*  
    const lightEntity1 = entityRepository.createEntity([Rn.TransformComponent, Rn.SceneGraphComponent, Rn.LightComponent])
    lightEntity1.getTransform().translate = new Rn.Vector3(1.0, 1.0, 100000.0);
    lightEntity1.getComponent(Rn.LightComponent).intensity = new Rn.Vector3(1, 1, 1);
    lightEntity1.getComponent(Rn.LightComponent).type = Rn.LightType.Directional;
    lightEntity1.getTransform().rotate = new Rn.Vector3(-Math.PI / 1.5, 0, Math.PI / 1.5);
*/
    const lightEntity2 = entityRepository.createEntity([Rn.TransformComponent, Rn.SceneGraphComponent, Rn.LightComponent])
    lightEntity2.getTransform().translate = new Rn.Vector3(1.0, 1.0, 100000.0);
    lightEntity2.getComponent(Rn.LightComponent).intensity = new Rn.Vector3(1, 1, 1);
    lightEntity2.getComponent(Rn.LightComponent).type = Rn.LightType.Directional;
    lightEntity2.getTransform().rotate = new Rn.Vector3(Math.PI / 1.5, 0, -Math.PI / 1.5);

    // renderPass
    const renderPass = new Rn.RenderPass();
    renderPass.cameraComponent = cameraComponent;
    renderPass.toClearColorBuffer = true;
    renderPass.clearColor = new Rn.Vector4(0, 0, 0, 1);
    renderPass.addEntities(entities);

    // expression
    const expression = new Rn.Expression();
    expression.addRenderPasses([renderPass]);

    function createCameraComponent() {
        const entityRepository = Rn.EntityRepository.getInstance();
        const cameraEntity = entityRepository.createEntity([Rn.TransformComponent, Rn.SceneGraphComponent, Rn.CameraComponent]);
        const cameraComponent = cameraEntity.getComponent(Rn.CameraComponent);
        return cameraComponent;
    }

    let axis = new Rn.Vector3(1, 1, 1);

    const draw = function(time) {

        const date = new Date();

        const rotation = 0.001 * (date.getTime() - startTime);

        gl.disable(gl.CULL_FACE); // TODO:
        system.process([expression]);

        count++;
        requestAnimationFrame(draw);
    }

    draw();

});