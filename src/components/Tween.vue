<script setup lang="ts">
import { useTemplateRef } from 'vue'

import { useAnimation } from '../composables/useAnimation'
import { ANIMATION_EVENTS } from '../constants'
import type { TweenAnimation } from '../types'

const props = withDefaults(defineProps<TweenAnimation>(), {
  initiallyHidden: true,
  tag: 'div',
  toggle: undefined
})

const emit = defineEmits([...ANIMATION_EVENTS])

const wrapper = useTemplateRef<HTMLElement>('wrapper')
const { animation, ready } = useAnimation(wrapper, props, emit)

defineExpose({ animation })
</script>

<template>
  <component
    ref="wrapper"
    :is="tag"
    :style="initiallyHidden && !ready ? { visibility: 'hidden' } : undefined"
  >
    <slot :animation />
  </component>
</template>
