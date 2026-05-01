import { computed, toValue, watch } from 'vue'
import type { MaybeRefOrGetter } from 'vue'

import type { ControllableAnimation } from '../types'
import type { Animation } from '../utils/Animation'

type AnimationControls<C = ControllableAnimation> = {
  [K in keyof C]?: MaybeRefOrGetter<C[K]>
}

export function useAnimationControls (animation: Animation, controls: AnimationControls) {
  const progress = computed(() => toValue(controls.progress))
  const toggle = computed(() => toValue(controls.toggle))
  const controlled = computed(() => typeof progress.value === 'number' || typeof toggle.value === 'boolean')

  if (controlled.value && toggle.value !== true) animation.timeline.pause()

  watch(progress, (value) => {
    if (typeof value !== 'number') return
    animation.timeline.progress(value)
  }, { immediate: true })

  watch(toggle, (value) => {
    if (typeof value !== 'boolean') return
    animation.timeline[value ? 'play' : 'reverse']()
  })

  return {
    controlled
  }
}
