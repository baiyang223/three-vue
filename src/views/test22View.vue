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
// 直线光源
const spotLight = new THREE.SpotLight(0xFFFFFF, 1)
spotLight.position.set(10, 10, 10)
spotLight.castShadow = true
spotLight.intensity = 2
// 设置阴影贴图的模糊度
spotLight.shadow.radius = 20
// 设置阴影贴图的分辨率
spotLight.shadow.mapSize.set(4096, 4096)
// console.log(spotLight.shadow)
spotLight.target = sphere1
spotLight.angle = Math.PI / 6
spotLight.distance = 0
spotLight.penumbra = 0
spotLight.decay = 0
// 设置透视相机的属性

scene.add(spotLight)
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
gui.add(spotLight.shadow.camera, 'near').min(0.1).max(20).step(0.1).onChange(() => {
  spotLight.shadow.camera.updateProjectionMatrix()
})
gui.add(spotLight.position, 'x').min(-15).max(15).step(0.1)
gui.add(spotLight, 'angle').min(0.01).max(Math.PI / 2).step(0.01)
gui.add(spotLight, 'distance').min(0.1).max(30).step(0.1)
gui.add(spotLight, 'penumbra').min(0).max(1).step(0.1)
gui.add(spotLight, 'decay').min(0).max(5).step(0.1)
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
// 渲染函数
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
