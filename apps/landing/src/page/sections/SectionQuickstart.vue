<script setup lang="ts">
import { Timeline, Tween } from 'deja-vue'

import Button from '@/components/atoms/Button.vue'
import CommandBox from '@/components/molecules/CommandBox.vue'
</script>

<template>
  <section id="quickstart" class="flex flex-col gap-25vh py-25vh bg-background">
    <Timeline
      is="h2"
      class="flex flex-col justify-end relative overflow-hidden landscape:text-35vh landscape:md:text-40vh portrait:text-30vw"
      :options="{
        scrollTrigger: {
          start: 'top bottom',
          end: 'bottom bottom',
          endTrigger: '.page',
          scrub: 1
        }
      }"
    >
      <Tween
        is="span"
        class="flex justify-start w-full"
        :from="{ x: '-50vw' }"
      >
        <span class="pl-25vw whitespace-nowrap">
          Start composing
        </span>
      </Tween>
      <Tween
        is="span"
        class="flex justify-end w-full"
        position="<"
        :from="{ x: '50vw' }"
      >
        <span class="pr-25vw whitespace-nowrap">
          your animations!
        </span>
      </Tween>
    </Timeline>
    <Tween
      is="div"
      class="flex flex-col justify-center gap-8 w-full max-w-140 px-8 mx-auto relative"
      tween-target="code,li"
      :from="{
        autoAlpha: 0,
        y: 48,
        stagger: 0.1,
        scrollTrigger: {
          start: 'top 75%',
          end: 'bottom bottom',
          endTrigger: '.page',
          once: true
        }
      }"
    >
      <CommandBox command="npm i deja-vue" />
      <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <li>
          <Button
            is="a"
            class="w-full"
            href="https://fiadone.github.io/deja-vue/docs"
            rel="noopener noreferrer"
            target="_blank"
          >
            Read documentation
          </Button>
        </li>
        <li>
          <Button
            is="a"
            outline
            class="w-full"
            href="https://fiadone.github.io/deja-vue/docs"
            rel="noopener noreferrer"
            target="_blank"
          >
            View on GitHub
          </Button>
        </li>
      </ul>
    </Tween>
  </section>
</template>
