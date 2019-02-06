import React, { Component } from 'react';
import * as THREE from 'three';
import { connect } from 'react-redux';
import OrbitControls from 'three-orbitcontrols';
import autoPilotCanvasSkybox from '../ThreeJSModules/AutoPilotCanvasSkybox';
import droneModel from '../ThreeJSModules/Drone3DModel';
import cardinalDirections from '../ThreeJSModules/CardinalDirections';
import Obstacles from '../ThreeJSModules/Obstacles';
import _ from 'lodash';
import { updateCDP } from '../store/store';
import { createSceneObjs } from '../utils/canvasUtils';

const { ipcRenderer } = window.require('electron');

class AutoPilotCanvas extends Component {
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
    this.scene.add(autoPilotCanvasSkybox);

    //DRONE 3D MODEL
    this.drone3DModel = droneModel.clone();
    this.drone3DModel.position.set(
      this.props.startingPosition.x,
      this.props.startingPosition.y,
      this.props.startingPosition.z
    );

    this.controls.target = this.drone3DModel.position;
    this.drone3DModel.rotation.y = Math.PI;
    this.drone3DModel.scale.set(0.1, 0.1, 0.1);

    this.scene.add(this.drone3DModel);

    //GRID
    this.gridEdgeLength = this.props.voxelSize;

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
    const { sceneObjects } = this.props;
    document.getElementById('canvas').appendChild(this.renderer.domElement);
    this.animate();

    this.redrawLines();

    this.sceneObjects = createSceneObjs(sceneObjects);
    this.scene.add(this.sceneObjects);

