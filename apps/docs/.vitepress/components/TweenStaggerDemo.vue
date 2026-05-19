<script setup lang="ts">
//
</script>

<template>
  <Demo v-slot="scope">
    <Tween
      v-model:trigger="scope.trigger"
      method="from"
      :vars="{ opacity: 0, y: 20, stagger: 0.1 }"
    >
      <div class="demo-boxes">
        <div
          v-for="item in 5"
          :key="item"
          class="demo-box"
        >
          {{ item }}
        </div>
      </div>
    </Tween>
  </Demo>
</template>
