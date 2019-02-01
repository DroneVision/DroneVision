import React, { Component } from 'react';
import * as THREE from 'three';
import { connect } from 'react-redux';
import OrbitControls from 'three-orbitcontrols';
import PubSub from 'pubsub-js';
import canvasSkybox from '../ThreeJSModules/CanvasSkybox';
import drone3DModel from '../ThreeJSModules/DroneForCanvas';
import cardinalDirections from '../ThreeJSModules/CardinalDirections';
import Obstacles from '../ThreeJSModules/Obstacles';
import _ from 'lodash';
import { updateCDP } from '../store/store';

const { ipcRenderer } = window.require('electron');

class Canvas extends Component {
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
    this.controls.enableDamping = true; //an animation loop is required when damping or auto-rotation are enabled
    this.controls.dampingFactor = 1;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 50;
    this.controls.maxPolarAngle = Math.PI / 2;

    // //SKYBOX
    this.scene.add(canvasSkybox);

    //SPHERE
    const sphereGeo = new THREE.SphereGeometry(0.1, 32, 32);
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0xff00ff });
    this.sphere = new THREE.Mesh(sphereGeo, sphereMat);
    // this.sphere.position.set(0, 0, 0);
    // this.sphere.position.set(0, this.gridEdgeLength * -0.5, 0);
    this.sphere.position.set(
      this.props.startingPosition.x,
      this.props.startingPosition.y,
      this.props.startingPosition.z
    );

    this.scene.add(this.sphere);

    //DRONE 3D MODEL
    drone3DModel.position.set(
      this.props.startingPosition.x,
      this.props.startingPosition.y,
      this.props.startingPosition.z
    );

    drone3DModel.rotation.y = Math.PI;
    drone3DModel.scale.set(0.1, 0.1, 0.1);

    this.scene.add(drone3DModel);

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

    //OBSTACLES (toggled by redux store)
    if (this.props.obstacles) {
      this.scene.add(Obstacles);
    }

    //TAKEOFF LINE
    const takeoffLineMaterial = new THREE.LineBasicMaterial({
      color: 'yellow',
    });
    const takeoffLineGeometry = new THREE.Geometry();
    takeoffLineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    takeoffLineGeometry.vertices.push(new THREE.Vector3(0, 1, 0));

    this.takeoffLine = new THREE.Line(takeoffLineGeometry, takeoffLineMaterial);
    this.takeoffLine.position.set(0, this.gridEdgeLength * -0.5, 0);
    this.scene.add(this.takeoffLine);

    //AMBIENT LIGHT
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(ambientLight);
  }

  componentDidMount() {
    document.getElementById('canvas').appendChild(this.renderer.domElement);
    this.animate();
    ipcRenderer.on('hi', event => {
      console.log('hiiiii');
    });
    ipcRenderer.on('next-drone-move', (msg, singleFlightCoord) => {
      console.log('subc');

      ipcRenderer.send('get-drone-moves');

      if (singleFlightCoord === 'command') {
      } else if (singleFlightCoord === 'takeoff') {
        updateCDP(this.props.startingPosition);
      } else if (singleFlightCoord === 'land') {
        updateCDP({
          x: this.props.currentDronePosition.x,
          y: this.props.currentDronePosition.y,
          z: 0,
        });
      } else {
        let newCoords = {};
        let singleFlightCoordArray = singleFlightCoord
          .split(' ')
          .slice(1, 4)
          .map(numStr => Number(numStr) / this.props.distance);

        const [z, x, y] = singleFlightCoordArray;
        // x -> z
        // y -> x
        // z -> y
        newCoords.x = this.props.currentDronePosition.x + x;
        newCoords.y = this.props.currentDronePosition.y + y;
        newCoords.z = this.props.currentDronePosition.z + z;

        updateCDP(newCoords);
      }
    });

    PubSub.subscribe('draw-path', (msg, flightCoords) => {
      if (this.line) {
        this.scene.remove(this.line);
        this.scene.remove(this.landLine);
      }

      //DRAWS FLIGHT PATH
      const material = new THREE.LineBasicMaterial({
        color: 0xff0000,
      });
      const geometry = new THREE.Geometry();
      const startingPoint = { x: 0, y: 1, z: 0 };
      const point = { ...startingPoint };
      geometry.vertices.push(new THREE.Vector3(point.x, point.y, point.z));
      flightCoords.forEach(command => {
        const [z, x, y] = command;
        point.x += x;
        point.y += y;
        point.z += z;
        // x -> z
        // y -> x
        // z -> y
        geometry.vertices.push(new THREE.Vector3(point.x, point.y, point.z));
      });
      this.line = new THREE.Line(geometry, material);
      //shift position of line down because the plane had to be shifted down in 3d space
      this.line.position.set(0, this.gridEdgeLength * -0.5, 0);
      this.scene.add(this.line);

      if (!_.isEqual(point, startingPoint)) {
        const landLineGeometry = new THREE.Geometry();
        landLineGeometry.vertices.push(new THREE.Vector3(point.x, 0, point.z));
        const landLineMaterial = new THREE.LineBasicMaterial({ color: 'blue' });

        landLineGeometry.vertices.push(
          new THREE.Vector3(point.x, point.y, point.z)
        );
        this.landLine = new THREE.Line(landLineGeometry, landLineMaterial);
        this.landLine.position.set(0, this.gridEdgeLength * -0.5, 0);
        this.scene.add(this.landLine);
      }
    });
  }

  moveDrone = object => {
    if (object.position.x !== this.props.currentDronePosition.x) {
      let differenceX = this.props.currentDronePosition.x - object.position.x;
      if (differenceX > 0) {
        object.position.x = object.position.x + 0.01;
      }
      if (differenceX < 0) {
        object.position.x = object.position.x - 0.01;
      }
      if (Math.abs(differenceX) < 0.02) {
        object.position.x = this.props.currentDronePosition.x;
      }
    }
    if (object.position.y !== this.props.currentDronePosition.y) {
      let differenceY = this.props.currentDronePosition.y - object.position.y;
      if (differenceY > 0) {
        object.position.y = object.position.y + 0.01;
      }
      if (differenceY < 0) {
        object.position.y = object.position.y - 0.01;
      }
      if (Math.abs(differenceY) < 0.02) {
        object.position.y = this.props.currentDronePosition.y;
      }
    }
    if (object.position.z !== this.props.currentDronePosition.z) {
      let differenceZ = this.props.currentDronePosition.z - object.position.z;
      if (differenceZ > 0) {
        object.position.z = object.position.z + 0.01;
      }
      if (differenceZ < 0) {
        object.position.z = object.position.z - 0.01;
      }
      if (Math.abs(differenceZ) < 0.02) {
        object.position.z = this.props.currentDronePosition.z;
      }
    }
  };

  animate = async () => {
    requestAnimationFrame(this.animate);

    this.moveDrone(this.sphere);
    this.moveDrone(drone3DModel);
    // this.moveDrone(this.camera);

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
)(Canvas);
