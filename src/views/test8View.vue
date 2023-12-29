<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, ref } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const testMain = ref()
// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = ref()
// 创建渲染器
const renderer = new THREE.WebGL1Renderer()
// 创建几何体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
// 创建材质
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 'blue' })
const cubeMaterial1 = new THREE.MeshBasicMaterial({ color: 'red' })
const cubeMaterial2 = new THREE.MeshBasicMaterial({ color: 'green' })
const cubeMaterial3 = new THREE.MeshBasicMaterial({ color: 'pink' })
const cubeMaterial4 = new THREE.MeshBasicMaterial({ color: 'yellowgreen' })
const cubeMaterial5 = new THREE.MeshBasicMaterial({ color: 'yellow' })
// 创建网络
const cube = new THREE.Mesh(cubeGeometry, [cubeMaterial, cubeMaterial1, cubeMaterial2, cubeMaterial3, cubeMaterial4, cubeMaterial5])
cube.position.set(2, 2, 1)
// 将网络添加到场景中
scene.add(cube)
// 创建几何体
const geometry = new THREE.BufferGeometry()
// 使用索引绘制
const vertices = new Float32Array([
  -1, -1, 0,
  1, -1, 0,
  1, 1, 0,
  -1, 1, 0,
])
// // 创建顶点属性
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
// 创建索引
const indices = new Uint16Array([0, 1, 2, 2, 3, 0])
// 创建索引属性
geometry.setIndex(new THREE.BufferAttribute(indices, 1))

// 设置两个顶点组，形成两个材质
geometry.addGroup(0, 3, 0)
geometry.addGroup(3, 3, 1)
// 创建材质
const material = new THREE.MeshBasicMaterial({
  color: 0x00FF00,
  // side: THREE.DoubleSide, // 正反都能看到
  wireframe: true,
})
const material1 = new THREE.MeshBasicMaterial({
  color: 0xFF0000,
  side: THREE.DoubleSide, // 正反都能看到
  // wireframe: true,
})
const plane = new THREE.Mesh(geometry, [material, material1])
scene.add(plane)
// 胶囊几何
const capsuleGeometry = new THREE.CapsuleGeometry(1, 1, 8, 8)
const capsuleMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 })
const capsule = new THREE.Mesh(capsuleGeometry, capsuleMaterial)
capsuleMaterial.wireframe = true
capsule.position.set(-3, 1, 1)
scene.add(capsule)
// 圆几何
const circleGeometry = new THREE.CircleGeometry(1, 32)
const circleMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 })
const circle = new THREE.Mesh(circleGeometry, circleMaterial)
circleMaterial.side = THREE.DoubleSide
circle.position.set(-3, 4, 1)
scene.add(circle)
// 圆锥几何
const coneGeometry = new THREE.ConeGeometry(1, 2, 32)
const coneMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 })
const cone = new THREE.Mesh(coneGeometry, coneMaterial)
cone.position.set(0, 4, 0)
scene.add(cone)
// 圆柱体几何形状
const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 3, 32)
const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 })
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial)
cylinder.position.set(0, -4, 0)
scene.add(cylinder)
// 边缘几何
const lineGeometry = new THREE.BoxGeometry(20, 20, 20)
const lineEdges = new THREE.EdgesGeometry(lineGeometry)
const line = new THREE.LineSegments(lineEdges, new THREE.LineBasicMaterial({ color: 0xFFFFFF }))
line.material.depthTest = false
line.material.opacity = 0.8
line.material.transparent = true
scene.add(line)
// 拉伸几何体
const length = 1
const width = 1
const shape = new THREE.Shape()
shape.moveTo(0, 0)
shape.lineTo(0, width)
shape.lineTo(length, width)
shape.lineTo(length, 0)
shape.lineTo(0, 0)
const extrudeSettings = {
  steps: 2,
  depth: 3,
  bevelEnabled: true,
  bevelThickness: 1,
  bevelSize: 1,
  bevelOffset: 0,
  bevelSegments: 1,
}
const meshGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
const meshMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 })
meshMaterial.wireframe = true
const mesh = new THREE.Mesh(meshGeometry, meshMaterial)
mesh.position.set(3, -3, -1.5)
scene.add(mesh)
// 车床几何
const points = []
for (let i = 0; i < 10; i++)
  points.push(new THREE.Vector2(Math.sin(i * 0.1) * 1.4 + 0.5, (i - 5) * 0.2))

