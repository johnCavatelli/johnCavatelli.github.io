import * as THREE from 'three';
import gsap from 'gsap'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Perlin } from "three-noise";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

//Set Canvas Width and Height so it renders correctly
const bg = document.getElementsByClassName('glslCanvas')[0];
bg.width = window.innerWidth;
bg.height = window.innerHeight;
//Start Load ing Assets
const loadingManager = new THREE.LoadingManager();//loading screen manager
loadingManager.onStart = function (url, item, total) { }
loadingManager.onLoad = function () { }

//Scene Setup
var mouse, currentHover, raycaster, mouseDownElement;
var skelHover = false;
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 500);
camera.position.set(90, 200, 5);
camera.lookAt(0, 0, 0);
const scene = new THREE.Scene();
const gltfLoader = new GLTFLoader(loadingManager);

//Geometry
var models = {};
var textHitboxes = {};
const linkTitles = ['about', 'garden', 'blog'];//art games contact
const links = ["aj is really stupid for indexing at 1", "/about/index.html", "/garden/index.html", "/blog/index.html"]
const meshNormalMat = new THREE.MeshNormalMaterial();
const centerBox = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), meshNormalMat);
centerBox.position.set(0, 0, 0);
scene.add(centerBox);
const eyeMat = new THREE.MeshStandardMaterial({ map: new THREE.Texture() });
const eyeMeshes = [1, 2, 3];//the incidies of all the eyeballs in the model array
const eyeURL = new URL('/models/ball.glb', import.meta.url);
const skeletonMat = new THREE.MeshStandardMaterial({ wireframe: true, wireframeLinewidth: 3, color: new THREE.Color(`hsl(${Math.random() * 100},100%,50%)`) });
const skeletonHighlightMat = new THREE.MeshStandardMaterial({ wireframe: true, wireframeLinewidth: 5, color: new THREE.Color(0x0000ff) });
const skeletonURL = new URL('/models/aaa.glb', import.meta.url);
await CreateMesh(skeletonURL, [skeletonMat], [0, 0, 0], [0, 0, 0], 2, 69, true);
await CreateMesh(eyeURL, [eyeMat], [8, 15, -4], [0, 0, 0], 0.5, 1, true);
await CreateMesh(eyeURL, [eyeMat], [10, 0, 7], [0, 0, 0], 0.5, 2, true);
await CreateMesh(eyeURL, [eyeMat], [12, -15, 0], [0, 0, 0], 0.5, 3, true);
const tubeMeshes = [101, 102, 103];//indicies of all the tubes
await CreateTubeMeshes();


//Lights
const dirLight = new THREE.DirectionalLight(0xffffff);
dirLight.position.set(- 3, 10, - 10);
/*
dirLight.castShadow = true;
dirLight.shadow.camera.top = 2;
dirLight.shadow.camera.bottom = -5;
dirLight.shadow.camera.left = -10;
dirLight.shadow.camera.right = 10;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 40;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
*/
scene.add(dirLight);
const hemiLight = new THREE.HemisphereLight(0xeef0c0, 0x444444, 1.2);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);


//Rendering Setup
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas });
//renderer.setClearColor(0x000000, 0); // the default
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);

// Instantiate new classes
const perlin = new Perlin(Math.random());
const clock = new THREE.Clock();
raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2;
window.addEventListener('pointermove', onMouseMove);
window.addEventListener('mouseup', mouseUp);
window.addEventListener('mousedown', mouseDown);
window.addEventListener("touchend", (ev) => {
    //console.log((ev.changedTouches[0].clientX * (2/window.innerWidth) - 1) );
    // mouse.x = (ev.changedTouches[0].clientX * (2/window.innerWidth) - 1);
    // mouse.y = (ev.changedTouches[0].clientY * (2/window.innerHeight) - 1); 
    mouse.x = (ev.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (ev.changedTouches[0].clientY / window.innerHeight) * 2 + 1;
    //console.log(mouse);
    handleRaycast();
    mouseDown();
    mouseUp();
});
const controls = new OrbitControls(camera, renderer.domElement);//Orbit controls
controls.enableDamping = false; controls.dampingFactor = 0.05; controls.enablePan = false; controls.enableZoom = false; controls.minPolarAngle = 0; controls.maxPolarAngle = Math.PI * 0.5; controls.rotateSpeed = 0.8;
//controls.enabled = false;
controls.update();

let lateLoadComplete = false;//Flag to load things after models have been loaded
function animation(time) {
    //console.log(models);

    //MODELS ANIMATION
    const elapsedTime = clock.getElapsedTime();
    if (typeof models[3] !== "undefined") {
        if (!lateLoadComplete) {
            lateLoadComplete = true;
            LoadText();
            resize();
            LoadCamera();
        }
        //models[2].children[0].rotation.y = 5.2 * perlin.get3(new THREE.Vector3(elapsedTime,0,0));
        let tubularSegments = 20,
            radius = 0.15,
            radialSegments = 5,
            pa = []
        eyeMeshes.forEach((item) => {
            if (models[item] != null) {
                //update positions
                //models[item].rotation.y = 0.2 * perlin.get3(new THREE.Vector3(elapsedTime + item, 0, 0));
                models[item].position.y = 0.8 * perlin.get3(new THREE.Vector3(elapsedTime + item, 0, 0));
                //models[item].position.x = 9.2 * perlin.get3(new THREE.Vector3(elapsedTime + item, 0, 0));

                //update Curves
                pa[item] = new THREE.CubicBezierCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -5, 0), new THREE.Vector3(5, -8, -5), models[item].position);

                models[(item + 100)].geometry = new THREE.TubeGeometry(pa[item], tubularSegments, radius, radialSegments, false);
                //console.log(pa);
                //console.log(item);
            }
        });
    }
    if (models[69] != null) { models[69].children[0].rotation.y += skelHover ? 0.1 : 0.05;models[69].children[0].rotation.x += skelHover ? 0.08 : 0; }//rotate center skeleton

    controls.update();

    //RAYCAST/MOUSE HANDLING
    handleRaycast();    

    //RENDER
    renderer.render(scene, camera);
}




