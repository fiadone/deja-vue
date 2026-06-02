<script setup lang="ts">
defineProps<{ showDirection?: boolean }>()

function getRangeValue (event: Event) {
  return Number((event.target as HTMLInputElement).value)
}
</script>

<template>
  <Demo>
    <template #controls="{ progress, setProgress }">
      <span class="demo-label">Scrub</span>
      <input
        class="demo-range"
        max="1"
        min="0"
        step="0.01"
        type="range"
        :value="progress"
        @input="e => setProgress(getRangeValue(e))"
      >
    </template>
    <template #default="{ progress }">
      <Tween
        :progress
        :to="{ x: 56 }"
        v-slot="{ direction }"
      >
        <div class="demo-box">
          {{ showDirection ? direction : '' }}
        </div>
      </Tween>
    </template>
  </Demo>
</template>
