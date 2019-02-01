import React, { Component } from 'react';
import * as THREE from 'three';
import { connect } from 'react-redux';
import OrbitControls from 'three-orbitcontrols';
import PubSub from 'pubsub-js';
import canvasSkybox from '../ThreeJSModules/CanvasSkybox';
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
    // this.camera.position.set(15, -15, -30);

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
    const northStarGeometry = new THREE.CylinderBufferGeometry(0, 10, 30, 4, 1);
    const northStarMaterial = new THREE.MeshPhongMaterial({
      color: 0xb29600,
      flatShading: true,
    });

    const northStar = new THREE.Mesh(northStarGeometry, northStarMaterial);

    northStar.position.set(0, 0, 200);
    northStar.updateMatrix();
    northStar.matrixAutoUpdate = false;
    northStar.position.set(0, this.gridEdgeLength * -0.5, 0);
    this.scene.add(northStar);

    //NORTH STAR HEAVENLY LIGHT
    const northStarHeavenlyLightGeometry = new THREE.CylinderBufferGeometry(
      0,
      1,
      140,
      4,
      1
    );
    const northStarHeavenlyLightMaterial = new THREE.MeshPhongMaterial({
      color: 0xffff00,
      flatShading: true,
    });

    const northStarHeavenlyLight = new THREE.Mesh(
      northStarHeavenlyLightGeometry,
      northStarHeavenlyLightMaterial
    );

    northStarHeavenlyLight.position.set(0, 75, 200);
    northStarHeavenlyLight.updateMatrix();
    northStarHeavenlyLight.matrixAutoUpdate = false;
    northStarHeavenlyLight.position.set(0, this.gridEdgeLength * -0.5, 0);
    this.scene.add(northStarHeavenlyLight);

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
  // PubSub.subscribe('new-line', (msg, points) => {
  //   const { point1, point2 } = points;
  //   //create a LineBasicMaterial
  //   const material = new THREE.LineBasicMaterial({
  //     color: 'red',
  //     linewidth: 5,
  //   });

  //   const geometry = new THREE.Geometry();
  //   geometry.vertices.push(new THREE.Vector3(point1.x, point1.y, point1.z));
  //   geometry.vertices.push(new THREE.Vector3(point2.x, point2.y, point2.z));

  //   const line = new THREE.Line(geometry, material);
  //   this.scene.add(line);

  //   //BLUE LAND LINE
  //   if (this.state.landLine) {
  //     this.scene.remove(this.state.landLine);
  //   }
  //   const landLineMaterial = new THREE.LineBasicMaterial({ color: 'blue' });
  //   const landLineGeometry = new THREE.Geometry();
  //   landLineGeometry.vertices.push(
  //     new THREE.Vector3(point2.x, point2.y, point2.z)
  //   );
  //   landLineGeometry.vertices.push(new THREE.Vector3(point2.x, 0, point2.z));

  //   const landLine = new THREE.Line(landLineGeometry, landLineMaterial);
  //   landLine.name = 'landLine';
  //   this.scene.add(landLine);
  //   this.setState({ landLine: landLine });
  // });

  // moveSphere = (startingPosition, endPosition, speed) => {
  //   let currentPosition = this.sphere.position;

  //   let incrementX = Math.abs((startingPosition.x - endPosition.x) / speed);
  //   let incrementY = Math.abs((startingPosition.y - endPosition.y) / speed);
  //   let incrementZ = Math.abs((startingPosition.z - endPosition.z) / speed);

  //   //END X is Greater
  //   if (currentPosition.x < endPosition.x) {
  //     currentPosition.x += incrementX;
  //     if (currentPosition.x + incrementX > endPosition.x) {
  //       currentPosition.x = endPosition.x;
  //     }
  //   }

  //   //END X is Lesser
  //   if (currentPosition.x > endPosition.x) {
  //     currentPosition.x -= incrementX;
  //     if (currentPosition.x - incrementX < endPosition.x) {
  //       currentPosition.x = endPosition.x;
  //     }
  //   }

  //   //END Y is Greater
  //   if (currentPosition.y < endPosition.y) {
  //     currentPosition.y += incrementY;
  //     if (currentPosition.y + incrementY > endPosition.y) {
  //       currentPosition.y = endPosition.y;
  //     }
  //   }

  //   //END Y is Lesser
  //   if (currentPosition.y > endPosition.y) {
  //     currentPosition.y -= incrementY;
  //     if (currentPosition.y - incrementY < endPosition.y) {
  //       currentPosition.y = endPosition.y;
  //     }
  //   }

  //   //END Z is Greater
  //   if (currentPosition.z < endPosition.z) {
  //     currentPosition.z += incrementZ;
  //     if (currentPosition.z + incrementZ > endPosition.z) {
  //       currentPosition.z = endPosition.z;
  //     }
  //   }

  //   //END Z is Lesser
  //   if (currentPosition.z > endPosition.z) {
  //     currentPosition.z -= incrementZ;
  //     if (currentPosition.z - incrementZ < endPosition.z) {
  //       currentPosition.z = endPosition.z;
  //     }
  //   }
  // };

  // moveSphere = (distances, speed) => {
  //   const { x, y, z } = distances;
  //   let direction = new THREE.Vector3(x, y, z);
  //   let vector = direction.clone().multiplyScalar(speed, speed, speed);

  //   this.sphere.position.x += vector.x;
  //   this.sphere.position.y += vector.y;
  //   this.sphere.position.z += vector.z;
  // };

  moveDrone = object => {
    if (object.position.x !== this.props.currentDronePosition.x) {
      let differenceX = this.props.currentDronePosition.x - object.position.x;
      if (differenceX > 0) {
        object.position.x = object.position.x + 0.01;
      }
      if (differenceX < 0) {
        object.position.x = object.position.x - 0.01;
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
    }
    if (object.position.z !== this.props.currentDronePosition.z) {
      let differenceZ = this.props.currentDronePosition.z - object.position.z;
      if (differenceZ > 0) {
        object.position.z = object.position.z + 0.01;
      }
      if (differenceZ < 0) {
        object.position.z = object.position.z - 0.01;
      }
    }
  };

  animate = async () => {
    requestAnimationFrame(this.animate);

    this.moveDrone(this.sphere);

    // if (this.sphere.position.x !== this.props.currentDronePosition.x) {
    //   this.sphere.position.x = this.props.currentDronePosition.x;
    // }
    // if (this.sphere.position.y !== this.props.currentDronePosition.y) {
    //   this.sphere.position.y = this.props.currentDronePosition.y;
    // }
    // if (this.sphere.position.z !== this.props.currentDronePosition.z) {
    //   this.sphere.position.z = this.props.currentDronePosition.z;
    // }
    // console.dir(this.camera);
    // if (this.run) {
    // this.moveSphere({ x: 0, y: 0, z: 0 }, { x: 5, y: 5, z: 5 }, 120);
    // this.moveSphere(this.sphere.position, { x: 5, y: 5, z: 5 }, 120);
    // }
    // if (this.sphere.position.x < this.props.droneCurrentX)
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
