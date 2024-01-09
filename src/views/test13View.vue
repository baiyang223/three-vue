<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, onUnmounted, ref } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { Easing, Tween, update as TweenUpdate } from 'three/examples/jsm/libs/tween.module.js'

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
// 创建三个球
const sphere1 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0x00FF00,
  }),
)
sphere1.position.x = -4
scene.add(sphere1)
// 移动小球
const tween = new Tween(sphere1.position)
tween.to({ x: 4 }, 2000)
// 设置循环无数次
// tween.repeat(Number.POSITIVE_INFINITY)
// tween.repeat(2)
// 循环往复
// tween.yoyo(true)
// 延迟
// tween.delay(2000)
// 设置缓冲函数
tween.easing(Easing.Quadratic.InOut)
// 连接动画
const tween2 = new Tween(sphere1.position)
tween2.to({ x: -4 }, 1000)
// 连接
tween.chain(tween2)
tween2.chain(tween)
// 启动补间动画
tween.start()

tween.onStart(() => {
  console.log('开始')
})
tween.onComplete(() => {
  console.log('结束')
})
tween.onStop(() => {
  console.log('停止')
})
tween.onUpdate(() => {
  console.log('更新')
})

const params = {
  stop() {
    tween.stop()
  },
  start() {
    tween.start()
  },
}
gui.add(params, 'stop').name('停止')
gui.add(params, 'start').name('开始')

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

  camera.value.position.set(2, 2, 15)
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
