<script setup lang="ts">
import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { onMounted, onUnmounted, ref } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

const testMain = ref()
// 创建物理世界
const world = new CANNON.World()
// 设置重力
world.gravity.set(0, -9.82, 0)
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
const clock = new THREE.Clock()
const phyMeshes = [] as any[]
const meshes = [] as any[]
// 设置碰撞组,数值要用2的幂次方
const GROUP1 = 1
const GROUP2 = 2
const GROUP3 = 4
const GROUP4 = 8
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

  camera.value.position.set(0, 2, 10)
  camera.value.lookAt(0, 0, 0)
  //   添加环境纹理
  const texture = new THREE.TextureLoader().load('../src/assets/textures/sky2.jpg')
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.background = texture
  scene.environment = texture

  // 设置立方体材质
  const boxMaterialCon = new CANNON.Material('boxMaterial')
  boxMaterialCon.friction = 0

  // 创建一个物理世界的平面
  // const planeShape = new CANNON.Plane()
  const planeShape = new CANNON.Box(new CANNON.Vec3(5, 0.1, 5))
  // 创建一个刚体
  const planeBody = new CANNON.Body({
    // mass: 0,
    shape: planeShape,
    position: new CANNON.Vec3(0, -0.1, 0),
    type: CANNON.Body.STATIC,
    material: boxMaterialCon,
    collisionFilterGroup: GROUP1,
    collisionFilterMask: GROUP1 | GROUP2 | GROUP3,
  })
  // planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), 0.1)
  world.addBody(planeBody)
  // 创建几何平面
  const planeGeometry = new THREE.BoxGeometry(10, 0.2, 10)
  const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00, side: THREE.DoubleSide })
  const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
  planeMesh.position.set(0, -0.1, 0)
  scene.add(planeMesh)

  // 创建物理立方体
  const boxShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
  // 创建一个刚体
  const boxBody = new CANNON.Body({
    shape: boxShape,
    position: new CANNON.Vec3(-2, 0.5, 0),
    mass: 1,
    material: boxMaterialCon,
    collisionFilterGroup: GROUP1,
    collisionFilterMask: GROUP1 | GROUP2 | GROUP3 | GROUP4,
  })
  world.addBody(boxBody)
  phyMeshes.push(boxBody)

  // 创建立方体几何体
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
  const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 })
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial)
  scene.add(boxMesh)
  meshes.push(boxMesh)

  // 创建一个物理球
  const sphereShape = new CANNON.Sphere(0.5)
  // 创建刚体
  const sphereBody = new CANNON.Body({
    shape: sphereShape,
    position: new CANNON.Vec3(0, 0.5, 0),
    mass: 1,
    material: boxMaterialCon,
    collisionFilterGroup: GROUP2,
    collisionFilterMask: GROUP1 | GROUP4,
  })
  // 将刚体添加到物理世界
  world.addBody(sphereBody)
  phyMeshes.push(sphereBody)

  // 创建几何球体
  const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32)
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000FF })
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
  scene.add(sphereMesh)
  meshes.push(sphereMesh)

  // 创建物理圆柱体
  const cylinderShape = new CANNON.Cylinder(0.5, 0.5, 1, 32)
  const cylinderBody = new CANNON.Body({
    shape: cylinderShape,
    position: new CANNON.Vec3(2, 0.5, 0),
    mass: 1,
    material: boxMaterialCon,
    collisionFilterGroup: GROUP3,
    collisionFilterMask: GROUP1 | GROUP4,
  })
  world.addBody(cylinderBody)
  phyMeshes.push(cylinderBody)

  // 创建圆柱几何体
  const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32)
  const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 })
  const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial)
  scene.add(cylinderMesh)
  meshes.push(cylinderMesh)

  // 设置立方体的初速度
  boxBody.velocity.set(2, 0, 0)

  // 动画渲染
  animate()
})

onUnmounted(() => {
  gui.destroy()
})

function animate() {
  const delta = clock.getDelta()
  world.step(1 / 60, delta, 10)
  for (let i = 0; i < phyMeshes.length; i++) {
    meshes[i].position.copy(phyMeshes[i].position)
    meshes[i].quaternion.copy(phyMeshes[i].quaternion)
  }
  // 更新球体网格的位置和旋转
  // sphereMesh.position.copy(sphereBody.position)
  // sphereMesh.quaternion.copy(sphereBody.quaternion)
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
