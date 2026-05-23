<script setup lang="ts">
import type { WatchOptions } from 'vue'
import { computed, onUnmounted, watch } from 'vue'

import { type AnimationControls, useAnimationControls } from '../composables/useAnimationControls'
import { useAnimationNesting } from '../composables/useAnimationNesting'
import { useAnimationScope } from '../composables/useAnimationScope'
import { useStableObjectProp } from '../composables/useStableObjectProp'
import { useTweenVars } from '../composables/useTweenVars'
import { ANIMATION_EVENTS } from '../constants'
import { Animation } from '../core/Animation'
import type { AnimationComposeDefinition, AnimationEventEmitter, ControllableAnimation, DejaVueInstance, TweenDefinition } from '../types'
import { cloneObject } from '../utils'

const emit = defineEmits(ANIMATION_EVENTS) as AnimationEventEmitter

const props = defineProps<ControllableAnimation & TweenDefinition & { seamless?: boolean }>()

const animation = new Animation()

const progress = defineModel<number>('progress', { default: undefined })

const controls: AnimationControls = {
  progress,
  trigger: computed(() => props.trigger),
  triggerAction: computed(() => props.triggerAction),
  triggerOptions: useStableObjectProp<WatchOptions>(() => props.triggerOptions ?? {})
}

const { controlled, direction } = useAnimationControls(animation, controls)
const { parent } = useAnimationNesting({ animation })
const { $el, AnimationScope, target } = useAnimationScope()
const { method, vars } = useTweenVars(props)
const seamless = computed(() => props.seamless)

for (const event of ANIMATION_EVENTS) {
  animation.on(event, () => emit(event, animation, parent))
}

watch([target, method, vars], async ([currentTarget, currentMethod, currentVars]) => {
  animation.clear(true)
  if (!currentTarget || !currentMethod) return
  animation.compose({
    method: currentMethod,
    target: currentTarget,
    vars: cloneObject(currentVars)
  } as AnimationComposeDefinition)
}, { deep: true })

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
