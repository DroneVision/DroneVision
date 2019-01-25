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
    this.geometry = new THREE.PlaneGeometry( 30, 30, 14 );
    this.material = new THREE.MeshBasicMaterial({ color: 0x488384, side: THREE.DoubleSide} );
    this.floor = new THREE.Mesh(this.geometry, this.material);
    this.floor.rotation.x = 5;
    this.scene.add(this.floor);
    this.camera.position.z = 5;
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
    return (
      <div id="canvas"/>
    );
  }
}

export default Canvas;
