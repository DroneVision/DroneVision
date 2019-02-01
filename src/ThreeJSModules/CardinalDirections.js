import * as THREE from 'three';
import voxelSizeValue from '../store/store';
//CARDINAL DIRECTIONS GROUP
const cardinalDirections = new THREE.Group();

//NORTH STAR
const northStarGeometry = new THREE.CylinderBufferGeometry(0, 7, 30, 4, 1);
const northStarMaterial = new THREE.MeshPhongMaterial({
  color: 0x007f00,
  flatShading: true,
});

const northStar = new THREE.Mesh(northStarGeometry, northStarMaterial);

northStar.position.set(0, 0, 200);
northStar.updateMatrix();
northStar.matrixAutoUpdate = false;
northStar.position.set(0, voxelSizeValue * -0.5, 0);
cardinalDirections.add(northStar);

//NORTH STAR HEAVENLY LIGHT
const northStarHeavenlyLightGeometry = new THREE.CylinderBufferGeometry(
  0,
  1,
  140,
  4,
  1
);

const northStarHeavenlyLightMaterial = new THREE.MeshPhongMaterial({
  color: 0x00ff00,
  flatShading: true,
});

const northStarHeavenlyLight = new THREE.Mesh(
  northStarHeavenlyLightGeometry,
  northStarHeavenlyLightMaterial
);

northStarHeavenlyLight.position.set(0, 75, 200);
northStarHeavenlyLight.updateMatrix();
northStarHeavenlyLight.matrixAutoUpdate = false;
northStarHeavenlyLight.position.set(0, voxelSizeValue * -0.5, 0);
cardinalDirections.add(northStarHeavenlyLight);

//EAST STAR
const eastStarGeometry = new THREE.CylinderBufferGeometry(0, 7, 30, 4, 1);
const eastStarMaterial = new THREE.MeshPhongMaterial({
  color: 0x7f7f00,
  flatShading: true,
});

const eastStar = new THREE.Mesh(eastStarGeometry, eastStarMaterial);

eastStar.position.set(-200, 0, 0);
eastStar.updateMatrix();
eastStar.matrixAutoUpdate = false;
eastStar.position.set(0, voxelSizeValue * -0.5, 0);
cardinalDirections.add(eastStar);

//EAST STAR HEAVENLY LIGHT
const eastStarHeavenlyLightGeometry = new THREE.CylinderBufferGeometry(
  0,
  1,
  140,
  4,
  1
);

const eastStarHeavenlyLightMaterial = new THREE.MeshPhongMaterial({
  color: 0xffff00,
  flatShading: true,
});

const eastStarHeavenlyLight = new THREE.Mesh(
  eastStarHeavenlyLightGeometry,
  eastStarHeavenlyLightMaterial
);

eastStarHeavenlyLight.position.set(-200, 75, 0);
eastStarHeavenlyLight.updateMatrix();
eastStarHeavenlyLight.matrixAutoUpdate = false;
eastStarHeavenlyLight.position.set(0, voxelSizeValue * -0.5, 0);
cardinalDirections.add(eastStarHeavenlyLight);

//SOUTH STAR
const southStarGeometry = new THREE.CylinderBufferGeometry(0, 7, 30, 4, 1);
const southStarMaterial = new THREE.MeshPhongMaterial({
  color: 0x7f0000,
  flatShading: true,
});

const southStar = new THREE.Mesh(southStarGeometry, southStarMaterial);

southStar.position.set(0, 0, -200);
southStar.updateMatrix();
southStar.matrixAutoUpdate = false;
southStar.position.set(0, voxelSizeValue * -0.5, 0);
cardinalDirections.add(southStar);

//SOUTH STAR HEAVENLY LIGHT
const southStarHeavenlyLightGeometry = new THREE.CylinderBufferGeometry(
  0,
  1,
  140,
  4,
  1
);

const southStarHeavenlyLightMaterial = new THREE.MeshPhongMaterial({
  color: 0xff0000,
  flatShading: true,
});

const southStarHeavenlyLight = new THREE.Mesh(
  southStarHeavenlyLightGeometry,
  southStarHeavenlyLightMaterial
);

southStarHeavenlyLight.position.set(0, 75, -200);
southStarHeavenlyLight.updateMatrix();
southStarHeavenlyLight.matrixAutoUpdate = false;
southStarHeavenlyLight.position.set(0, voxelSizeValue * -0.5, 0);
cardinalDirections.add(southStarHeavenlyLight);

//WEST STAR
const westStarGeometry = new THREE.CylinderBufferGeometry(0, 7, 30, 4, 1);
const westStarMaterial = new THREE.MeshPhongMaterial({
  color: 0x00007f,
  flatShading: true,
});

const westStar = new THREE.Mesh(westStarGeometry, westStarMaterial);

westStar.position.set(200, 0, 0);
westStar.updateMatrix();
westStar.matrixAutoUpdate = false;
westStar.position.set(0, voxelSizeValue * -0.5, 0);
cardinalDirections.add(westStar);

//WEST STAR HEAVENLY LIGHT
const westStarHeavenlyLightGeometry = new THREE.CylinderBufferGeometry(
  0,
  1,
  140,
  4,
  1
);

const westStarHeavenlyLightMaterial = new THREE.MeshPhongMaterial({
  color: 0x0000ff,
  flatShading: true,
});

const westStarHeavenlyLight = new THREE.Mesh(
  westStarHeavenlyLightGeometry,
  westStarHeavenlyLightMaterial
);

westStarHeavenlyLight.position.set(200, 75, 0);
westStarHeavenlyLight.updateMatrix();
westStarHeavenlyLight.matrixAutoUpdate = false;
westStarHeavenlyLight.position.set(0, voxelSizeValue * -0.5, 0);
cardinalDirections.add(westStarHeavenlyLight);

export default cardinalDirections;
