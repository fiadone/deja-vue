import type { ShallowRef } from 'vue'
import { getCurrentInstance, onMounted, onUnmounted, watch } from 'vue'

import type { TimelineAnimation, TweenAnimation, TweenAnimationDefinition } from '../types'

import { ANIMATION_EVENTS } from '../constants'
import { Animation } from '../utils/Animation'
import { useAnimationControls } from './useAnimationControls'
import { useAnimationNesting } from './useAnimationNesting'

export function useAnimation (wrapper: Readonly<ShallowRef<HTMLElement | null>>) {
  const { props, emit } = getCurrentInstance()! as {
    props: TimelineAnimation | TweenAnimation
    emit: (event: typeof ANIMATION_EVENTS[number], timeline: gsap.core.Timeline) => void
  }

  const options = 'options' in props
    ? {
        ...props.options,
        data: {
          ...props.options?.data,
          totalDuration: Number(props.duration)
        }
      } as gsap.TimelineVars
    : undefined
  
  const animation = new Animation(options)

  const { controlled } = useAnimationControls(animation, {
    progress: () => props.progress,
    toggle: () => props.toggle
  })

  const { parent } = useAnimationNesting(animation, props)

  ANIMATION_EVENTS.forEach(event => animation.on(event, () => emit(event, animation.timeline)))

  if ('duration' in props) {
    watch(() => props.duration, duration => {
      animation.timeline.data.totalDuration = Number(duration)
    })
  }

  onMounted(() => {
    if (wrapper.value) {
      // TODO: evaluate rebuilding if props or options or content mutations occur
      const target = props.group ? wrapper.value.children : wrapper.value
      const definition = 'tweens' in props ? props.tweens || [] : props as TweenAnimationDefinition
      animation.compose(target, definition)
    }
  })

  onUnmounted(() => animation.dispose())

  return {
    animation,
    controlled,
    parent
  }
}
