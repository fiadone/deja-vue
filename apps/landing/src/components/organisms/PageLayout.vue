<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { computed } from 'vue'

import Footer from '@/components/organisms/PageFooter.vue'
import Header from '@/components/organisms/PageHeader.vue'
import { scrollY } from '@/utils/lenis'

const { height } = useWindowSize()
const solidHeader = computed(() => scrollY.value > height.value)
</script>

<template>
  <div class="page">
    <Header :solid="solidHeader" />
    <main>
      <slot />
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  min-height: 100svh;
}
</style>