<script setup lang="ts">
import { onMounted } from 'vue'
import { Viewer } from 'cesium'
import type * as Cesium from 'cesium'
import { DEFAULT_OPTION } from '~/cesium/params'

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
  initMars3d(props.options)
})
onUnmounted(() => {
  if (viewer) {
    viewer.destroy()
    viewer = null
  }
})

function initMars3d(option: any) {
  if ($container.value) {
    viewer = new Viewer(
      $container.value,
      { ...DEFAULT_OPTION, ...option },
    )
    emit('onload', viewer)
  }
}
</script>

<template>
  <div ref="$container" />
</template>
