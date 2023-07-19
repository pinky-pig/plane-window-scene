<script setup lang="ts">
import * as Cesium from 'cesium'

const viewerInstance = ref<Cesium.Viewer | null>(null)
function mapLoaded(viewer: Cesium.Viewer) {
  viewerInstance.value = viewer
  addGoogle3DTileset(viewer)
  addPlaneModel(viewer)
}

async function addGoogle3DTileset(viewer: Cesium.Viewer) {
  // viewer.scene.globe.show = false

  // try {
  //   const tileset = await Cesium.createGooglePhotorealistic3DTileset()
  //   viewer.scene.primitives.add(tileset)
  // }
  // catch (error) {
  //   // eslint-disable-next-line no-console
  //   console.log(`Error loading Photorealistic 3D Tiles tileset. ${error}`)
  // }

  // // Point the camera at the Googleplex
  // viewer.scene.camera.setView({
  //   destination: new Cesium.Cartesian3(
  //     -2693797.551060477,
  //     -4297135.517094725,
  //     3854700.7470414364,
  //   ),
  //   orientation: new Cesium.HeadingPitchRoll(
  //     4.6550106925119925,
  //     -0.2863894863138836,
  //     1.3561760425773173e-7,
  //   ),
  // })
}

async function addPlaneModel(viewer: Cesium.Viewer) {
  viewer.entities.removeAll()

  const position = Cesium.Cartesian3.fromDegrees(
    -123.0744619,
    44.0503706,
    5000,
  )

  viewer.entities.add({
    name: '/model/plane.glb',
    position,
    model: {
      uri: '/model/plane.glb',
      minimumPixelSize: 128,
      maximumScale: 20000,
    },
  })
}
</script>

<template>
  <CesiumMap @onload="mapLoaded" />
</template>

<style scoped>

</style>
