<script setup lang="ts">
import { ref } from 'vue'

import { useAnimationNesting } from '../composables/useAnimationNesting'
import type { AnimationDirection } from '../types'

const emit = defineEmits<{ (e: 'cross', direction: AnimationDirection): void }>()
const props = defineProps<(
  { label?: string }
)>()

const crossed = ref(false)
const { parent } = useAnimationNesting([
  { callback: onCross },
  { label: () => props.label }
])

function onCross () {
  const direction = parent!.direction.value
  crossed.value = direction === 1
  emit('cross', direction)
}
</script>

<template>
  <slot :crossed :parent />
</template>
