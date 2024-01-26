<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, onUnmounted, ref } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// interface User {
//   id: number
//   name: string
// }
//
// const u: User = { id: 1, name: 'qqq' }
//
// type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

const testMain = ref()
// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = ref()
// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true,
})
//   创建rgbe加载器
// const hdrLoader = new RGBELoader()
const loader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('../src/utils/draco/')
loader.setDRACOLoader(dracoLoader)
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
let material: any
let showText = false

// 添加按钮
gui.add(eventObj, 'FullScreen').name('全屏')
gui.add(eventObj, 'exitFullscreen').name('退出全屏')

onMounted(() => {
  // 创建相机
  camera.value = new THREE.PerspectiveCamera(
    75, // 视角
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
  // controls.value.autoRotate = true

  camera.value.position.set(0, 0, 3)
  camera.value.lookAt(0, 0, 0)

  //   添加环境纹理
  const texture = new THREE.TextureLoader().load('../src/assets/textures/sky2.jpg')
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.background = texture
  scene.environment = texture
  // 背景模糊度
  // scene.backgroundBlurriness = 1

  //   加载字体模型
  addModel()
  window.addEventListener('click', swatchShow)

  // 动画渲染
  animate()
})

function addModel() {
  loader.load('../src/assets/model/newyear.glb', (gltf: any) => {
    const text = gltf.scene.getObjectByName('文本')
    scene.add(text)

    const geometry = text.geometry
    const position = geometry.attributes.position
    const vertexCount = position.count
    // const triangleCount = Number((vertexCount / 3).toFixed(0))
    const triangleCount = vertexCount
    const randomDirections = [] as any[]
    const randomStrengths = [] as any[]

    for (let i = 0; i < triangleCount; i++) {
      const dir = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
      ).normalize().toArray()
      randomDirections.push(dir[0], dir[1], dir[2])
      const str = Math.random()
      randomStrengths.push(str, str, str)
    }

    const randomDirectionsAttribute = new THREE.Float32BufferAttribute(
      new Float32Array(randomDirections),
      3,
    )
    geometry.setAttribute('randomDirection', randomDirectionsAttribute)

    const randomStrengthsAttribute = new THREE.Float32BufferAttribute(
      new Float32Array(randomStrengths),
      1,
    )
    geometry.setAttribute('randomStrength', randomStrengthsAttribute)

    material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 1 },
      },
      vertexShader: `
        attribute vec3 randomDirection;
        attribute float randomStrength;
        uniform float time;
        varying vec3 vPosition;
        void main() {
          vPosition = position;
          vec3 pos = position.xyz;
          pos += randomDirection * randomStrength * time;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos.xyz, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vPosition;
        void main() {
          vec3 color = normalize(vPosition) * 0.5 + 0.5;
          color.z = color.z * 3.0;
          gl_FragColor = vec4(color,1.0);
        }
      `,
      side: THREE.DoubleSide,
      transparent: true,
    })
    text.material = material

    // material.onBeforeCompile = (shader: any) => {
    //   shader.vertexShader = `
    //     attribute vec3 randomDirection;
    //     attribute float randomStrength;
    //     uniform float time;
    //     varying vec3 vPosition;
    //     void main() {
    //       vPosition = position;
    //       vec3 pos = position.xyz;
    //       pos += randomDirection * randomStrength * time;
    //       gl_Position = projectionMatrix * modelViewMatrix * vec4(pos.xyz, 1.0);
    //     }
    //   `
    //   shader.fragmentShader = `
    //     varying vec3 vPosition;
    //     void main() {
    //       vec3 color = normalize(vPosition) * 0.5 + 0.5;
    //       color.z = color.z * 3.0;
    //       gl_FragColor = vec4(color,1.0);
    //     }
    //   `
    // }
  })
}

function swatchShow() {
  showText = !showText
}
// 渲染
const clock = new THREE.Clock()
let value = 0 as any
function animate() {
  const delta = clock.getDelta()
  // console.log(delta);
  if (material) {
    if (showText) {
      value -= delta
      value = Math.max(value, 0)
      material.uniforms.time.value = value
    }
    else {
      value += delta
      value = Math.min(value, 1)
      material.uniforms.time.value = value
    }
  }
  requestAnimationFrame(animate)
  controls.value.update()
  renderer.render(scene, camera.value)
}

onUnmounted(() => {
  gui.destroy()
  window.removeEventListener('click', swatchShow)
  cancelAnimationFrame(animate as unknown as number)
  renderer.forceContextLoss()
  renderer.context = null
  renderer.domElement = null
  // renderer = null
})
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
