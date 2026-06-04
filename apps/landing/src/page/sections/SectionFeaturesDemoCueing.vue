<script setup lang="ts">
import { Marker, Timeline, Tween } from 'deja-vue'

import ProgressBar from '@/components/atoms/ProgressBar.vue'

const tweenTarget = { value: 0 }
const cues = [
  { label: 'Start', position: 0 },
  { label: 'Center', position: 0.5 },
  { label: 'End', position: 1 }
]
</script>

<template>
  <Timeline
    is="div"
    class="flex flex-col justify-between relative size-full"
    :options="{
      delay: 0.5,
      scrollTrigger: {
        start: 'top bottom',
        toggleActions: 'play none none reset'
      }
    }"
    v-slot="{ progress }"
  >
    <Tween
      :position="0"
      :to="{ value: 1, duration: 1, ease: 'none' }"
      :tween-target
    />

    <div class="flex flex-col items-center gap-2">
      <Marker
        v-for="cue, index in cues"
        :key="cue.label"
        :position="cue.position"
        v-slot="{ crossed }"
      >
        <div v-if="index > 0" class="w-1px h-4 bg-current/50 lt-lg:hidden" />
        <div
          class="flex items-center justify-between w-full px-2 py-1 md:py-2 rounded-2 border border-current transition-all"
          :class="{
            'c-primary bg-current': crossed,
            'c-secondary': !crossed
          }"
        >
          <span
            class="label transition-color"
            :class="{
              'c-foreground': crossed,
              'c-white/50': !crossed
            }"
          >
            {{ cue.label }}
          </span>
          <svg
            class="size-6 transition-all"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            :class="{
              'fill-foreground stroke-foreground': crossed,
              'fill-none stroke-white/50': !crossed
            }"
          >
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
            <Transition>
              <path v-if="crossed" class="stroke-primary" d="M9 12l2 2l4 -4" />
            </Transition>>
          </svg>
        </div>
      </Marker>
    </div>
    
    <div>
      <div class="flex justify-between px-1 py-2">
        <span class="w-1px h-1 bg-white/50" />
        <span class="w-1px h-1 bg-white/50" />
        <span class="w-1px h-1 bg-white/50" />
      </div>
      <ProgressBar :progress />
    </div>
  </Timeline>
</template>
