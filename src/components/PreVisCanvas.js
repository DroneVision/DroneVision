import React, { Component } from 'react';
import * as THREE from 'three';
import { connect } from 'react-redux';
import OrbitControls from 'three-orbitcontrols';
import preVisCanvasSkybox from '../ThreeJSModules/PreVisCanvasSkybox';
import droneModel from '../ThreeJSModules/Drone3DModel';
import cardinalDirections from '../ThreeJSModules/CardinalDirections';
import Obstacles from '../ThreeJSModules/Obstacles';
import _ from 'lodash';
import { createSceneObjs } from '../utils/canvasUtils';

class PreVisCanvas extends Component {
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

    //ORBITAL CONTROLS
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableKeys = false;
    this.controls.enableDamping = true; //an animation loop is required when damping or auto-rotation are enabled
    this.controls.dampingFactor = 1;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 50;
    // this.controls.maxPolarAngle = Math.PI / 2;

    // //SKYBOX
    this.scene.add(preVisCanvasSkybox);

    //DRONE 3D MODEL
    this.drone3DModel = droneModel.clone();
    this.drone3DModel.position.set(
      this.props.postTakeoffPosition.x,
      this.props.postTakeoffPosition.y,
      this.props.postTakeoffPosition.z
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

    //AMBIENT LIGHT
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(ambientLight);

    this.takeoffLine = null;
    this.flightLine = null;
    this.landLine = null;
  }

  componentDidMount() {
    const { sceneObjects } = this.props;
    document.getElementById('canvas').appendChild(this.renderer.domElement);
    this.animate();

    this.drawLineForPreVis(this.props.flightInstructions);

    this.drone3DModel.position.set(
      this.props.startingPosition.x,
      this.props.startingPosition.y,
      this.props.startingPosition.z
    );

    this.sceneObjects = createSceneObjs(sceneObjects);
    this.scene.add(this.sceneObjects);

    //OBSTACLES (toggled by redux store)
    if (this.props.obstacles) {
      this.scene.add(Obstacles);
    } else {
      this.scene.remove(Obstacles);
    }
  }

  componentDidUpdate(prevProps) {
    const { sceneObjects } = this.props;
    this.drawLineForPreVis(this.props.flightInstructions);
    if (!_.isEqual(prevProps.sceneObjects, sceneObjects)) {
      if (this.sceneObjects) {
        this.scene.remove(this.sceneObjects);
      }
      this.sceneObjects = createSceneObjs(sceneObjects);
      this.scene.add(this.sceneObjects);
    }
  }

  drawLineForPreVis = flightInstructions => {
    this.scene.remove(this.takeoffLine);
    this.scene.remove(this.flightLine);
    this.scene.remove(this.landLine);

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

    //RED FLIGHT LINE
    const flightLineMaterial = new THREE.LineBasicMaterial({
      color: 0xff0000,
    });
    const flightLineGeometry = new THREE.Geometry();
    const takeoffPoint = { ...this.props.startingPosition };
    const pointAboveTakeoff = { ...takeoffPoint, y: takeoffPoint.y + 1 };
    flightLineGeometry.vertices.push(
      new THREE.Vector3(
        pointAboveTakeoff.x,
        pointAboveTakeoff.y,
        pointAboveTakeoff.z
      )
    );

    let point = { ...pointAboveTakeoff };
    //draw red lines by iterating over all flight instructions
    flightInstructions.forEach(instruction => {
      const command = instruction.droneInstruction.split(' ')[0];
      const drawInstruction = instruction.drawInstruction;
      //just checking to see if the command is a rotation
      if ((command === 'takeoff') | (command === 'land')) {
        //do nothing
      } else if (command === 'cw') {
        // this.drone3DModel.rotation.y =
        // Math.PI - (Math.PI / 2) * this.props.droneOrientation;
      } else if (command === 'ccw') {
        // this.drone3DModel.rotation.y =
        // -Math.PI - (Math.PI / 2) * this.props.droneOrientation;
      } else {
        const [z, x, y] = drawInstruction;
        point.x = point.x + x;
        point.y = point.y + y;
        point.z = point.z + z;
        // x -> z
        // y -> x
        // z -> y
        flightLineGeometry.vertices.push(
          new THREE.Vector3(point.x, point.y, point.z)
        );
      }
    });
    this.flightLine = new THREE.Line(flightLineGeometry, flightLineMaterial);
    this.scene.add(this.flightLine);

    const takeOffEqualsLanding =
      point.x === pointAboveTakeoff.x &&
      point.y === pointAboveTakeoff.y &&
      point.z === pointAboveTakeoff.z;

    // BLUE LANDING LINE
    if (!takeOffEqualsLanding) {
      //add land line if drone is not still at the starting position
      const landLineGeometry = new THREE.Geometry();
      landLineGeometry.vertices.push(
        new THREE.Vector3(point.x, point.y, point.z)
      );
      const landLineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
      landLineGeometry.vertices.push(
        new THREE.Vector3(point.x, this.props.scale * -0.5, point.z)
      );
      this.landLine = new THREE.Line(landLineGeometry, landLineMaterial);
      this.scene.add(this.landLine);
    }

    //OBSTACLES (toggled by redux store)
    if (this.props.obstacles) {
      this.scene.add(Obstacles);
    } else {
      this.scene.remove(Obstacles);
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
    currentDroneRotation: state.currentDroneRotation,
    startingPosition: state.startingPosition,
    obstacles: state.obstacles,
    postTakeoffPosition: state.postTakeoffPosition,
    droneOrientation: state.droneOrientation,
    flightInstructions: state.flightInstructions,
    preVisualizeAnimation: state.preVisualizeAnimation,
    sceneObjects: state.sceneObjects,
  };
};

const mapDispatch = dispatch => {
  return {};
};

export default connect(
  mapState,
  mapDispatch
)(PreVisCanvas);
