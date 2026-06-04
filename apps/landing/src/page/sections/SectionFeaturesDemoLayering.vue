<script setup lang="ts">
import { Timeline, Tween } from 'deja-vue'

import ProgressBar from '@/components/atoms/ProgressBar.vue'
</script>

<template>
  <Timeline
    is="div"
    class="flex flex-col justify-between size-full"
    :options="{
      delay: 0.5,
      scrollTrigger: {
        start: 'top bottom',
        toggleActions: 'play none none reset'
      }
    }"
    v-slot="{ progress }"
  >
    <div class="grid grid-cols-2 w-full">
      <Timeline>
        <Tween
          :to="{
            xPercent: 100,
            yPercent: 0,
            rotation: 90,
            ease: 'power2.inOut'
          }"
        >
          <Tween
            is="div"
            seamless
            class="flex items-center justify-center aspect-square p-3 overflow-hidden"
            tween-target="self"
            :to="{
              xPercent: 100,
              yPercent: 100,
              rotation: 180,
              ease: 'power2.inOut'
            }"
          >
            <div class="w-full aspect-square bg-primary rounded-2" />
          </Tween>
        </Tween>
      </Timeline>
      <div class="border border-dashed border-white/10 rounded-2" />
      <div class="border border-dashed border-white/10 rounded-2" />
      <Timeline :position="0.25">
        <Tween
          :to="{
            xPercent: -100,
            yPercent: 0,
            rotation: 90,
            ease: 'power2.inOut'
          }"
        >
          <Tween
            is="div"
            seamless
            class="flex items-center justify-center aspect-square p-3 overflow-hidden"
            tween-target="self"
            :to="{
              xPercent: -100,
              yPercent: -100,
              rotation: 180,
              ease: 'power2.inOut'
            }"
          >
            <div class="w-full aspect-square bg-secondary rounded-3" />
          </Tween>
        </Tween>
      </Timeline>
    </div>

    <ProgressBar :progress />
  </Timeline>
</template>
