<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, onUnmounted, ref } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import gsap from 'gsap'

const testMain = ref()
// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = ref()
// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  //   对数深度缓冲区
  // logarithmicDepthBuffer: true,
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
const progress = ref<number>(0)
// 添加按钮
gui.add(eventObj, 'FullScreen').name('全屏')
gui.add(eventObj, 'exitFullscreen').name('退出全屏')

function lon2xyz(R: number, longitude: number, latitude: number) {
  let lon = (longitude * Math.PI) / 180 // 转弧度值
  const lat = (latitude * Math.PI) / 180 // 转弧度值
  lon = -lon // js坐标系z坐标轴对应经度-90度，而不是90度

  // 经纬度坐标转球面坐标计算公式
  const x = R * Math.cos(lat) * Math.cos(lon)
  const y = R * Math.sin(lat)
  const z = R * Math.cos(lat) * Math.sin(lon)
  // 返回球面坐标
  return new THREE.Vector3(x, y, z)
}

onMounted(() => {
  // 创建相机
  camera.value = new THREE.PerspectiveCamera(
    45, // 视角
    testMain.value.clientWidth / testMain.value.clientHeight, // 宽高比
    0.1, // 进平面
    100000, // 远平面
  )
  camera.value.position.set(0, 50, 300)
  camera.value.lookAt(0, 0, 0)
  // 设置渲染器宽高，并添加到页面
  renderer.setSize(testMain.value.clientWidth, testMain.value.clientHeight)
  renderer.shadowMap.enabled = true
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.physicallyCorrectLights = true

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

  // 动画渲染
  animate()

  scene.background = new THREE.Color(0x030311)
  // 使用点材质创建星空效果
  const vertices = []
  for (let i = 0; i < 500; i++) {
    const vertex = new THREE.Vector3()
    vertex.x = 800 * Math.random() - 400
    vertex.y = 800 * Math.random() - 400
    vertex.z = 800 * Math.random() - 400
    vertices.push(vertex.x, vertex.y, vertex.z)
  }

  // 星空效果
  const starsGeometry = new THREE.BufferGeometry()
  starsGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array(vertices), 3),
  )

  // 加载点材质纹理
  const starsTexture = new THREE.TextureLoader().load('../src/assets/textures/images/stars.png')
  const starsMaterial = new THREE.PointsMaterial({
    size: 2,
    sizeAttenuation: true, // 尺寸衰减
    color: 0x4D76CF,
    transparent: true,
    opacity: 1,
    map: starsTexture,
  })

  const stars = new THREE.Points(starsGeometry, starsMaterial)
  scene.add(stars)

  // 创建地球
  const earthGeometry = new THREE.SphereGeometry(50, 32, 32)
  const earthTexture = new THREE.TextureLoader().load('../src/assets/textures/images/map.jpg')

  const earthMaterial = new THREE.MeshBasicMaterial({
    map: earthTexture,
  })
  const earth = new THREE.Mesh(earthGeometry, earthMaterial)
  scene.add(earth)
  // 发光地球
  const lightTexture = new THREE.TextureLoader().load('../src/assets/textures/images/earth.jpg')
  const lightEarthGeometry = new THREE.SphereGeometry(53, 32, 32)
  const lightEarthMaterial = new THREE.MeshBasicMaterial({
    map: lightTexture,
    alphaMap: lightTexture,
    blending: THREE.AdditiveBlending,
    transparent: true,
  })
  const lightEarth = new THREE.Mesh(lightEarthGeometry, lightEarthMaterial)
  scene.add(lightEarth)

  // 添加地球内外发光精灵
  const spriteTexture = new THREE.TextureLoader().load('../src/assets/textures/images/glow.png')
  const spriteMaterial = new THREE.SpriteMaterial({
    map: spriteTexture,
    color: 0x4D76CF,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  })
  const sprite = new THREE.Sprite(spriteMaterial)
  sprite.scale.set(155, 155, 0)
  scene.add(sprite)

  // 内发光
  const spriteTexture1 = new THREE.TextureLoader().load('../src/assets/textures/images/innerGlow.png')
  const spriteMaterial1 = new THREE.SpriteMaterial({
    map: spriteTexture1,
    color: 0x4D76CF,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  })
  const sprite1 = new THREE.Sprite(spriteMaterial1)
  sprite1.scale.set(128, 128, 0)
  scene.add(sprite1)
  const scale = new THREE.Vector3(1, 1, 1)

  for (let i = 0; i < 30; i++) {
    // 实现光柱
    const lightPillarTexture = new THREE.TextureLoader().load(
      '../src/assets/textures/images/light_column.png',
    )
    const lightPillarGeometry = new THREE.PlaneGeometry(3, 20)
    const lightPillarMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      map: lightPillarTexture,
      alphaMap: lightPillarTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
    const lightPillar = new THREE.Mesh(lightPillarGeometry, lightPillarMaterial)
    lightPillar.add(lightPillar.clone().rotateY(Math.PI / 2))

    // 创建波纹扩散效果
    const circlePlane = new THREE.PlaneGeometry(6, 6)
    const circleTexture = new THREE.TextureLoader().load('../src/assets/textures/images/label.png')
    const circleMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      map: circleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
    const circleMesh = new THREE.Mesh(circlePlane, circleMaterial)
    circleMesh.rotation.x = -Math.PI / 2
    circleMesh.position.set(0, -7, 0)

    lightPillar.add(circleMesh)

    gsap.to(circleMesh.scale, {
      duration: 1 + Math.random() * 0.5,
      x: 2,
      y: 2,
      z: 2,
      repeat: -1,
      delay: Math.random() * 0.5,
      yoyo: true,
      ease: 'power2.inOut',
    })

    // 设置光柱的位置

    // lightPillar.position.set(0, 50, 0);

    const lat = Math.random() * 180 - 90
    const lon = Math.random() * 360 - 180
    const position = lon2xyz(60, lon, lat)
    lightPillar.position.set(position.x, position.y, position.z)

    lightPillar.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      position.clone().normalize(),
    )
    scene.add(lightPillar)
  }

  // 绕地球运行的月球
  const moonTexture = new THREE.TextureLoader().load('../src/assets/textures/images/moon.jpg')
  const moonMaterial = new THREE.MeshStandardMaterial({
    map: moonTexture,
    emissive: 0xFFFFFF,
    emissiveMap: moonTexture,
  })
  const moonGeometry = new THREE.SphereGeometry(5, 32, 32)
  const moon = new THREE.Mesh(moonGeometry, moonMaterial)
  moon.position.set(150, 0, 0)
  scene.add(moon)

  // 创建月球环
  const moonRingTexture = new THREE.TextureLoader().load(
    '../src/assets/textures/images/moon_ring.png',
  )
  const moonRingMaterial = new THREE.MeshBasicMaterial({
    map: moonRingTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
    opacity: 0.5,
  })
  const moonRingGeometry = new THREE.RingGeometry(145, 155, 64)
  const moonRing = new THREE.Mesh(moonRingGeometry, moonRingMaterial)
  moonRing.rotation.x = -Math.PI / 2
  scene.add(moonRing)

  const time = {
    value: 0,
  }
  gsap.to(time, {
    value: 1,
    duration: 10,
    repeat: -1,
    ease: 'linear',
    onUpdate: () => {
      moon.position.x = 150 * Math.cos(time.value * Math.PI * 2)
      moon.position.z = 150 * Math.sin(time.value * Math.PI * 2)
      moon.rotation.y = time.value * Math.PI * 8
    },
  })

  THREE.DefaultLoadingManager.onProgress = function (item: any, loaded: number, total: number) {
    // console.log(item, loaded, total)
    progress.value = Number(((loaded / total) * 100).toFixed(2))
  }
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
  <div v-if="progress !== 100" class="loading" />
  <div v-if="progress !== 100" class="progress">
    <img src="@/assets/textures/images/loading.gif" alt="">
    <span>地球加载中：{{ progress }}%</span>
  </div>
  <div class="title">
    酷炫3D地球
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
.loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/textures/images/loading.jpg');
  background-size: cover;
  filter: blur(50px);
  z-index: 100;
}
.progress {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 101;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #fff;
}
.progress > img {
  padding: 0 15px;
}

.title {
  width: 380px;
  height: 40px;
  position: fixed;
  right: 100px;
  top: 70px;
  background-color: rgba(0, 0, 0, 0.5);
  line-height: 40px;
  text-align: center;
  color: #fff;
  border-radius: 5px;
  z-index: 110;
}
</style>
