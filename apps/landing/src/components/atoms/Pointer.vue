<script setup lang="ts">
import { useEventListener, useMouse } from '@vueuse/core'
import { gsap } from 'gsap'
import { ref, useTemplateRef, watch } from 'vue'

const { x, y } = useMouse({ touch: false, type: 'client' })
const pointer = useTemplateRef<HTMLElement>('pointer')
const visible = ref(false)
const hovering = ref<HTMLElement | null>()

watch([x, y], coords => {
  if (!pointer.value) return
  if (visible.value) {
    gsap.to(pointer.value, {
      duration: 0.3,
      ease: 'power3.out',
      x: coords[0],
      y: coords[1]
    })
  } else {
    gsap.set(pointer.value, {
      x: coords[0],
      y: coords[1],
      onComplete: () => {
        visible.value = true
        gsap.to(pointer.value, { scale: 1 })
      }
    })
  }
})

watch(hovering, el => {
  if (!visible.value) return
  gsap.to(pointer.value, {
    ease: 'power3.out',
    scale: el ? ('hidePointer' in el.dataset ? 0 : 4) : 1
  })
})

useEventListener(document, 'mouseleave', () => {
  if (!visible.value) return
  gsap.to(pointer.value, {
    scale: 0,
    onComplete: () => (visible.value = false)
  })
})

useEventListener(document, 'mousemove', (e: MouseEvent) => {
  if (!visible.value) return
  hovering.value = (e.target as Element)?.closest('a, button')
})
</script>

<template>
  <div
    ref="pointer"
    class="size-6 fixed top-0 left-0 -translate-1/2 rounded-1/2 bg-primary mix-blend-difference scale-0 pointer-events-none"
  />
</template>