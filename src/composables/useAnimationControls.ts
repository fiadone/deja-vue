import type { MaybeRefOrGetter, ModelRef } from 'vue'
import { computed, ref, toValue, watch } from 'vue'

import type { AnimationDirection, ControllableAnimation, TweenAction } from '../types'
import type { Animation } from '../utils/Animation'

type AnimationControls = {
  progress: ModelRef<ControllableAnimation['progress']>
  trigger: {
    actions: MaybeRefOrGetter<ControllableAnimation['triggerActions']>
    once: true | undefined
    value: ModelRef<ControllableAnimation['trigger']>
  }
}

export function useAnimationControls (animation: Animation, controls: AnimationControls) {
  const controlled = controls.progress.value !== undefined || controls.trigger.value.value !== undefined
  const direction = ref<AnimationDirection>(0)
  const triggerActions = computed<[TweenAction, TweenAction]>(() => {
    const value = toValue(controls.trigger.actions)
    if (typeof value === 'string' && value.trim()) return [value, value]
    if (Array.isArray(value) && value.length) return [value[0] || 'play', value[1] || value[0] || 'reverse']
    return ['play', 'reverse']
  })

  if (controlled && controls.trigger.value.value !== true) animation.timeline.pause()

  animation.on('update', () => {
    const progress = animation.timeline.progress()
    if (progress === controls.progress.value) return
    controls.progress.value = progress
  })

  watch(controls.progress, (currentValue, previousValue) => {
    if (currentValue === undefined || currentValue === previousValue) return
    if (previousValue !== undefined) direction.value = currentValue > previousValue ? 1 : -1
    animation.timeline.progress(currentValue)
  }, { flush: 'sync', immediate: true })

  watch(controls.trigger.value, (value) => {
    if (value === undefined) return
    const [onTrue, onFalse = onTrue] = triggerActions.value
    const action = value ? onTrue : onFalse
    animation.run(action)
  }, { flush: 'sync', once: controls.trigger.once })

  return {
    controlled,
    direction
  }
}
