<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, onUnmounted, ref } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const testMain = ref()
// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = ref()
// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
})
// 添加世界坐标辅助器
// const axesHelper = new THREE.AxesHelper(5)
// scene.add(axesHelper)
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
// const gui = new GUI()

// 添加按钮
// gui.add(eventObj, 'FullScreen').name('全屏')
// gui.add(eventObj, 'exitFullscreen').name('退出全屏')

const data = [{ label: '昨天', value: 200 }, { label: '今天天', value: 120 }]
const color = [0xFFFF00, 0x1482F0]

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

  // 添加轨道控制器
  controls.value = new OrbitControls(camera.value, renderer.domElement)
  // 设置带阻尼的惯性
  controls.value.enableDamping = true
  // 设置阻尼的数值
  controls.value.dampingFactor = 0.05
  controls.value.autoRotate = true

  camera.value.position.set(0, 40, 120)
  camera.value.lookAt(0, 0, 0)

  // 动画渲染
  animate()
  let count = 0
  data.forEach((item) => {
    count += item.value
  })
  const differ = Math.PI * 2 / count
  data.forEach((item, index) => {
    const geometry = new THREE.TorusGeometry(30, 3, 5, 32, differ * item.value * 99 / 100)
    const material = new THREE.MeshBasicMaterial({ color: color[index], transparent: true, opacity: 0.5, side: THREE.DoubleSide })
    const torus = new THREE.Mesh(geometry, material)
    torus.rotation.set(Math.PI / 2, 0, 0)
    if (index !== 0)
      torus.rotation.set(Math.PI / 2, 0, differ * data[index - 1].value)

    scene.add(torus)
  })
})

onUnmounted(() => {
  // gui.destroy()
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
  //color: #1482f0;
  :deep(canvas) {background: transparent}
}
</style>