const latheGeometry = new THREE.LatheGeometry(points)
const latheMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 })
latheMaterial.side = THREE.DoubleSide
const lathe = new THREE.Mesh(latheGeometry, latheMaterial)
lathe.position.set(3, 0, 0)
scene.add(lathe)
// 平面几何
const planeGeometry = new THREE.PlaneGeometry(1, 1)
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00, side: THREE.DoubleSide })
const plane2 = new THREE.Mesh(planeGeometry, planeMaterial)
plane2.position.set(2, 3, 0)
plane2.rotation.set(Math.PI / 5, -Math.PI / 4, 0)
scene.add(plane2)
// 环形几何
const mesh2Geometry = new THREE.RingGeometry(1, 2, 32)
const mesh2Material = new THREE.MeshBasicMaterial({ color: 0xFFFF00, side: THREE.DoubleSide })
const mesh2 = new THREE.Mesh(mesh2Geometry, mesh2Material)
mesh2.position.set(-3.2, -4, 0)
scene.add(mesh2)
// 形状几何
const x = 0
const y = 0

const heartShape = new THREE.Shape()

heartShape.moveTo(x + 5, y + 5)
heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y)
heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7)
heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19)
heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7)
heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y)
heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5)

const mesh3Geometry = new THREE.ShapeGeometry(heartShape)
const mesh3Material = new THREE.MeshBasicMaterial({ color: 0x00FF00 })
mesh3Material.side = THREE.DoubleSide
const mesh3 = new THREE.Mesh(mesh3Geometry, mesh3Material)
mesh3.scale.set(0.1, 0.1, 0.1)
mesh3.rotation.set(Math.PI, 0, 0)
mesh3.position.set(4, 3, 0)
scene.add(mesh3)
// 球体几何
const sphereGeometry = new THREE.SphereGeometry(1, 32, 16)
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 })
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.position.set(0, 2, 0)
scene.add(sphere)
// 环面几何
const torusGeometry = new THREE.TorusGeometry(0.5, 0.1, 16, 40)
const torusMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 })
const torus = new THREE.Mesh(torusGeometry, torusMaterial)
torus.position.set(4, 4, 0)
scene.add(torus)
// 环面几何
const torusKnotGeometry = new THREE.TorusKnotGeometry(1, 0.3, 40, 16)
const torusKnotMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 })
const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial)
torusKnot.position.set(4, -6.4, 0)
scene.add(torusKnot)
// 管几何形状
class CustomSinCurve extends THREE.Curve {
  constructor(scale = 1) {
    super()
    this.scale = scale
  }

  getPoint(t: number, optionalTarget = new THREE.Vector3()) {
    const tx = t * 6 - 1.5
    const ty = Math.sin(2 * Math.PI * t)
    const tz = 0

    return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale)
  }
}

const path = new CustomSinCurve(3)
const mesh4Geometry = new THREE.TubeGeometry(path, 4, 1, 3, false)
const mesh4Material = new THREE.MeshBasicMaterial({ color: 0x00FF00 })
mesh4Material.wireframe = true
const mesh4 = new THREE.Mesh(mesh4Geometry, mesh4Material)
mesh4.position.set(0, -10, 0)
scene.add(mesh4)
// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)
// 轨道控制器全局变量
const controls = ref()

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

  camera.value.position.set(4, 1, 40)
  camera.value.lookAt(0, 0, 0)

  // 动画渲染
  animate()
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
