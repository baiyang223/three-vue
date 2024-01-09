<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, onUnmounted, ref } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js'

const testMain = ref()
// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = ref()
// 创建渲染器
const renderer = new THREE.WebGL1Renderer()
// 创建纹理加载器
const uvTexture = new THREE.TextureLoader().load(new URL('../assets/textures/uv_grid_opengl.jpg', import.meta.url).href)
// 创建几何体
const geometry = new THREE.BufferGeometry()
// 使用索引
const vertices = new Float32Array([
  -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0,
])
// 创建顶点属性
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
// 创建索引
const indices = new Uint16Array([0, 1, 2, 2, 3, 0])
// 创建素材
geometry.setIndex(new THREE.BufferAttribute(indices, 1))
// 设置UV坐标
const uv = new Float32Array([
  0, 0, 1, 0, 1, 1, 0, 1,
])
// 创建uv属性
geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
// 设置法向量
const normals = new Float32Array([
  0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
])
geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
geometry.translate(1, 0, 0)
geometry.rotateX(Math.PI / 2)
geometry.scale(3, 3, 3)
// 计算顶点的法线向量
// geometry.computeVertexNormals()
// 创建材质
const material = new THREE.MeshBasicMaterial({
  color: 0xFFFFFF,
  map: uvTexture,
  side: THREE.DoubleSide, // 正反都能看到
})
const planeMesh = new THREE.Mesh(geometry, material)
scene.add(planeMesh)
// planeMesh.position.x = 3

// 创建法向量辅助器
const helper = new VertexNormalsHelper(planeMesh, 0.2, 0xFF0000)
scene.add(helper)

// 创建几何体
const planeGeometry = new THREE.PlaneGeometry(2, 2)
// 创建材质
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0xFFFFFF,
  map: uvTexture,
  side: THREE.DoubleSide,
  transparent: true, // 透明
})
// 创建网络
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
// 将网络添加到场景中
scene.add(plane)
plane.position.x = -3

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
  planeMaterial.envMap = envMap
  //   设置planeMesh的环境贴图
  material.envMap = envMap
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
