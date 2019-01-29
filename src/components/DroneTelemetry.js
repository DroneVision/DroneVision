import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import droneGroup from '../ThreeJSModules/Drone';
import droneModelSkybox from '../ThreeJSModules/DroneModelSkybox';
import droneModel3D from '../ThreeJSModules/Drone';

class DroneTelemetry extends Component {
  constructor(props) {
    super(props);

    //RENDERER
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(640, 360, false);

    //SCENE
    this.scene = new THREE.Scene();

    //CAMERA
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.set(0, 10, 15);

    //ORBITAL CONTROLS
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; //an animation loop is required when damping or auto-rotation are enabled
    this.controls.dampingFactor = 1;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 5000;
    // this.controls.maxPolarAngle = Math.PI / 2;

    //SKYBOX
    this.scene.add(droneModelSkybox);

    //3D DRONE MODEL
    this.scene.add(droneModel3D);

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

    droneGroup.rotation.set(
      this.props.pitch * 0.01,
      this.props.yaw * -0.019,
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
)(DroneTelemetry);
