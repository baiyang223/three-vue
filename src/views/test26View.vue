<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, onUnmounted, ref } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js'

const testMain = ref()
// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = ref()
// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true,
})
//   创建rgbe加载器
const hdrLoader = new RGBELoader()
const loader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('../src/utils/draco/')
loader.setDRACOLoader(dracoLoader)
// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)
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
// 添加按钮
gui.add(eventObj, 'FullScreen').name('全屏')
gui.add(eventObj, 'exitFullscreen').name('退出全屏')
onMounted(() => {
  // 创建相机
  camera.value = new THREE.PerspectiveCamera(
    45, // 视角
    testMain.value.clientWidth / testMain.value.clientHeight, // 宽高比
    0.1, // 进平面
    1000, // 远平面
  )
  // 设置渲染器宽高，并添加到页面
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

  // 添加轨道控制器
  controls.value = new OrbitControls(camera.value, renderer.domElement)
  // 设置带阻尼的惯性
  controls.value.enableDamping = true
  // 设置阻尼的数值
  controls.value.dampingFactor = 0.05

  camera.value.position.set(0, 1.5, 6)
  camera.value.lookAt(0, 0, 0)

  // 动画渲染
  animate()

  hdrLoader.load(new URL('../assets/textures/sky12.hdr', import.meta.url).href, (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.background = texture
    scene.environment = texture
  })

  //   添加机器人
  loader.load(new URL('../assets/model/robot.glb', import.meta.url).href, (gltf: any) => {
    const robot = gltf.scene
    scene.add(robot)
  })

  //   添加直线
  const light1 = new THREE.DirectionalLight(0xFFFFFF, 0.3)
  light1.position.set(0, 10, 10)
  const light2 = new THREE.DirectionalLight(0xFFFFFF, 0.3)
  light1.position.set(0, 10, -10)
  const light3 = new THREE.DirectionalLight(0xFFFFFF, 0.3)
  light1.position.set(10, 10, 10)
  scene.add(light1, light2, light3)

  //  添加光阵
  const video = document.createElement('video')
  video.src = '../src/assets/textures/zp2.mp4'
  video.loop = true
  video.muted = true
  video.play()
  const videoTexture = new THREE.VideoTexture(video)
  const videoGeoPlane = new THREE.PlaneBufferGeometry(8, 4.5)
  const videoGeoMaterial = new THREE.MeshBasicMaterial({
    map: videoTexture,
    transparent: true,
    side: THREE.DoubleSide,
    alphaMap: videoTexture,
  })
  const videoMesh = new THREE.Mesh(videoGeoPlane, videoGeoMaterial)
  videoMesh.position.set(0, 0.2, 0)
  videoMesh.rotation.set(-Math.PI / 2, 0, 0)
  scene.add(videoMesh)

  //   镜面反射
  const reflectorGeometry = new THREE.PlaneBufferGeometry(100, 100)
  const reflectorPlane = new Reflector(reflectorGeometry, {
    textureWidth: testMain.value.clientWidth,
    textureHeight: testMain.value.clientHeight,
    color: 0x332222,
  })
  reflectorPlane.rotation.x = -Math.PI / 2
  scene.add(reflectorPlane)
})

onUnmounted(() => {
  gui.destroy()
})

function animate() {
  requestAnimationFrame(animate)
  controls.value.update()
  renderer.render(scene, camera.value)
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
  .btn {
    position: absolute;
    top: 10px;
    left: 10px;
    &.btn2 {
      left: 70px;
    }
  }
}
</style>
