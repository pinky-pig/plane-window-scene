<script setup lang="ts">
import * as Cesium from 'cesium'
import { ref } from 'vue'
import * as TWEEN from '@tweenjs/tween.js'
import { DefaultPlaneUrl, DefaultPosition } from '~/cesium/params'

// import { TweensRoaming } from '~/cesium/tweenRoaming'

const viewerInstance = ref<Cesium.Viewer | null>(null)
function mapLoaded(viewer: Cesium.Viewer) {
  viewerInstance.value = viewer

  const position = Cesium.Cartesian3.fromDegrees(DefaultPosition[0], DefaultPosition[1], DefaultPosition[2])
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  async function loadModel() {
    await viewer.entities.add({
      position,
      model: { uri: DefaultPlaneUrl },
    })
  }
  // loadModel()

  // flyTo(viewer)
  // flyPath(viewer)

  flyTween(viewer)
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
function flyTo(viewer: Cesium.Viewer) {
  if (viewer) {
    const position = Cesium.Cartesian3.fromDegrees(DefaultPosition[0], DefaultPosition[1], DefaultPosition[2] + 100)
    viewer.camera.flyTo({
      destination: position,
      duration: 2,
      complete: () => {
        const center = Cesium.Cartesian3.fromDegrees(DefaultPosition[0], DefaultPosition[1], DefaultPosition[2])
        viewer.camera.flyToBoundingSphere(
          new Cesium.BoundingSphere(center, -0),
          {
            offset: new Cesium.HeadingPitchRange(Cesium.Math.toRadians(0), Cesium.Math.toRadians(-15), 0),
            duration: 2,
          },
        )
      },
    })
  }
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
function flyPath(viewer: Cesium.Viewer) {
  // Enable lighting based on the sun position
  viewer.scene.globe.enableLighting = true

  // Enable depth testing so things behind the terrain disappear.
  viewer.scene.globe.depthTestAgainstTerrain = true

  // Set the random number seed for consistent results.
  Cesium.Math.setRandomNumberSeed(3)

  // Set bounds of our simulation time
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

  // Generate a random circular pattern with varying heights.
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
}

function flyTween(viewer: Cesium.Viewer) {
  const viewPoints = [
    { id: 0, name: '地铁口', lat: 22.7407925, lng: 108.3393365, alt: 90.7, heading: 37.4, pitch: -7.1, duration: 4 },
    { id: 1, name: '电梯口1', lat: 22.7408074, lng: 108.3403484, alt: 100.7, heading: 37.4, pitch: -5.3, duration: 5 },
    { id: 2, name: '电梯口2', lat: 22.7408334, lng: 108.3513717, alt: 110.6, heading: 41.6, pitch: -30.5, duration: 6 },
    { id: 3, name: '电梯底部', lat: 22.7409422, lng: 108.3624671, alt: 120.4, heading: 38.9, pitch: -34.6, duration: 7 },
    { id: 4, name: '进地铁2', lat: 22.7412386, lng: 108.3733242, alt: 130.9, heading: 272.8, pitch: -4.8, duration: 8 },
  ]

  const tweens = []
  let animateId: number = 0

  for (let i = 0; i < viewPoints.length - 1; i++) {
    const startObject = viewPoints[i]
    const stopObject = viewPoints[i + 1]
    const duration = Cesium.defaultValue(stopObject.duration, 3) * 1000

    const tween = new TWEEN.Tween(startObject)
      .to(stopObject, duration) // 使用duration作为过渡时间
      .delay(1000)
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
      .start()

    tweens.push(tween)
  }

  // 动画更新循环
  function animate() {
    animateId = requestAnimationFrame(animate)
    TWEEN.update()
  }

  // 启动动画循环
  animate()
}

async function handleClick() {
  const position = Cesium.Cartesian3.fromDegrees(108.3393365, 22.7407925, 90.7)
  await viewerInstance.value?.camera.flyTo({
    destination: position,
    duration: 2,
  })

  flyTween(viewerInstance.value!)
}
</script>

<template>
  <div class="box-container" @click="handleClick">
    <img src="/bg.png" alt="Your Image">
    <CesiumMap class="overlay" @onload="mapLoaded" />
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
