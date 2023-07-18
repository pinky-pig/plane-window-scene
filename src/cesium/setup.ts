import * as Cesium from 'cesium'
import { DaylightSkybox } from './params'

export function setSkybox(viewer: Cesium.Viewer) {
// 如果相机高度小于2000米，则显示蓝天
  viewer.scene.postRender.addEventListener(() => {
    const e = viewer!.camera.position
    if (Cesium.Cartographic.fromCartesian(e).height < 2000) {
      viewer!.scene.skyBox = DaylightSkybox
      viewer!.scene.skyAtmosphere.show = false
    }
  })
}
