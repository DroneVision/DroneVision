import React, { Component } from 'react';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import PubSub from 'pubsub-js';
const keyboard = {};

function keyDown(event) {
  keyboard[event.keyCode] = true;
}

function keyUp(event) {
  keyboard[event.keyCode] = false;
}

// var geometry = new THREE.BoxGeometry(1, 1, 1);
// var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// var cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

class Canvas extends Component {
  constructor() {
    super();

    //renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(640, 360, false);

    //scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xa9a9a9);

    //camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.set(0, -13, 6.5);
    // this.camera.rotateOnWorldAxis()

    //controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; //an animation loop is required when damping or auto-rotation are enabled
    this.controls.dampingFactor = 0.25;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 1000;
    // this.controls.maxPolarAngle = Math.P;1I / 2;

    this.planeGeo = new THREE.PlaneBufferGeometry(10, 10, 10, 10);
    this.planeMaterial = new THREE.MeshBasicMaterial({
      color: 0x488384,
      wireframe: true,
    });
    this.floor = new THREE.Mesh(this.planeGeo, this.planeMaterial);

    this.scene.add(this.floor);

    // lights
    var light1 = new THREE.DirectionalLight(0xffffff);
    light1.position.set(1, 1, 1);
    this.scene.add(light1);
    var light2 = new THREE.DirectionalLight(0x002288);
    light2.position.set(-1, -1, -1);
    this.scene.add(light2);
    var light3 = new THREE.AmbientLight(0x222222);
    this.scene.add(light3);
  }

  componentDidMount() {
    document.getElementById('canvas').appendChild(this.renderer.domElement);
    this.animate();
    PubSub.subscribe('new-line', (msg, points) => {
      const { point1, point2 } = points;
      //create a LineBasicMaterial
      var material = new THREE.LineBasicMaterial({ color: 'red' });
      var geometry = new THREE.Geometry();
      geometry.vertices.push(new THREE.Vector3(point1.x, point1.y, point1.z));
      geometry.vertices.push(new THREE.Vector3(point2.x, point2.y, point2.z));

      var line = new THREE.Line(geometry, material);
      this.scene.add(line);
    });
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    console.dir(this.camera);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    // if (keyboard[87]) {
    //   // W key
    //   this.camera.position.x -= Math.sin(this.camera.rotation.y) * 0.5;
    //   this.camera.position.z -= -Math.cos(this.camera.rotation.y) * 0.5;
    // }
    // if (keyboard[83]) {
    //   // S key
    //   this.camera.position.x += Math.sin(this.camera.rotation.y) * 0.5;
    //   this.camera.position.z += -Math.cos(this.camera.rotation.y) * 0.5;
    // }
    // if (keyboard[68]) {
    //   // D key
    //   this.camera.position.x +=
    //     Math.sin(this.camera.rotation.y + Math.PI / 2) * 0.5;
    //   this.camera.position.z +=
    //     -Math.cos(this.camera.rotation.y + Math.PI / 2) * 0.5;
    // }
    // if (keyboard[65]) {
    //   // A key
    //   this.camera.position.x +=
    //     Math.sin(this.camera.rotation.y - Math.PI / 2) * 0.5;
    //   this.camera.position.z +=
    //     -Math.cos(this.camera.rotation.y - Math.PI / 2) * 0.5;
    // }
    // if (keyboard[37]) {
    //   //left arrow
    //   this.camera.rotation.y -= 0.01;
    // }
    // if (keyboard[39]) {
    //   //right arrow
    //   this.camera.rotation.y += 0.01;
    // }

    // this.floor.rotation.x += 0.01;
    // this.floor.rotation.y += 0.01;
  };

  render() {
    return <div id="canvas" />;
  }
}

export default Canvas;
