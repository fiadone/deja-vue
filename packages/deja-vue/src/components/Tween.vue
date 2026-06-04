<script setup lang="ts">
import { computed, watch } from 'vue'

import type { AnimationControls } from '../composables/useAnimationControls'
import { useAnimationControls } from '../composables/useAnimationControls'
import { useAnimationNesting } from '../composables/useAnimationNesting'
import { useAnimationScope } from '../composables/useAnimationScope'
import { useTweenVars } from '../composables/useTweenVars'
import { ANIMATION_EVENTS } from '../constants'
import { Animation } from '../core/Animation'
import type {
  AnimationComposeDefinition,
  AnimationEventEmitter,
  AnimationNestableChild,
  ControllableAnimation,
  DejaVueAnimationComponentProps,
  DejaVueAnimationInstance,
  DejaVueAnimationScopeProps,
  TweenDefinition
} from '../types'
import { cloneObject } from '../utils'
import { isEmptyTarget } from '../utils/gsap'

const props = defineProps<(
  & DejaVueAnimationComponentProps
  & AnimationNestableChild
  & ControllableAnimation
  & TweenDefinition
)>()

const emit = defineEmits(ANIMATION_EVENTS) as AnimationEventEmitter

const { AnimationScope, root, tweenTarget } = useAnimationScope({ tweenTarget: () => props.tweenTarget })

const animation = new Animation()
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
  position: () => props.position
})

const { method: tweenMethod, vars: tweenVars } = useTweenVars(props)
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

watch([root, tweenMethod, tweenTarget, tweenVars], ([scope, method, target, vars]) => {
  if (isEmptyTarget(target) || !method) return
  animation.clear(true)
  const definition = { method, scope, target, vars: cloneObject(vars) } as AnimationComposeDefinition
  animation.compose(definition)
}, { deep: true, immediate: true })

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
