<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, onUnmounted, ref } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { Water } from 'three/examples/jsm/objects/Water2.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

const testMain = ref()
// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = ref()
// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  //   对数深度缓冲区
  logarithmicDepthBuffer: true,
})
// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)
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
    75, // 视角
    testMain.value.clientWidth / testMain.value.clientHeight, // 宽高比
    0.1, // 进平面
    2000, // 远平面
  )
  // 设置渲染器宽高，并添加到页面
  renderer.setSize(testMain.value.clientWidth, testMain.value.clientHeight)
  renderer.shadowMap.enabled = true
  renderer.outputEncoding = THREE.sRGBEncoding
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

  camera.value.position.set(-50, 50, 130)
  camera.value.lookAt(0, 0, 0)

  // 动画渲染
  animate()

  //   创建一个巨大的天空球体
  const texture = new THREE.TextureLoader().load(new URL('../assets/textures/sky.jpg', import.meta.url).href)
  const skyGeometry = new THREE.SphereGeometry(1000, 60, 60)
  const skyMaterial = new THREE.MeshBasicMaterial({
    map: texture,
  })
  skyGeometry.scale(1, 1, -1)
  const sky = new THREE.Mesh(skyGeometry, skyMaterial)
  scene.add(sky)

  //  视频纹理
  const video = document.createElement('video')
  video.src = '../src/assets/textures/sky.mp4'
  video.loop = true
  window.addEventListener('click', videoPlay)

  const loader = new RGBELoader()
  loader.load(new URL('../assets/textures/050.hdr', import.meta.url).href, (texture: any) => {
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.background = texture
    scene.environment = texture
  })
  // 添加平行光
  const light = new THREE.DirectionalLight(0xFFFFFF, 1)
  light.position.set(-100, 100, 10)
  scene.add(light)
  // 创建水面
  const waterGeometry = new THREE.CircleBufferGeometry(300, 64)
  const water = new Water(waterGeometry, {
    textureWidth: 1024,
    textureHeight: 1024,
    color: 0xEEEEFF,
    flowDirection: new THREE.Vector2(1, 1),
    scale: 1,
    normalMap0: new THREE.TextureLoader().load(
      new URL('../assets/textures/water/Water_1_M_Normal.jpg', import.meta.url).href,
      (texture: any) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      },
    ), // 水的纹理   不加 就是个平面，没有动态的
    normalMap1: new THREE.TextureLoader().load(
      new URL('../assets/textures/water/Water_1_M_Normal.jpg', import.meta.url).href,
      (texture: any) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      },
    ),
  })
  water.position.y = 3
  // 水面旋转至水平
  water.rotation.x = -Math.PI / 2
  scene.add(water)
  //   加载小岛模型
  const gltfLoader = new GLTFLoader()
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('../src/utils/draco/')
  gltfLoader.setDRACOLoader(dracoLoader)
  gltfLoader.load(new URL('../assets/model/island2.glb', import.meta.url).href, (gltf: any) => {
    const model = gltf.scene
    scene.add(model)
  })
  onUnmounted(() => {
    gui.destroy()
    window.removeEventListener('click', videoPlay)
  })

  function videoPlay() {
    if (video.paused) {
      video.play()
      skyMaterial.map = new THREE.VideoTexture(video)
      skyMaterial.map.needsUpdate = true
    }
  }
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
