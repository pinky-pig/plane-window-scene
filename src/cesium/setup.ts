import * as Cesium from 'cesium'
import { DaylightSkybox } from './params'

export function setSkybox(viewer: Cesium.Viewer) {
// 如果相机高度小于2000米，则显示蓝天
  viewer.scene.postRender.addEventListener(() => {
    const e = viewer!.camera.position
    if (Cesium.Cartographic.fromCartesian(e).height < 5000) {
      viewer!.scene.skyBox = DaylightSkybox
      viewer!.scene.skyAtmosphere.show = false
    }
  })
}

export function setMouseAction(viewer: Cesium.Viewer) {
  // 右键拖拽设置倾斜视图
  viewer.scene.screenSpaceCameraController.tiltEventTypes = [
    Cesium.CameraEventType.RIGHT_DRAG,
    Cesium.CameraEventType.PINCH,
    {
      eventType: Cesium.CameraEventType.RIGHT_DRAG,
      modifier: Cesium.KeyboardEventModifier.CTRL,
    },

    {
      eventType: Cesium.CameraEventType.MIDDLE_DRAG,
      modifier: Cesium.KeyboardEventModifier.CTRL,
    },
  ]

  // 将原来鼠标右键放大缩放修改为鼠标滚轮滚动
  viewer.scene.screenSpaceCameraController.zoomEventTypes = [
    Cesium.CameraEventType.WHEEL,
  ]
}
