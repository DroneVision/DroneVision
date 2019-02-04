import React, { Component } from 'react';
import * as THREE from 'three';
import { connect } from 'react-redux';
import OrbitControls from 'three-orbitcontrols';
import PubSub from 'pubsub-js';
import autoPilotCanvasSkybox from '../ThreeJSModules/AutoPilotCanvasSkybox';
import droneModel from '../ThreeJSModules/Drone3DModel';
import cardinalDirections from '../ThreeJSModules/CardinalDirections';
import Obstacles from '../ThreeJSModules/Obstacles';
import _ from 'lodash';
import { updateCDP } from '../store/store';

const { ipcRenderer } = window.require('electron');

class SceneCanvas extends Component {
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
    this.camera.position.set(-2.8, 5.4, -14.8);
    // this.camera.position.set(
    //   this.props.startingPosition.x,
    //   this.props.startingPosition.y,
    //   this.props.startingPosition.z
    // );

    //ORBITAL CONTROLS
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableKeys = false;
    this.controls.enableDamping = true; //an animation loop is required when damping or auto-rotation are enabled
    this.controls.dampingFactor = 1;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 50;
    // this.controls.maxPolarAngle = Math.PI / 2;

    // //SKYBOX
    const sceneCanvasSkybox = autoPilotCanvasSkybox.clone();
    this.scene.add(sceneCanvasSkybox);

    //LOADING AN EXTERNAL OBJECT
    // this.loader = new THREE.ObjectLoader();
    // this.loader.load('../ThreeJSModules/robot.json', function(object) {
    //   var material = new THREE.MeshToonMaterial({
    //     color: 0x3f3f3f,
    //     alphaTest: 0.5,
    //   });
    //   object.traverse(function(child) {
    //     if (child instanceof THREE.Mesh) {
    //       child.material = material;
    //       child.drawMode = THREE.TrianglesDrawMode;
    //     }
    //   });
    //   object.scale.set(0.1, 0.1, 0.1);
    //   object.position.x = 1;
    //   object.position.y = 1;
    //   object.position.z = 1;
    //   object.rotation.set(25, 25, 25);
    //   this.scene.add(object);
    // });

    //GRID
    this.gridEdgeLength = this.props.voxelSize;
    // this.props.scale / (this.props.scale / this.props.voxelSize);

    this.gridGeo = new THREE.PlaneBufferGeometry(
      this.props.voxelSize,
      this.props.voxelSize,
      this.props.scale,
      this.props.scale
    );
    this.gridMaterial = new THREE.MeshBasicMaterial({
      color: 0x488384,
      wireframe: true,
    });
    this.grid = new THREE.Mesh(this.gridGeo, this.gridMaterial);
    this.grid.rotation.x = Math.PI / 2;
    this.grid.position.set(0, this.gridEdgeLength * -0.5, 0);
    this.scene.add(this.grid);

    // GRID CUBE
    const gridCubeGeometry = new THREE.BoxGeometry(
      this.gridEdgeLength,
      this.gridEdgeLength,
      this.gridEdgeLength
    );

    const gridCubeEdges = new THREE.EdgesGeometry(gridCubeGeometry);
    const gridCubeLines = new THREE.LineSegments(
      gridCubeEdges,
      new THREE.LineBasicMaterial({ color: 0x488384 })
    );
    //This line is to remind readers that the cube is centered
    gridCubeLines.position.set(0, 0, 0);
    this.scene.add(gridCubeLines);

    //NORTH STAR
    //EAST STAR
    //SOUTH STAR
    //WEST STAR
    this.scene.add(cardinalDirections);

    //AMBIENT LIGHT
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(ambientLight);
  }

  componentDidMount() {
    document.getElementById('canvas').appendChild(this.renderer.domElement);
    this.animate();
  }

  componentDidUpdate = prevProps => {};

  animate = async () => {
    requestAnimationFrame(this.animate);

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return <div id="canvas" />;
  }
}

const mapState = state => {
  return {
    scale: state.scale,
    voxelSize: state.voxelSize,
    currentDronePosition: state.currentDronePosition,
    startingPosition: state.startingPosition,
    obstacles: state.obstacles,
    flightInstructions: state.flightInstructions,
    postTakeoffPosition: state.postTakeoffPosition,
  };
};

// const mapDispatch = dispatch => {
//   return {
//     changeRoll: newRoll => {
//       dispatch(changeRoll(newRoll));
//     },
//     changePitch: newPitch => {
//       dispatch(changePitch(newPitch));
//     },
//     changeYaw: newYaw => {
//       dispatch(changeYaw(newYaw));
//     },
//   };
// };

export default connect(
  mapState,
  null
)(SceneCanvas);
