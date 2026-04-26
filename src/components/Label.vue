<script setup lang="ts">
import { useSlots, Fragment } from 'vue'
import { useAnimationNesting } from '../composables/useAnimationNesting'
import type { NestableAnimation } from '../types'

const props = defineProps<NestableAnimation>()

const emit = defineEmits(['cross'])

const slots = useSlots()
const label = String(slots.default?.()[0]?.children || '')

if (label) {
  const { parent } = useAnimationNesting(label, props)
  parent?.eventBus.on('update', () => emit('cross', parent.timeline.time() >= parent.timeline.labels[label]))
} else {
  console.warn('Missing label')
}
</script>

<template>
  <Fragment />
</template>
