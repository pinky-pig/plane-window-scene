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

5. 设置视角跟随模型移动，模型跟随轨迹移动。这里是有一个移动的线的点集，添加一个模型跟着线运动，然后将相机视角跟模型绑定，这样相机就跟着线运动了。但是遇到了一个小坑，就是模型设置隐藏的时候 （ show:false ） ，模型并不会运动了，相机视角也不会运动了。而当打算使用另一个小技巧，就是将模型的 scale 设置为 0 ，这样模型就看不见了，但是还是会运动的，结果发现并不能隐藏模型。于是就出现了另一个小技巧，将模型透明度设置为 0 ，这样模型就看不见了，而且相机视角也会跟着运动，最终成功！

6. 设置镜头补间动画。其实就是利用 Tween.js 和 viewer.scene.camera.setView 结合起来，在 Tween.js 的 .onUpdate 中设置 .setView ，这样就可以实现镜头的补间动画了。


```ts
// 设置镜头，然后以目的地为中心旋转角度
function flyTo(viewer: Cesium.Viewer) {
  if (viewer) {
    const position = Cesium.Cartesian3.fromDegrees(DefaultPosition[0], DefaultPosition[1], DefaultPosition[2] + 100)
    viewer.camera.flyTo({
      destination: position,
      duration: 2,
      complete: () => {
        const center = Cesium.Cartesian3.fromDegrees(DefaultPosition[0], DefaultPosition[1], DefaultPosition[2])
        viewer.camera.flyToBoundingSphere(
          new Cesium.BoundingSphere(center, -0),
          {
            offset: new Cesium.HeadingPitchRange(Cesium.Math.toRadians(0), Cesium.Math.toRadians(-15), 0),
            duration: 2,
          },
        )
      },
    })
  }
}
```


```ts
// 设置镜头跟着模型轨迹移动

function flyPath(viewer: Cesium.Viewer) {
  // Enable lighting based on the sun position
  viewer.scene.globe.enableLighting = true

  // Enable depth testing so things behind the terrain disappear.
  viewer.scene.globe.depthTestAgainstTerrain = true

  // Set the random number seed for consistent results.
  Cesium.Math.setRandomNumberSeed(3)

  // Set bounds of our simulation time
  const start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16))
  const stop = Cesium.JulianDate.addSeconds(
    start,
    360,
    new Cesium.JulianDate(),
  )

  // Make sure viewer is at the desired time.
  viewer.clock.startTime = start.clone()
  viewer.clock.stopTime = stop.clone()
  viewer.clock.currentTime = start.clone()
  viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP // Loop at the end
  viewer.clock.multiplier = 10

  // Set timeline to simulation bounds
  viewer.timeline.zoomTo(start, stop)

  // Generate a random circular pattern with varying heights.
  function computeCirclularFlight(lon: number, lat: number, radius: number) {
    const property = new Cesium.SampledPositionProperty()
    for (let i = 0; i <= 360; i += 45) {
      const radians = Cesium.Math.toRadians(i)
      const time = Cesium.JulianDate.addSeconds(
        start,
        i,
        new Cesium.JulianDate(),
      )
      const position = Cesium.Cartesian3.fromDegrees(
        lon + radius * 1.5 * Math.cos(radians),
        lat + radius * Math.sin(radians),
        Cesium.Math.nextRandomNumber() * 500 + 1750,
      )
      property.addSample(time, position)
    }
    return property
  }

  const position = computeCirclularFlight(-112.110693, 36.0994841, 0.03)

  const entity = viewer.entities.add({

    show: true,
    position,

    orientation: new Cesium.VelocityOrientationProperty(position),

    model: {
      scale: 0.5,
      uri: DefaultPlaneUrl,
      minimumPixelSize: 64,
      color: Cesium.Color.TRANSPARENT,
    },

  })

  viewer.trackedEntity = entity
}
```



```ts
// 设置补间动画

function flyTween(viewer: Cesium.Viewer) {
  const viewPoints = [
    { id: 0, name: '地铁口', lat: 22.7407925, lng: 108.3393365, alt: 90.7, heading: 37.4, pitch: -7.1, duration: 4 },
    { id: 1, name: '电梯口1', lat: 22.7408074, lng: 108.3403484, alt: 100.7, heading: 37.4, pitch: -5.3, duration: 5 },
    { id: 2, name: '电梯口2', lat: 22.7408334, lng: 108.3513717, alt: 110.6, heading: 41.6, pitch: -30.5, duration: 6 },
    { id: 3, name: '电梯底部', lat: 22.7409422, lng: 108.3624671, alt: 120.4, heading: 38.9, pitch: -34.6, duration: 7 },
    { id: 4, name: '进地铁2', lat: 22.7412386, lng: 108.3733242, alt: 130.9, heading: 272.8, pitch: -4.8, duration: 8 },
  ]

  const tweens = []
  let animateId: number = 0

  for (let i = 0; i < viewPoints.length - 1; i++) {
    const startObject = viewPoints[i]
    const stopObject = viewPoints[i + 1]
    const duration = Cesium.defaultValue(stopObject.duration, 3) * 1000

    const tween = new TWEEN.Tween(startObject)
      .to(stopObject, duration) // 使用duration作为过渡时间
      .delay(1000)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate((elapsed) => {
        const position = Cesium.Cartesian3.fromDegrees(elapsed.lng, elapsed.lat, elapsed.alt)

        viewer.scene.camera.setView({
          destination: position,
          orientation: {
            heading: Cesium.Math.toRadians(elapsed.heading ?? 0),
            pitch: Cesium.Math.toRadians(elapsed.pitch ?? -90),
            // heading: Cesium.Math.toRadians(0),
            // pitch: Cesium.Math.toRadians(0),
            roll: Cesium.Math.toRadians(0),
          },
        })
      })
      .onComplete(() => {
        // 检查当前Tween是否达到了最后一个点
        if (i === viewPoints.length - 2) {
          // 停止动画更新循环，不再调用TWEEN.update()
          cancelAnimationFrame(animateId)
        }
      })
      .start()

    tweens.push(tween)
  }

  // 动画更新循环
  function animate() {
    animateId = requestAnimationFrame(animate)
    TWEEN.update()
  }

  // 启动动画循环
  animate()
}
```
