<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, onUnmounted, ref } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

const testMain = ref()
// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = ref()
// 创建渲染器
const renderer = new THREE.WebGL1Renderer()
// 创建球
const material = new THREE.MeshStandardMaterial({
  // color: 0x00FF00,
})
const sphere1 = new THREE.Mesh(
  new THREE.SphereBufferGeometry(1, 20, 20),
  material,
)
sphere1.castShadow = true
scene.add(sphere1)
// 创建平面
const planeGeometry = new THREE.PlaneBufferGeometry(50, 50)
const plane = new THREE.Mesh(planeGeometry, material)
plane.position.set(0, -1, 0)
plane.rotation.x = -Math.PI / 2
// 接收阴影
plane.receiveShadow = true
scene.add(plane)
// 灯光 环境光
const light = new THREE.AmbientLight(0xFFFFFF, 0.5)
scene.add(light)

const smallBall = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.1, 20, 20),
  new THREE.MeshBasicMaterial({ color: 0xFF0000 }),
)

smallBall.position.set(2, 2, 2)
// 直线光源
const pointLight = new THREE.PointLight(0xFF0000, 1)
pointLight.position.set(2, 2, 2)
pointLight.castShadow = true
// 设置阴影贴图的模糊度
pointLight.shadow.radius = 20
// 设置阴影贴图的分辨率
pointLight.shadow.mapSize.set(512, 512)

pointLight.decay = 0
// 设置透视相机的属性
smallBall.add(pointLight)

scene.add(smallBall)
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
gui.add(pointLight.position, 'x').min(-15).max(15).step(0.1)
gui.add(pointLight, 'distance').min(0.1).max(30).step(0.1)
gui.add(pointLight, 'decay').min(0.01).max(5).step(0.1)
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
  renderer.physicallyCorrectLights = true

  // 监听窗口变化
  window.addEventListener('resize', () => {
    renderer.setSize(testMain.value.clientWidth, testMain.value.clientHeight)
    camera.value.aspect = testMain.value.clientWidth / testMain.value.clientHeight
    camera.value.updateProjectionMatrix()
  })

  testMain.value.appendChild(renderer.domElement)

  // 添加轨道控制器 testMain.value
  controls.value = new OrbitControls(camera.value, renderer.domElement)
  // 设置带阻尼的惯性
  controls.value.enableDamping = true
  // 设置阻尼的数值
  controls.value.dampingFactor = 0.05

  camera.value.position.set(2, 2, 15)
  camera.value.lookAt(0, 0, 0)

  // 光线投射交互
  // 动画渲染
  animate()
})

onUnmounted(() => {
  gui.destroy()
})
// 设置时钟
const clock = new THREE.Clock()
function animate() {
  const timer = clock.getElapsedTime()
  smallBall.position.x = Math.sin(timer) * 3
  smallBall.position.z = Math.cos(timer) * 3
  smallBall.position.y = 2 + Math.sin(timer * 10)
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
