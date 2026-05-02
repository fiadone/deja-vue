<script setup lang="ts">
import { provide, useTemplateRef, watch } from 'vue'

import { useAnimation } from '../composables/useAnimation'
import { ANIMATION_EVENTS, parentAnimationInjectionKey } from '../constants'
import type { TimelineAnimation } from '../types'

const props = withDefaults(defineProps<TimelineAnimation>(), {
  tag: 'div',
  toggle: undefined
})

const emit = defineEmits([...ANIMATION_EVENTS])

const wrapper = useTemplateRef<HTMLElement>('wrapper')
const { animation, controlled, parent, ready } = useAnimation(wrapper, props, emit, {
  ...props.options,
  data: {
    ...props.options?.data,
    totalDuration: Number(props.duration)
  }
})

watch(() => props.duration, duration => (animation.timeline.data.totalDuration = Number(duration)))

provide(parentAnimationInjectionKey, animation)

defineExpose({ animation, controlled, parent, ready })
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
      :ready
    />
  </component>
  <slot
    v-else
    :animation
    :controlled
    :parent
    :ready
  />
</template>
