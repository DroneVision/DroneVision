import * as THREE from 'three';

//DRONE 3D MODEL

//Drone Group
const droneGroup = new THREE.Group();

//Drone Body
const mainCircleGeometry = new THREE.CylinderGeometry(5, 5, 0.5, 32);
const mainCircleMaterial = new THREE.MeshBasicMaterial({
  color: 0xe8e7e7,
  side: THREE.DoubleSide,
});
const mainCircle = new THREE.Mesh(mainCircleGeometry, mainCircleMaterial);

const mainCircleEdges = new THREE.EdgesGeometry(mainCircleGeometry);
const mainCircleLines = new THREE.LineSegments(
  mainCircleEdges,
  new THREE.LineBasicMaterial({ color: 0x000000 })
);

mainCircle.position.set(0, 0, 0);
mainCircleLines.position.set(0, 0, 0);
droneGroup.add(mainCircle);
droneGroup.add(mainCircleLines);

//Drone Front Indication
const forwardIndicatorGeometry = new THREE.ConeGeometry(1, 8, 32);
const forwardIndicatorMaterial = new THREE.MeshBasicMaterial({
  color: 0x000000,
  side: THREE.DoubleSide,
});

const forwardIndicator = new THREE.Mesh(
  forwardIndicatorGeometry,
  forwardIndicatorMaterial
);
forwardIndicator.position.set(0, 0, -1);
forwardIndicator.rotation.x = -Math.PI / 2;
droneGroup.add(forwardIndicator);

//Front Left Propellor
const frontLeftCircleGeometry = new THREE.CylinderGeometry(2, 2, 0.75, 32);
const frontLeftCircleMaterial = new THREE.MeshBasicMaterial({
  color: 0xff4c4c,
  side: THREE.DoubleSide,
});
const frontLeftCircle = new THREE.Mesh(
  frontLeftCircleGeometry,
  frontLeftCircleMaterial
);

const frontLeftCircleEdges = new THREE.EdgesGeometry(frontLeftCircleGeometry);
const frontLeftCircleLines = new THREE.LineSegments(
  frontLeftCircleEdges,
  new THREE.LineBasicMaterial({ color: 0x000000 })
);

frontLeftCircle.position.set(-4, 0, -4);
frontLeftCircleLines.position.set(-4, 0, -4);
droneGroup.add(frontLeftCircle);
droneGroup.add(frontLeftCircleLines);

//Front Right Propellor
const frontRightCircleGeometry = new THREE.CylinderGeometry(2, 2, 0.75, 32);
const frontRightCircleMaterial = new THREE.MeshBasicMaterial({
  color: 0x7fff7f,
  side: THREE.DoubleSide,
});
const frontRightCircle = new THREE.Mesh(
  frontRightCircleGeometry,
  frontRightCircleMaterial
);

const frontRightCircleEdges = new THREE.EdgesGeometry(frontRightCircleGeometry);
const frontRightCircleLines = new THREE.LineSegments(
  frontRightCircleEdges,
  new THREE.LineBasicMaterial({ color: 0x000000 })
);

frontRightCircle.position.set(4, 0, -4);
frontRightCircleLines.position.set(4, 0, -4);
droneGroup.add(frontRightCircle);
droneGroup.add(frontRightCircleLines);

//Back Left Propellor
const backLeftCircleGeometry = new THREE.CylinderGeometry(2, 2, 0.75, 32);
const backLeftCircleMaterial = new THREE.MeshBasicMaterial({
  color: 0xff4c4c,
  side: THREE.DoubleSide,
});
const backLeftCircle = new THREE.Mesh(
  backLeftCircleGeometry,
  backLeftCircleMaterial
);

const backLeftCircleEdges = new THREE.EdgesGeometry(backLeftCircleGeometry);
const backLeftCircleLines = new THREE.LineSegments(
  backLeftCircleEdges,
  new THREE.LineBasicMaterial({ color: 0x000000 })
);

backLeftCircle.position.set(-4, 0, 4);
backLeftCircleLines.position.set(-4, 0, 4);
droneGroup.add(backLeftCircle);
droneGroup.add(backLeftCircleLines);

//Back Right Propellor
const backRightCircleGeometry = new THREE.CylinderGeometry(2, 2, 0.75, 32);
const backRightCircleMaterial = new THREE.MeshBasicMaterial({
  color: 0x7fff7f,
  side: THREE.DoubleSide,
});
const backRightCircle = new THREE.Mesh(
  backRightCircleGeometry,
  backRightCircleMaterial
);

const backRightCircleEdges = new THREE.EdgesGeometry(backRightCircleGeometry);
const backRightCircleLines = new THREE.LineSegments(
  backRightCircleEdges,
  new THREE.LineBasicMaterial({ color: 0x000000 })
);

backRightCircle.position.set(4, 0, 4);
backRightCircleLines.position.set(4, 0, 4);
droneGroup.add(backRightCircle);
droneGroup.add(backRightCircleLines);

export default droneGroup;
