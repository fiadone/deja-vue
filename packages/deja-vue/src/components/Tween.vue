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
import type {
  AnimationComposeDefinition,
  AnimationEventEmitter,
  AnimationNestableChild,
  AnimationTarget,
  ControllableAnimation,
  DejaVueAnimationPublicInstance,
  DejaVueAnimationScopeProps,
  TweenDefinition
} from '../types'
import { cloneObject } from '../utils'

const props = defineProps<(
  & TweenDefinition
  & ControllableAnimation
  & Pick<AnimationNestableChild, 'position'>
  & {
    seamless?: boolean
    tweenTarget?: AnimationTarget
  }
)>()

const emit = defineEmits(ANIMATION_EVENTS) as AnimationEventEmitter

const animation = new Animation()
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
const { method, vars } = useTweenVars(props)
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

watch([tweenTarget, method, vars], async ([tweenTarget, tweenMethod, tweenVars]) => {
  animation.clear(true)
  if (!tweenTarget || !tweenMethod) return
  animation.compose({
    method: tweenMethod,
    target: tweenTarget,
    vars: cloneObject(tweenVars)
  } as AnimationComposeDefinition)
}, { deep: true })

onUnmounted(() => animation.dispose())

defineExpose<DejaVueAnimationPublicInstance>(instance)

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
