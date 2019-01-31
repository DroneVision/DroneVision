import React, { Component } from 'react';
import * as THREE from 'three';
import { connect } from 'react-redux';
import OrbitControls from 'three-orbitcontrols';
import PubSub from 'pubsub-js';
import canvasSkybox from '../ThreeJSModules/CanvasSkybox';

class Sandbox extends Component {
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
    // this.scene.add(canvasSkybox);

    //SPHERE
    const sphereGeo = new THREE.SphereGeometry(1, 32, 32);
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0xff00ff });
    this.sphere = new THREE.Mesh(sphereGeo, sphereMat);
    this.sphere.position.set(0, 0, 0);
    this.scene.add(this.sphere);

    //GRID
    this.gridEdgeLength =
      this.props.scale / (this.props.scale / this.props.voxelSize);

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
    // const northStarGeometry = new THREE.CylinderBufferGeometry(0, 10, 30, 4, 1);
    // const northStarMaterial = new THREE.MeshPhongMaterial({
    //   color: 0xffffff,
    //   flatShading: true,
    // });

    // const northStar = new THREE.Mesh(northStarGeometry, northStarMaterial);

    // northStar.position.set(0, 0, 200);
    // northStar.updateMatrix();
    // northStar.matrixAutoUpdate = false;
    // northStar.position.set(0, this.gridEdgeLength * -0.5, 0);
    // this.scene.add(northStar);

    //TAKEOFF LINE
    // const takeoffLineMaterial = new THREE.LineBasicMaterial({
    //   color: 'yellow',
    // });
    // const takeoffLineGeometry = new THREE.Geometry();
    // takeoffLineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    // takeoffLineGeometry.vertices.push(new THREE.Vector3(0, 1, 0));

    // this.takeoffLine = new THREE.Line(takeoffLineGeometry, takeoffLineMaterial);
    // this.takeoffLine.position.set(0, this.gridEdgeLength * -0.5, 0);
    // this.scene.add(this.takeoffLine);

    //AMBIENT LIGHT
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);
  }

  componentDidMount() {
    document.getElementById('sandbox').appendChild(this.renderer.domElement);
    this.animate();
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
      const point = { x: 0, y: 1, z: 0 };
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
      this.line.position.set(0, this.gridEdgeLength * -0.5, 0);
      this.scene.add(this.line);

      const landLineMaterial = new THREE.LineBasicMaterial({ color: 'blue' });
      const landLineGeometry = new THREE.Geometry();
      landLineGeometry.vertices.push(
        new THREE.Vector3(point.x, point.y, point.z)
      );
      landLineGeometry.vertices.push(new THREE.Vector3(point.x, 0, point.z));

      this.landLine = new THREE.Line(landLineGeometry, landLineMaterial);
      this.landLine.position.set(0, this.gridEdgeLength * -0.5, 0);
      this.scene.add(this.landLine);
    });

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
  }

  moveSphere = (endPosition, speed) => {
    if (this.sphere.position.x <= endPosition.x) {
      this.sphere.position.x += endPosition.x / speed;
    }
    if (this.sphere.position.y <= endPosition.y) {
      this.sphere.position.y += endPosition.y / speed;
    }
    if (this.sphere.position.z <= endPosition.z) {
      this.sphere.position.z += endPosition.z / speed;
    }
  };

  animate = () => {
    PubSub.subscribe('move-sphere', (msg, data) => {
      this.moveSphere({ x: 5, y: 5, z: 5 }, 1000);
    });

    requestAnimationFrame(this.animate);
    // console.dir(this.camera);

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return <div id="sandbox" />;
  }
}

const mapState = state => {
  return {
    scale: state.scale,
    voxelSize: state.voxelSize,
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
)(Sandbox);