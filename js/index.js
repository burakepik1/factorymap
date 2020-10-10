var camera, controls, scene, renderer, bus, minibus;
var move = false;
init();
//render(); // remove when using next line for animation loop (requestAnimationFrame)
animate();
var audio = new Audio('assets/sound/engine.wav');


function init() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.Fog(0xffffff, 1000, 4000);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(130, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.set(-400, 400, 50);

    // controls

    controls = new THREE.OrbitControls(camera, document, renderer.domElement);

    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;

    controls.screenSpacePanning = false;

    controls.minDistance = 100;
    controls.maxDistance = 500;

    controls.maxPolarAngle = Math.PI / 2;

    // GROUND
    var gt = new THREE.TextureLoader().load("assets/asphalts.png");
    var gg = new THREE.PlaneBufferGeometry(16000, 16000);
    var gm = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        map: gt
    });

    var ground = new THREE.Mesh(gg, gm);
    ground.rotation.x = -Math.PI / 2;
    ground.material.map.repeat.set(64, 64);
    ground.material.map.wrapS = THREE.RepeatWrapping;
    ground.material.map.wrapT = THREE.RepeatWrapping;
    ground.material.map.encoding = THREE.sRGBEncoding;
    ground.receiveShadow = true;

    scene.add(ground);

    // GROUND

    // LIGHTS
    scene.add(new THREE.AmbientLight(0x222222));

    var light = new THREE.DirectionalLight(0xffffff, 2.25);
    light.position.set(200, 450, 400);

    light.castShadow = true;

    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 512;

    light.shadow.camera.near = 100;
    light.shadow.camera.far = 1200;

    light.shadow.camera.left = -1000;
    light.shadow.camera.right = 1000;
    light.shadow.camera.top = 350;
    light.shadow.camera.bottom = -350;

    scene.add(light);

    // LIGHTS

    // world

    createMapLeftWall();
    createMapRightWall();

    ////////   BUS    ////////////
    var oBusStep = 0;
    for (var k = 0; k < 13; k++) {
        createAddMesh(oBusStep, 0);
        oBusStep += 400;
    }

    ///////////   MINIBUS  ///////////
    var oMBusStep = 0;
    for (var l = 0; l < 4; l++) {
        createAddMesh(oMBusStep, 600);
        oMBusStep += 400;
    }

    var oMBusLStep = 1200;
    for (var n = 0; n < 10; n++) {
        createAddMesh(oMBusLStep, 1000);
        oMBusLStep += 400;
    }
    // createAddMesh(300, 600);
    // createAddMesh(600, 600);

    // car = new THREE.Mesh(geometry, material);
    // car.position.set(-900, 0, 61.5);
    // car.scale.set(50, 40, 25);
    // car.updateMatrix();
    // car.matrixAutoUpdate = false;
    // scene.add(car);





    addBusAndMiniBus("Bus");
    addBusAndMiniBus("MBus");

    window.addEventListener('resize', onWindowResize, false);
}

function addBusAndMiniBus(type, value) {
    // MODEL

    var loader = new THREE.OBJLoader();
    var mtloader = new THREE.MTLLoader();

    mtloader.load('assets/bus2/BUS.mtl', function (materials) {
        materials.preload();
        loader.setMaterials(materials);
        loader.load('assets/bus2/BUS.obj', function (obj) {
            if (type === "Bus") {
                obj.scale.set(30, 40, 30);
                obj.position.set(0, 110, 25);
                bus = obj;
                scene.add(bus);
            }
            if (type === "MBus") {
                obj.scale.set(15, 40, 30);
                obj.position.set(0, 110, 625);
                minibus = obj;
                scene.add(minibus);
            }
        });
    });

    // MODEL
}

function createMapLeftWall() {

    var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    geometry.translate(0, 0.5, 0);
    var material = new THREE.MeshPhongMaterial({
        color: 0xffff11,
        flatShading: true
    });

    var group = new THREE.Group();
    var oXpos = -400;
    for (var i = 0; i < 14; i++) {
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(oXpos, 0, -300);
        mesh.scale.set(400, 200, 1);
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;

        var mesh1 = new THREE.Mesh(geometry, material);
        mesh1.position.set(oXpos + 200, 0, -300);
        mesh1.scale.set(20, 200, 10);
        mesh1.updateMatrix();
        mesh1.matrixAutoUpdate = false;
        group.add(mesh, mesh1);
        oXpos += 400;
    }
    scene.add(group);

}

