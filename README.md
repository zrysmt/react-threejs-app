详细博客地址:
> [使用React+Three.js 封装一个三维地球](https://zrysmt.github.io/2017/09/23/%E4%BD%BF%E7%94%A8React+Three.js%E5%B0%81%E8%A3%85%E4%B8%80%E4%B8%AA%E4%B8%89%E7%BB%B4%E5%9C%B0%E7%90%83/)

## 1.环境
使用facebook给出的脚手架工具[create-react-app](https://github.com/facebookincubator/create-react-app).

```bash
npm install -g create-react-app

create-react-app react-threejs-app
cd react-threejs-app/
```
执行
```bash
npm start
```
浏览器会自动打开`localhost:3000`。

## 2.一步一个脚印
### 2.1 准备一张高清的世界地图
这里在github仓库中已经给出。
### 2.2 定义一个组件`ThreeMap`
在`ThreeMap.js`定义组件`ThreeMap`，并且创建改组件的样式`ThreeMap.css`。css定义三维地球的容器的宽度和高度。
```css
#WebGL-output{
    width: 100%;
    height: 700px;
}
```
并且该组件在`App.js`引用。
### 2.2 引入库和样式
```js
import './ThreeMap.css';
import React, { Component } from 'react';
import * as THREE from 'three';
import Orbitcontrols from 'three-orbitcontrols';
import Stats from './common/threejslibs/stats.min.js';
```
### 2.3 初始化方法入口和要渲染的虚拟DOM
```js
componentDidMount(){
    this.initThree();
}
```
要渲染的虚拟DOM设定好
```js
render(){
    return(
        <div id='WebGL-output'></div>
    )
}
```
### 2.4 initThree方法
- 创建场景

```js
let scene;
scene = new THREE.Scene();
```
- 创建Group

```js
let group;
group = new THREE.Group();
scene.add( group );
```
- 创建相机

```js
camera = new THREE.PerspectiveCamera( 60, width / height, 1, 2000 );
camera.position.x = -10;
camera.position.y = 15;
camera.position.z = 500;
camera.lookAt( scene.position );
```
- 相机作为`Orbitcontrols`的参数，支持鼠标交互

```js
let orbitControls = new Orbitcontrols(camera);
orbitControls.autoRotate = false;
```
- 添加光源:环境光和点光源

```js
let ambi = new THREE.AmbientLight(0x686868); //环境光
scene.add(ambi);
let spotLight = new THREE.DirectionalLight(0xffffff);  //点光源
spotLight.position.set(550, 100, 550);  
spotLight.intensity = 0.6;
scene.add(spotLight);
```
- 创建模型和材质

```js
let loader = new THREE.TextureLoader();
let planetTexture = require("./assets/imgs/planets/Earth.png");

loader.load( planetTexture, function ( texture ) {
    let geometry = new THREE.SphereGeometry( 200, 20, 20 );
    let material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
    let mesh = new THREE.Mesh( geometry, material );
    group.add( mesh );
} );
```
- 渲染

```js
let renderer;
renderer = new THREE.WebGLRenderer();
renderer.setClearColor( 0xffffff );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( width, height );
container.appendChild( renderer.domElement );
```
- 增加监控的信息状态

```js
stats = new Stats();
container.appendChild( stats.dom );
```
**将以上封装到`init`函数中**
- 动态渲染，地球自转

```js
function animate() {
    requestAnimationFrame( animate );
    render();
    stats.update();
}
function render() {
    group.rotation.y -= 0.005;  //这行可以控制地球自转
    renderer.render( scene, camera );
}
```
调用的顺序是：
```js
init();
animate();

