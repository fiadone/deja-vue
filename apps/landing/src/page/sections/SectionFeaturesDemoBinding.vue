<script setup lang="ts">
import { Tween } from 'deja-vue'
import { ref } from 'vue'

import IconFinger from '@/assets/icons/finger.svg'
import InputRange from '@/components/atoms/InputRange.vue'

const progress = ref(0)
const trigger = ref(false)
</script>

<template>
  <div class="flex flex-col justify-between gap-6 size-full">
    <div class="flex flex-auto items-center justify-center">
      <Tween
        is="button"
        v-model:progress="progress"
        class="flex items-center justify-center w-2/3 aspect-square rounded-2 bg-primary origin-center"
        tween-target="self"
        type="button"
        :to="{
          scale: 1.15,
          rotation: 360,
          borderRadius: '50%',
          ease: 'none'
        }"
        :trigger
        :trigger-action="trigger ? 'play' : 'reverse'"
        @click="trigger = !trigger"
      >
        <span class="flex flex-col items-center gap-2 c-background">
          <IconFinger class="size-6" />
          <span>Trigger</span>
        </span>
      </Tween>
    </div>

    <div class="flex flex-shrink-0 flex-col gap-3">
      <div class="flex items-center justify-between">
        <span class="c-white/50 tracking-wide">Scrub</span>
        <span class="c-secondary tracking-wide">{{ ~~(progress * 100) }}%</span>
      </div>
      <InputRange
        v-model.number="progress"
        class="flex-auto c-primary"
        max="1"
        min="0"
        step="0.01"
      />
    </div>
  </div>
</template>
