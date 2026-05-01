import { onMounted, onUnmounted, shallowRef } from 'vue'
import type { ShallowRef } from 'vue'

import type { TimelineAnimation, TweenAnimation, TweenAnimationDefinition } from '../types'

import { useAnimationControls } from './useAnimationControls'
import { useAnimationNesting } from './useAnimationNesting'
import { ANIMATION_EVENTS } from '../constants'
import { Animation } from '../utils/Animation'

export function useAnimation (
  wrapper: Readonly<ShallowRef<HTMLElement | null>>,
  props: TimelineAnimation | TweenAnimation,
  emit: (event: typeof ANIMATION_EVENTS[number], timeline: gsap.core.Timeline) => void,
  options?: gsap.TimelineVars
) {
  const animation = new Animation(options)
  const ready = shallowRef(false)

  const { controlled } = useAnimationControls(animation, {
    progress: () => props.progress,
    toggle: () => props.toggle
  })

  const { parent } = useAnimationNesting(animation, props)

  ANIMATION_EVENTS.forEach(event => animation.on(event, () => emit(event, animation.timeline)))

  onMounted(() => {
    if (wrapper.value) {
      // TODO: evaluate rebuilding if props or options or content mutations occur
      const target = props.group ? wrapper.value.children : wrapper.value
      const definition = 'tweens' in props ? props.tweens || [] : props as TweenAnimationDefinition
      animation.compose(target, definition)
    }

    ready.value = true
  })

  onUnmounted(() => animation.dispose())

  return {
    animation,
    controlled,
    parent,
    ready
  }
}
