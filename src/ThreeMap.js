/**
 * React+Three.js 三维地球
 */
import './ThreeMap.css';
import React, { Component } from 'react';
import * as THREE from 'three';
import Orbitcontrols from 'three-orbitcontrols';
import Stats from './common/threejslibs/stats.min.js';

class ThreeMap extends Component{
 	componentDidMount(){
		this.initThree();
	}
	initThree(){
		let stats;
		let camera, scene, renderer;
		let group;
		let container = document.getElementById('WebGL-output');
		let width = container.clientWidth,height = container.clientHeight;

		init();
		animate();

		function init() {
			scene = new THREE.Scene();
			group = new THREE.Group();
			scene.add( group );

			camera = new THREE.PerspectiveCamera( 60, width / height, 1, 2000 );
			camera.position.x = -10;
        	camera.position.y = 15;
			camera.position.z = 500;
			camera.lookAt( scene.position );
			
			//控制地球
			let orbitControls = new /*THREE.OrbitControls*/Orbitcontrols(camera);
        	orbitControls.autoRotate = false;
        	// let clock = new THREE.Clock();
        	//光源
        	let ambi = new THREE.AmbientLight(0x686868);
        	scene.add(ambi);

        	let spotLight = new THREE.DirectionalLight(0xffffff);
        	spotLight.position.set(550, 100, 550);
        	spotLight.intensity = 0.6;

        	scene.add(spotLight);
			// Texture
			let loader = new THREE.TextureLoader();
			let planetTexture = require("./assets/imgs/planets/Earth.png");

			loader.load( planetTexture, function ( texture ) {
				let geometry = new THREE.SphereGeometry( 200, 20, 20 );
				let material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
				let mesh = new THREE.Mesh( geometry, material );
				group.add( mesh );
			} );

			renderer = new THREE.WebGLRenderer();
			renderer.setClearColor( 0xffffff );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( width, height );
			container.appendChild( renderer.domElement );
			stats = new Stats();
			container.appendChild( stats.dom );  //增加状态信息 

		}
		
		function animate() {
			requestAnimationFrame( animate );
			render();
			stats.update();
		}
		function render() {		
			group.rotation.y -= 0.005;  //这行可以控制地球自转
			renderer.render( scene, camera );
		}
	}
	render(){
		return(
			<div id='WebGL-output'></div>
		)
	}
}

export default ThreeMap;