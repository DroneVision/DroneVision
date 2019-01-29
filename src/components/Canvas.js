import React, { Component } from 'react';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import PubSub from 'pubsub-js';

const backImage = require('../assets/skybox/back.png');
const frontImage = require('../assets/skybox/front.png');
const upImage = require('../assets/skybox/up.png');
const downImage = require('../assets/skybox/down.png');
const rightImage = require('../assets/skybox/right.png');
const leftImage = require('../assets/skybox/left.png');

class Canvas extends Component {
  constructor() {
    super();

    //renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(640, 360, false);

    //scene
    this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color(0xa9a9a9);

    //camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.set(-2.8, 5.4, -14.8);

    //controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; //an animation loop is required when damping or auto-rotation are enabled
    this.controls.dampingFactor = 1;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 50;
    this.controls.maxPolarAngle = Math.PI / 2;

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

    //GRID
    this.planeGeo = new THREE.PlaneBufferGeometry(10, 10, 10, 10);
    this.planeMaterial = new THREE.MeshBasicMaterial({
      color: 0x488384,
      wireframe: true,
    });
    this.grid = new THREE.Mesh(this.planeGeo, this.planeMaterial);
    this.grid.rotation.x = Math.PI / 2;
    this.scene.add(this.grid);

    //TRIANGLE
    const geometry = new THREE.CylinderBufferGeometry(0, 10, 30, 4, 1);
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      flatShading: true,
    });
    for (let i = 0; i < 5; i++) {
      const triangle = new THREE.Mesh(geometry, material);
      triangle.position.x = 0;
      triangle.position.y = 0;
      triangle.position.z = 200;
      triangle.updateMatrix();
      triangle.matrixAutoUpdate = false;
      this.scene.add(triangle);
    }

    //TAKEOFF YELLOW LINE
    const yellowLineMaterial = new THREE.LineBasicMaterial({
      color: 'yellow',
    });
    const yellowLineGeometry = new THREE.Geometry();
    yellowLineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    yellowLineGeometry.vertices.push(new THREE.Vector3(0, 1, 0));

    const yellowLine = new THREE.Line(yellowLineGeometry, yellowLineMaterial);
    this.scene.add(yellowLine);

    //AMBIENT LIGHT
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);
  }

  componentDidMount() {
    document.getElementById('canvas').appendChild(this.renderer.domElement);
    this.animate();
    PubSub.subscribe('draw-path', (msg, flightCoords) => {
      if (this.line) {
        this.scene.remove(this.line);
        this.scene.remove(this.landLine);
      }

      //create a LineBasicMaterial
      const material = new THREE.LineBasicMaterial({
        color: 'red',
        linewidth: 5,
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
      this.scene.add(this.line);

      const landLineMaterial = new THREE.LineBasicMaterial({ color: 'blue' });
      const landLineGeometry = new THREE.Geometry();
      landLineGeometry.vertices.push(
        new THREE.Vector3(point.x, point.y, point.z)
      );
      landLineGeometry.vertices.push(new THREE.Vector3(point.x, 0, point.z));

      this.landLine = new THREE.Line(landLineGeometry, landLineMaterial);

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

  animate = () => {
    requestAnimationFrame(this.animate);
    // console.dir(this.camera);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return <div id="canvas" />;
  }
}

export default Canvas;
