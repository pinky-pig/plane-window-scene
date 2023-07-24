<script setup lang="ts">
import * as Cesium from 'cesium'
import { ref } from 'vue'
import * as TWEEN from '@tweenjs/tween.js'
import { DefaultPath, DefaultPosition } from '~/cesium/params'

// 1. 天空视角
// 3. 加载 Google 3DTiles
// 4. 提示开始运动
// 5. 设置镜头跟随模型轨迹移动 Timeline
// 6. 点击画面，移动暂停
// 7. 鼠标松开 5s 后继续
// https://sandcastle.cesium.com/?src=Interpolation.html

const viewerInstance = ref<Cesium.Viewer | null>(null)
const mapOptions = { }
const defaultCesiumPosition = Cesium.Cartesian3.fromDegrees(DefaultPosition[0], DefaultPosition[1], DefaultPosition[2])

function mapLoaded(viewer: Cesium.Viewer) {
  viewerInstance.value = viewer

  main(viewer)
}

function main(viewer: Cesium.Viewer) {
  // 1. 看天空
  viewer.scene.camera.setView({
    destination: defaultCesiumPosition,
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(25),
      roll: Cesium.Math.toRadians(0),
    },
  })
  // 2. 加载 Google 3DTiles

  // 3. 提示开始运动

  // 4. 视角下移倾斜
  // setTimeout(() => {
  //   const center = Cesium.Cartesian3.fromDegrees(DefaultPosition[0], DefaultPosition[1], DefaultPosition[2])
  //   viewer.camera.flyToBoundingSphere(
  //     new Cesium.BoundingSphere(center, -0),
  //     {
  //       offset: new Cesium.HeadingPitchRange(
  //         Cesium.Math.toRadians(0),
  //         Cesium.Math.toRadians(-15),
  //         0,
  //       ),
  //       duration: 2,
  //     },
  //   )
  // }, 1000 * 5)

  setTimeout(() => {
    const viewPoints = DefaultPath

    const tweens = []
    let animateId: number = 0

    for (let i = 0; i < viewPoints.length - 1; i++) {
      const startObject = viewPoints[i]
      const stopObject = viewPoints[i + 1]
      const duration = Cesium.defaultValue(stopObject.duration, 3) * 1000

      const tween = new TWEEN.Tween(startObject)
        .to(stopObject, duration) // 使用duration作为过渡时间
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate((elapsed) => {
          const position = Cesium.Cartesian3.fromDegrees(elapsed.lng, elapsed.lat, elapsed.alt)

          viewer.scene.camera.setView({
            destination: position,
            orientation: {
              heading: Cesium.Math.toRadians(elapsed.heading ?? 0),
              pitch: Cesium.Math.toRadians(elapsed.pitch ?? -90),
              // heading: Cesium.Math.toRadians(0),
              // pitch: Cesium.Math.toRadians(0),
              roll: Cesium.Math.toRadians(0),
            },
          })
        })
        .onComplete(() => {
          // 检查当前Tween是否达到了最后一个点
          if (i === viewPoints.length - 2) {
            // 停止动画更新循环，不再调用TWEEN.update()
            cancelAnimationFrame(animateId)
          }
        })

      tweens.push(tween)
    }

    // 将数组中的动画链式调用
    for (let i = 0; i < tweens.length; i++) {
      if (i === tweens.length - 1) {
        tweens[i].chain()
        break
      }
      tweens[i].chain(tweens[i + 1])
    }

    // 动画更新循环
    function animate() {
      animateId = requestAnimationFrame(animate)
      TWEEN.update()
    }

    // 启动动画循环
    animate()
    tweens[0].start()
  }, 1000 * 6)
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
