<script setup lang="ts">
import { computed, nextTick, provide, watch } from 'vue'

import type { AnimationControls } from '../composables/useAnimationControls'
import { useAnimationControls } from '../composables/useAnimationControls'
import { useAnimationNesting } from '../composables/useAnimationNesting'
import { useAnimationScope } from '../composables/useAnimationScope'
import { useStableObjectProp } from '../composables/useStableObjectProp'
import { ANIMATION_EVENTS, dejaVueParentInstance } from '../constants'
import { Animation } from '../core/Animation'
import type {
  AnimationEventEmitter,
  AnimationNestableChild,
  ControllableAnimation,
  DejaVueAnimationComponentProps,
  DejaVueAnimationInstance,
  DejaVueAnimationScopeProps
} from '../types'
import { cloneObject } from '../utils'
import { stripScrollTriggerVars } from '../utils/gsap'

const props = defineProps<(
  & DejaVueAnimationComponentProps
  & AnimationNestableChild
  & ControllableAnimation
  & {
    duration?: number
    options?: gsap.TimelineVars
  }
)>()

const emit = defineEmits(ANIMATION_EVENTS) as AnimationEventEmitter

const { AnimationScope, root, tweenTarget } = useAnimationScope({ tweenTarget: () => props.tweenTarget })

const options = useStableObjectProp<gsap.TimelineVars>(() => props.options)
const vars = computed(() => {
  const tl = cloneObject(options)
  const st = stripScrollTriggerVars(tl, root.value)
  return { scrollTrigger: st, timeline: tl }
})

const animation = new Animation({
  ...vars.value?.timeline,
  data: typeof props.duration === 'number' && props.duration > 0
    ? { ...vars.value?.timeline.data, totalDuration: props.duration }
    : vars.value?.timeline.data
})

const progress = defineModel<number>('progress', { default: undefined })
const controls: AnimationControls = {
  progress,
  trigger: () => props.trigger,
  triggerAction: () => props.triggerAction,
  triggerOptions: () => props.triggerOptions
}

const { controlled, direction } = useAnimationControls(animation, controls)
const { parent } = useAnimationNesting({ animation }, {
  parent: props.parent,
  position: () => props.position,
  revertOnDispose: () => props.revertOnDispose
})

const seamless = computed(() => props.seamless)

const instance: DejaVueAnimationInstance = {
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

watch(() => vars.value.timeline, vars => {
  Object.assign(animation.timeline.vars, cloneObject(vars))
  animation.timeline.invalidate()
})

watch(() => vars.value.scrollTrigger, async vars => {
  if (Object.keys(vars || {}).length) {
    await nextTick()
    animation.attachScrollTrigger(vars)
  } else {
    animation.attachScrollTrigger(null)
  }
}, { immediate: true })

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

provide(dejaVueParentInstance, instance)

defineExpose<DejaVueAnimationInstance>(instance)
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
