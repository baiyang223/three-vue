<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const route = useRoute()
const userName = ref(JSON.parse(localStorage.getItem('userInfo') as string))

function logout() {
  localStorage.clear()
  router.push('/login')
}

function toRouter(path: string) {
  router.push(path)
}
</script>

<template>
  <main class="home">
    <div class="head">
      <div class="logoBox">
        <img class="logo" src="@/assets/loginLogo.png" alt="">
      </div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="/">
          xxxx后台系统
        </el-breadcrumb-item>
      </el-breadcrumb>
      <div class="outLogin" style="margin-left: auto">
        <svg-icon name="userImg" width="32px" height="32px" />
        <!--        <span>{{ userName.name }}</span> -->
      </div>
    </div>
    <div style="display: flex;">
      <div class="homeMenu">
        <el-menu
          :default-active="route.name"
          class="el-menu-vertical-demo"
          router
        >
          <el-menu-item index="staging" :route="{ path: '/' }">
            <span>工作台</span>
          </el-menu-item>
          <el-menu-item index="test" route="test">
            <span>方块动画旋转</span>
          </el-menu-item>
          <el-menu-item index="test2" route="test2">
            <span>坐标辅助器与轨道控制器</span>
          </el-menu-item>
          <el-menu-item index="test3" route="test3">
            <span>物体位移旋转与元素添加</span>
          </el-menu-item>
          <el-menu-item index="test4" route="test4">
            <span>响应式与全屏控制</span>
          </el-menu-item>
          <el-menu-item index="test5" route="test5">
            <span>lil-GUI调试</span>
          </el-menu-item>
          <el-menu-item index="test6" route="test6">
            <span>几何体_顶点_索引_平面</span>
          </el-menu-item>
          <el-menu-item index="test7" route="test7">
            <span>几何体划分顶点组设置不同材质</span>
          </el-menu-item>
          <el-menu-item index="test8" route="test8">
            <span>常见几何体</span>
          </el-menu-item>
          <el-menu-item index="test9" route="test9">
            <span>基础材料_贴图_高光_透视_环境_光照_环境遮蔽贴图</span>
          </el-menu-item>
          <el-menu-item index="test10" route="test10">
            <span>场景的线型雾和指数雾</span>
          </el-menu-item>
          <el-menu-item index="test11" route="test11">
            <span>加载gltf模型和加载压缩过的模型</span>
          </el-menu-item>
        </el-menu>
        <div class="menuBox" style="margin-bottom: 40px;margin-top: auto">
          <svg-icon name="outLogin" class="icon" width="24px" height="24px" />
          <el-popconfirm title="确定退出登陆吗？" width="160" @confirm="logout">
            <template #reference>
              <div class="logoutShow">
                <div style="text-align: left;">
                  退出登陆
                </div>
              </div>
            </template>
          </el-popconfirm>
        </div>
      </div>
      <div class="homeCont">
        <router-view />
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.head {
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  background-color: #fff;
  box-shadow: inset 0px -1px 0px #EBEDEF;

  .logoBox {
    min-width: 200px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px #EBEBEB solid;
    box-sizing: border-box;
    margin-right: 20px;

    img {
      width: 124px;
    }
  }

  .el-breadcrumb {
    margin-right: auto;
  }

  .outLogin {
    margin-right: 20px;
    font-size: 12px;
    cursor: pointer;
    display: flex;

    img {
      margin-right: 5px;
    }

    span {
      margin: 8px 10px 0;
      font-size: 14px;
    }
  }
}

.homeMenu {
  min-width: 200px;
  max-width: 200px;
  height: calc(100vh - 64px);
  background: #fff;
  border-right: 1px #EBEBEB solid;
  flex-direction: column;
  display: flex;
  .el-menu {
    overflow-y: auto;
    border: none;
    .el-menu-item {
      white-space: pre-wrap;
      line-height: 20px;
    }
  }
  .menuBox {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 52px;
    border-radius: 12px;
    margin: 20px auto 0 auto;
    padding-top: 20px;
    cursor: pointer;
    box-sizing: content-box;

    .icon {
      width: 24px;
      height: 24px;
      margin-right: 10px;
    }
  }
}

.homeCont {
  flex: 1;
  width: calc(100vw - 200px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - 64px);
  background: #f5f5f5;
  overflow-y: auto;
}
:deep(.el-dialog__header){
  padding: 0 !important;
}
:deep(.el-dialog){
  --el-dialog-margin-top: 30vh !important;
}
</style>
