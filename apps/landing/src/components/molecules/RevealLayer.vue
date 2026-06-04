<script setup lang="ts">
import { Tween } from 'deja-vue'
import { computed } from 'vue'

const emit = defineEmits(['reveal-start', 'reveal-complete'])

const holeRadius = computed(() => Math.sqrt(window.screen.width ** 2 + window.screen.height ** 2) / 2)
</script>

<template>
  <Tween
    is="div"
    class="fixed inset-0 bg-background"
    tween-target="self"
    :to="{
      '--hole-radius': holeRadius,
      duration: 1.5,
      clearProps: 'all'
    }"
    @complete="$emit('reveal-complete')"
    @start="$emit('reveal-start')"
  />
</template>

<style scoped>
div {
  --hole-radius: 0;

  mask-image:
    radial-gradient(
      circle at center,
      transparent calc(var(--hole-radius) * 1px),
      var(--color-background) calc((var(--hole-radius) + 1) * 1px)
    );
}
</style>
