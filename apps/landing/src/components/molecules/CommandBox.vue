<script setup lang="ts">
import { ref } from 'vue'

import ClipboardCopy from '@/components/atoms/ClipboardCopy.vue'

defineProps<{ command: string }>()

const hovering = ref(false)
</script>

<template>
  <code
    class="flex items-center justify-between rounded-xl bg-foreground border border-current/10 text-lg md:text-xl"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <span class="p-6 md:p-8">{{ command }}</span>
    <div class="p-4 md:px-6">
      <Transition>
        <div v-if="$touch || hovering">
          <ClipboardCopy :content="command" />
        </div>
      </Transition>
    </div>
  </code>
</template>
