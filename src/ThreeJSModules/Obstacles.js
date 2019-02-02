import * as THREE from 'three';
import voxelSizeValue from '../store/store';

//OBSTACLES GROUP
const Obstacles = new THREE.Group();

//OBSTACLE1 RED CYLINDER
const obstacle1Geometry = new THREE.CylinderBufferGeometry(1, 1, 5, 8, 1);
const obstacle1Material = new THREE.MeshPhongMaterial({
  color: 0xff6666,
  flatShading: false,
});

const obstacle1Edges = new THREE.EdgesGeometry(obstacle1Geometry);
const obstacle1Lines = new THREE.LineSegments(
  obstacle1Edges,
  new THREE.LineBasicMaterial({ color: 0x000000 })
);
Obstacles.add(obstacle1Lines);

const obstacle1 = new THREE.Mesh(obstacle1Geometry, obstacle1Material);

obstacle1.position.set(3, -2.5, 3);
obstacle1Lines.position.set(3, -2.5, 3);
obstacle1.updateMatrix();
obstacle1.matrixAutoUpdate = false;
Obstacles.add(obstacle1);

//OBSTACLE2 BLUE CUBE
const obstacle2Geometry = new THREE.CubeGeometry(2, 2, 4);
const obstacle2Material = new THREE.MeshPhongMaterial({
  color: 0x6666ff,
  flatShading: false,
});

const obstacle2Edges = new THREE.EdgesGeometry(obstacle2Geometry);
const obstacle2Lines = new THREE.LineSegments(
  obstacle2Edges,
  new THREE.LineBasicMaterial({ color: 0x000000 })
);
Obstacles.add(obstacle2Lines);

const obstacle2 = new THREE.Mesh(obstacle2Geometry, obstacle2Material);

obstacle2.position.set(-3, -2.5, -3);
obstacle2Lines.position.set(-3, -2.5, -3);
obstacle2.updateMatrix();
obstacle2.matrixAutoUpdate = false;
Obstacles.add(obstacle2);

//OBSTACLE3 YELLOW SPHERE
const obstacle3Geometry = new THREE.SphereGeometry(1.5, 1.5, 2);
const obstacle3Material = new THREE.MeshPhongMaterial({
  color: 0xffff66,
  flatShading: false,
});

const obstacle3Edges = new THREE.EdgesGeometry(obstacle3Geometry);
const obstacle3Lines = new THREE.LineSegments(
  obstacle3Edges,
  new THREE.LineBasicMaterial({ color: 0x000000 })
);
Obstacles.add(obstacle3Lines);

const obstacle3 = new THREE.Mesh(obstacle3Geometry, obstacle3Material);

obstacle3.position.set(-4, 2.5, 3);
obstacle3Lines.position.set(-4, 2.5, 3);
obstacle3.updateMatrix();
obstacle3.matrixAutoUpdate = false;
Obstacles.add(obstacle3);

//OBSTACLE4
const obstacle4Geometry = new THREE.ConeGeometry(1, 1, 3);
const obstacle4Material = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  flatShading: false,
});

const obstacle4Edges = new THREE.EdgesGeometry(obstacle4Geometry);
const obstacle4Lines = new THREE.LineSegments(
  obstacle4Edges,
  new THREE.LineBasicMaterial({ color: 0x000000 })
);
Obstacles.add(obstacle4Lines);

const obstacle4 = new THREE.Mesh(obstacle4Geometry, obstacle4Material);

obstacle4.position.set(4, -4.5, -4);
obstacle4Lines.position.set(4, -4.5, -4);
obstacle4.updateMatrix();
obstacle4.matrixAutoUpdate = false;
Obstacles.add(obstacle4);

export default Obstacles;
