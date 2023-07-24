import * as Cesium from 'cesium'
import * as TWEEN from '@tweenjs/tween.js'
import { DefaultPlaneUrl, DefaultPosition } from './params'

// 1. Tween.js 跟镜头飞行的结合
export function flyTween(viewer: Cesium.Viewer) {
  const viewPoints = [
    { id: 0, name: '地铁口', lat: 22.7407925, lng: 108.3393365, alt: 90.7, heading: 37.4, pitch: -7.1, duration: 3 },
    { id: 1, name: '电梯口1', lat: 22.7408074, lng: 108.3403484, alt: 100.7, heading: 37.4, pitch: -5.3, duration: 3 },
    { id: 2, name: '电梯口2', lat: 22.7408334, lng: 108.3513717, alt: 110.6, heading: 41.6, pitch: -30.5, duration: 3 },
    { id: 3, name: '电梯底部', lat: 22.7409422, lng: 108.3624671, alt: 120.4, heading: 38.9, pitch: -34.6, duration: 3 },
    { id: 4, name: '进地铁2', lat: 22.7412386, lng: 108.3733242, alt: 130.9, heading: 272.8, pitch: -4.8, duration: 3 },
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

    tweens.push(tween)
  }

  for (let i = 0; i < tweens.length; i++) {
    if (i === tweens.length - 1) {
      tweens[i].chain()
      break
    }

    tweens[i].chain(tweens[i + 1])
  }

  // 动画更新循环
  function animate() {
    animateId = requestAnimationFrame(animate)
    TWEEN.update()
  }

  // 启动动画循环
  animate()
  tweens[0].start()
}

// 2. 镜头跟随模型轨迹飞行
export function flyPath(viewer: Cesium.Viewer) {
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

// 3. 镜头以目的地为圆心的旋转
export function flyTo(viewer: Cesium.Viewer) {
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

// 4. 镜头飞行动画，起点到目的地点的飞行
export function losAngelesToTokyo(viewer: Cesium.Viewer) {
  const adjustPitch = true
  const camera = viewer.scene.camera

  const tokyoOptions: any = {
    destination: Cesium.Cartesian3.fromDegrees(
      139.8148,
      35.7142,
      20000.0,
    ),
    orientation: {
      heading: Cesium.Math.toRadians(15.0),
      pitch: Cesium.Math.toRadians(-60),
      roll: 0.0,
    },
    duration: 20,
    flyOverLongitude: Cesium.Math.toRadians(60.0),
  }

  const laOptions: any = {
    destination: Cesium.Cartesian3.fromDegrees(
      -117.729,
      34.457,
      10000.0,
    ),
    duration: 5,
    orientation: {
      heading: Cesium.Math.toRadians(-15.0),
      pitch: -Cesium.Math.PI_OVER_FOUR,
      roll: 0.0,
    },
  }

  laOptions.complete = function () {
    setTimeout(() => {
      camera.flyTo(tokyoOptions)
    }, 1000)
  }

  if (adjustPitch) {
    tokyoOptions.pitchAdjustHeight = 1000
    laOptions.pitchAdjustHeight = 1000
  }

  camera.flyTo(laOptions)
}