//Functions
function handleRaycast() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);// calculate objects intersecting the picking ray
    //var newHover;
    if (intersects.length === 0) { currentHover = null; }
    for (let i = 0; i < intersects.length; i++) {
        //console.log(intersects[i].object.name?.includes("Text"));
        if (intersects[i].object.name?.includes("Text")) {
            // console.log(models)
            //console.log(intersects[i].object.id);
            currentHover = intersects[i].object.id;
            break;
        }
        else {
            currentHover = null;
        }
    }
    if (models[69] != undefined) {
        if (currentHover != null) {
            models[69].children[0].material = skeletonHighlightMat;
            skelHover = true;
        }
        else {
            models[69].children[0].material = skeletonMat;
            skelHover = false;
        }
    }
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function mouseDown(event) {
    if (currentHover != null) {
        mouseDownElement = currentHover;
    }
}

function mouseUp(event) {
    if (currentHover != null ) {
        //console.log("Clicked on: " + currentHover);
        if(currentHover == mouseDownElement){
        window.open(
            links[textHitboxes[currentHover]], "_self");
        }
    }
}

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    resize();
})

function resize() {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    //update eye scale
    setEyeSizes();
    //update scene
    let sceneScale = 1 + (0.5 * (sizes.width/sizes.height));
    scene.scale.set(sceneScale,sceneScale,sceneScale);
    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

function setEyeSizes() {
    eyeMeshes.forEach((item) => {
        if (models[item] != null) {
            const newScale = 2;//sizes.width / 700;
            models[item].scale.set(newScale, newScale, newScale);
            let radius = 10;
            let angle = (2 * Math.PI) / eyeMeshes.length * (item - 1);
            models[item].position.set(Math.sin(angle) * radius, 0, Math.cos(angle) * radius);
            models[item].rotation.set(0, angle - (Math.PI / 2), 0);//Radians to degrees
        }
    });
}

async function CreateMesh(url, materials, position, rotation, scale, colliderId, isSingleModel = false) {
    var materialIndex = 0;
    gltfLoader.load(url.href, function (gltf) {
        const model = gltf.scene;
        model.traverse((o) => {
            if (o.isMesh) {
                o.castShadow = true;
                o.receiveShadow = true;
                if (materials != null) {
                    const texture = o.material.map;
                    // console.log(texture);
                    o.material = materials[materialIndex];
                    o.material.map = texture;
                    materialIndex++;
                }
            }
        });
        model.rotation.set(rotation[0], rotation[1], rotation[2]);
        model.scale.set(scale, scale, scale);
        model.position.set(position[0], position[1], position[2]);
        scene.add(model);
        if (isSingleModel) {
            //SetModel(model.children[0], colliderId);
            SetModel(model, colliderId);
        }
        else {
            SetModel(model, colliderId)
        }

    }, undefined, function (error) {
        console.log(error);
    })
}

function SetModel(model, colliderId) {
    //console.log(colliderId);
    models[colliderId] = model;
}

async function CreateTubeMeshes() {
    tubeMeshes.forEach((item) => {
        let tubeMesh = new THREE.Mesh(
            new THREE.BoxGeometry(),
            new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide })
        );
        SetModel(tubeMesh, item);
        console.log
        scene.add(tubeMesh);
    });
}

async function LoadText() {
    const loader = new FontLoader();
    loader.load('/orbit_regular.json', function (font) {
        let fontProps = {
            font: font,
            size: 1,
            height: 1,
            curveSegments: 6,
            bevelEnabled: false,
        }
        // const linkTitles = ['about', 'garden', 'blog'];
        for (let i = 0; i < linkTitles.length; i++) {
            //console.log(i);
            let textGeometry = new TextGeometry(linkTitles[i], fontProps);
            let textMesh = new THREE.Mesh(textGeometry, meshNormalMat);
            textMesh.position.set(2, 0, 2);
            textMesh.rotation.set(0, 90, 0);
            textMesh.name = "Text" + (i + 1);
            scene.add(textMesh);
            textHitboxes[textMesh.id] = i + 1;
            SetModel(textMesh, 201 + i);
            models[i + 1].add(textMesh);
        }
    });
}

function LoadCamera(){
    gsap.to(camera.position, {
        x:30,
        y:0,
        z:30,
        ease: "sine.out",
        duration: 1.5
    })
}