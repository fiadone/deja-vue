<script setup lang="ts">
import { useMagicKeys } from '@vueuse/core'
import { Timeline, Tween } from 'deja-vue'
import { watch } from 'vue'

import CloseIcon from '@/assets/icons/close.svg'
import lenis from '@/utils/lenis'

const visible = defineModel<boolean>('visible')
const { escape } = useMagicKeys()

if (visible.value) lenis.stop()

watch(escape, () => (visible.value = false))
watch(visible, value => value ? lenis.stop() : lenis.start())
</script>

<template>
  <Teleport to="body">
    <div
      class="flex items-center justify-center fixed inset-0 z-996 p-8"
      :class="{ 'pointer-events-none': !visible }"
    >
      <Timeline
        :trigger="visible"
        :trigger-action="visible ? 'play' : 'reverse'"
      >
        <Tween 
          is="div"
          class="absolute inset-0 z-0 bg-background/75"
          tween-target="self"
          :from="{
            autoAlpha: 0,
            backdropFilter: 'blur(0px)'
          }"
          :to="{
            autoAlpha: 1,
            backdropFilter: 'blur(8px)'
          }"
          @click.self="visible = false"
        />
        <Tween
          is="div"
          class="flex flex-col items-end gap-4 w-full max-w-140"
          position="<"
          tween-target="self"
          :from="{
            autoAlpha: 0,
            yPercent: 25,
            ease: 'power2.inOut'
          }"
        >
          <Tween
            position="<"
            :from="{
              scale: 0.4,
              transformOrigin: 'right bottom'
            }"
          >
            <button
              class="flex items-center justify-center size-10 bg-primary c-foreground"
              @click="visible = false"
            >
              <CloseIcon class="size-6" />
            </button>
          </Tween>
          
          <div class="px-8 py-12 mb-14 bg-foreground border-16 border-primary">
            <slot />
          </div>
        </Tween>
      </Timeline>
    </div>
  </Teleport>
</template>
