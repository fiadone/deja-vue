<script setup lang="ts">
//
</script>

<template>
  <Demo v-slot="scope">
    <Tween
      v-model:trigger="scope.trigger"
      method="to"
      :vars="{ x: 100 }"
      v-slot="{ progress }"
    >
      <div class="demo-stack">
        <div class="demo-box">
          Target
        </div>
        <span class="demo-progress">Progress: {{ ((progress ?? 0) * 100).toFixed(0) }}%</span>
      </div>
    </Tween>
  </Demo>
</template>
