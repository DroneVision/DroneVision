import React, { Component } from 'react';
import * as THREE from 'three';
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

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(640, 360, false);
    this.planeGeo = new THREE.PlaneBufferGeometry(30, 30, 500, 500);
    this.planeMaterial = new THREE.MeshBasicMaterial({
      color: 0x488384,
      wireframe: true,
    });
    this.floor = new THREE.Mesh(this.planeGeo, this.planeMaterial);

    this.floor.rotation.x = 5;
    this.scene.add(this.floor);

    this.camera.position.z = 2;
  }

  componentDidMount() {
    document.getElementById('canvas').appendChild(this.renderer.domElement);
    this.animate();
    PubSub.subscribe('cube-button', (msg, points) => {
      const { point1, point2 } = points;
      //create a blue LineBasicMaterial
      var material = new THREE.LineBasicMaterial({ color: 0x0000ff });
      var geometry = new THREE.Geometry();
      geometry.vertices.push(new THREE.Vector3(point1.x, point1.y, point1.z));
      geometry.vertices.push(new THREE.Vector3(point2.x, point2.y, point2.z));

      var line = new THREE.Line(geometry, material);
      this.scene.add(line);
    });
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    if (keyboard[87]) {
      // W key
      this.camera.position.x -= Math.sin(this.camera.rotation.y) * 0.5;
      this.camera.position.z -= -Math.cos(this.camera.rotation.y) * 0.5;
    }
    if (keyboard[83]) {
      // S key
      this.camera.position.x += Math.sin(this.camera.rotation.y) * 0.5;
      this.camera.position.z += -Math.cos(this.camera.rotation.y) * 0.5;
    }
    if (keyboard[68]) {
      // D key
      this.camera.position.x +=
        Math.sin(this.camera.rotation.y + Math.PI / 2) * 0.5;
      this.camera.position.z +=
        -Math.cos(this.camera.rotation.y + Math.PI / 2) * 0.5;
    }
    if (keyboard[65]) {
      // A key
      this.camera.position.x +=
        Math.sin(this.camera.rotation.y - Math.PI / 2) * 0.5;
      this.camera.position.z +=
        -Math.cos(this.camera.rotation.y - Math.PI / 2) * 0.5;
    }
    if (keyboard[37]) {
      //left arrow
      this.camera.rotation.y -= 0.01;
    }
    if (keyboard[39]) {
      //right arrow
      this.camera.rotation.y += 0.01;
    }

    // this.floor.rotation.x += 0.01;
    // this.floor.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return <div id="canvas" />;
  }
}

export default Canvas;
