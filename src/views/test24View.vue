<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, onUnmounted, ref } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Water } from 'three/examples/jsm/objects/Water2.js'
import gsap from 'gsap'

const testMain = ref()
// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = ref()
// 创建渲染器
const renderer = new THREE.WebGLRenderer({
//   设置抗锯齿
  antialias: true,
})

// 添加世界坐标辅助器
// const axesHelper = new THREE.AxesHelper(5)
// scene.add(axesHelper)
// 轨道控制器全局变量
const controls = ref()

// 创建GUI
const gui = new GUI()

const rgbeLoader = new RGBELoader() // 加载hdr
rgbeLoader.load(new URL('../assets/textures/sky.hdr', import.meta.url).href, (envMap: any) => {
  // 设置球形贴图
  envMap.mapping = THREE.EquirectangularReflectionMapping
  // 设置环境贴图
  scene.background = envMap
  //  设置环境贴图
  scene.environment = envMap
})
// 实例化加载器gltf
const gltfLoader = new GLTFLoader()
// 实例化加载器draco
const dracoLoader = new DRACOLoader()
// 设置draco路径
dracoLoader.setDecoderPath('../src/utils/draco/')
// 设置gltf加载器draco解码器
gltfLoader.setDRACOLoader(dracoLoader)
// 加载模型
gltfLoader.load(new URL('../assets/model/scene.glb', import.meta.url).href, (gltf: any) => {
  gltf.scene.traverse((child: any) => {
    if (child.name === 'Plane')
      child.visible = false
    if (child.isMesh) {
      child.castShadow = true
      child.receiveShadow = true
    }
  })
  scene.add(gltf.scene)
})
// 创建水面
const waterGeometry = new THREE.CircleGeometry(300, 32)
const water = new Water(waterGeometry, {
  textureWidth: 1024,
  textureHeight: 1024,
  color: 0xEEEEFF,
  flowDirection: new THREE.Vector2(1, 1),
  scale: 100,
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
water.rotation.x = -Math.PI / 2
water.position.y = -0.4
scene.add(water)
// 添加平行光
const light = new THREE.DirectionalLight(0xFFFFFF, 1)
light.position.set(0, 50, 0)
scene.add(light)
// 添加点光源
const pointLight = new THREE.PointLight(0xFFFFFF, 50)
pointLight.position.set(0.1, 2.4, 0)
pointLight.castShadow = true
scene.add(pointLight)
// 创建点光源组
const pointLightGroup = new THREE.Group()
pointLightGroup.position.set(-8, 2.5, -1.5)
const pointLightArr = [] as any[]
const radius = 3
for (let i = 0; i < 3; i++) {
  // 创建球体当灯泡
  const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32)
  const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, emissive: 0xFFFFFF, emissiveIntensity: 10 })
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphere.position.set(
    radius * Math.cos((i * 2 * Math.PI) / 3),
    Math.cos((i * 2 * Math.PI) / 3),
    radius * Math.sin((i * 2 * Math.PI) / 3),
  )
  sphere.castShadow = true
  const pointLight = new THREE.PointLight(0xFFFFFF, 50)

  sphere.add(pointLight)
  pointLightArr.push(sphere)
  pointLightGroup.add(sphere)
}
scene.add(pointLightGroup)

// 使用补间函数，从0到2PI，使用灯旋转
const options = {
  angle: 0,
}
gsap.to(options, {
  angle: Math.PI * 2,
  duration: 10,
  repeat: -1,
  ease: 'linear',
  onUpdate: () => {
    pointLightGroup.rotation.y = options.angle
    pointLightArr.forEach((item, index) => {
      item.position.set(
        radius * Math.cos((index * 2 * Math.PI) / 3),
        Math.cos((index * 2 * Math.PI) / 3 + options.angle * 5),
        radius * Math.sin((index * 2 * Math.PI) / 3),
      )
    })
  },
})
// 初始化loader
onMounted(() => {
  // 创建相机
  camera.value = new THREE.PerspectiveCamera(
    45, // 视角
    testMain.value.clientWidth / testMain.value.clientHeight, // 宽高比
    0.1, // 进平面
    1000, // 远平面
  )
  camera.value.position.set(-3.23, 3, 4.06)
  camera.value.lookAt(0, 0, 0)
  // 设置渲染器宽高，并添加到页面
  renderer.setSize(testMain.value.clientWidth, testMain.value.clientHeight)
  // 设置色调映射
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.5
  renderer.shadowMap.enabled = true
  renderer.physicallyCorrectLights = true
  // 设置睡眠效果

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
  controls.value.target.set(-8, 2, 0)

  // 动画渲染
  animate()
})

onUnmounted(() => {
  gui.destroy()
  window.removeEventListener('wheel', wheelFn)
})
function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera.value)
  controls.value.update()
}
// 使用补间动画移动相机
const timerLine1 = gsap.timeline()
const timerLine2 = gsap.timeline()

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
  })
}

