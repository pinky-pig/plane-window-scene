// skybox: https://blog.csdn.net/qq_25519615/article/details/128063735

import * as Cesium from 'cesium'
import { SkyBox as SkyboxOnGround } from '~/cesium/SkyboxOnGround.js'

export const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3MDg3YjFmOS04YmE3LTQ4ZWYtYmYzMS03ZDIyZjJmMjA5ZGMiLCJpZCI6NzI5NjksImlhdCI6MTY4OTY1NjI5NX0.pVRJ-1IugyzFWbiPG2Rh0GMK4NXI-laMR5H41gE5sBA'

export const UniverseSkybox = new Cesium.SkyBox({
  sources: {
    positiveX: '/skybox/px.png', // 右
    negativeX: '/skybox/nx.png', // 左
    positiveY: '/skybox/pz.png', // 上
    negativeY: '/skybox/nz.png', // 下
    positiveZ: '/skybox/py.png', // 前
    negativeZ: '/skybox/ny.png', // 后
  },
})
export const DaylightSkybox = new SkyboxOnGround({
  sources: {
    positiveX: '/skybox/px.png', // 右
    negativeX: '/skybox/nx.png', // 左
    positiveY: '/skybox/pz.png', // 上
    negativeY: '/skybox/nz.png', // 下
    positiveZ: '/skybox/py.png', // 前
    negativeZ: '/skybox/ny.png', // 后
  },
  nearGround: true,
} as {
  sources: any
  show: boolean
  nearGround: boolean
})

export const DEFAULT_OPTION: Cesium.Viewer.ConstructorOptions = {
  // 放大镜图标，查找位置工具，查找到之后会将镜头对准找到的地址，默认使用bing地图
  geocoder: false,
  // 房子图标，视角返回初始位置
  homeButton: false,
  // 经纬网图标，选择视角的模式，有三种：3D，2D，哥伦布视图（2.5D)
  sceneModePicker: false,
  // 地图图标，图层选择器，选择要显示的地图服务和地形服务,默认会用到cesium.ion
  baseLayerPicker: false,
  // 问号图标，导航帮助按钮，显示默认的地图控制帮助
  navigationHelpButton: false,
  animation: false, // 动画器件，显示当前时间，允许跳转特定时间
  timeline: true, // 时间轴
  // 全屏图标，全屏按钮
  fullscreenButton: false,
  // 虚拟现实
  // vrButton: true,
  // 阴影
  shadows: true,
  // 点击后显示详细信息
  // infoBox: true,
  // terrainExaggeration: 3.0, //地形夸大
  shouldAnimate: true,

  skyBox: UniverseSkybox,
}

export const DefaultPlaneUrl = '/model/plane.glb'
export const DefaultPosition = [35.729094, 139.768948, 500]
export const DefaultPath = [
  [35.729094, 139.768948, 500],
  [35.726340, 139.771907, 500],
  [35.724612, 139.774252, 500],
  [35.719367, 139.779088, 500],
  [35.718225, 139.779124, 500],
  [35.715975, 139.777437, 500],
  [35.713881, 139.775586, 500],
  [35.710259, 139.774342, 500],
  [35.708066, 139.774494, 500],
  [35.703507, 139.773765, 500],
  [35.699392, 139.772855, 500],
  [35.695079, 139.771914, 500],
  [35.691136, 139.770185, 500],
  [35.686699, 139.768212, 500],
  [35.683914, 139.767089, 500],
  [35.677432, 139.764571, 500],
  [35.674350, 139.761566, 500],
  [35.670135, 139.758441, 500],
  [35.664489, 139.758107, 500],
  [35.659632, 139.757712, 500],
  [35.659637, 139.757363, 500],
  [35.652754, 139.755424, 500],
  [35.647155, 139.749351, 500],
  [35.624882, 139.737664, 500],
]
