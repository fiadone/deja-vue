<script setup lang="ts">
import CodeIcon from '@/assets/icons/code.svg'
import ContentCard from '@/components/molecules/ContentCard.vue'

defineProps<{
  title: string
  source?: string
  subtitle: string
}>()
</script>

<template>
  <ContentCard :subtitle :title>
    <div class="flex flex-auto items-center justify-center w-full p-6">
      <div class="w-2/3 aspect-4/5">
        <slot />
      </div>
    </div>
    <a
      v-if="source"
      class="button-icon absolute top-8 right-8 will-change-transform"
      rel="noopener noreferrer"
      target="_blank"
      :href="source"
    >
      <CodeIcon />
    </a>
  </ContentCard>
</template>
