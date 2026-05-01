<script setup lang="ts">
import { Fragment } from 'vue'
import { useAnimationNesting } from '../composables/useAnimationNesting'
import type { NestableAnimation } from '../types'

const props = defineProps<NestableAnimation & { label: string }>()

const emit = defineEmits(['cross'])

const { parent } = useAnimationNesting(props.label, props)

useAnimationNesting(() => emit('cross'), { parent, position: props.label })
</script>

<template>
  <Fragment />
</template>
