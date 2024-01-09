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
// 创建纹理加载器
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load(new URL('../assets/textures/watercover/CityNewYork002_COL_VAR1_1K.png', import.meta.url).href)
// 调色
// texture.colorSpace = THREE.SRGBColorSpace
texture.colorSpace = THREE.LinearSRGBColorSpace
// texture.colorSpace = THREE.NoColorSpace
// 加载ao贴图
const aoMap = textureLoader.load(new URL('../assets/textures/watercover/CityNewYork002_AO_1K.jpg', import.meta.url).href)
// 透明度贴图
const alphaMap = textureLoader.load(new URL('../assets/textures/door/height.jpg', import.meta.url).href)
// 光照贴图
const lightMap = textureLoader.load(new URL('../assets/textures/colors.png', import.meta.url).href)
// 高光贴图
const specularMap = textureLoader.load(new URL('../assets/textures/watercover/CityNewYork002_GLOSS_1K.jpg', import.meta.url).href)
// rgbeLoader 加载hdr贴图
const rgbeLoader = new RGBELoader() // 加载hdr
rgbeLoader.load(new URL('../assets/textures/Alex_Hart-Nature_Lab_Bones_2k.hdr', import.meta.url).href, (envMap) => {
  // 设置球形贴图
  envMap.mapping = THREE.EquirectangularReflectionMapping
  // 设置环境贴图
  scene.background = envMap
  //  设置环境贴图
  scene.environment = envMap
  //   设置plane的环境贴图
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  planeMaterial.envMap = envMap
})
// textureLoader.load(new URL('../assets/textures/map/map_living_room.jpg', import.meta.url).href, (envMap: any) => {
//   // 设置球形贴图
//   envMap.mapping = THREE.EquirectangularReflectionMapping
//   // 设置环境贴图
//   scene.background = envMap
//   //  设置环境贴图
//   scene.environment = envMap
//   //   设置plane的环境贴图
//   // eslint-disable-next-line @typescript-eslint/no-use-before-define
//   planeMaterial.envMap = envMap
// })
// 创建渲染器
const renderer = new THREE.WebGL1Renderer()
// 创建几何体
const planeGeometry = new THREE.PlaneGeometry(1, 1)
// 创建材质
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0xFFFFFF,
  map: texture,
  side: THREE.DoubleSide,
  transparent: true, // 透明
  aoMap, // 设置贴图
  aoMapIntensity: 1,
  // alphaMap, // 透明度贴图
  // lightMap, // 光照贴图
  //   设置高光贴图
  specularMap,
  reflectivity: 0.5, // 环境贴图透明度
})
// 创建网络
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
// plane.rotation.set(Math.PI / 4, 0, 0)
// 将网络添加到场景中
scene.add(plane)
// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const controls = ref()

// 创建GUI
const gui = new GUI()

gui.add(planeMaterial, 'aoMapIntensity').min(0).max(1).name('透明')

gui.add(texture, 'colorSpace', {
  sRGB: THREE.SRGBColorSpace,
  Linear: THREE.LinearSRGBColorSpace,
}).onChange(() => {
  texture.needsUpdate = true
})

onUnmounted(() => {
  gui.destroy()
})

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
  testMain.value.appendChild(renderer.domElement)

  // 添加轨道控制器
  controls.value = new OrbitControls(camera.value, renderer.domElement)
  // 设置带阻尼的惯性
  controls.value.enableDamping = true
  // 设置阻尼的数值
  controls.value.dampingFactor = 0.05
  // 设置自动旋转
  // controls.value.autoRotate = true

  // 设置相机位置
  camera.value.position.set(2, 0, 2)
  camera.value.lookAt(0, 0, 0)

  // 动画渲染
  animate()
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
}
</style>
