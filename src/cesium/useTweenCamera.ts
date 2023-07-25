import * as Cesium from 'cesium'
import * as TWEEN from '@tweenjs/tween.js'
import { DefaultPath } from '~/cesium/params'

interface IPathPoint {
  lng: number
  lat: number
  alt: number
  heading: number
  pitch: number
  duration: number
}

export function useTweenCamera(viewer: Cesium.Viewer, points: IPathPoint[]) {
  const animateId = ref(0)
  const tweens = ref<any>([])
  const currentTween = ref<any>(null)

  function startTweenAnimation() {
    tweens.value = createTween()
    const lastTween = tweens.value[tweens.value.length - 1]

    // 在最后一个 tween 终止动画更新循环
    lastTween.onComplete(() => {
      cancelAnimationFrame(animateId.value)
    })

    // 动画更新循环
    function animate() {
      animateId.value = requestAnimationFrame(animate)
      TWEEN.update()
    }

    // 启动动画循环
    animate()
    tweens.value[0].start()

    return tweens
  }

  function pauseTweenAnimation() {
    currentTween.value = tweens.value.find((t: any) => t.isPlaying() === true)
    currentTween.value.pause()

    animateId.value && cancelAnimationFrame(animateId.value)
  }

  function resumeTweenAnimation() {
    function animate() {
      animateId.value = requestAnimationFrame(animate)
      TWEEN.update()
    }
    animate()

    currentTween.value.resume()
  }

  function restartTweenAnimation() {
    animateId.value && cancelAnimationFrame(animateId.value)
    tweens.value.forEach((t: any) => t.stop())

    tweens.value = []
    animateId.value = 0
    currentTween.value = null

    startTweenAnimation()
  }

  function createTween(points: any[] = DefaultPath) {
    const tweens = []

    for (let i = 0; i < points.length - 1; i++) {
      const startObject = points[i]
      const stopObject = points[i + 1]
      const duration = Cesium.defaultValue(stopObject.duration, 3) * 1000

      const tween = new TWEEN.Tween(startObject)
        .to(stopObject, duration) // 使用duration作为过渡时间
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

      tweens.push(tween)
    }

    // 将数组中的动画链式调用
    for (let i = 0; i < tweens.length; i++) {
      if (i === tweens.length - 1) {
        tweens[i].chain()
        break
      }
      tweens[i].chain(tweens[i + 1])
    }

    return tweens
  }

  return {
    startTweenAnimation,
    pauseTweenAnimation,
    resumeTweenAnimation,
    restartTweenAnimation,
  }
}
