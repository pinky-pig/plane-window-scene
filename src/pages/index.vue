<script setup lang="ts">
import type * as Cesium from 'cesium'

const viewerInstance = ref<Cesium.Viewer | null>(null)
function mapLoaded(viewer: Cesium.Viewer) {
  viewerInstance.value = viewer
}
</script>

<template>
  <CesiumMap @onload="mapLoaded" />
</template>

<style scoped>

</style>
