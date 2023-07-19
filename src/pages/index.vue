<script setup lang="ts">
import * as Cesium from 'cesium'
import { DefaultPlaneUrl } from '~/cesium/params'

const viewerInstance = ref<Cesium.Viewer | null>(null)
function mapLoaded(viewer: Cesium.Viewer) {
  viewerInstance.value = viewer
  addGoogle3DTileset(viewer)
  addPlaneModel(viewer)

  flyToDefaultPosition(viewer)
  flyAlongWithLine(viewer)
}

async function addGoogle3DTileset(viewer: Cesium.Viewer) {
  viewer.scene.globe.show = false

  try {
    const tileset = await Cesium.createGooglePhotorealistic3DTileset()
    viewer.scene.primitives.add(tileset)
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.log(`Error loading Photorealistic 3D Tiles tileset. ${error}`)
  }

  // Point the camera at the Googleplex
  viewer.scene.camera.setView({
    destination: new Cesium.Cartesian3(
      -2693797.551060477,
      -4297135.517094725,
      3854700.7470414364,
    ),
    orientation: new Cesium.HeadingPitchRoll(
      4.6550106925119925,
      -0.2863894863138836,
      1.3561760425773173e-7,
    ),
  })
}

async function addPlaneModel(viewer: Cesium.Viewer) {
  // viewer.entities.removeAll()

  // const position = Cesium.Cartesian3.fromDegrees(DefaultPosition[0], DefaultPosition[1], DefaultPosition[2])

  // await viewer.entities.add({
  //   name: DefaultPlaneUrl,
  //   position,
  //   model: {
  //     uri: DefaultPlaneUrl,
  //     minimumPixelSize: 128,
  //     maximumScale: 20000,
  //   },
  // })
}

function flyToDefaultPosition(viewer: Cesium.Viewer) {
  // const scene = viewer.scene
  // const camera = scene.camera
  // camera.flyTo({
  //   destination: Cesium.Cartesian3.fromDegrees(DefaultPosition[0], DefaultPosition[1], DefaultPosition[2] + 200),
  //   easingFunction: Cesium.EasingFunction.LINEAR_NONE,
  //   complete() {
  //     setTimeout(() => {
  //       camera.setView({
  //         orientation: {
  //           heading: Cesium.Math.toRadians(90.0),
  //         },
  //       })
  //     }, 1000)
  //   },
  // })
}

async function flyAlongWithLine(viewer: Cesium.Viewer) {
  const flightData
  = await fetch('/json/fly.json')
    .then((response) => {
      return response.json()
    })

  const timeStepInSeconds = 30
  const totalSeconds = timeStepInSeconds * (flightData.length - 1)
  const start = Cesium.JulianDate.fromIso8601('2020-03-09T23:10:00Z')
  const stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate())
  viewer.clock.startTime = start.clone()
  viewer.clock.stopTime = stop.clone()
  viewer.clock.currentTime = start.clone()
  viewer.timeline.zoomTo(start, stop)
  // Speed up the playback speed 50x.
  viewer.clock.multiplier = 50
  // Start playing the scene.
  viewer.clock.shouldAnimate = true

  // The SampledPositionedProperty stores the position and timestamp for each sample along the radar sample series.
  const positionProperty = new Cesium.SampledPositionProperty()

  for (let i = 0; i < flightData.length; i++) {
    const dataPoint = flightData[i]

    // Declare the time for this individual sample and store it in a new JulianDate instance.
    const time = Cesium.JulianDate.addSeconds(start, i * timeStepInSeconds, new Cesium.JulianDate())
    const position = Cesium.Cartesian3.fromDegrees(dataPoint.longitude, dataPoint.latitude, dataPoint.height)
    // Store the position along with its timestamp.
    // Here we add the positions all upfront, but these can be added at run-time as samples are received from a server.
    positionProperty.addSample(time, position)

    viewer.entities.add({
      description: `Location: (${dataPoint.longitude}, ${dataPoint.latitude}, ${dataPoint.height})`,
      position,
      point: { pixelSize: 10, color: Cesium.Color.RED },
    })
  }

  async function loadModel() {
  // Load the glTF model from Cesium ion.
    const airplaneEntity = viewer.entities.add({
      availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({ start, stop })]),
      position: positionProperty,
      // Attach the 3D model instead of the green point.
      model: { uri: DefaultPlaneUrl },
      // Automatically compute the orientation from the position.
      orientation: new Cesium.VelocityOrientationProperty(positionProperty),
      path: new Cesium.PathGraphics({ width: 3 }),
    })

    viewer.trackedEntity = airplaneEntity
  }
  loadModel()
}
</script>

<template>
  <CesiumMap :options="{ timeline: true }" @onload="mapLoaded" />
</template>

<style scoped>

</style>
