<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, onUnmounted, ref } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

const testMain = ref()
// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = ref()
// 创建渲染器
const renderer = new THREE.WebGL1Renderer()
// 创建纹理加载器
const textureLoader = new THREE.TextureLoader()
textureLoader.load(new URL('../assets/textures/map/map_living_room.jpg', import.meta.url).href, (envMap: any) => {
  // 设置球形贴图
  envMap.mapping = THREE.EquirectangularReflectionMapping
  // 设置环境贴图
  scene.background = envMap
  //  设置环境贴图
  scene.environment = envMap
  //   设置plane的环境贴图

  // planeMaterial.envMap = envMap
})
// 实例化加载器gltf
const gltfLoader = new GLTFLoader()
// 加载模型
gltfLoader.load(new URL('../assets/textures/GreenPlants.gltf', import.meta.url).href, (gltf: any) => {
  // console.log(gltf)
  scene.add(gltf.scene)
})

// 实例化加载器draco
const dracoLoader = new DRACOLoader()
// 设置draco路径 new URL('../src/utils/draco/', import.meta.url).href
dracoLoader.setDecoderPath('../src/utils/draco/')
// 设置gltf加载器draco解码器
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load(new URL('../assets/model/city.glb', import.meta.url).href, (gltf: any) => {
  // console.log(gltf)
  scene.add(gltf.scene)
})
// 创建场景fog
scene.fog = new THREE.Fog(0x999999, 0.1, 150)
// 场景场景指数fog
// scene.fog = new THREE.FogExp2(0x999999, 0.1)
// scene.background = new THREE.Color(0xFFFFFF)
// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const controls = ref()

// 创建GUI
const gui = new GUI()

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
  camera.value.position.set(0, 1, 8)
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
