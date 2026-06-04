<script setup lang="ts">
import { ref } from 'vue'

import CodeIcon from '@/assets/icons/code.svg'
import ModalDialog from '@/components/molecules/ModalDialog.vue'

const currentYear = new Date().getFullYear()
const showCredits = ref(false)
</script>

<template>
  <footer class="flex items-center justify-center lg:justify-between gap-4 p-4 bg-background">
    <div class="flex items-center gap-4">
      <p class="label flex items-center gap-2 opacity-50">
        <span>©</span><span>{{ currentYear }}</span>
      </p>
    
      <nav class="flex items-center gap-4">
        <div class="w-1px h-4 bg-current/25" />
        <div class="relative">
          <button
            class="label hover:opacity-100 opacity-50 transition-opacity"
            type="button"
            @click="showCredits = !showCredits"
          >
            Credits
          </button>
        </div>
      </nav>
    </div>

    <a
      class="inline-flex items-center gap-2 hover:opacity-100 opacity-50 transition-opacity"
      href="https://github.com/fiadone/deja-vue/apps/landing/src/page/index.vue"
      rel="noopener noreferrer"
      target="_blank"
    >
      <CodeIcon class="size-4 lt-lg:hidden" /><span class="label whitespace-nowrap">Source code</span>
    </a>

    <ModalDialog v-model:visible="showCredits">
      <p class="label flex-shrink-0 text-3xl text-center">
        Special thanks to:
      </p>
      <div class="flex flex-auto items-center justify-center mt-8 text-center">
        <ul class="flex flex-col gap-4">
          <li class="label text-xl">
            <a
              class="c-secondary"
              href="https://github.com/lavolpecheprogramma"
              rel="noopener noreferrer"
              target="_blank"
            >
              @lavolpecheprogramma
            </a>
            for discussing and sharing ideas
          </li>
          <li class="label text-xl">
            <a
              class="c-secondary"
              href="https://www.studiogusto.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              @studiogusto
            </a>
            for strongly inspiring this landing page
          </li>
        </ul>
      </div>
    </ModalDialog>
  </footer>
</template>
