<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, onUnmounted, ref } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import gsap from 'gsap'
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'

interface Build {
  id: number
  name: string
  state: string
  date: string
  position: number[]
}

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

const builds = [] as any[]
const buildPositions = [
  { id: 1, name: 'A座', state: '开发中', date: '2024-05-01', position: [-18, 0, 18] },
  { id: 2, name: 'B座', state: '启用', date: '2024-11-06', position: [0, 0, 18] },
  { id: 3, name: 'C座', state: '开发中', date: '2024-05-01', position: [18, 0, 18] },
  { id: 4, name: 'D座', state: '启用', date: '2023-11-06', position: [-18, 0, 0] },
  { id: 5, name: 'E座', state: '启用', date: '2023-11-06', position: [0, 0, 0] },
  { id: 6, name: 'F座', state: '启用', date: '2023-11-06', position: [18, 0, 0] },
  { id: 7, name: 'G座', state: '启用', date: '2023-11-06', position: [-18, 0, -18] },
  { id: 8, name: 'H座', state: '启用', date: '2023-11-06', position: [0, 0, -18] },
  { id: 9, name: 'I座', state: '启用', date: '2023-11-06', position: [18, 0, -18] },
] as Build[]
const currentBuild = ref<Build>({} as Build)
// 创建射线
const raycaster = new THREE.Raycaster()
// 创建鼠标向量
const mouse = new THREE.Vector2()
// 使用补间动画移动相机
const timerLine1 = gsap.timeline()
const timerLine2 = gsap.timeline()
const popupBox = ref()
let labelRenderer: any
// 定义相机移动函数
function translateCamera(position: any, target: any) {
  timerLine1.to(camera.value.position, {
    x: position.x,
    y: position.y,
    z: position.z,
    duration: 1,
    ease: 'power2.inOut',
  })

  timerLine2.to(controls.value.target, {
    x: target.x,
    y: target.y,
    z: target.z,
    duration: 1,
    ease: 'power2.inOut',
    onComplete() {
      controls.value.target.set(target.x, target.y, target.z - 0.001)
    },
  })
}
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
  camera.value.position.set(0, 30, -80)

  testMain.value.appendChild(renderer.domElement)

  // 标签渲染器
  labelRenderer = new CSS2DRenderer()
  labelRenderer.setSize(testMain.value.clientWidth, testMain.value.clientHeight)
  labelRenderer.domElement.style.position = 'absolute'
  labelRenderer.domElement.style.top = '0px'
  // labelRenderer.domElement.style.pointerEvents = 'none'
  testMain.value.appendChild(labelRenderer.domElement)
  // 添加轨道控制器
  controls.value = new OrbitControls(camera.value, renderer.domElement)
  // 设置带阻尼的惯性
  controls.value.enableDamping = true
  // 设置阻尼的数值
  controls.value.dampingFactor = 0.05
  // controls.value.autoRotate = true
  controls.value.target.set(0, 0, 0)

  // 动画渲染
  animate()
  //   添加环境纹理
  const texture = new THREE.TextureLoader().load('../src/assets/textures/HdrSkyCloudy004_JPG_2K.jpg')
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.background = texture
  scene.environment = texture
  // 背景模糊度
  // scene.backgroundBlurriness = 1

  //   加载地基
  const hdrLoader = new RGBELoader()
  const loader = new GLTFLoader()
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('../src/utils/draco/')
  loader.setDRACOLoader(dracoLoader)
  loader.load('../src/assets/model/lawn.gltf', (gltf) => {
    const model = gltf.scene.children[0]
    model.scale.set(400, 100, 400)
    model.position.y = -13.96
    scene.add(model)
  })
  buildPositions.forEach((item) => {
    loader.load('../src/assets/model/building.glb', (gltf) => {
      const model = gltf.scene.children[0]
      model.position.set(item.position[0], item.position[1], item.position[2])
      model.userData = item
      builds.push(model)
      scene.add(model)
    })
  })
})

onUnmounted(() => {
  gui.destroy()
})

function animate() {
  requestAnimationFrame(animate)
  controls.value.update()
  labelRenderer.render(scene, camera.value)
  renderer.render(scene, camera.value)
}

function Click(event: MouseEvent) {
  //   设置鼠标向量的x，y值
  mouse.x = ((event.clientX - (window.innerWidth - testMain.value.clientWidth)) / testMain.value.clientWidth) * 2 - 1
  mouse.y = -(((event.clientY - (window.innerHeight - testMain.value.clientHeight)) / testMain.value.clientHeight) * 2 - 1)

  //   通过摄像机和鼠标位置更新射线
  raycaster.setFromCamera(mouse, camera.value)

  //   计算物体和射线的焦点
  const intersects = raycaster.intersectObjects(builds)

  if (intersects.length > 0) {
    const popupBoxEl = new CSS2DObject(popupBox.value)
    if (intersects[0].object.isSelect) {
      intersects[0].object.material.color.set(intersects[0].object._originColor)
      intersects[0].object.isSelect = false
      translateCamera(new THREE.Vector3(0, 30, -80), new THREE.Vector3(0, 0, 0))
      currentBuild.value = {} as Build
      popupBox.value.style.opacity = '0'
      popupBoxEl.position.set(0, 40, 0)
      scene.add(popupBoxEl)
      return
    }
    intersects[0].object.isSelect = true
    intersects[0].object._originColor = intersects[0].object.material.color.getHex()
    intersects[0].object.material.color.set(0xFF0000)
    translateCamera(new THREE.Vector3(0, 40, intersects[0].object.position.z - 30), new THREE.Vector3(intersects[0].object.position.x, intersects[0].object.position.y, intersects[0].object.position.z + 30))
    currentBuild.value = intersects[0].object.userData
    setTimeout(() => {
      popupBoxEl.position.set(intersects[0].object.position.x, intersects[0].object.geometry.boundingBox.max.y, intersects[0].object.position.z)
      popupBox.value.style.opacity = '1'
      scene.add(popupBoxEl)
    }, 800)
  }
}
</script>

<template>
  <div ref="testMain" class="main" @click="Click">
    <div ref="popupBox" class="popupBox">
      <div class="info">
        <img src="@/assets/loginLogo.png" alt="">
        <p class="name">
          {{ currentBuild.name }}
        </p>
      </div>
      <div class="state">
        <span class="label">状态：</span>{{ currentBuild.state }}
      </div>
      <div class="date">
        <span class="label">日期：</span>{{ currentBuild.date }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  .popupBox {
    position: absolute;
    top: 0;
    left: 0;
    width: 260px;
    height: 210px;
    background: url("@/assets/detailBg.png") no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    color: #fff;
    font-size: 18px;
    transition: opacity 1s ease, transform .3s ease;
    opacity: 0;
    .info {
      display: flex;
      align-items: center;
      padding: 0 30px;
      margin-top: 66px;
      img {
        width: 100px;
        background: #fff;
        margin-right: 20px;
      }
    }
    .state,
    .date {
      padding: 0 30px;
      font-size: 16px;
    }
    .state {
      margin-top: 10px;
    }
  }
}
</style>
