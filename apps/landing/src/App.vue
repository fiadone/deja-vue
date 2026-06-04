<script setup lang="ts">
import { gsap } from 'gsap'
import { ref } from 'vue'

import Pointer from '@/components/atoms/Pointer.vue'
import PreloadLayer from '@/components/molecules/PreloadLayer.vue'
import RevealLayer from '@/components/molecules/RevealLayer.vue'
import Page from '@/page/index.vue'
import lenis from '@/utils/lenis'
import type { PreloadableAsset } from '@/utils/preload'

gsap.defaults({ ease: 'power2.out' })

const ready = ref(false)
const revealed = ref(false)

const manifest: PreloadableAsset[] = [
  {
    family: 'Bebas Neue',
    options: { display: 'block' },
    source: new URL('@/assets/fonts/BebasNeue-Regular.woff2', import.meta.url).href,
    type: 'font'
  }
]
</script>

<template>
  <Page v-if="ready" />

  <Teleport to="body">
    <Pointer
      v-if="!$touch"
      class="z-999"
    />
    <PreloadLayer
      v-if="!ready"
      class="z-998"
      :manifest
      @ready="ready = true"
    />
    <RevealLayer
      v-else-if="!revealed"
      class="z-997"
      @reveal-complete="revealed = true"
      @reveal-start="lenis.resize()"
    />
  </Teleport>
</template>
