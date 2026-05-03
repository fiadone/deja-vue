<script setup lang="ts">
import { provide, useTemplateRef } from 'vue'

import { useAnimation } from '../composables/useAnimation'
import { ANIMATION_EVENTS, parentAnimationInjectionKey } from '../constants'
import type { TimelineAnimation } from '../types'

withDefaults(defineProps<TimelineAnimation>(), {
  tag: 'div',
  toggle: undefined
})

defineEmits([...ANIMATION_EVENTS])

const wrapper = useTemplateRef<HTMLElement>('wrapper')
const { animation, controlled, parent, progress } = useAnimation(wrapper)

provide(parentAnimationInjectionKey, animation)

defineExpose({ animation, controlled, parent, progress })
</script>

<template>
  <component
    v-if="tweens"
    :is="tag"
    ref="wrapper"
  >
    <slot
      :animation
      :controlled
      :parent
      :progress
    />
  </component>
  <slot
    v-else
    :animation
    :controlled
    :parent
    :progress
  />
</template>
