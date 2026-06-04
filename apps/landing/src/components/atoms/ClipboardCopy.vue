<script setup lang="ts">
import { autoResetRef } from '@vueuse/core'

const props = defineProps<{ content: string }>()

const copied = autoResetRef(false, 2000)

function copy () {
  if (copied.value) return
  navigator.clipboard
    .writeText(props.content)
    .then(() => (copied.value = true))
    .catch()
}
</script>

<template>
  <button
    data-hide-pointer
    class="button-icon"
    type="button"
    :class="{
      'c-primary !opacity-100': copied,
      '!border-current/10 c-current': !copied
    }"
    :disabled="copied"
    @click="copy"
  >
    <svg
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
      <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
      <Transition>
        <path v-if="copied" d="M9 14l2 2l4 -4" />
      </Transition>
    </svg>
  </button>
</template>

<style scoped>
@media (hover: hover) and (pointer: fine) {
  button {
    opacity: 0.5;
    transition:
      border-color var(--transition-default),
      color var(--transition-default),
      opacity var(--transition-default);
  }

  button:hover {
    opacity: 1;
  }
}
</style>