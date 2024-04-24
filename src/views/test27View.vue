<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, onUnmounted, ref } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import gsap from 'gsap'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

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
// 添加立方体
// const geometry = new THREE.BoxGeometry(10, 10, 10)
// geometry.scale(1, 1, -1)
// 客厅
// const living = ['4_b', '4_f', '4_u', '4_d', '4_r', '4_l']
// const boxMaterials = [] as any[]
// living.forEach((item) => {
// //   纹理加载
//   const texture = new THREE.TextureLoader().load(new URL(`../assets/textures/imgs/living/${item}.jpg`, import.meta.url).href)
//   //   创建材质
//   if (item === '4_u' || item === '4_d') {
//     texture.rotation = item === '4_d' ? Math.PI / 2 : -Math.PI / 2
//     texture.center = new THREE.Vector2(0.5, 0.5)
//     boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture }))
//   }
//   else {
//     boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture }))
//   }
// })
// const cube = new THREE.Mesh(geometry, boxMaterials)
// scene.add(cube)
// 添加球
// const geometry = new THREE.SphereGeometry(5, 32, 32)
// const loader = new RGBELoader()
// loader.load(new URL('../assets/textures/imgs/hdr/Living.hdr', import.meta.url).href, (texture) => {
//   const material = new THREE.MeshBasicMaterial({ map: texture })
//   const sphere = new THREE.Mesh(geometry, material)
//   sphere.geometry.scale(1, 1, -1)
//   scene.add(sphere)
// })
// 添加按钮
gui.add(eventObj, 'FullScreen').name('全屏')
gui.add(eventObj, 'exitFullscreen').name('退出全屏')
const builds = [
  { id: 1, name: '房门口走廊', position: [10, 0, 0], buildBg: ['0_b', '0_f', '0_u', '0_d', '0_r', '0_l'] },
  { id: 2, name: '客厅', position: [0, 0, 0], buildBg: ['4_b', '4_f', '4_u', '4_d', '4_r', '4_l'] },
  { id: 3, name: '走廊', position: [0, 0, -10], buildBg: ['7_r', '7_l', '7_u', '7_d', '7_f', '7_b'] },
  { id: 4, name: '主卧室门口', position: [0, 0, -20], buildBg: ['20_r', '20_l', '20_u', '20_d', '20_f', '20_b'] },
  { id: 5, name: '主卧室', position: [-5, 0, -30], buildBg: ['23_r', '23_l', '23_u', '23_d', '23_f', '23_b'] },
  { id: 6, name: '次卧', position: [10, 0, -20], buildBg: ['11_r', '11_l', '11_u', '11_d', '11_f', '11_b'] },
  { id: 7, name: '儿童卧', position: [-10, 0, -20], buildBg: ['19_r', '19_l', '19_u', '19_d', '19_f', '19_b'] },
  { id: 8, name: '厨房', position: [10, 0, -10], buildBg: ['2_r', '2_l', '2_u', '2_d', '2_f', '2_b'] },
]
const fonts = [
  { id: 1, title: '客厅', buildId: 2, position: [7, 0, 0], rotate: [0, Math.PI / 2, 0] },
  { id: 2, title: '厨房', buildId: 8, position: [10, 0, -3], rotate: [0, 0, 0] },
  { id: 3, title: '房门口走廊', buildId: 1, position: [3, 0, 5], rotate: [0, Math.PI, 0] },
  { id: 4, title: '走廊', buildId: 3, position: [1.8, -1, -4], rotate: [0, -Math.PI / 6, 0] },
  { id: 5, title: '客厅', buildId: 2, position: [1, 0, -6], rotate: [0, -Math.PI, 0] },
  { id: 6, title: '儿童卧', buildId: 7, position: [-1.1, -0.4, -13], rotate: [0, Math.PI / 4, 0] },
  { id: 7, title: '主卧室门口', buildId: 4, position: [-0.5, 0, -14], rotate: [0, 0, 0] },
  { id: 8, title: '次卧', buildId: 6, position: [0.8, 0, -13], rotate: [0, -Math.PI / 6, 0] },
  { id: 9, title: '走廊', buildId: 3, position: [-7, 0, -17.4], rotate: [0, -Math.PI / 1.6, 0] },
  { id: 10, title: '走廊', buildId: 3, position: [7, -0.5, -17.9], rotate: [0, Math.PI / 1.6, 0] },
  { id: 11, title: '主卧室门口', buildId: 4, position: [0, 0, -30.2], rotate: [0, -Math.PI / 2, 0] },
  { id: 12, title: '走廊', buildId: 3, position: [1.4, 0, -17], rotate: [0, Math.PI, 0] },
  { id: 13, title: '主卧室', buildId: 5, position: [-3, 0, -24], rotate: [0, 0, 0] },
  { id: 14, title: '房门口走廊', buildId: 1, position: [10, 0, -6], rotate: [0, Math.PI, 0] },
]
const geometryFonts = [] as any[]
// 创建射线
const raycaster = new THREE.Raycaster()
// 创建鼠标向量
const mouse = new THREE.Vector2()
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
  // controls.value.enableZoom = false
  // controls.value.enablePan = false

  camera.value.position.set(10, 0, 0.1)
  camera.value.lookAt(0, 0, 0)
  controls.value.target.x = 10

  // 循环创建房间
  builds.forEach((item) => {
    // 添加立方体
    const geometry = new THREE.BoxGeometry(10, 10, 10)
    geometry.scale(1, 1, -1)
    const boxMaterials = [] as any[]
    item.buildBg.forEach((subItem) => {
    //   纹理加载
      const texture = new THREE.TextureLoader().load(new URL(`../assets/textures/imgs/living/${subItem}.jpg`, import.meta.url).href)
      //   创建材质
      if (subItem === '0_u' || subItem === '0_d') {
        texture.rotation = subItem === '0_d' ? Math.PI / 2 : -Math.PI / 2
        texture.center = new THREE.Vector2(0.5, 0.5)
        boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture }))
        return
      }
      if (subItem === '4_u' || subItem === '4_d') {
        texture.rotation = subItem === '4_d' ? Math.PI / 2 : -Math.PI / 2
        texture.center = new THREE.Vector2(0.5, 0.5)
        boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture }))
        return
      }
      boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture }))
    })
    const cube = new THREE.Mesh(geometry, boxMaterials)
    cube.position.set(item.position[0], item.position[1], item.position[2])
    if (item.id === 6)
      cube.rotation.y = -Math.PI / 2
    if (item.id === 8)
      cube.rotation.y = Math.PI / 2
    geometryFonts.push(cube)
    scene.add(cube)
  })

  //   加载字体
  const loader = new FontLoader()
  loader.load('../src/assets/fonts/FangSong_Regular.json', (font) => {
    fonts.forEach((item) => {
      const boxGeometry = new THREE.BoxGeometry(0.3 * item.title.length, 0.3, 0.02)
      const boxMaterial = new THREE.MeshBasicMaterial({ color: '#fff', transparent: true, opacity: 0 })
      const boxCube = new THREE.Mesh(boxGeometry, boxMaterial)
      boxCube.userData = item
      boxCube.position.set(item.position[0], item.position[1], item.position[2])
      boxCube.rotation.set(item.rotate[0], item.rotate[1], item.rotate[2])
      const geometry = new TextGeometry(item.title, {
        font, // 字体
        size: 0.2, // 字体大小
        height: 0.02, // 字体厚度
      })
      geometry.center()
      // 设置字体材质
      const material = new THREE.MeshPhysicalMaterial({
        color: 0xFFFFFF,
        side: THREE.DoubleSide,
      })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.z = 0.01
      boxCube.add(mesh)
      geometryFonts.push(boxCube)
      scene.add(boxCube)
    })
  })
  // 动画渲染
  animate()
})

onUnmounted(() => {
  gui.destroy()
})

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera.value)
  controls.value.update()
}

function Click(event: MouseEvent) {
  //   设置鼠标向量的x，y值
  mouse.x = ((event.clientX - (window.innerWidth - testMain.value.clientWidth)) / testMain.value.clientWidth) * 2 - 1
  mouse.y = -(((event.clientY - (window.innerHeight - testMain.value.clientHeight)) / testMain.value.clientHeight) * 2 - 1)

  //   通过摄像机和鼠标位置更新射线
  raycaster.setFromCamera(mouse, camera.value)

  //   计算物体和射线的焦点
  const intersects = raycaster.intersectObjects(geometryFonts)
  if (intersects.length > 0 && intersects[0].object.userData?.buildId) {
    const buildGeometry = builds.find(item => item.id === intersects[0].object.userData.buildId)
    if (buildGeometry)
      translateCamera(new THREE.Vector3(buildGeometry.position[0], buildGeometry.position[1], buildGeometry.position[2]), new THREE.Vector3(buildGeometry.position[0], buildGeometry.position[1], buildGeometry.position[2]))
  }
}
</script>

<template>
  <div ref="testMain" class="main" @click="Click" />
</template>

<style scoped lang="scss">
.main {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
</style>
