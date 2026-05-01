<script setup lang="ts">
import { Fragment } from 'vue'
import { useAnimationNesting } from '../composables/useAnimationNesting'
import type { NestableAnimation } from '../types'

const props = defineProps<NestableAnimation & { fn: () => void }>()

useAnimationNesting(props.fn, props)
</script>

<template>
  <Fragment />
</template>
