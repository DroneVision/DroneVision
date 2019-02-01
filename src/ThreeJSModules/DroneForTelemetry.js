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
mainCircle.position.set(0, 0, 0);
droneGroup.add(mainCircle);

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
frontLeftCircle.position.set(-4, 0, -4);
droneGroup.add(frontLeftCircle);

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
frontRightCircle.position.set(4, 0, -4);
droneGroup.add(frontRightCircle);

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
backLeftCircle.position.set(-4, 0, 4);
droneGroup.add(backLeftCircle);

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
backRightCircle.position.set(4, 0, 4);
droneGroup.add(backRightCircle);

export default droneGroup;
