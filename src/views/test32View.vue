<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, onUnmounted, ref } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'

const testMain = ref()
// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = ref()
// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
})
// 添加世界坐标辅助器
// const axesHelper = new THREE.AxesHelper(5)
// scene.add(axesHelper)
// 轨道控制器全局变量
const controls = ref()
const eventObj = {
  FullScreen() {
    document.body.requestFullscreen()
  },
  exitFullscreen() {
    if (document.fullscreenElement)
      document.exitFullscreen()
  },
}
// 创建GUI
const gui = new GUI()
//   地球和月球的半径大小
const EARTH_RADIUS = 2.5
const MOON_RADIUS = 0.27
// 声明全局变量
let labelRenderer: any, moon: any, earth: any
const clock = new THREE.Clock()
const textureLoader = new THREE.TextureLoader()
function init() {
  // 创建相机
  camera.value = new THREE.PerspectiveCamera(
    45, // 视角
    testMain.value.clientWidth / testMain.value.clientHeight, // 宽高比
    0.1, // 进平面
    2000, // 远平面
  )
  // 设置渲染器宽高，并添加到页面
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(testMain.value.clientWidth, testMain.value.clientHeight)
  renderer.shadowMap.enabled = true
  // renderer.physicallyCorrectLights = true

  // 监听窗口变化
  window.addEventListener('resize', () => {
    renderer.setSize(testMain.value.clientWidth, testMain.value.clientHeight)
    camera.value.aspect = testMain.value.clientWidth / testMain.value.clientHeight
    camera.value.updateProjectionMatrix()
  })

  testMain.value.appendChild(renderer.domElement)

  // 标签渲染器
  labelRenderer = new CSS2DRenderer()
  labelRenderer.setSize(testMain.value.clientWidth, testMain.value.clientHeight)
  labelRenderer.domElement.style.position = 'absolute'
  labelRenderer.domElement.style.top = '0px'
  // testMain.value.appendChild(labelRanderer.domElement)
  // 添加轨道控制器
  controls.value = new OrbitControls(camera.value, renderer.domElement)
  // 设置带阻尼的惯性
  controls.value.enableDamping = true
  // 设置阻尼的数值
  controls.value.dampingFactor = 0.05
  controls.value.autoRotate = true

  camera.value.position.set(10, 5, 20)
  camera.value.lookAt(0, 0, 0)

  //   创建聚光灯光源
  const dirLight = new THREE.SpotLight(0xFFFFFF)
  dirLight.position.set(0, 0, 10)
  dirLight.intensity = 2
  dirLight.castShadow = true
  scene.add(dirLight)
  // 添加环境光
  const aLight = new THREE.AmbientLight(0xFFFFFF)
  aLight.initensity = 0.3
  scene.add(aLight)

  // 创建月球
  const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS, 16, 16)
  const moonMaterial = new THREE.MeshPhongMaterial({
    map: textureLoader.load('../src/assets/textures/planets/moon_1024.jpg'),
  })
  moon = new THREE.Mesh(moonGeometry, moonMaterial)
  moon.receiveShadow = true
  moon.castShadow = true
  scene.add(moon)

  const moonDiv = document.createElement('div')
  moonDiv.className = 'label'
  moonDiv.textContent = 'moom'
  const moonLabel = new CSS2DObject(moonDiv)

  moonLabel.position.set(0, MOON_RADIUS + 0.5, 0)
  moon.add(moonLabel)
  //   创建地球
  const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 16, 16)
  const earthMaterial = new THREE.MeshPhongMaterial({
    shininess: 5,
    map: textureLoader.load('../src/assets/textures/planets/earth_atmos_4096.jpg'),
    specularMap: textureLoader.load('../src/assets/textures/planets/earth_specular_2048.jpg'),
    normalMap: textureLoader.load('../src/assets/textures/planets/earth_normal_2048.jpg'),
  })
  earth = new THREE.Mesh(earthGeometry, earthMaterial)
  earth.receiveShadow = true
  earth.castShadow = true
  scene.add(earth)

  const earthDiv = document.createElement('div')
  earthDiv.className = 'label'
  earthDiv.textContent = 'Earth'
  const earthLabel = new CSS2DObject(earthDiv)

  earthLabel.position.set(0, EARTH_RADIUS + 0.5, 0)
  earth.add(earthLabel)
}
// 添加按钮
gui.add(eventObj, 'FullScreen').name('全屏')
gui.add(eventObj, 'exitFullscreen').name('退出全屏')

onMounted(() => {
  init()
  // 动画渲染
  animate()
})

onUnmounted(() => {
  gui.destroy()
})
let oldTime = 0
function animate() {
  const elapsed = clock.getElapsedTime()
  moon.position.set(Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5)
  // 地球自转
  const axis = new THREE.Vector3(0, 1, 0)
  earth.rotateOnAxis(axis, (elapsed - oldTime) * Math.PI / 100)
  controls.value.update()
  renderer.render(scene, camera.value)
  labelRenderer.render(scene, camera.value)
  oldTime = elapsed
  requestAnimationFrame(animate)
}
</script>

<template>
  <div ref="testMain" class="main" />
</template>

<style scoped lang="scss">
.main {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  :deep(canvas) {
    background-image: url("@/assets/textures/star.jpg");
    background-size: cover;
  }
  .btn {
    position: absolute;
    top: 10px;
    left: 10px;
    &.btn2 {
      left: 70px;
    }
  }
  :deep(.label) {
    color: #fff;
    font-size: 16px;
  }
}
</style>
