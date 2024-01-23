<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, onUnmounted, ref } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

const testMain = ref()
// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = ref()
// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true,
})
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
// 添加立方体
// const geometry = new THREE.BoxGeometry(10, 10, 10)
// // 4_b,
// const arr = ['4_b', '4_f', '4_u', '4_d', '4_r', '4_l']
// const boxMaterials = [] as any[]
// arr.forEach((item) => {
// //   纹理加载
//   const texture = new THREE.TextureLoader().load(new URL(`../assets/textures/imgs/living/${item}.jpg`, import.meta.url).href)
//   //   创建材质
//   if (item === '4_u' || item === '4_d') {
//     texture.rotation = item === '4_d' ? Math.PI / 2 : -Math.PI / 2
//     texture.center = new THREE.Vector2(0.5, 0.5)
//     boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture }))
//   }
//   else {
//     boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture }))
//   }
// })
// const cube = new THREE.Mesh(geometry, boxMaterials)
// cube.geometry.scale(1, 1, -1)
// scene.add(cube)

// 添加球
const geometry = new THREE.SphereGeometry(5, 32, 32)
const loader = new RGBELoader()
loader.load(new URL('../assets/textures/imgs/hdr/Living.hdr', import.meta.url).href, (texture) => {
  const material = new THREE.MeshBasicMaterial({ map: texture })
  const sphere = new THREE.Mesh(geometry, material)
  sphere.geometry.scale(1, 1, -1)
  scene.add(sphere)
})
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

  // 添加轨道控制器 testMain.value
  controls.value = new OrbitControls(camera.value, renderer.domElement)
  // 设置带阻尼的惯性
  controls.value.enableDamping = true
  // 设置阻尼的数值
  controls.value.dampingFactor = 0.05

  camera.value.position.set(0, 0, 0.1)
  camera.value.lookAt(0, 0, 0)

  // 光线投射交互
  // 动画渲染
  animate()
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
