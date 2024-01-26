<script setup lang="ts">
import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { onMounted, onUnmounted, ref } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import gsap from 'gsap'

const testMain = ref()
// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = ref()
// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  logarithmicDepthBuffer: true,
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
// 初始化物理世界
const world = new CANNON.World()
// 设置重力
world.gravity.set(0, -9.82, 0)
const loader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('../src/utils/draco/')
loader.setDRACOLoader(dracoLoader)
let ball: any, ballBody: any
const clock = new THREE.Clock()
let isClick = false
const percentage = ref(30)

gsap.to(percentage, {
  duration: 1,
  value: 100,
  ease: 'linear',
  repeat: -1,
  onUpdate: () => {
    percentage.value = Math.floor(percentage.value)
  },
})
// 添加按钮
gui.add(eventObj, 'FullScreen').name('全屏')
gui.add(eventObj, 'exitFullscreen').name('退出全屏')

onMounted(() => {
  // 创建相机
  camera.value = new THREE.PerspectiveCamera(
    75, // 视角
    testMain.value.clientWidth / testMain.value.clientHeight, // 宽高比
    0.1, // 进平面
    100, // 远平面
  )
  // 设置渲染器宽高，并添加到页面
  renderer.setSize(testMain.value.clientWidth, testMain.value.clientHeight)
  // 设置色调映射
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.5
  // 设置阴影
  renderer.shadowMap.enabled = true
  // 设置阴影类型
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

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
  // controls.value.autoRotate = true

  camera.value.position.set(4, 2, 0)
  camera.value.lookAt(0, 0, 0)

  // 动画渲染
  animate()
  // 加载纹理
  const textureLoader = new THREE.TextureLoader()
  textureLoader.load('../src/assets/textures/outdoor.jpg', (texture: any) => {
    texture.mapping = THREE.EquirectangularReflectionMapping
    // 设置环境纹理
    scene.background = texture
    scene.environment = texture
    scene.backgroundBlurriness = 0.3
  })

  // 添加聚光灯
  const spotLight = new THREE.SpotLight(0xFFFFFF)
  spotLight.position.set(10, 50, 0)
  spotLight.castShadow = true
  spotLight.shadow.mapSize.width = 2048
  spotLight.shadow.mapSize.height = 2048
  spotLight.shadow.camera.near = 0.5
  spotLight.shadow.camera.far = 500
  spotLight.shadow.camera.fov = 30
  spotLight.shadow.bias = -0.00008
  spotLight.intensity = 2
  scene.add(spotLight)

  // 加载模型
  loader.load('../src/assets/model/playground02.glb', (gltf: any) => {
    const model = gltf.scene

    model.traverse((child: any) => {
      if (child.isMesh && child.name.search(/Solid/) === -1) {
        child.castShadow = true
        child.receiveShadow = true

        // trimesh类型
        const trimesh = new CANNON.Trimesh(
          child.geometry.attributes.position.array,
          child.geometry.index.array,
        )
        // 创建刚体
        const trimeshBody = new CANNON.Body({
          mass: 0,
          shape: trimesh,
        })
        // 获取世界位置和旋转给到物理世界
        trimeshBody.position.copy(child.getWorldPosition(new THREE.Vector3()))
        trimeshBody.quaternion.copy(
          child.getWorldQuaternion(new THREE.Quaternion()),
        )
        // 添加刚体到物理世界
        world.addBody(trimeshBody)

        if (child.name === 'door') {
          child.material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            opacity: 0,
            transparent: true,
          })
        }
      }

      if (child.name === 'Soccer_Ball') {
        ball = child
        // 创建球体
        const ballShape = new CANNON.Sphere(0.15)
        // 创建刚体
        ballBody = new CANNON.Body({
          mass: 1,
          position: new CANNON.Vec3(0, 15, 0),
          shape: ballShape,
        })
        // 添加刚体到物理世界
        world.addBody(ballBody)
      }
      setTimeout(() => {
        ballBody.position.set(0, 15, 0)
        ballBody.velocity.set(0, 0, 0)
        ballBody.angularVelocity.set(0, 0, 0)
      }, 2000)
    })
    // 添加模型到场景
    scene.add(model)
  })
  window.addEventListener('click', sendBall)
})

onUnmounted(() => {
  gui.destroy()
  window.removeEventListener('click', sendBall)
})

function sendBall() {
  if (isClick)
    return
  isClick = true
  ballBody.applyForce(
    new CANNON.Vec3(
      -10 * percentage.value,
      6 * percentage.value,
      (Math.random() - 0.5) * percentage.value,
    ),
    ballBody.position,
  )
  setTimeout(() => {
    isClick = false
    ballBody.position.set(0, 15, 0)
    ballBody.velocity.set(0, 0, 0)
    ballBody.angularVelocity.set(0, 0, 0)
  }, 5000)
}

function animate() {
  const delta = clock.getDelta()
  world.step(delta)
  if (ball && ballBody) {
    ball.position.copy(ballBody.position)
    ball.quaternion.copy(ballBody.quaternion)
  }
  requestAnimationFrame(animate)
  controls.value.update()
  renderer.render(scene, camera.value)
}
</script>

<template>
  <div ref="testMain" class="main" />
  <h1>{{ percentage }}</h1>
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
h1 {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
  color: #fff;
}
</style>
