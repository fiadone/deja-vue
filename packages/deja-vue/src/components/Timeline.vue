<script setup lang="ts">
import type { WatchOptions } from 'vue'
import { computed, onUnmounted, provide, watch } from 'vue'

import { type AnimationControls, useAnimationControls } from '../composables/useAnimationControls'
import { useAnimationNesting } from '../composables/useAnimationNesting'
import { useAnimationScope } from '../composables/useAnimationScope'
import { useStableObjectProp } from '../composables/useStableObjectProp'
import { ANIMATION_EVENTS, dejaVueParentInstance } from '../constants'
import { Animation } from '../core/Animation'
import type { AnimationEventEmitter, ControllableAnimation, DejaVueInstance } from '../types'

const emit = defineEmits(ANIMATION_EVENTS) as AnimationEventEmitter

const props = defineProps<ControllableAnimation & {
  duration?: number
  options?: gsap.TimelineVars
  seamless?: boolean
}>()

const options = useStableObjectProp<gsap.TimelineVars>(() => props.options)

const animation = new Animation({
  ...options,
  data: typeof props.duration === 'number' && props.duration > 0
    ? { ...options.data, totalDuration: props.duration }
    : options.data
})

const progress = defineModel<number>('progress', { default: undefined })

const controls: AnimationControls = {
  progress,
  trigger: computed(() => props.trigger),
  triggerAction: computed(() => props.triggerAction),
  triggerOptions: useStableObjectProp<WatchOptions>(() => props.triggerOptions)
}

const { controlled, direction } = useAnimationControls(animation, controls)
const { parent } = useAnimationNesting({ animation })
const { $el, AnimationScope, target } = useAnimationScope()
const seamless = computed(() => props.seamless)

const instance: DejaVueInstance = {
  $el,
  animation,
  controlled,
  direction,
  parent,
  progress,
  seamless,
  target
}

for (const event of ANIMATION_EVENTS) {
  animation.on(event, () => emit(event, animation, parent))
}

watch(options, vars => {
  Object.assign(animation.timeline.vars, vars)
  animation.timeline.invalidate()
})

watch(() => props.duration, duration => {
  if (typeof duration === 'number' && duration > 0) {
    animation.timeline.data.totalDuration = duration
    animation.timeline.duration(duration)
  } else {
    delete animation.timeline.data.totalDuration
    animation.timeline.timeScale(1)
    animation.timeline.invalidate()
  }
})

onUnmounted(() => animation.dispose())

provide(dejaVueParentInstance, instance)

defineExpose(instance)
</script>

<template>
  <AnimationScope
    :animation
    :controlled
    :direction
    :parent
    :progress
    :target
  />
</template>
