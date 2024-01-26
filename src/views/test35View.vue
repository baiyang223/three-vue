<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, onUnmounted, ref } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { SpriteMaterial } from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import vertexShader from '@/assets/shader/vertexShader.glsl?raw'
import fragmentShader from '@/assets/shader/fragmentShader.glsl?raw'

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

// 使用dracoloader载入draco格式的模型
// 载入ew.glb模型
const loader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('../src/utils/draco/')
loader.setDRACOLoader(dracoLoader)
const listener = new THREE.AudioListener()
const sound = new THREE.Audio(listener)
// 创建clock
const clock = new THREE.Clock()
let oldPoint
let mixer, missile: any, mapels: any, mapwkl: any, curvePath: any
// 创建精灵材质
const params = {
  iTime: {
    value: 0,
  },
}
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
  // 初始化渲染器
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1
  //   设置渲染器的像素比例
  renderer.setPixelRatio(window.devicePixelRatio)
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

  camera.value.position.set(0, 5, 10)
  camera.value.lookAt(0, 0, 0)

  //   添加环境纹理
  const rgbeLoader = new RGBELoader()
  rgbeLoader.load(new URL('../assets/textures/kloppenheim_02_2k.hdr', import.meta.url).href, (texture: any) => {
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.background = texture
    scene.environment = texture
  })

  // 背景模糊度
  // scene.backgroundBlurriness = 1

  loader.load('../src/assets/model/ew8.glb', (gltf: any) => {
    gltf.scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    mapels = gltf.scene.children[0]
    curvePath = gltf.scene.children[2]
    // console.log(curvePath);
    mapwkl = gltf.scene.children[1]
    missile = gltf.scene.children[3]
    scene.add(mapels, mapwkl, missile)

    // 根据点创建曲线
    const points = []
    for (let i = curvePath.geometry.attributes.position.count - 1; i >= 0; i--) {
      points.push(
        new THREE.Vector3(
          curvePath.geometry.attributes.position.array[i * 3],
          curvePath.geometry.attributes.position.array[i * 3 + 1],
          curvePath.geometry.attributes.position.array[i * 3 + 2],
        ),
      )
    }
    curvePath = new THREE.CatmullRomCurve3(points)
    // 设置载入的所有物体接收和投射阴影

    // 调用mixer控制动画
    // mixer = new THREE.AnimationMixer(missile);
    // const action = mixer.clipAction(gltf.animations[0]);
    // action.play();
  })

  // dracoLoader.preload();
  // dracoLoader.load("../src/assets/model/ew.glb", (gltf) => {
  //   console.log(gltf);
  //   // scene.add(gltf.scene);
  // });

  // 环境光;
  const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1)
  scene.add(ambientLight)
  // 添加平行光源
  const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.5)
  directionalLight.position.set(1, 10, 1)
  directionalLight.castShadow = true
  scene.add(directionalLight)

  // 添加另外一个平行光源
  const directionalLight2 = new THREE.DirectionalLight(0xFFFFFF, 0.5)
  directionalLight2.position.set(-1, -1, -1)
  directionalLight2.castShadow = true
  scene.add(directionalLight2)

  // 创建平面添加到场景中
  const planeGeometry = new THREE.PlaneGeometry(2, 2)
  // 设置shader材质
  const planeMaterial = new THREE.ShaderMaterial({
    uniforms: {
      iResolution: {
        value: new THREE.Vector2(testMain.value.clientWidth, testMain.value.clientHeight),
        // value: new THREE.Vector2(800, 800),
      },
      iTime: {
        value: 0,
      },
      iChannel0: {
        value: new THREE.TextureLoader().load('../src/assets/textures/iChannel0.png'),
      },
      iChannel1: {
        value: new THREE.TextureLoader().load('../src/assets/textures/iChannel1.png'),
      },
      iChannel2: {
        value: new THREE.TextureLoader().load('../src/assets/textures/iChannel2.png'),
      },
      iMouse: {
        value: new THREE.Vector2(0, 0),
      },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  })
  // 添加平面到场景
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  scene.add(plane)

  // 添加sprite

  const spriteMaterial = new SpriteMaterial({
    color: 0xFFFFFF,
    blending: THREE.AdditiveBlending,
  })
  spriteMaterial.onBeforeCompile = (shader: any) => {
    shader.uniforms.iResolution = {
      value: new THREE.Vector2(testMain.value.clientWidth, testMain.value.clientHeight),
    }
    shader.uniforms.iTime = params.iTime
    shader.uniforms.iChannel0 = {
      value: new THREE.TextureLoader().load('../src/assets/textures/iChannel0.png'),
    }
    shader.uniforms.iChannel1 = {
      value: new THREE.TextureLoader().load('../src/assets/textures/iChannel1.png'),
    }
    shader.uniforms.iChannel2 = {
      value: new THREE.TextureLoader().load('../src/assets/textures/iChannel2.png'),
    }
    shader.uniforms.iMouse = { value: new THREE.Vector2(0, 0) }
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
        `#include <common>
    varying vec2 vUv;`,
    )
    shader.vertexShader = shader.vertexShader.replace(
      '#include <uv_vertex>',
        `#include <uv_vertex>
        vUv = uv;`,
    )
    shader.fragmentShader = fragmentShader
  }
  // const sprite = new THREE.Sprite(planeMaterial);
  const sprite = new THREE.Sprite(spriteMaterial)
  sprite.position.set(-5.5, 0.8, 0)
  // scene.add(sprite);

  // 添加一个球到场景
  // const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
  // const sphere = new THREE.Mesh(sphereGeometry, planeMaterial);
  // scene.add(sphere);

  // 添加声音
  const audioLoader = new THREE.AudioLoader()
  audioLoader.load('../src/assets/bomb.mp3', (buffer: any) => {
    sound.setBuffer(buffer)
    // sound.setLoop(true);
    sound.setVolume(0.5)
    // sound.play();
  })
  // 渲染函数
  function animate() {
    requestAnimationFrame(animate)
    controls.value.update()
    renderer.render(scene, camera.value)
    // 获取delay时间
    const delay = clock.getDelta()
    // 获取总共耗时
    const time = clock.getElapsedTime()
    let t = time % 5
    t /= 5
    // console.log(t);
    // 通过curvePath获取曲线上的点
    if (curvePath) {
      const point = curvePath.getPointAt(t)

      // console.log(point);
      // 通过point设置模型dd位置
      // 获取点的切线
      const tangent = curvePath.getTangentAt(t)
      missile.position.set(point.x, point.y, point.z)
      // 设置模型的朝向
      if (t + 0.01 < 1) {
        const point1 = curvePath.getPointAt(t + 0.01)
        // console.log(point1);
        missile.lookAt(point1)
      }
      // oldPoint = point;

      // missile.lookAt(tangent);

      if (t > 0.95)
        scene.add(sprite)
        // 判断声音是否播放，如果没有播放则播放
      if (!sound.isPlaying)
        sound.play()
    }
    params.iTime.value = t * 10

    // if (mixer) {
    //   mixer.update(delay);
    // }
  }
  // 动画渲染
  animate()
})

onUnmounted(() => {
  gui.destroy()
  sound.pause()
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
