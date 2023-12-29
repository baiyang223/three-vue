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
const renderer = new THREE.WebGL1Renderer()
// 创建几何体
const geometry = new THREE.BoxGeometry(1, 1, 1)
// 创建材质
const material = new THREE.MeshBasicMaterial({ color: 'blue' })
const parentMaterial = new THREE.MeshBasicMaterial({ color: 'red' })
// 设置父元素材质为线框模式
parentMaterial.wireframe = true
// 父元素
const parentCube = new THREE.Mesh(geometry, parentMaterial)
// 创建网络
const cube = new THREE.Mesh(geometry, material)
// 添加元素
parentCube.add(cube)
// 设置立方体位移
parentCube.position.set(-3, 0, 0)
cube.position.set(3, 0, 0)
// 设置立方体的放大
// parentCube.scale.set(2, 2, 2)
// cube.scale.set(2,2,2)
// 绕着x轴旋转
parentCube.rotation.set(Math.PI / 3, 0, 0)
cube.rotation.set(Math.PI / 4, 0, 0)
// 将网络添加到场景中
scene.add(parentCube)
// scene.add(cube)
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
// 控制立方体的位置
// gui.add(cube.position, 'x', -5, 5).name('立方体x轴位置')
const folder = gui.addFolder('立方体位置')
folder.add(cube.position, 'x').min(-10).max(10).step(1).name('立方体x轴位置').onChange((val) => {
  console.log(val)
})
folder.add(cube.position, 'y').min(-10).max(10).step(1).name('立方体y轴位置').onFinishChange((val) => {
  console.log(val)
})
folder.add(cube.position, 'z').min(-10).max(10).step(1).name('立方体z轴位置')

gui.add(parentMaterial, 'wireframe').name('父元素线框模式')

const colorParams = {
  cubeColor: '#0000ff',
}
gui.addColor(colorParams, 'cubeColor').name('立方体颜色').onChange((val) => {
  cube.material.color.set(val)
})

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

  camera.value.position.set(4, 2, 10)
  camera.value.lookAt(0, 0, 0)

  // 动画渲染
  animate()
})

onUnmounted(() => {
  gui.destroy()
})
// 渲染函数
function animate() {
  requestAnimationFrame(animate)
  controls.value.update()
  //     旋转
  //   cube.rotation.x += .01
  //   cube.rotation.y += .01
  //     渲染
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
