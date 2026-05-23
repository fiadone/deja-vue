<script setup lang="ts">
import { ref, watch } from 'vue'

const progress = ref(0)
const trigger = ref(false)
const triggerAction = ref('play')

watch(trigger, value => {
  triggerAction.value = value ? 'reverse' : 'play'
}, { flush: 'post' })
</script>

<template>
  <div class="demo">
    <div class="demo-controls">
      <slot
        name="controls"
        :progress
        :set-progress="(value: number) => progress = value"
        :trigger
        :trigger-action
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
        :trigger
        :trigger-action
      />
    </div>
  </div>
</template>