    ipcRenderer.on('next-drone-move', (msg, singleFlightCoord) => {
      ipcRenderer.send('get-drone-moves');

      if (singleFlightCoord === 'command') {
      } else if (singleFlightCoord === 'takeoff') {
        this.props.updateCDP(this.props.startingPosition);
      } else if (singleFlightCoord === 'land') {
        this.props.updateCDP({
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

        this.props.updateCDP(newCoords);
      }
    });
  }

  componentDidUpdate = prevProps => {
    this.redrawLines(prevProps);
    const { sceneObjects } = this.props;
    if (!_.isEqual(prevProps.sceneObjects, sceneObjects)) {
      if (this.sceneObjects) {
        this.scene.remove(this.sceneObjects);
      }
      this.sceneObjects = createSceneObjs(sceneObjects);
      this.scene.add(this.sceneObjects);
    }
  };

  redrawLines = (prevProps = null) => {
    const {
      postTakeoffPosition,
      flightInstructions: newFlightInstructions,
      obstacles,
    } = this.props;
    let oldFlightInstructions;
    if (prevProps) {
      const { flightInstructions } = prevProps;
      oldFlightInstructions = flightInstructions;
    } else {
      oldFlightInstructions = null;
    }

    //OBSTACLES (toggled by redux store)
    if (obstacles) {
      this.scene.add(Obstacles);
    } else {
      this.scene.remove(Obstacles);
    }

    //REMOVE OLD LINE AND LAND LINE
    if (this.line) {
      this.scene.remove(this.line);
      this.scene.remove(this.landLine);
    }

    //DRAW NEW FLIGHT PATH
    const material = new THREE.LineBasicMaterial({
      color: 0xff0000,
    });
    const geometry = new THREE.Geometry();

    const point = { ...postTakeoffPosition };
    geometry.vertices.push(new THREE.Vector3(point.x, point.y, point.z));

    if (!_.isEqual(oldFlightInstructions, newFlightInstructions)) {
      newFlightInstructions.slice(1, -1).forEach(instructionObj => {
        const { droneInstruction, drawInstruction } = instructionObj;

        //just checking to see if the command is a rotation
        const [command] = droneInstruction.split(' ');
        if (command !== 'cw' && command !== 'ccw') {
          const [z, x, y] = drawInstruction;
          point.x += x;
          point.y += y;
          point.z += z;
          // x -> z
          // y -> x
          // z -> y
          geometry.vertices.push(new THREE.Vector3(point.x, point.y, point.z));
        }
      });

      this.line = new THREE.Line(geometry, material);

      this.scene.add(this.line);
    }
    if (!_.isEqual(point, postTakeoffPosition)) {
      //add land line if drone is not still at the starting position
      const landLineGeometry = new THREE.Geometry();
      landLineGeometry.vertices.push(new THREE.Vector3(point.x, -5, point.z));
      const landLineMaterial = new THREE.LineBasicMaterial({ color: 'blue' });

      landLineGeometry.vertices.push(
        new THREE.Vector3(point.x, point.y, point.z)
      );
      this.landLine = new THREE.Line(landLineGeometry, landLineMaterial);
      this.scene.add(this.landLine);
    }
  };

  moveDrone = object => {
    let differenceX = this.props.currentDronePosition.x - object.position.x;
    let differenceY = this.props.currentDronePosition.y - object.position.y;
    let differenceZ = this.props.currentDronePosition.z - object.position.z;
    let speed;

    if (differenceX > 8 || differenceY > 8 || differenceZ > 8) {
      speed = 0.05;
    } else if (differenceX > 6 || differenceY > 6 || differenceZ > 6) {
      speed = 0.04;
    } else if (differenceX > 4 || differenceY > 4 || differenceZ > 4) {
      speed = 0.03;
    } else if (differenceX > 2 || differenceY > 2 || differenceZ > 2) {
      speed = 0.02;
    } else {
      speed = 0.01;
    }

    if (object.position.x !== this.props.currentDronePosition.x) {
      if (differenceX > 0) {
        object.position.x = object.position.x + speed;
      }
      if (differenceX < 0) {
        object.position.x = object.position.x - speed;
      }
      if (Math.abs(differenceX) < speed + 0.01) {
        object.position.x = this.props.currentDronePosition.x;
      }
    }
    if (object.position.y !== this.props.currentDronePosition.y) {
      if (differenceY > 0) {
        object.position.y = object.position.y + speed;
      }
      if (differenceY < 0) {
        object.position.y = object.position.y - speed;
      }
      if (Math.abs(differenceY) < speed + 0.01) {
        object.position.y = this.props.currentDronePosition.y;
      }
    }
    if (object.position.z !== this.props.currentDronePosition.z) {
      if (differenceZ > 0) {
        object.position.z = object.position.z + speed;
      }
      if (differenceZ < 0) {
        object.position.z = object.position.z - speed;
      }
      if (Math.abs(differenceZ) < speed + 0.01) {
        object.position.z = this.props.currentDronePosition.z;
      }
    }
  };

  rotateDrone = object => {
    let difference = this.props.currentDroneRotation - object.rotation.y;
    let speed = 0.01;

    if (Math.abs(difference) <= Math.PI) {
      speed = 0.02;
    } else if (Math.abs(difference) <= Math.PI + Math.PI / 2) {
      speed = 0.04;
    } else if (Math.abs(difference) < Math.PI * 2) {
      speed = 0.06;
    } else if (Math.abs(difference) >= Math.PI * 2) {
      speed = 0.08;
    }

    if (difference < 0) {
      if (object.rotation.y !== this.props.currentDroneRotation) {
        object.rotation.y = object.rotation.y - speed;
      }
    } else {
      if (object.rotation.y !== this.props.currentDroneRotation) {
        object.rotation.y = object.rotation.y + speed;
      }
    }
    if (Math.abs(difference) < speed + 0.01) {
      object.rotation.y = this.props.currentDroneRotation;
    }
  };

  animate = async () => {
    requestAnimationFrame(this.animate);

    this.moveDrone(this.drone3DModel);
    this.rotateDrone(this.drone3DModel);

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
  };
};

const mapDispatch = dispatch => {
  return {
    updateCDP: dronePosition => dispatch(updateCDP(dronePosition)),
  };
};

export default connect(
  mapState,
  mapDispatch
)(AutoPilotCanvas);
