import React, { Component } from 'react';
import * as THREE from 'three';

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
      fog: true,
    });
    this.floor = new THREE.Mesh(this.planeGeo, this.planeMaterial);

    // this.cubeGeo = new THREE.PlaneBufferGeometry(30, 30, 200, 200);
    // this.cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    // this.cube = new THREE.Mesh(this.cubeGeo, this.cubeMaterial);

    this.floor.rotation.x = 5;
    this.scene.add(this.floor);
    this.scene.add(this.cube);
    this.camera.position.z = 2;
  }

  componentDidMount() {
    document.getElementById('canvas').appendChild(this.renderer.domElement);
    this.animate();
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    // this.floor.rotation.x += 0.01;
    // this.floor.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return <div id="canvas" />;
  }
}

export default Canvas;
