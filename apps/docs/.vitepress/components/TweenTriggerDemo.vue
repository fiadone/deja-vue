<script setup lang="ts">
//
</script>

<template>
  <Demo v-slot="scope">
    <Tween
      v-model:trigger="scope.trigger"
      method="to"
      :vars="{ x: 120 }"
    >
      <div class="demo-box">
        Target
      </div>
    </Tween>
  </Demo>
</template>
