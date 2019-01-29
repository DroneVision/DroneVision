import React, { Component } from 'react';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';

const backImage = require('../assets/skybox/back.png');
const frontImage = require('../assets/skybox/front.png');
const upImage = require('../assets/skybox/up.png');
const downImage = require('../assets/skybox/down.png');
const rightImage = require('../assets/skybox/right.png');
const leftImage = require('../assets/skybox/left.png');

class DroneModel extends Component {
	constructor() {
		super();

		//renderer
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(640, 360, false);

		//scene
		this.scene = new THREE.Scene();

		//camera
		this.camera = new THREE.PerspectiveCamera(
			35,
			window.innerWidth / window.innerHeight,
			1,
			1000
		);
		this.camera.position.set(0, 100, 200);

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

		// this.group = new THREE.Group();
		// this.group.position.y = 50;
		// this.scene.add(this.group);
		// // Circle shape
		// this.circleRadius = 40;
		// this.circleShape = new THREE.Shape();
		// this.circleShape.moveTo(0, this.circleRadius);
		// this.circleShape.quadraticCurveTo(this.circleRadius, this.circleRadius, this.circleRadius, 0);
		// this.circleShape.quadraticCurveTo(this.circleRadius, - this.circleRadius, 0, - this.circleRadius);
		// this.circleShape.quadraticCurveTo(- this.circleRadius, - this.circleRadius, - this.circleRadius, 0);
		// this.circleShape.quadraticCurveTo(- this.circleRadius, this.circleRadius, 0, this.circleRadius);
		// // Add shape
		// this.circleGeometry = new THREE.ShapeBufferGeometry(this.circleShape);
		// this.mesh = new THREE.Mesh(this.circleGeometry, new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
		// this.mesh.position.set(120, 250, 0 - 125);
		// this.mesh.rotation.set(0, 0, 0);
		// this.mesh.scale.set(1, 1, 1);
		// this.group.add(this.mesh);

		// // flat shape
		// this.flatCircleGeometry = new THREE.ShapeBufferGeometry(this.circleShape);
		// this.flatCircleMesh = new THREE.Mesh(this.flatCircleGeometry, new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
		// this.flatCircleMesh.position.set(120, 250, 0 - 125);
		// this.flatCircleMesh.rotation.set(0, 0, 0);
		// this.flatCircleMesh.scale.set(1, 1, 1);
		// this.group.add(this.flatCircleMesh);

		const mainCircleGeometry = new THREE.CircleGeometry( 5, 32, 14 );
		const mainCircleMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );
		
		this.mainCircle = new THREE.Mesh( mainCircleGeometry, mainCircleMaterial );
		this.mainCircle.position.set(0, 0, 0);
		this.scene.add( this.mainCircle );

		// const mainCubeGeometry = new THREE.BoxGeometry(1, 3, 1);
		// const mainCubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
		// this.mainCube = new THREE.Mesh(mainCubeGeometry, mainCubeMaterial);
		// this.scene.add(this.mainCube);


		const frontLeftCircleGeometry = new THREE.CircleGeometry(3, 32);
		const frontLeftCircleMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700 });
		this.frontLeftCircle = new THREE.Mesh(frontLeftCircleGeometry, frontLeftCircleMaterial);
		this.frontLeftCircle.position.set(2, -5, 2.5);
		this.scene.add(this.frontLeftCircle);


		const frontRightCircleGeometry = new THREE.CircleGeometry(3, 32);
		const frontRightCircleMaterial = new THREE.MeshBasicMaterial({ color: 0x4b0082 });
		this.frontRightCircle = new THREE.Mesh(frontRightCircleGeometry, frontRightCircleMaterial);
		this.frontLeftCircle.position.set(2, 5, -2.5 );
		this.scene.add(this.frontRightCircle);

		// 	const geometry = new THREE.CylinderBufferGeometry(0, 10, 30, 4, 1);
		// 	const material = new THREE.MeshPhongMaterial({
		// 	  color: 0xffffff,
		// 	  flatShading: true,
		// 	});

		// const triangle = new THREE.Mesh(geometry, material);
		//   triangle.position.x = 0;
		//   triangle.position.y = 0;
		//   triangle.position.z = 200;
		//   triangle.updateMatrix();
		//   triangle.matrixAutoUpdate = false;
		//   this.scene.add(triangle);


		//AMBIENT LIGHT
		const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4 );
		this.scene.add(ambientLight);
	}
	componentDidMount() {
		document.getElementById('drone-model').appendChild(this.renderer.domElement);
		this.animate();
	}

	animate = () => {
		requestAnimationFrame(this.animate);
		// this.group.rotation.x += 0.01
		// this.group.rotation.y += 0.01
		// this.mainCube.rotation.x += 0.01
		// this.mainCube.rotation.y += 0.01
		// this.mainCircle.rotation.x += 0.01
		// this.mainCircle.rotation.y += 0.01
		this.controls.update();
		this.renderer.render(this.scene, this.camera);
	};

	render() {
		return <div id="drone-model" />;
	}

}

export default DroneModel;
