<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, onUnmounted, ref } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

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
const mouse = new THREE.Vector2()
let material: any
// 添加按钮
gui.add(eventObj, 'FullScreen').name('全屏')
gui.add(eventObj, 'exitFullscreen').name('退出全屏')

onMounted(() => {
  // 创建相机
  camera.value = new THREE.PerspectiveCamera(
    90, // 视角
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

  camera.value.position.set(0, 0, 5.5)
  camera.value.lookAt(0, 0, 0)

  //   添加环境纹理
  const textureLoader = new THREE.TextureLoader()
  // const texture = textureLoader.load('../src/assets/textures/cat.jpg')
  // const depthTexture = textureLoader.load('../src/assets/textures/cat_depth.jpg')
  const texture = textureLoader.load('../src/assets/textures/build.jpg')
  const depthTexture = textureLoader.load('../src/assets/textures/build_depth.jpg')
  // texture.mapping = THREE.EquirectangularReflectionMapping
  // scene.background = texture
  // scene.environment = texture
  // 背景模糊度
  // scene.backgroundBlurriness = 1

  // 创建平面
  const geometry = new THREE.PlaneGeometry(19.2, 12)
  // const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
  // const plane = new THREE.Mesh(geometry, material)
  // scene.add(plane)

  material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uTexture: { value: texture },
      uDepthTexture: { value: depthTexture },
      uMouse: { value: mouse },
    },
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    uniform sampler2D uTexture;
    uniform sampler2D uDepthTexture;
    uniform vec2 uMouse;
    varying vec2 vUv;
    uniform float uTime;
    void main() {
      vec4 color = texture2D(uTexture, vUv);
      vec4 depth = texture2D(uDepthTexture, vUv);
      float depthValue = depth.r;
      float x = vUv.x + (uMouse.x+sin(uTime))*0.01*depthValue;
      float y = vUv.y + (uMouse.y+cos(uTime))*0.01*depthValue;
      vec4 newColor = texture2D(uTexture, vec2(x, y));
      gl_FragColor = newColor;
    }
  `,
  })
  const plane = new THREE.Mesh(geometry, material)
  scene.add(plane)

  window.addEventListener('mousemove', moveFn)

  // 动画渲染
  animate()
})

onUnmounted(() => {
  gui.destroy()
  window.removeEventListener('mousemove', moveFn)
})

function moveFn(event: MouseEvent) {
  mouse.x = (event.clientX / testMain.value.clientWidth) * 2 - 1
  mouse.y = -(event.clientY / testMain.value.clientHeight) * 2 + 1
}

function animate() {
  material.uniforms.uMouse.value = mouse
  material.uniforms.uTime.value = performance.now() / 1000
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
