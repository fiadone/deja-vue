<script setup lang="ts">
import { useTemplateRef } from 'vue'

import { useAnimation } from '../composables/useAnimation'
import { ANIMATION_EVENTS } from '../constants'
import type { TweenAnimation } from '../types'

const props = withDefaults(defineProps<TweenAnimation>(), {
  tag: 'div',
  toggle: undefined
})

const emit = defineEmits([...ANIMATION_EVENTS])

const wrapper = useTemplateRef<HTMLElement>('wrapper')
const { animation, controlled, parent, ready } = useAnimation(wrapper, props, emit)

defineExpose({ animation, controlled, parent, ready })
</script>

<template>
  <component :is="tag" ref="wrapper">
    <slot
      :animation
      :controlled
      :parent
      :ready
    />
  </component>
</template>
