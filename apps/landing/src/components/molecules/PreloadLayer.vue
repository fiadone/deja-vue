<script setup lang="ts">
import { Tween } from 'deja-vue'
import { computed, ref } from 'vue'

import { type PreloadableAsset, preloadManifest } from '@/utils/preload'

const props = defineProps<{ manifest: PreloadableAsset[] }>()

defineEmits(['ready'])

const loaded = ref(false)
const revealed = ref(false)
const ready = computed(() => loaded.value && revealed.value)

preloadManifest(props.manifest).then(() => (loaded.value = true))
</script>

<template>
  <div class="flex items-center justify-center fixed inset-0 bg-background">
    <div class="landscape:size-25vh portrait:size-25vw bg-background rounded-1/2">
      <Tween
        :to="{
          '--angle': '360deg',
          duration: 2,
          ease: 'power2.inOut'
        }"
        @complete="revealed = true"
      >
        <Tween
          seamless
          :to="{
            scale: 0,
            ease: 'power2.in'
          }"
          :trigger="ready"
          @complete="$emit('ready')"
        >
          <div class="dot size-full rounded-1/2" />
        </Tween>
      </Tween>
    </div>
  </div>
</template>

<style scoped>
.dot {
  --angle: 0deg;

  background: conic-gradient(#ffffff, #ffffff var(--angle), transparent calc(var(--angle) + 0.1deg));
}
</style>