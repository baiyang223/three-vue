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
const geometry = new THREE.BoxGeometry(1, 1, 1)
// 创建材质
const material = new THREE.MeshBasicMaterial({ color: 'blue' })
const parentMaterial = new THREE.MeshBasicMaterial({ color: 'red' })
// 父元素
const parentCube = new THREE.Mesh(geometry, parentMaterial)
// 创建网络
const cube = new THREE.Mesh(geometry, material)
// 添加元素
parentCube.add(cube)
// 设置立方体位移
parentCube.position.set(-3, 0, 0)
cube.position.set(3, 0, 0)
// 设置立方体的放大
parentCube.scale.set(2, 2, 2)
// cube.scale.set(2,2,2)
// 绕着x轴旋转
parentCube.rotation.set(Math.PI / 3, 0, 0)
cube.rotation.set(Math.PI / 4, 0, 0)
// 将网络添加到场景中
scene.add(parentCube)
// scene.add(cube)
// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

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

  camera.value.position.set(4, 2, 10)
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

function fullScreen() {
  // 全屏
  // renderer.domElement.requestFullscreen()
  document.body.requestFullscreen()
}

function exitFullscreenFn() {
  //   退出全屏
  if (document.fullscreenElement)
    document.exitFullscreen()
}
</script>

<template>
  <div ref="testMain" class="main">
    <el-button class="btn" type="primary" @click="fullScreen">
      全屏
    </el-button>
    <el-button class="btn btn2" type="primary" @click="exitFullscreenFn">
      退出全屏
    </el-button>
  </div>
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
