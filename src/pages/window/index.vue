<script setup lang="ts">
import type * as Cesium from 'cesium'
import { DefaultPath } from '~/cesium/params'

import { useTweenCamera } from '~/cesium/useTweenCamera'

// 1. 天空视角
// 3. 加载 Google 3DTiles
// 4. 提示开始运动
// 5. 设置镜头跟随模型轨迹移动 Timeline
// 6. 点击画面，移动暂停
// 7. 鼠标松开 5s 后继续
// https://sandcastle.cesium.com/?src=Interpolation.html

const viewerInstance = ref<Cesium.Viewer | null>(null)
const mapOptions = { }

function mapLoaded(viewer: Cesium.Viewer) {
  viewerInstance.value = viewer

  const {
    startTweenAnimation,
    pauseTweenAnimation,
    resumeTweenAnimation,
  } = useTweenCamera(viewer, DefaultPath)

  setTimeout(() => {
    startTweenAnimation()
    setTimeout(() => {
      pauseTweenAnimation()

      setTimeout(() => {
        resumeTweenAnimation()
      }, 1000 * 3)
    }, 1000 * 5)
  }, 1000 * 1)
}

async function handleClick() {
  // const position = Cesium.Cartesian3.fromDegrees(108.3393365, 22.7407925, 90.7)
  // await viewerInstance.value?.camera.flyTo({
  //   destination: position,
  //   duration: 2,
  // })
}
</script>

<template>
  <div class="box-container" @click="handleClick">
    <img class="hidden" src="/bg.png" alt="Your Image">
    <CesiumMap class="overlay" :options="mapOptions" @onload="mapLoaded" />
  </div>
</template>

<style scoped>
.box-container {
  position: relative;
  display: inline-block;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50px;
  overflow: hidden;
  outline: 1px solid #5a6275;
}

.box-container img {
  max-height: 90vh;
  width: auto;
  display: block;
  object-fit: contain;
  z-index: 999999;
  position: relative;
  pointer-events: none;
}

.box-container .overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
