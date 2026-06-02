<script setup lang="ts">
import { Marker, Timeline, Tween } from 'deja-vue'
</script>

<template>
  <Demo v-slot="scope">
    <Timeline
      :trigger="scope.trigger"
      :trigger-action="scope.triggerAction"
    >
      <Tween :to="{ x: 56 }">
        <div class="demo-box" />
      </Tween>
      <Marker v-slot="{ crossed }">
        <Tween
          :from="{ opacity: 0 }"
          :parent="null"
          :trigger="crossed"
          :trigger-action="crossed ? 'play' : 'reverse'"
        >
          <div class="demo-box demo-box--muted" />
        </Tween>
      </Marker>
      <Tween :to="{ x: 56 }">
        <div class="demo-box" />
      </Tween>
    </Timeline>
  </Demo>
</template>
