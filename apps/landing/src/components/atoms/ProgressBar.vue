<script setup lang="ts">
withDefaults(defineProps<{ progress?: number }>(), { progress: 0 })
</script>

<template>
  <div class="relative w-full h-1.5 rounded-0.75 bg-white/10 overflow-hidden">
    <div
      class="absolute inset-0 bg-gradient-to-r from-primary to-secondary"
      :style="{ clipPath: `polygon(0% 0%, ${progress * 100}% 0%, ${progress * 100}% 100%, 0% 100%)` }"
    />
  </div>
</template>
