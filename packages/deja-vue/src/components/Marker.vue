<script setup lang="ts">
import { ref, type Ref } from 'vue'

import { useAnimationNesting } from '../composables/useAnimationNesting'
import type { AnimationDirection, AnimationNestableChild, DejaVueAnimationPublicInstance } from '../types'

export interface DejaVueMarkerScopeProps {
  crossed: boolean
  parent: DejaVueAnimationPublicInstance | null
}

export interface DejaVueMarkerPublicInstance {
  crossed: Ref<boolean>
  parent: DejaVueAnimationPublicInstance | null
}

const props = defineProps<(Pick<AnimationNestableChild, 'position'> & { label?: string })>()

const emit = defineEmits<{ (e: 'cross', direction: AnimationDirection): void }>()

const crossed = ref(false)
const { parent } = useAnimationNesting([
  { callback: onCross },
  { label: () => props.label }
], () => props.position)

const instance: DejaVueMarkerPublicInstance = { crossed, parent }

function onCross () {
  const direction = parent!.direction.value
  crossed.value = direction === 1
  emit('cross', direction)
}

defineExpose(instance)

defineSlots<{ default(props: DejaVueMarkerScopeProps): any }>()
</script>

<template>
  <slot
    :crossed
    :parent
  />
</template>
