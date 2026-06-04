<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'

const model = defineModel<number>('modelValue', { default: 0 })

const input = useTemplateRef<HTMLInputElement>('input')
const progress = computed(() => {
  const min = Number(input.value?.min ?? 0)
  const max = Number(input.value?.max ?? 100)
  return (model.value - min) / (max - min)
})
</script>

<template>
  <input
    ref="input"
    v-model="model"
    class="h-5 appearance-none bg-transparent accent-current cursor-pointer"
    type="range"
    :style="{ '--progress': `${progress * 100}%` }"
  >
</template>

<style scoped>
input::-webkit-slider-runnable-track {
  height: 0.375rem;
  border: none;
  border-radius: 0.2rem;
  background:
    linear-gradient(
      to right,
      currentColor 0%,
      currentColor var(--progress, 0%),
      rgb(255 255 255 / 10%) var(--progress, 0%),
      rgb(255 255 255 / 10%) 100%
    );
}

input::-webkit-slider-thumb {
  width: 1.25rem;
  height: 1.25rem;
  border: none;
  border-radius: 50%;
  margin-top: -0.4375rem;
  -webkit-appearance: none;
  appearance: none;
  background: currentColor;
}

input::-moz-range-track {
  height: 0.375rem;
  border: none;
  border-radius: 0.2rem;
  background: rgb(255 255 255 / 10%);
}

input::-moz-range-progress {
  height: 0.375rem;
  border-radius: 0.2rem;
  background: currentColor;
}

input::-moz-range-thumb {
  width: 1.25rem;
  height: 1.25rem;
  border: none;
  border-radius: 50%;
  background: currentColor;
}
</style>