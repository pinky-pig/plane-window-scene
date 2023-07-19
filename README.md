<p align='center'>
  <img src='https://cdn.jsdelivr.net/gh/pinky-pig/pic-bed/images20230718171725.png' alt='Plane Window Scene' width='600'/>
</p>

## Features

- ☁️ Skybox on ground
- 🏠 Google photo-realistic 3DTileset
- ✈ Plane model

<br>

- 设置默认的鼠标操作

- 飞机整体视角
  - 飞机运行轨迹
  - 模拟飞机运动

- 视角切换动画

- 飞机窗户视角
  - 飞机运动时，窗户视角随机颠簸，模拟真实感

- 地图缩略图


## Point

1. 加载的模型默认会根据地图视角变大 （Location => Earth） 而变小，如果想设置成地图视角变大后，模型也跟着变大，需要设置
`maximumScale`，具体参考 [Cesium Model maximumScale && minimumPixelSize](https://cesium.com/learn/ion-sdk/ref-doc/Model.html?classFilter=model)

2. 修改 Cesium 的默认鼠标操作，参考 [screenSpaceCameraController](https://cesium.com/learn/ion-sdk/ref-doc/ScreenSpaceCameraController.html?classFilter=screenSpaceCameraController)

3. 修改 Skybox 的样式。主要是分为两块， Skybox 是宇宙中全景图，还需要修改近地全景图。而全景图需要几步：获取全景图、切割全景图、旋转全景图，再按照 Cesium 对应顺序加载即可。

4. 设置视角方向。设置视角地点很好设置 flyTo ，包括动画，直接在属性中设置就行了。设置视角倾斜角度的时候，也可以使用 flyTo 但是视角中心并不是 flyTo 的中心，所以效果不是很好。当使用 camera.setView 或者 viewer.zoomTo 等也都是可以，但是并不能设置 duration ， 所以这里使用了 viewer.camera.flyToBoundingSphere ，可以设置 duration ，但是需要传入一个 Cesium.BoundingSphere 对象。可以直接使用，也可以跟 flyTo 结合起来做一些动画效果，比如先飞到目的地点再旋转倾斜视角。
