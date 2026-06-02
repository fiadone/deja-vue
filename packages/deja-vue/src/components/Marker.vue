<script setup lang="ts">
import { ref, toValue } from 'vue'

import { useAnimationNesting } from '../composables/useAnimationNesting'
import type { AnimationDirection, AnimationNestableChild } from '../types'
import type { DejaVueMarkerInstance, DejaVueMarkerScopeProps } from './Marker.types'

const props = defineProps<AnimationNestableChild & { label?: string }>()

const emit = defineEmits<{ (e: 'cross', direction: AnimationDirection): void }>()

const crossed = ref(false)
const { parent } = useAnimationNesting([
  { callback: onCross },
  { label: () => props.label }
], {
  parent: props.parent,
  position: () => props.position
})

const instance: DejaVueMarkerInstance = { crossed, parent }

function onCross () {
  const direction = toValue(parent!.direction)
  crossed.value = direction === 1
  emit('cross', direction)
}

defineExpose<DejaVueMarkerInstance>(instance)
defineSlots<{ default(props: DejaVueMarkerScopeProps): any }>()
</script>

<template>
  <slot
    :crossed
    :parent
  />
</template>
