<script setup lang="ts">
import PieEl from '@/components/3DPieEl/index.vue'
</script>

<template>
  <div class="main">
    <dv-full-screen-container>
      <dv-border-box1>
        <div class="pieCont" style="height: 100%; width: 100%" h18rem color-white flex justify-center items-center>
          <p class="title">
            3D饼图
          </p>
          <div class="pieElBox">
            <PieEl />
          </div>
        </div>
      </dv-border-box1>
    </dv-full-screen-container>
  </div>
</template>

<style scoped lang="scss">
.main {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #303133;
  color: #fff;
  :deep(#dv-full-screen-container) {
    padding: 0 20px;
    box-sizing: border-box;
  }
  .dv-border-box-1 {
    width: 24%;
    height: 50%;
    font-size: 60px;
    .pieCont {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      box-sizing: border-box;
    }
    .pieElBox {
      width: 100%;
      flex: 1;
    }
  }
}
</style>
