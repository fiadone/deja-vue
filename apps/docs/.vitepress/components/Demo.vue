<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import type { TweenAction } from 'deja-vue'
import { ref, shallowRef, watch } from 'vue'

const props = defineProps<{ observeIntersection?: boolean }>()

const root = shallowRef<HTMLElement>()
const progress = ref(0)
const trigger = ref(false)
const triggerAction = ref<TweenAction>('play')

const { pause, resume } = useIntersectionObserver(root, ([entry]) => {
  trigger.value = !!entry?.isIntersecting
}, {
  immediate: props.observeIntersection,
  threshold: 0
})

watch(() => props.observeIntersection, enabled => enabled ? resume() : pause())

watch(trigger, value => {
  if (props.observeIntersection) {
    triggerAction.value = value ? 'reset' : 'play'
  } else {
    triggerAction.value = value ? 'reverse' : 'play'
  }
}, { flush: 'post' })
</script>

<template>
  <div
    ref="root"
    class="demo"
  >
    <div
      v-if="!observeIntersection"
      class="demo-controls"
    >
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
