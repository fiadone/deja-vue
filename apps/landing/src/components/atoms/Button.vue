<script setup lang="ts">
defineProps<{ outline?: boolean }>()
</script>

<template>
  <component
    :is="$attrs.is || 'button'"
    class="button inline-flex h-12 px-6 rounded-full overflow-hidden border border-secondary"
    :class="{
      'bg-secondary': !outline,
      'has-hover': !$touch
    }"
  >
    <span class="button-content flex flex-col w-full text-center">
      <span class="w-full label text-xl">
        <slot />
      </span>
      <span v-if="!$touch" class="w-full label text-xl">
        <slot />
      </span>
    </span>
  </component>
</template>

<style scoped>
@media (hover: hover) and (pointer: fine) {
  .button.has-hover > .button-content {
    transition: transform var(--transition-default);
  }

  .button.has-hover:hover > .button-content {
    transform: translate3d(0, -100%, 0);
  }
}

.label {
  line-height: calc(3rem - 0.125em - 2px);
}
</style>