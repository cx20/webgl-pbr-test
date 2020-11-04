const c = document.getElementById('world');
c.width = window.innerWidth;
c.height = window.innerHeight;

function generateEntity() {
    const repo = Rn.EntityRepository.getInstance();
    const entity = repo.createEntity([Rn.TransformComponent, Rn.SceneGraphComponent, Rn.MeshComponent, Rn.MeshRendererComponent]);
    return entity;
}

function createSpherePrimitive(roughnessFactor, metallicFactor) {
    //let modelMaterial = Rn.MaterialHelper.createClassicUberMaterial();

    let isMorphing = false;
    let isSkinning = false;
    let isLighting = true;
    let alphaMode = {index:0, str: "OPAQUE"};
    let additionalName = undefined;
    let maxMaterialInstanceNumber = 25; // TODO: need to investigation out what the value is
    let modelMaterial = Rn.MaterialHelper.createPbrUberMaterial({
        isMorphing, isSkinning, isLighting, alphaMode,
        additionalName: additionalName, maxInstancesNumber: maxMaterialInstanceNumber
    });

    //let metallicFactor = 1.0;
    //let roughnessFactor = 1.0;
    modelMaterial.setParameter(Rn.ShaderSemantics.MetallicRoughnessFactor, new Rn.Vector2(metallicFactor, roughnessFactor));
    modelMaterial.setParameter(Rn.ShaderSemantics.BaseColorFactor, new Rn.Vector4(1.0, 1.0, 1.0, 1.0));

    const primitive = new Rn.Sphere();
    primitive.generate({ radius: 0.5, widthSegments: 24, heightSegments: 24, material: modelMaterial });

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
    //const c = document.getElementById('world');
    //const gl = system.setProcessApproachAndCanvas(Rn.ProcessApproach.UniformWebGL1, c);
    const gl = system.setProcessApproachAndCanvas(Rn.ProcessApproach.FastestWebGL1, c);
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

    const entities = [];
    
    // Metal/Roughness
    // 
    //     [Metal] ^ 1.0
    //             |
    //             |
    //             |
    //             |
    // [Non-metal] | 0.0          1.0
    //             +--------------->
    //          [Smooth]         [Rough]
    for(let r = 0.0; r <= 1.0; r += 0.25) {
        for(let m = 0.0; m <= 1.0; m += 0.25) {
            // setup material
            const spherePrimitive = createSpherePrimitive(r, m);
            const mesh = new Rn.Mesh();
            mesh.addPrimitive(spherePrimitive);
            const entity = generateEntity();
            const meshComponent = entity.getComponent(Rn.MeshComponent);

            meshComponent.setMesh(mesh);
            entity.getTransform().toUpdateAllTransform = false;
            entity.getTransform().translate = new Rn.Vector3((r-0.5)*4, (m-0.5)*4, 0);
            entities.push(entity);
        }
    }

    // camera
    const cameraComponent = createCameraComponent();
    cameraComponent.zNear = 0.1;
    cameraComponent.zFar = 1000;
    cameraComponent.setFovyAndChangeFocalLength(45);
    cameraComponent.aspect = window.innerWidth / window.innerHeight;
    const cameraEntity = cameraComponent.entity;
    cameraEntity.getTransform().translate = new Rn.Vector3(0, 0, 6.5);

    // Lights
    const entityRepository = Rn.EntityRepository.getInstance();

    // Lights
    const lightEntity = entityRepository.createEntity([Rn.TransformComponent, Rn.SceneGraphComponent, Rn.LightComponent])
    //lightEntity.getTransform().translate = new Rn.Vector3(0.0, 0.0, 1.0);
    lightEntity.getComponent(Rn.LightComponent).intensity = new Rn.Vector3(1, 1, 1);
    lightEntity.getComponent(Rn.LightComponent).type = Rn.LightType.Directional;
    lightEntity.getTransform().rotate = new Rn.Vector3(Math.PI / 2, 0, 0);

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

    const startTime = Date.now();

    const draw = function(time) {

        const date = new Date();

        const rotation = 0.001 * (date.getTime() - startTime);

        gl.disable(gl.CULL_FACE); // TODO:
        system.process([expression]);

        requestAnimationFrame(draw);
    }

    draw();

});