function createMapRightWall() {
    var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    geometry.translate(0, 0.5, 0);
    var material = new THREE.MeshPhongMaterial({
        color: 0xffff11,
        flatShading: true
    });

    var group = new THREE.Group();
    var oXpos = -400,
        oZ = 900;
    for (var i = 0; i < 14; i++) {
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(oXpos, 0, oZ);
        mesh.scale.set(400, 200, 1);
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;

        var mesh1 = new THREE.Mesh(geometry, material);
        mesh1.position.set(oXpos + 200, 0, oZ);
        mesh1.scale.set(20, 200, 10);
        mesh1.updateMatrix();
        mesh1.matrixAutoUpdate = false;
        group.add(mesh, mesh1);
        oXpos += 400;
        if (i === 3) {
            oZ = 1300;
        }
    }
    var mesh2 = new THREE.Mesh(geometry, material);
    mesh2.position.set(1000, 0, 1100);
    mesh2.scale.set(1, 200, 400);
    mesh2.updateMatrix();
    mesh2.matrixAutoUpdate = false;

    var mesh3 = new THREE.Mesh(geometry, material);
    mesh3.position.set(1000, 0, 1300);
    mesh3.scale.set(10, 200, 20);
    mesh3.updateMatrix();
    mesh3.matrixAutoUpdate = false;
    group.add(mesh2, mesh3);
    scene.add(group);
}

function createAddMesh(px, pz) {
    var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    geometry.translate(0, 0.5, 0);
    var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        flatShading: true
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(px, 0, pz);
    mesh.scale.set(200, 3, 10);
    mesh.updateMatrix();
    mesh.matrixAutoUpdate = false;

    var mesh1 = new THREE.Mesh(geometry, material);
    mesh1.position.set(px, 0, pz + 123);
    mesh1.scale.set(200, 3, 10);
    mesh1.updateMatrix();
    mesh1.matrixAutoUpdate = false;
    var oLineStep = -50;
    var group1 = new THREE.Group();
    for (var t = 0; t < 5; t++) {
        var line = new THREE.Mesh(geometry, material);
        line.position.set(px + oLineStep, 0, pz);
        line.scale.set(5, 130, 1);
        line.updateMatrix();
        line.matrixAutoUpdate = false;

        var roof = new THREE.Mesh(geometry, material);
        roof.position.set(px + oLineStep, 130, pz + 61.5);
        roof.scale.set(5, 10, 123);
        roof.updateMatrix();
        roof.matrixAutoUpdate = false;

        var line1 = new THREE.Mesh(geometry, material);
        line1.position.set(px + oLineStep, 0, pz + 123);
        line1.scale.set(5, 130, 1);
        line1.updateMatrix();
        line1.matrixAutoUpdate = false;
        group1.add(line, roof, line1);
        oLineStep += 25;
    }



    var yt = new THREE.TextureLoader().load("assets/2endlft.png");
    var yg = new THREE.PlaneBufferGeometry(400, 200);
    var ym = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        map: yt
    });

    var gr = new THREE.Mesh(yg, ym);
    gr.rotation.x = -Math.PI / 2;
    gr.position.y = 0.9;
    gr.position.z = pz + 64;
    gr.position.x = px;
    gr.material.map.repeat.set(2, 1);
    gr.material.map.wrapS = THREE.RepeatWrapping;
    gr.material.map.wrapT = THREE.RepeatWrapping;
    gr.material.map.encoding = THREE.sRGBEncoding;
    gr.receiveShadow = true;

    var group = new THREE.Group();
    group.add(mesh, mesh1, group1, gr);
    scene.add(group);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

var mBusRight = false;

function animate() {
    requestAnimationFrame(animate);
    if (move) {
        audio.play();
        if (bus.position.x <= 4800) {
            bus.translateX(2);
            bus.updateMatrix();
        } else{
            audio.pause();
        }
        if ((bus.position.x % 400) === 0) {
            move = false;
            setTimeout(function () {
                move = true;
            }, 3000);
        }

        if (mBusRight) {
            minibus.translateZ(2);
            minibus.updateMatrix();
            if ((minibus.position.z % 1025) === 0) {
                move = false;
                mBusRight = false;
                setTimeout(function () {
                    move = true;
                }, 3000);
            }
        } else {
            if (minibus.position.x <= 4800) {
                minibus.translateX(2);
                minibus.updateMatrix();
            }
            if ((minibus.position.x % 400) === 0) {
                move = false;

                if (minibus.position.x === 1200) {
                    mBusRight = true;
                }
                setTimeout(function () {
                    move = true;
                }, 3000);
            }
        }

    } else {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }

    }

    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

    render();
}

function render() {

    renderer.render(scene, camera);
}

function carMove() {
    audio.play();
    move = true;
}