import type { EffectScope, MaybeRefOrGetter, ModelRef } from 'vue'
import { computed, effectScope, onUnmounted, ref, toValue, watch } from 'vue'

import type { Animation } from '../core/Animation'
import type { AnimationDirection, AnimationTriggerOptions, TweenAction } from '../types'
import { useStableObjectProp } from './useStableObjectProp'

export interface AnimationControls {
  progress: ModelRef<number | undefined>
  trigger: MaybeRefOrGetter<unknown>
  triggerAction: MaybeRefOrGetter<TweenAction | undefined>
  triggerOptions: MaybeRefOrGetter<AnimationTriggerOptions | undefined>
}

export function useAnimationControls (animation: Animation, controls: AnimationControls) {
  const direction = ref<AnimationDirection>(0)
  const trigger = computed(() => toValue(controls.trigger))
  const triggerOptions = useStableObjectProp<AnimationTriggerOptions>(controls.triggerOptions)
  let triggerScope: EffectScope
  let lastProgress: number = animation.timeline.progress()

  const controlled = controls.progress.value !== undefined || trigger.value !== undefined

  if (controlled) animation.timeline.pause()
  if (controls.progress.value === undefined) controls.progress.value = 0

  function onAnimationUpdate () {
    const progress = animation.timeline.progress()
    if (progress !== lastProgress) {
      direction.value = progress > lastProgress ? 1 : -1
      lastProgress = progress
    }
    if (progress === controls.progress.value) return
    controls.progress.value = progress
  }

  animation.on('update', onAnimationUpdate)

  watch(controls.progress, (current, previous) => {
    if (previous === undefined || current === undefined || current === previous) return
    direction.value = current > previous ? 1 : -1
    if (animation.timeline.progress() === current) return
    animation.timeline.progress(current)
  })

  watch(triggerOptions, options => {
    triggerScope?.stop()
    triggerScope = effectScope()
    triggerScope.run(() => {
      const { actionArgs, ...watchOptions } = options
      watch(trigger, () => {
        const action = toValue(controls.triggerAction) || 'play'
        animation.run(action, ...actionArgs || [])
      }, watchOptions)
    })
  }, { immediate: true })

  onUnmounted(() => {
    animation.off('update', onAnimationUpdate)
    triggerScope?.stop()
  })

  return {
    controlled,
    direction
  }
}
