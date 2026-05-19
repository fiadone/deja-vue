<script setup lang="ts">
import { Tween } from 'deja-vue'
</script>

<template>
  <Demo>
    <template #controls="{ progress, setProgress }">
      <label class="demo-label demo-scrub">
        Scrub
        <input
          aria-label="Animation progress"
          class="demo-range"
          max="1"
          min="0"
          step="0.01"
          type="range"
          :value="progress"
          @input="e => setProgress(Number((e.target as HTMLInputElement).value))"
        >
      </label>
    </template>
    <template #default="{ progress }">
      <Tween method="to" :progress :vars="{ x: 160 }">
        <div class="demo-box">
          Target
        </div>
      </Tween>
    </template>
  </Demo>
</template>

<style scoped>
.demo-scrub {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
