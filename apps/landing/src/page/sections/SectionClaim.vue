<script setup lang="ts">
import { SplitText, Timeline, Tween } from 'deja-vue'
</script>

<template>
  <section id="claim" class="flex justify-center py-25vh bg-background">
    <Timeline
      is="div"
      class="flex flex-col gap-6"
      :options="{
        scrollTrigger: {
          start: 'center bottom',
          end: 'bottom bottom',
          endTrigger: '#claim',
          scrub: 1
        }
      }"
    >
      <Tween
        :from="{
          opacity: 0.1,
          duration: 2,
          stagger: { amount: 4 }
        }"
      >
        <SplitText
          is="p"
          class="landscape:text-12.5vh portrait:text-12.5vw text-center"
          type="lines,chars"
        >
          Declarative
          <a
            class="c-secondary"
            href="https://gsap.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            GSAP
          </a>
          <br>
          animations for 
          <a
            class="c-primary"
            href="https://vuejs.org/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Vue
          </a>
        </SplitText>
      </Tween>
  
      <Tween
        is="hr"
        class="flex-auto h-1px border-none bg-current/25"
        tween-target="self"
        :from="{
          scaleX: 0,
          duration: 6
        }"
      />
  
      <Tween
        position="<"
        :from="{
          opacity: 0.1,
          duration: 2,
          stagger: { amount: 4 }
        }"
      >
        <SplitText
          is="p"
          class="mt-3 landscape:text-7.5vh portrait:text-7.5vw text-center"
          type="lines,chars"
        >
          Compose tweens and timelines<br>
          with ease using just components
        </SplitText>
      </Tween>
    </Timeline>
  </section>
</template>
