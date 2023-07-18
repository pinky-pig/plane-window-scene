<script setup lang="ts">
import { onMounted } from 'vue'
import * as Cesium from 'cesium'
import { DEFAULT_OPTION } from '~/cesium/params'

// eslint-disable-next-line import/no-named-default
import { default as SkyBox } from '~/cesium/skybox'

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
    viewer = new Cesium.Viewer(
      $container.value,
      { ...DEFAULT_OPTION, ...option },
    )
    emit('onload', viewer)

    const blueSkySkybox = new SkyBox({
      sources: {
        positiveX: '/skybox/px.png', // 右
        negativeX: '/skybox/nx.png', // 左
        positiveY: '/skybox/pz.png', // 上
        negativeY: '/skybox/nz.png', // 下
        positiveZ: '/skybox/py.png', // 前
        negativeZ: '/skybox/ny.png', // 后
      },
      nearGround: true,
    })
    // 如果相机高度小于2000米，则显示蓝天
    viewer.scene.postRender.addEventListener(() => {
      const e = viewer!.camera.position
      if (Cesium.Cartographic.fromCartesian(e).height < 2000) {
        viewer!.scene.skyBox = blueSkySkybox
        viewer!.scene.skyAtmosphere.show = false
      }
    })
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
