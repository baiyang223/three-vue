<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, onUnmounted, ref } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

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
const gui = new GUI()

// 添加按钮
gui.add(eventObj, 'FullScreen').name('全屏')
gui.add(eventObj, 'exitFullscreen').name('退出全屏')

onMounted(() => {
  // 创建相机
  camera.value = new THREE.PerspectiveCamera(
    45, // 视角
    testMain.value.clientWidth / testMain.value.clientHeight, // 宽高比
    0.1, // 进平面
    2000, // 远平面
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

  camera.value.position.set(0, 0, 160)
  camera.value.lookAt(0, 0, 0)

  // 动画渲染
  animate()
  //   添加环境纹理
  const texture = new THREE.TextureLoader().load('../src/assets/textures/sky2.jpg')
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.background = texture
  scene.environment = texture
  // 背景模糊度
  // scene.backgroundBlurriness = 1

  //   加载字体
  const loader = new FontLoader()
  loader.load('../src/assets/fonts/FangSong_Regular.json', (font) => {
    const geometry = new TextGeometry('王小阳', {
      font, // 字体
      size: 40, // 字体大小
      height: 5, // 字体厚度
      curveSegments: 12, // 曲线分段数
      bevelEnabled: true, // 是否启用斜角
      bevelThickness: 5, // 斜角厚度
      bevelSize: 2, // 斜角大小
      bevelSegments: 5, // 斜角分段数
    })
    geometry.center()
    // 设置字体材质
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xEEEEFF,
      roughness: 0,
      reflectivity: 1,
      thickness: 80,
      ior: 1.5,
      transmission: 1,
      side: THREE.DoubleSide,
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
  })
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
