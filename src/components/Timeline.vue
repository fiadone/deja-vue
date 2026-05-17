<script setup lang="ts">
import { computed, onUnmounted, provide, watch } from 'vue'

import { useAnimationControls } from '../composables/useAnimationControls'
import { useAnimationNesting } from '../composables/useAnimationNesting'
import { useAnimationScope } from '../composables/useAnimationScope'
import { ANIMATION_EVENTS, dejaVueParentInstance } from '../constants'
import type { AnimationEventEmitter, ControllableAnimation, DejaVueInstance } from '../types'
import { Animation } from '../utils/Animation'

const emit = defineEmits(ANIMATION_EVENTS) as AnimationEventEmitter

const props = defineProps<ControllableAnimation & {
  duration?: number
  options?: gsap.TimelineVars
  seamless?: boolean
}>()

const animation = new Animation({
  ...props.options,
  data: typeof props.duration === 'number' && props.duration > 0
    ? { ...props.options?.data, totalDuration: props.duration }
    : props.options?.data
})

const progress = defineModel<number>('progress', { default: undefined })
const [triggerValue, triggerModifier] = defineModel<boolean, 'once'>('trigger', { default: undefined })
const trigger = {
  actions: () => props.triggerActions,
  once: triggerModifier.once,
  value: triggerValue
}

const { controlled, direction } = useAnimationControls(animation, { progress, trigger })
const { parent } = useAnimationNesting({ animation })
const { $el, target, AnimationScope } = useAnimationScope()
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
