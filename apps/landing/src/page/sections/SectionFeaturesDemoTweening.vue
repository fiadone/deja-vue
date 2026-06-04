<script setup lang="ts">
import { Tween } from 'deja-vue'

const data = [0.6, 0.85, 0.7, 1, 0.75]
</script>

<template>
  <Tween
    is="div"
    class="flex items-end justify-center gap-3 size-full"
    :from="{
      scaleY: 0,
      transformOrigin: 'bottom center',
      delay: 0.5,
      stagger: 0.1,
      scrollTrigger: {
        start: 'top bottom',
        toggleActions: 'play none none reset'
      }
    }"
  >
    <div
      v-for="value, index in data"
      :key="index"
      class="w-7 rounded-1 origin-bottom"
      :class="{
        'bg-primary': index % 2 === 0,
        'bg-secondary': index % 2 === 1
      }"
      :style="{ height: `${value * 100}%` }"
    />
  </Tween>
</template>
