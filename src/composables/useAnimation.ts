import { gsap } from 'gsap'
import { onMounted, onUnmounted, shallowRef } from 'vue'
import type { ShallowRef } from 'vue'

import type { AnimationInstance, TimelineAnimation, TweenAnimation, TweenAnimationDefinition } from '../types'

import { useAnimationControls } from './useAnimationControls'
import { useAnimationNesting } from './useAnimationNesting'
import { ANIMATION_EVENTS } from '../constants'
import { EventBus } from '../utils/EventBus'

export function useAnimation (
  wrapper: Readonly<ShallowRef<HTMLElement | null>>,
  props: TimelineAnimation | TweenAnimation,
  emit: (event: typeof ANIMATION_EVENTS[number], animation: gsap.core.Timeline) => void,
  options?: gsap.TimelineVars
) {
  const eventBus = new EventBus([...ANIMATION_EVENTS])
  const timeline = gsap.timeline({
    ...options,
    onComplete: () => eventBus.dispatch('complete'),
    onRepeat: () => eventBus.dispatch('repeat'),
    onReverseComplete: () => eventBus.dispatch('reverseComplete'),
    onStart: () => eventBus.dispatch('start'),
    onUpdate: () => eventBus.dispatch('update')
  })

  const animation: AnimationInstance = { eventBus, timeline }
  const ready = shallowRef(false)

  eventBus.on('complete', () => emit('complete', timeline))
  eventBus.on('interrupt', () => emit('interrupt', timeline))
  eventBus.on('repeat', () => emit('repeat', timeline))
  eventBus.on('reverseComplete', () => emit('reverseComplete', timeline))
  eventBus.on('start', () => emit('start', timeline))
  eventBus.on('update', () => emit('update', timeline))

  if (options) {
    ANIMATION_EVENTS.forEach(vueEvent => {
      const gsapEvent = `on${vueEvent[0].toUpperCase() + vueEvent.slice(1)}`
      if (gsapEvent in options) eventBus.on(vueEvent, options[gsapEvent])
    })
  }

  const { controlled } = useAnimationControls(animation, {
    progress: () => props.progress,
    toggle: () => props.toggle
  })

  const { parent } = useAnimationNesting(animation, props)

  function composeAnimation (target: HTMLElement | HTMLCollection, tween: TweenAnimationDefinition) {
    if (tween.method.startsWith('effect')) {
      try {
        const [_, effect] = tween.method.split(':')
        timeline[effect](target, tween.vars)
      } catch {
        console.warn('Missing or unknown effect')
      }
    } else if (tween.method === 'fromTo') {
      timeline.fromTo(target, ...tween.vars)
    } else {
      timeline[tween.method](target, tween.vars)
    }
  }

  onMounted(() => {
    // TODO: evaluate rebuilding if props or content mutations occur
    if (wrapper.value) {
      const target = props.group ? wrapper.value.children : wrapper.value
  
      if ('tweens' in props) {
        props.tweens?.forEach(tween => composeAnimation(target, tween))
      } else {
        const tween = props as TweenAnimation
        composeAnimation(target, tween)
      }
    }

    ready.value = true
  })

  onUnmounted(() => {
    timeline.kill()
    eventBus.dispose()
  })

  return {
    animation,
    controlled,
    parent,
    ready
  }
}
