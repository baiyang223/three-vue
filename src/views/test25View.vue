<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, onUnmounted, ref } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

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

const wheels = [] as any[]
let carBody, frontCar, hoodCar, glassCar
// 创建材质
const bodyMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xFF0000,
  metalness: 1,
  roughness: 0.5,
  clearcoat: 1,
  clearcoatRoughness: 0,
})
const frontMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xFF0000,
  metalness: 1,
  roughness: 0.5,
  clearcoat: 1,
  clearcoatRoughness: 0,
})
const hoodMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xFF0000,
  metalness: 1,
  roughness: 0.5,
  clearcoat: 1,
  clearcoatRoughness: 0,
})
const wheelsMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xFF0000,
  metalness: 1,
  roughness: 0.1,
})

const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xFFFFFF,
  metalness: 0,
  roughness: 0,
  transmission: 1,
  transparent: true,
})
const colors = ['red', 'blue', 'green', 'gray', 'orange', 'purple']
const currentColor = ref('red')
const materials = [
  { label: '磨砂', value: 1 },
  { label: '冰晶', value: 0 },
]
const currentMaterial = ref('冰晶')
function animate() {
  requestAnimationFrame(animate)
  controls.value.update()
  renderer.render(scene, camera.value)
}

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
  renderer.setClearColor('#000')
  scene.background = new THREE.Color('#ccc')
  scene.environment = new THREE.Color('#ccc')

  // 添加网格地面
  const gridHelper = new THREE.GridHelper(10, 10)
  gridHelper.material.opacity = 0.2
  gridHelper.material.transparent = true
  scene.add(gridHelper)

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

  camera.value.position.set(0, 2, 6)
  camera.value.lookAt(0, 0, 0)

  // 动画渲染
  animate()

  //   添加模型
  const loader = new GLTFLoader()
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('../src/utils/draco/')
  loader.setDRACOLoader(dracoLoader)
  loader.load(new URL('../assets/model/bmw01.glb', import.meta.url).href, (gltf: any) => {
    const bmw = gltf.scene
    bmw.traverse((child: any) => {
      if (child.isMesh) {
        if (child.name.includes('轮毂')) {
          child.material = wheelsMaterial
          wheels.push(child)
        }
        if (child.name.includes('Mesh002')) {
          carBody = child
          carBody.material = bodyMaterial
        }
        if (child.name.includes('前脸')) {
          child.material = frontMaterial
          frontCar = child
        }
        if (child.name.includes('引擎盖_1')) {
          child.material = hoodMaterial
          hoodCar = child
        }
        if (child.name.includes('挡风玻璃')) {
          child.material = glassMaterial
          glassCar = child
        }
      }
    })
    scene.add(bmw)
  })

  //   添加灯光
  const light1 = new THREE.DirectionalLight(0xFFFFFF, 1)
  light1.position.set(0, 0, 10)
  scene.add(light1)
  const light2 = new THREE.DirectionalLight(0xFFFFFF, 1)
  light2.position.set(0, 0, 110)
  scene.add(light2)
  const light3 = new THREE.DirectionalLight(0xFFFFFF, 1)
  light3.position.set(10, 0, 0)
  scene.add(light3)
  const light4 = new THREE.DirectionalLight(0xFFFFFF, 1)
  light4.position.set(-10, 0, 0)
  scene.add(light4)
  const light5 = new THREE.DirectionalLight(0xFFFFFF, 1)
  light5.position.set(0, 10, 0)
  scene.add(light5)
  const light6 = new THREE.DirectionalLight(0xFFFFFF, 0.3)
  light6.position.set(5, 10, 0)
  scene.add(light6)
  const light7 = new THREE.DirectionalLight(0xFFFFFF, 0.3)
  light7.position.set(0, 10, 5)
  scene.add(light7)
  const light8 = new THREE.DirectionalLight(0xFFFFFF, 0.3)
  light8.position.set(-5, 10, 0)
  scene.add(light8)
  const light9 = new THREE.DirectionalLight(0xFFFFFF, 0.3)
  light9.position.set(0, 10, -5)
  scene.add(light9)
})

onUnmounted(() => {
  gui.destroy()
})

function selectColor() {
  wheelsMaterial.color.set(currentColor.value)
  frontMaterial.color.set(currentColor.value)
  bodyMaterial.color.set(currentColor.value)
  hoodMaterial.color.set(currentColor.value)
  // glassMaterial.color.set(currentColor.value)
}

function selectMaterial() {
  console.log(wheels)
  frontMaterial.clearcoatRoughness = currentMaterial.value
  bodyMaterial.clearcoatRoughness = currentMaterial.value
  hoodMaterial.clearcoatRoughness = currentMaterial.value
}
</script>

<template>
  <div ref="testMain" class="main" />
  <div class="ctrlBox">
    <h1>汽车配置</h1>
    <h2>选择汽车颜色</h2>
    <el-select
      v-model="currentColor"
      class="m-2"
      placeholder="Select"
      style="width: 240px"
      @change="selectColor"
    >
      <el-option
        v-for="item in colors"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>
    <h2>选择贴膜材质</h2>
    <el-select
      v-model="currentMaterial"
      class="m-2"
      placeholder="Select"
      style="width: 240px"
      @change="selectMaterial"
    >
      <el-option
        v-for="item in materials"
        :key="item.label"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
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
.ctrlBox {
  width: 260px;
  height: 100%;
  padding: 0 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  top: 0;
  right: 0;
  .el-select {
    width: 100% !important;
  }
}
</style>
