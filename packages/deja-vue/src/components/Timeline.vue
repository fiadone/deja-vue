<script setup lang="ts">
import type { WatchOptions } from 'vue'
import { computed, onUnmounted, provide, watch } from 'vue'

import { type AnimationControls, useAnimationControls } from '../composables/useAnimationControls'
import { useAnimationNesting } from '../composables/useAnimationNesting'
import { useAnimationScope } from '../composables/useAnimationScope'
import { useStableObjectProp } from '../composables/useStableObjectProp'
import { ANIMATION_EVENTS, dejaVueParentInstance } from '../constants'
import { Animation } from '../core/Animation'
import type {
  AnimationEventEmitter,
  AnimationNestableChild,
  AnimationTarget,
  ControllableAnimation,
  DejaVueAnimationPublicInstance,
  DejaVueAnimationScopeProps
} from '../types'

const props = defineProps<(
  & ControllableAnimation
  & Pick<AnimationNestableChild, 'position'>
  & {
    duration?: number
    options?: gsap.TimelineVars
    seamless?: boolean
    tweenTarget?: AnimationTarget
  }
)>()

const emit = defineEmits(ANIMATION_EVENTS) as AnimationEventEmitter

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
const { parent } = useAnimationNesting({ animation }, () => props.position)
const { AnimationScope, root, tweenTarget } = useAnimationScope({ tweenTarget: () => props.tweenTarget })
const seamless = computed(() => props.seamless)

const instance: DejaVueAnimationPublicInstance = {
  $el: root,
  animation,
  controlled,
  direction,
  parent,
  progress,
  seamless,
  tweenTarget
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

defineSlots<{ default(props: DejaVueAnimationScopeProps): any }>()
</script>

<template>
  <AnimationScope
    :animation
    :direction
    :parent
    :progress
  />
</template>