const scenes = [
  {
    text: '1xxxx',
    callback() {
    //   执行函数切换的位置
      translateCamera(
        new THREE.Vector3(-3.23, 3, 4.06),
        new THREE.Vector3(-8, 2, 0),
      )
    },
  },
  {
    text: '2xxxx',
    callback() {
      //   执行函数切换的位置
      translateCamera(
        new THREE.Vector3(7, 0, 23),
        new THREE.Vector3(0, 0, 0),
      )
    },
  },
  {
    text: '3xxxx',
    callback() {
      //   执行函数切换的位置
      translateCamera(
        new THREE.Vector3(10, 3, 0),
        new THREE.Vector3(5, 2, 0),
      )
    },
  },
  {
    text: '4xxxx',
    callback() {
      //   执行函数切换的位置
      translateCamera(
        new THREE.Vector3(7, 0, 23),
        new THREE.Vector3(0, 0, 0),
      )
      makeHeart()
    },
  },
  {
    text: '5xxxx',
    callback() {
      //   执行函数切换的位置
      translateCamera(
        new THREE.Vector3(-20, 1.3, 6.6),
        new THREE.Vector3(5, 2, 0),
      )
    },
  },
]
const index = ref(0)
let isAnimate = false
// 监听鼠标滚轮事件
window.addEventListener('wheel', wheelFn)

function wheelFn(e: WheelEvent) {
  if (isAnimate)
    return
  isAnimate = true
  if (e.deltaY > 0) {
    index.value++
    if (index.value > scenes.length - 1) {
      index.value = 0
      restoreHeart()
    }
  }
  scenes[index.value].callback()
  setTimeout(() => {
    isAnimate = false
  }, 1000)
}

// 实例化创建漫天的星星
const starsInstance = new THREE.InstancedMesh(
  new THREE.SphereGeometry(0.1, 32, 32),
  new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    emissive: 0xFFFFFF,
    emissiveIntensity: 10,
  }),
  100,
)

// 星星随机分布到天上
const starsArr = [] as any[]
const endArr = [] as any[]
for (let i = 0; i < 100; i++) {
  const x = Math.random() * 100 - 50
  const y = Math.random() * 100 - 50
  const z = Math.random() * 100 - 50
  starsArr.push(new THREE.Vector3(x, y, z))

  const matrix = new THREE.Matrix4()
  matrix.setPosition(x, y, z)
  starsInstance.setMatrixAt(i, matrix)
}
scene.add(starsInstance)

// 创建爱心路径
const hearShape = new THREE.Shape()
hearShape.moveTo(25, 25)
hearShape.bezierCurveTo(25, 25, 20, 0, 0, 0)
hearShape.bezierCurveTo(-30, 0, -30, 35, -30, 35)
hearShape.bezierCurveTo(-30, 55, -10, 77, 25, 95)
hearShape.bezierCurveTo(60, 77, 80, 55, 80, 35)
hearShape.bezierCurveTo(80, 35, 80, 0, 50, 0)
hearShape.bezierCurveTo(35, 0, 25, 25, 25, 25)

// 根据爱心路径获取点
const center = new THREE.Vector3(0, 2, 10)
for (let i = 0; i < 100; i++) {
  const point = hearShape.getPoint(i / 100)
  endArr.push(new THREE.Vector3(
    point.x * 0.1 + center.x,
    point.y * 0.1 + center.y,
    center.z,
  ))
}
// 创建爱心动画
function makeHeart() {
  const params = {
    time: 0,
  }
  gsap.to(
    params, {
      time: 1,
      duration: 1,
      onUpdate() {
        for (let i = 0; i < 100; i++) {
          const x = starsArr[i].x + (endArr[i].x - starsArr[i].x) * params.time
          const y = starsArr[i].y + (endArr[i].y - starsArr[i].y) * params.time
          const z = starsArr[i].z + (endArr[i].z - starsArr[i].z) * params.time
          const matrix = new THREE.Matrix4()
          matrix.setPosition(x, y, z)
          starsInstance.setMatrixAt(i, matrix)
        }
        starsInstance.instanceMatrix.needsUpdate = true
      },
    },
  )
}

function restoreHeart() {
  const params = {
    time: 0,
  }
  gsap.to(
    params, {
      time: 1,
      duration: 1,
      onUpdate() {
        for (let i = 0; i < 100; i++) {
          const x = endArr[i].x + (starsArr[i].x - endArr[i].x) * params.time
          const y = endArr[i].y + (starsArr[i].y - endArr[i].y) * params.time
          const z = endArr[i].z + (starsArr[i].z - endArr[i].z) * params.time
          const matrix = new THREE.Matrix4()
          matrix.setPosition(x, y, z)
          starsInstance.setMatrixAt(i, matrix)
        }
        starsInstance.instanceMatrix.needsUpdate = true
      },
    },
  )
}
</script>

<template>
  <div ref="testMain" class="main" @mouseenter="isAnimate = false" @mouseleave="isAnimate = true" />
  <div :key="index" class="text">
    <h1>{{ scenes[index].text }}</h1>
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
.text {
  position: absolute;
  top: 200%;
  left: 0;
  padding-left: 50px;
  font-size: 50px;
  color: #fff;
  animation: toTOP 1s ease .3s forwards;
}

@keyframes toTOP {
  0% {
    top: 200%;
  }
  100% {
    top: 0;
  }
}
</style>
