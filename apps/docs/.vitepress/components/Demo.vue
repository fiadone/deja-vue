<script setup lang="ts">
import { ref } from 'vue'

const progress = ref(0)
const trigger = ref(false)

function setProgress (value: number) {
  progress.value = value
}

function setTriggerState (value: boolean) {
  trigger.value = value
}
</script>

<template>
  <div class="demo">
    <div class="demo-controls">
      <slot
        name="controls"
        :progress
        :set-progress
        :set-trigger-state
        :trigger
      >
        <button
          class="demo-button"
          type="button"
          @click="trigger = !trigger"
        >
          {{ trigger ? 'Reverse' : 'Play' }}
        </button>
      </slot>
    </div>
    <div class="demo-content">
      <slot
        :progress
        :set-progress
        :set-trigger-state
        :trigger
      />
    </div>
  </div>
</template>
