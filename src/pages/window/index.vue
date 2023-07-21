<script setup lang="ts">
import * as Cesium from 'cesium'
import { ref } from 'vue'
import { DefaultPlaneUrl, DefaultPosition } from '~/cesium/params'

// 1. 天空视角
// 3. 加载 Google 3DTiles
// 4. 提示开始运动
// 5. 设置镜头跟随模型轨迹移动 Timeline
// 6. 点击画面，移动暂停
// 7. 鼠标松开 5s 后继续

const viewerInstance = ref<Cesium.Viewer | null>(null)
const mapOptions = { }
const defaultCesiumPosition = Cesium.Cartesian3.fromDegrees(DefaultPosition[0], DefaultPosition[1], DefaultPosition[2])

function mapLoaded(viewer: Cesium.Viewer) {
  viewerInstance.value = viewer

  main(viewer)
  // flyTo(viewer)
  // flyPath(viewer)

  // flyTween(viewer)
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
  setTimeout(() => {
    const center = Cesium.Cartesian3.fromDegrees(DefaultPosition[0], DefaultPosition[1], DefaultPosition[2])
    viewer.camera.flyToBoundingSphere(
      new Cesium.BoundingSphere(center, -0),
      {
        offset: new Cesium.HeadingPitchRange(
          Cesium.Math.toRadians(0),
          Cesium.Math.toRadians(-15),
          0,
        ),
        duration: 2,
      },
    )
  }, 1000 * 5)

  setTimeout(() => {
    const start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16))
    const stop = Cesium.JulianDate.addSeconds(
      start,
      360,
      new Cesium.JulianDate(),
    )

    // Make sure viewer is at the desired time.
    viewer.clock.startTime = start.clone()
    viewer.clock.stopTime = stop.clone()
    viewer.clock.currentTime = start.clone()
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP // Loop at the end
    viewer.clock.multiplier = 10

    // Set timeline to simulation bounds
    viewer.timeline.zoomTo(start, stop)

    function computeCirclularFlight(lon: number, lat: number, radius: number) {
      const property = new Cesium.SampledPositionProperty()
      for (let i = 0; i <= 360; i += 45) {
        const radians = Cesium.Math.toRadians(i)
        const time = Cesium.JulianDate.addSeconds(
          start,
          i,
          new Cesium.JulianDate(),
        )
        const position = Cesium.Cartesian3.fromDegrees(
          lon + radius * 1.5 * Math.cos(radians),
          lat + radius * Math.sin(radians),
          Cesium.Math.nextRandomNumber() * 500 + 1750,
        )
        property.addSample(time, position)
      }
      return property
    }
    const position = computeCirclularFlight(-112.110693, 36.0994841, 0.03)

    const entity = viewer.entities.add({
      show: true,
      position,
      orientation: new Cesium.VelocityOrientationProperty(position),

      model: {
        scale: 0.5,
        uri: DefaultPlaneUrl,
        minimumPixelSize: 64,
        color: Cesium.Color.TRANSPARENT,
      },

    })

    viewer.trackedEntity = entity
  }, 1000 * 10)
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
