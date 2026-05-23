import type { ComputedRef, EffectScope, MaybeRefOrGetter, ModelRef, Reactive, WatchOptions } from 'vue'
import { effectScope, ref, toValue, watch } from 'vue'

import type { Animation } from '../core/Animation'
import type { AnimationDirection, ControllableAnimation, TweenAction } from '../types'

export interface AnimationControls {
  progress: ModelRef<ControllableAnimation['progress']>
  trigger: ComputedRef<unknown>
  triggerAction: MaybeRefOrGetter<TweenAction | undefined>
  triggerOptions: Reactive<WatchOptions>
}

export function useAnimationControls (animation: Animation, controls: AnimationControls) {
  const direction = ref<AnimationDirection>(0)
  const controlled = controls.progress.value !== undefined || controls.trigger.value !== undefined
  let triggerScope: EffectScope

  if (controlled) animation.timeline.pause()
  if (controls.progress.value === undefined) controls.progress.value = 0

  animation.on('update', () => {
    const progress = animation.timeline.progress()
    if (progress === controls.progress.value) return
    controls.progress.value = progress
  })

  watch(controls.progress, (currentValue, previousValue) => {
    if (previousValue === undefined) return
    if (currentValue === undefined || currentValue === previousValue) return
    direction.value = currentValue > previousValue ? 1 : -1
    animation.timeline.progress(currentValue)
  }, { flush: 'post' })

  watch(controls.triggerOptions, watchOptions => {
    triggerScope?.stop()
    triggerScope = effectScope()
    triggerScope.run(() => {
      watch(controls.trigger, () => {
        const action = toValue(controls.triggerAction) || 'play'
        animation.run(action)
      }, watchOptions)
    })
  }, { immediate: true })

  return {
    controlled,
    direction
  }
}
