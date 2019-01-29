import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as THREE from 'three';
import throttle from 'lodash/throttle';
import OrbitControls from 'three-orbitcontrols';

const backImage = require('../assets/skybox/back.png');
const frontImage = require('../assets/skybox/front.png');
const upImage = require('../assets/skybox/up.png');
const downImage = require('../assets/skybox/down.png');
const rightImage = require('../assets/skybox/right.png');
const leftImage = require('../assets/skybox/left.png');

class DroneModel extends Component {
  constructor(props) {
    super(props);

    //renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(640, 360, false);

    //scene
    this.scene = new THREE.Scene();

    //camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.set(0, 10, 15);

    //controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; //an animation loop is required when damping or auto-rotation are enabled
    this.controls.dampingFactor = 1;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 5000;
    // this.controls.maxPolarAngle = Math.PI / 2;

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
    let skyboxMesh = new THREE.Mesh(skyboxCube, skyboxCubeMaterial);
    this.scene.add(skyboxMesh);

    // this.group = new THREE.Group();
    // this.group.position.y = 50;
    // this.scene.add(this.group);
    // // Circle shape
    // this.circleRadius = 40;
    // this.circleShape = new THREE.Shape();
    // this.circleShape.moveTo(0, this.circleRadius);
    // this.circleShape.quadraticCurveTo(this.circleRadius, this.circleRadius, this.circleRadius, 0);
    // this.circleShape.quadraticCurveTo(this.circleRadius, - this.circleRadius, 0, - this.circleRadius);
    // this.circleShape.quadraticCurveTo(- this.circleRadius, - this.circleRadius, - this.circleRadius, 0);
    // this.circleShape.quadraticCurveTo(- this.circleRadius, this.circleRadius, 0, this.circleRadius);
    // // Add shape
    // this.circleGeometry = new THREE.ShapeBufferGeometry(this.circleShape);
    // this.mesh = new THREE.Mesh(this.circleGeometry, new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
    // this.mesh.position.set(120, 250, 0 - 125);
    // this.mesh.rotation.set(0, 0, 0);
    // this.mesh.scale.set(1, 1, 1);
    // this.group.add(this.mesh);

    // // flat shape
    // this.flatCircleGeometry = new THREE.ShapeBufferGeometry(this.circleShape);
    // this.flatCircleMesh = new THREE.Mesh(this.flatCircleGeometry, new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
    // this.flatCircleMesh.position.set(120, 250, 0 - 125);
    // this.flatCircleMesh.rotation.set(0, 0, 0);
    // this.flatCircleMesh.scale.set(1, 1, 1);
    // this.group.add(this.flatCircleMesh);

    //Drone Metallic Properties
    const settings = {
      metalness: 1.0,
      roughness: 0.4,
      ambientIntensity: 0.2,
      aoMapIntensity: 1.0,
      envMapIntensity: 1.0,
      envMap: 'reflection-cube',
      displacementScale: 2.436143, // from original model
      normalScale: 1.0,
    };

    //Drone Group
    this.droneGroup = new THREE.Group();

    //Drone Body
    const mainCircleGeometry = new THREE.CylinderGeometry(5, 5, 0.5, 32);
    const mainCircleMaterial = new THREE.MeshBasicMaterial({
      color: 0xe8e7e7,
      side: THREE.DoubleSide,
    });

    this.mainCircle = new THREE.Mesh(mainCircleGeometry, mainCircleMaterial);
    this.mainCircle.position.set(0, 0, 0);
    this.droneGroup.add(this.mainCircle);

    //Drone Front Indication
    const forwardIndicatorGeometry = new THREE.ConeGeometry(1, 8, 32);
    const forwardIndicatorMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
    });

    this.forwardIndicator = new THREE.Mesh(
      forwardIndicatorGeometry,
      forwardIndicatorMaterial
    );
    this.forwardIndicator.position.set(0, 0, -1);
    this.forwardIndicator.rotation.x = -Math.PI / 2;
    this.droneGroup.add(this.forwardIndicator);

    //Front Left Propellor
    const frontLeftCircleGeometry = new THREE.CylinderGeometry(2, 2, 0.75, 32);
    const frontLeftCircleMaterial = new THREE.MeshBasicMaterial({
      color: 0xff4c4c,
      side: THREE.DoubleSide,
    });
    this.frontLeftCircle = new THREE.Mesh(
      frontLeftCircleGeometry,
      frontLeftCircleMaterial
    );
    this.frontLeftCircle.position.set(-4, 0, -4);
    this.droneGroup.add(this.frontLeftCircle);

    //Front Right Propellor
    const frontRightCircleGeometry = new THREE.CylinderGeometry(2, 2, 0.75, 32);
    const frontRightCircleMaterial = new THREE.MeshBasicMaterial({
      color: 0x7fff7f,
      side: THREE.DoubleSide,
    });
    this.frontRightCircle = new THREE.Mesh(
      frontRightCircleGeometry,
      frontRightCircleMaterial
    );
    this.frontRightCircle.position.set(4, 0, -4);
    this.droneGroup.add(this.frontRightCircle);

    //Back Left Propellor
    const backLeftCircleGeometry = new THREE.CylinderGeometry(2, 2, 0.75, 32);
    const backLeftCircleMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide,
    });
    this.backLeftCircle = new THREE.Mesh(
      backLeftCircleGeometry,
      backLeftCircleMaterial
    );
    this.backLeftCircle.position.set(-4, 0, 4);
    this.droneGroup.add(this.backLeftCircle);

    //Back Right Propellor
    const backRightCircleGeometry = new THREE.CylinderGeometry(2, 2, 0.75, 32);
    const backRightCircleMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      side: THREE.DoubleSide,
    });
    this.backRightCircle = new THREE.Mesh(
      backRightCircleGeometry,
      backRightCircleMaterial
    );
    this.backRightCircle.position.set(4, 0, 4);
    this.droneGroup.add(this.backRightCircle);

    this.scene.add(this.droneGroup);

    // 	const geometry = new THREE.CylinderBufferGeometry(0, 10, 30, 4, 1);
    // 	const material = new THREE.MeshPhongMaterial({
    // 	  color: 0xffffff,
    // 	  flatShading: true,
    // 	});

    // const triangle = new THREE.Mesh(geometry, material);
    //   triangle.position.x = 0;
    //   triangle.position.y = 0;
    //   triangle.position.z = 200;
    //   triangle.updateMatrix();
    //   triangle.matrixAutoUpdate = false;
    //   this.scene.add(triangle);

    //AMBIENT LIGHT
    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    this.scene.add(ambientLight);
  }
  componentDidMount() {
    document
      .getElementById('drone-model')
      .appendChild(this.renderer.domElement);
    this.animate();
  }

  animate = () => {
    requestAnimationFrame(this.animate);

    let yaw = this.props.yaw;

    if (yaw < 0) {
      yaw = yaw + 360;
    }

    this.droneGroup.rotation.set(
      this.props.pitch * 0.01,
      yaw * 0.01,
      this.props.roll * -0.01
    );

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return <div id="drone-model" />;
  }
}

const mapState = state => {
  return {
    roll: state.roll,
    pitch: state.pitch,
    yaw: state.yaw,
  };
};

// const mapDispatch = dispatch => {
//   return {
//     functionName: () => {
//       dispatch(functionName());
//     },
//   };
// };

export default connect(
  mapState,
  null
)(DroneModel);
