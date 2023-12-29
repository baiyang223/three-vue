<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, ref } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const testMain = ref()
// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = ref()
// 创建渲染器
const renderer = new THREE.WebGL1Renderer()
// 创建几何体
const geometry = new THREE.BufferGeometry()
// 创建顶点数据
// const vertices = new Float32Array([
//   -1, -1, 0,
//   1, -1, 0,
//   1, 1, 0,
//
//   -1, 1, 0,
//   1, 1, 0,
//   -1, -1, 0,
// ])
// 使用索引绘制
const vertices = new Float32Array([
  -1, -1, 0,
  1, -1, 0,
  1, 1, 0,
  -1, 1, 0,
])
// // 创建顶点属性
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
// 创建索引
const indices = new Uint16Array([0, 1, 2, 2, 3, 0])
// 创建索引属性
geometry.setIndex(new THREE.BufferAttribute(indices, 1))
// 创建材质
const material = new THREE.MeshBasicMaterial({
  color: 0x00FF00,
  // side: THREE.DoubleSide, // 正反都能看到
  wireframe: true,
})
const plane = new THREE.Mesh(geometry, material)
scene.add(plane)
// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)
// 轨道控制器全局变量
const controls = ref()

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

  camera.value.position.set(4, 1, 5)
  camera.value.lookAt(0, 0, 0)

  // 动画渲染
  animate()
})

// 渲染函数
function animate() {
  requestAnimationFrame(animate)
  controls.value.update()
  //     旋转
  //   cube.rotation.x += .01
  //   cube.rotation.y += .01
  //     渲染
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
