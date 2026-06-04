<script setup lang="ts">
import { Tween } from 'deja-vue'

defineProps<{
  title: string
  subtitle: string
}>()
</script>

<template>
  <article class="relative">
    <div class="card w-full aspect-4/5 p-4 relative rounded-3 bg-current">
      <Tween
        is="div"
        class="card-content flex items-center justify-center size-full rounded-2 bg-foreground c-white"
        tween-target="self"
        :from="{ clipPath: 'inset(50% 50% 50% 50% round 0.5rem)' }"
        :to="{
          clipPath: 'inset(0% 0% 0% 0% round 0.5rem)',
          clearProps: 'clipPath',
          duration: 0.75,
          scrollTrigger: {
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: 1,
            once: true
          }
        }"
      >
        <slot />
      </Tween>
    </div>
    
    <Tween
      is="div"
      class="py-8"
      tween-target=".label"
      :from="{
        autoAlpha: 0,
        yPercent: 100,
        stagger: 0.25,
        scrollTrigger: {
          start: 'top bottom',
          end: 'bottom+=100% bottom',
          once: true
        }
      }"
    >
      <div class="overflow-hidden">
        <h4 class="label text-3xl">
          {{ title }}
        </h4>
      </div>
      <div class="overflow-hidden">
        <p class="label text-xl c-white">
          {{ subtitle }}
        </p>
      </div>
    </Tween>
  </article>
</template>