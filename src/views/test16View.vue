<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, onUnmounted, ref } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const testMain = ref()
// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = ref()
// 创建渲染器
const renderer = new THREE.WebGL1Renderer()
// 实例化加载器gltf
const gltfLoader = new GLTFLoader()
// 加载模型
gltfLoader.load(new URL('../assets/model/Duck.glb', import.meta.url).href, (gltf: any) => {
  scene.add(gltf.scene)
  const duckMesh = gltf.scene.getObjectByName('LOD3spShape')
  const duckGeometry = duckMesh.geometry
  //   计算包围盒
  duckGeometry.computeBoundingBox()
  //   获取包围盒
  const duckBox = duckGeometry.boundingBox
  // 更新世界矩阵
  duckMesh.updateWorldMatrix(true, true)
  // 更新包围盒
  duckBox.applyMatrix4(duckMesh.matrixWorld)
  // 创建包围盒辅助器
  const boxHelper = new THREE.Box3Helper(duckBox, 0xFF0000)
  scene.add(boxHelper)
  console.log(duckBox, duckMesh)
})

// rgbeLoader 加载hdr贴图
const rgbeLoader = new RGBELoader() // 加载hdr
rgbeLoader.load(new URL('../assets/textures/Alex_Hart-Nature_Lab_Bones_2k.hdr', import.meta.url).href, (envMap) => {
  // 设置球形贴图
  envMap.mapping = THREE.EquirectangularReflectionMapping
  // 设置环境贴图
  scene.background = envMap
  //  设置环境贴图
  scene.environment = envMap
})

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
  camera.value.position.set(0, 0, 12)
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
