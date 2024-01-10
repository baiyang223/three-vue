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
// 创建三个球
const sphere1 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0x00FF00,
  }),
)
sphere1.position.x = -4
scene.add(sphere1)

const sphere2 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0x0000FF,
  }),
)
scene.add(sphere2)

const sphere3 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0xFF00FF,
  }),
)
sphere3.position.x = 4
scene.add(sphere3)

const box = new THREE.Box3()
const arrSphere = [sphere1, sphere2, sphere3]
arrSphere.forEach((item: any) => {
  // 第一种方式
  // 获取当前物体的包围盒
  // item.geometry.computeBoundingBox()
  // // 获取包围盒
  // const current = item.geometry.boundingBox
  // // 更新世界矩阵
  // item.updateWorldMatrix(true, true)
  // // 将奥委会转换到世界坐标系
  // current.applyMatrix4(item.matrixWorld)
  // 第二种方式
  const current = new THREE.Box3().setFromObject(item)
  //   合并包围盒
  box.union(current)
})
console.log(box)
// 创建包围盒辅助器
const boxHelper = new THREE.Box3Helper(box, 0xFFFF00)
scene.add(boxHelper)
// 创建射线
const raycaster = new THREE.Raycaster()
// 创建鼠标向量
const mouse = new THREE.Vector2()

function Click(event: MouseEvent) {
  //   设置鼠标向量的x，y值
  mouse.x = ((event.clientX - (window.innerWidth - testMain.value.clientWidth)) / testMain.value.clientWidth) * 2 - 1
  mouse.y = -(((event.clientY - (window.innerHeight - testMain.value.clientHeight)) / testMain.value.clientHeight) * 2 - 1)

  //   通过摄像机和鼠标位置更新射线
  raycaster.setFromCamera(mouse, camera.value)

  //   计算物体和射线的焦点
  const intersects = raycaster.intersectObjects([sphere1, sphere2, sphere3])

  if (intersects.length > 0) {
    if (intersects[0].object.isSelect) {
      intersects[0].object.material.color.set(intersects[0].object._originColor)
      intersects[0].object.isSelect = false
      return
    }
    intersects[0].object.isSelect = true
    intersects[0].object._originColor = intersects[0].object.material.color.getHex()
    intersects[0].object.material.color.set(0xFF0000)
  }
}

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

  camera.value.position.set(2, 2, 15)
  camera.value.lookAt(0, 0, 0)

  // 光线投射交互
  window.addEventListener('click', Click)
  // 动画渲染
  animate()
})

onUnmounted(() => {
  gui.destroy()
  window.removeEventListener('click', Click)
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
