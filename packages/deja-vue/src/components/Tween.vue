<script setup lang="ts">
import { computed, onUnmounted, watch } from 'vue'

import { useAnimationControls } from '../composables/useAnimationControls'
import { useAnimationNesting } from '../composables/useAnimationNesting'
import { useAnimationScope } from '../composables/useAnimationScope'
import { useStableTweenVars } from '../composables/useStableTweenVars'
import { ANIMATION_EVENTS } from '../constants'
import type { AnimationEventEmitter, ControllableAnimation, DejaVueInstance, TweenDefinition } from '../types'
import { cloneObject } from '../utils'
import { Animation } from '../utils/Animation'

const emit = defineEmits(ANIMATION_EVENTS) as AnimationEventEmitter

const props = defineProps<ControllableAnimation & TweenDefinition & { seamless?: boolean }>()

const animation = new Animation()

const progress = defineModel<number>('progress', { default: undefined })
const [triggerState, triggerModifier] = defineModel<boolean, 'once'>('trigger', { default: undefined })
const trigger = {
  once: triggerModifier.once,
  state: triggerState,
  actions: () => props.triggerActions
}

const { controlled, direction } = useAnimationControls(animation, { progress, trigger })
const { parent } = useAnimationNesting({ animation })
const { $el, AnimationScope, target } = useAnimationScope()
const tweenVars = useStableTweenVars(() => props.vars)
const seamless = computed(() => props.seamless)

for (const event of ANIMATION_EVENTS) {
  animation.on(event, () => emit(event, animation, parent))
}

watch([target, () => props.method, tweenVars], ([currentTarget, method, vars]) => {
  animation.clear(true)
  if (!currentTarget || !method || !vars) return
  animation.compose(currentTarget, {
    method,
    vars: cloneObject(vars) // prevent gsap from mutating tweenVars
  } as TweenDefinition)
})

onUnmounted(() => animation.dispose())

defineExpose<DejaVueInstance>({
  $el,
  animation,
  controlled,
  direction,
  parent,
  progress,
  seamless,
  target
})
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
