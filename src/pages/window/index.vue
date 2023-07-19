<script setup lang="ts">
import * as Cesium from 'cesium'
import { ref } from 'vue'
import { DefaultPlaneUrl, DefaultPosition } from '~/cesium/params'

const viewerInstance = ref<Cesium.Viewer | null>(null)
function mapLoaded(viewer: Cesium.Viewer) {
  viewerInstance.value = viewer

  const position = Cesium.Cartesian3.fromDegrees(DefaultPosition[0], DefaultPosition[1], DefaultPosition[2])
  async function loadModel() {
    await viewer.entities.add({
      position,
      model: { uri: DefaultPlaneUrl },
    })
  }
  loadModel()

  flyTo(viewer)
}

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
</script>

<template>
  <div class="box-container">
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
