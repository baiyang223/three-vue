<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, ref } from 'vue'

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
// 创建网络
const cube = new THREE.Mesh(geometry, material)
// 将网络添加到场景中
scene.add(cube)

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
  testMain.value.appendChild(renderer.domElement)

  // 设置相机位置
  camera.value.position.z = 5
  camera.value.lookAt(0, 0, 0)
  // 动画渲染
  animate()
})

// 渲染函数
function animate() {
  requestAnimationFrame(animate)
  //     旋转
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
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
}
</style>
