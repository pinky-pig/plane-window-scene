// skybox: https://blog.csdn.net/qq_25519615/article/details/128063735

import * as Cesium from 'cesium'

export const DEFAULT_OPTION: Cesium.Viewer.ConstructorOptions = {
  timeline: false,
  animation: false,
  sceneModePicker: false,
  baseLayerPicker: false,
  skyBox: new Cesium.SkyBox({
    sources: {
      positiveX: '/skybox/px.png', // 右
      negativeX: '/skybox/nx.png', // 左
      positiveY: '/skybox/pz.png', // 上
      negativeY: '/skybox/nz.png', // 下
      positiveZ: '/skybox/py.png', // 前
      negativeZ: '/skybox/ny.png', // 后
    },
  }),
}

export const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3MDg3YjFmOS04YmE3LTQ4ZWYtYmYzMS03ZDIyZjJmMjA5ZGMiLCJpZCI6NzI5NjksImlhdCI6MTY4OTY1NjI5NX0.pVRJ-1IugyzFWbiPG2Rh0GMK4NXI-laMR5H41gE5sBA'
