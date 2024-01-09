<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, onUnmounted, ref } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { update as TweenUpdate } from 'three/examples/jsm/libs/tween.module.js'

const testMain = ref()
// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = ref()
// 创建渲染器
const renderer = new THREE.WebGL1Renderer()
// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)
// 轨道控制器全局变量
const controls = ref()
// 创建GUI
const gui = new GUI()
const uvTexture = new THREE.TextureLoader().load(new URL('../assets/textures/uv_grid_opengl.jpg', import.meta.url).href)
// 创建平面几何体
const planeGeometry = new THREE.PlaneGeometry(2, 2)
console.log(planeGeometry)
// 创建材质
const planeMaterial = new THREE.MeshBasicMaterial({
  map: uvTexture,
  side: THREE.DoubleSide,
})
// 创建平面
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(planeMesh)
planeMesh.position.x = -2
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
  0, 0, 1, 0, 1, 1, 0, 0,
])
// 创建uv属性
geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
console.log(geometry)
// 创建材质
const material = new THREE.MeshBasicMaterial({
  color: 0xFFFFFF,
  map: uvTexture,
  side: THREE.DoubleSide, // 正反都能看到
  // wireframe: true,
})
const plane = new THREE.Mesh(geometry, material)
scene.add(plane)
plane.position.x = 2
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

  camera.value.position.set(2, 2, 6)
  camera.value.lookAt(0, 0, 0)

  // 动画渲染
  animate()
})

onUnmounted(() => {
  gui.destroy()
})
// 渲染函数
function animate() {
  controls.value.update()
  requestAnimationFrame(animate)
  //     渲染
  renderer.render(scene, camera.value)
  // 更新tween
  // tween.update()
  TweenUpdate()
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
