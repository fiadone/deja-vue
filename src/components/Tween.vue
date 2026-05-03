<script setup lang="ts">
import { useTemplateRef } from 'vue'

import { useAnimation } from '../composables/useAnimation'
import { ANIMATION_EVENTS } from '../constants'
import type { TweenAnimation } from '../types'

withDefaults(defineProps<TweenAnimation>(), {
  tag: 'div',
  toggle: undefined
})

defineEmits([...ANIMATION_EVENTS])

const wrapper = useTemplateRef<HTMLElement>('wrapper')
const { animation, controlled, parent, progress } = useAnimation(wrapper)

defineExpose({ animation, controlled, parent, progress })
</script>

<template>
  <component :is="tag" ref="wrapper">
    <slot
      :animation
      :controlled
      :parent
      :progress
    />
  </component>
</template>
