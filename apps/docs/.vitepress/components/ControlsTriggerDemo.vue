<script setup lang="ts">
//
</script>

<template>
  <Demo v-slot="scope">
    <Tween
      v-model:trigger="scope.trigger"
      method="from"
      :vars="{ opacity: 0, yPercent: 50 }"
    >
      <div class="demo-box">
        Reveal
      </div>
    </Tween>
  </Demo>
</template>
