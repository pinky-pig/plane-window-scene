<script setup lang="ts">
import { onMounted } from 'vue'
import * as Cesium from 'cesium'
import { DEFAULT_OPTION } from '~/cesium/params'
import { setMouseAction, setSkybox } from '~/cesium/setup'

const props = withDefaults(
  defineProps<{
    mapKey?: string
    options?: any
  }>(),
  {
    mapKey: 'default',
    options: () => ({}),
  },
)

const emit = defineEmits(['onload'])
const $container = ref<Element | null>(null)
let viewer: Cesium.Viewer | null

onMounted(() => {
  initCesiumViewer(props.options)
})

onUnmounted(() => {
  // if (viewer) {
  //   viewer.destroy()
  //   viewer = null
  // }
})

function initCesiumViewer(option: any) {
  if ($container.value) {
    viewer = new Cesium.Viewer(
      $container.value,
      { ...DEFAULT_OPTION, ...option },
    )
    emit('onload', viewer)

    setSkybox(viewer)
    setMouseAction(viewer)
  }
}
</script>

<template>
  <div ref="$container" class="h-full w-full" />
</template>

<style>
.cesium-viewer-bottom{
  display: none !important;
}
</style>
