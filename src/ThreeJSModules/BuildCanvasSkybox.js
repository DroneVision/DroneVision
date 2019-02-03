import * as THREE from 'three';

//SKYBOX IMAGES
const backImage = require('../assets/skybox/oasis/back.png');
const frontImage = require('../assets/skybox/oasis/front.png');
const upImage = require('../assets/skybox/oasis/up.png');
const downImage = require('../assets/skybox/oasis/down.png');
const rightImage = require('../assets/skybox/oasis/right.png');
const leftImage = require('../assets/skybox/oasis/left.png');

//SKYBOX
let skyboxCube = new THREE.CubeGeometry(1000, 1000, 1000);

let textureBack = new THREE.TextureLoader().load(backImage);
let textureFront = new THREE.TextureLoader().load(frontImage);
let textureUp = new THREE.TextureLoader().load(upImage);
let textureDown = new THREE.TextureLoader().load(downImage);
let textureRight = new THREE.TextureLoader().load(rightImage);
let textureLeft = new THREE.TextureLoader().load(leftImage);

let skyboxCubeMaterials = [
  // back side
  new THREE.MeshBasicMaterial({
    map: textureBack,
    side: THREE.DoubleSide,
  }),
  // front side
  new THREE.MeshBasicMaterial({
    map: textureFront,
    side: THREE.DoubleSide,
  }),
  // Top side
  new THREE.MeshBasicMaterial({
    map: textureUp,
    side: THREE.DoubleSide,
  }),
  // Bottom side
  new THREE.MeshBasicMaterial({
    map: textureDown,
    side: THREE.DoubleSide,
  }),
  // left side
  new THREE.MeshBasicMaterial({
    map: textureLeft,
    side: THREE.DoubleSide,
  }),
  // right side
  new THREE.MeshBasicMaterial({
    map: textureRight,
    side: THREE.DoubleSide,
  }),
];

//add cube & materials
let skyboxCubeMaterial = new THREE.MeshFaceMaterial(skyboxCubeMaterials);
let buildCanvasSkybox = new THREE.Mesh(skyboxCube, skyboxCubeMaterial);
buildCanvasSkybox.rotation.y = Math.PI / 2;

// export const skyboxMesh2 = skyboxMesh;
export default buildCanvasSkybox;
