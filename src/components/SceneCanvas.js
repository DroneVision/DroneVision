import React, { Component } from 'react';
import * as THREE from 'three';
import { connect } from 'react-redux';
import OrbitControls from 'three-orbitcontrols';
import autoPilotCanvasSkybox from '../ThreeJSModules/AutoPilotCanvasSkybox';
import cardinalDirections from '../ThreeJSModules/CardinalDirections';
import _ from 'lodash';

import { createSceneObjs } from '../utils/canvasUtils';

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
    this.scene.add(cardinalDirections);

    //AMBIENT LIGHT
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(ambientLight);
  }

  componentDidMount() {
    const { sceneObjects, selectedObjId } = this.props;
    document.getElementById('canvas').appendChild(this.renderer.domElement);
    this.animate();
    this.sceneObjects = createSceneObjs(sceneObjects, selectedObjId);
    this.scene.add(this.sceneObjects);
  }

  componentDidUpdate = prevProps => {
    const { sceneObjects, selectedObjId } = this.props;
    // console.dir(prevProps.sceneObjects);
    // console.dir(sceneObjects);
    // if (!_.isEqual(prevProps.sceneObjects, sceneObjects)) {

    if (this.sceneObjects) {
      this.scene.remove(this.sceneObjects);
    }
    this.sceneObjects = createSceneObjs(sceneObjects, selectedObjId);
    this.scene.add(this.sceneObjects);
    // }
  };

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
    sceneObjects: state.sceneObjects,
    selectedObjId: state.selectedObjId,
  };
};

const mapDispatch = dispatch => {
  return {};
};

export default connect(
  mapState,
  mapDispatch
)(SceneCanvas);
