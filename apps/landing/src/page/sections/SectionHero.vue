<script setup lang="ts">
import { SplitText, Tween } from 'deja-vue'
</script>

<template>
  <section id="hero" class="flex flex-col items-center justify-center relative overflow-hidden bg-foreground">
    <Tween
      :from="{
        autoAlpha: 0,
        yPercent: 50,
        stagger: 0.1
      }"
    >
      <SplitText
        is="h1"
        class="pt-0.125em landscape:text-35vh landscape:md:text-40vh portrait:text-30vw relative leading-none select-none"
        type="chars"
      >
        <Tween
          :to="{
            autoAlpha: 0,
            yPercent: -50,
            stagger: {
              amount: 1,
              from: 'center',
              axis: 'x',
              ease: 'none'
            },
            scrollTrigger: {
              trigger: '#hero',
              start: 'top top',
              end: 'bottom 62.5%',
              scrub: 1
            }
          }"
        >
          <span class="c-secondary">D</span>
          <span>é</span>
          <span>j</span>
          <span>à</span>
          <span>&nbsp;</span>
          <span class="c-primary">V</span>
          <span>u</span>
          <span>e</span>
        </Tween>
      </SplitText>
    </Tween>
    <div class="flex justify-center w-full absolute bottom-10 left-0">
      <Tween :from="{ scale: 0 }">
        <Tween
          is="div"
          seamless
          class="flex justify-center w-6 h-10 p-2 border border-white rounded-4"
          tween-target="self"
          :to="{
            opacity: 0,
            scrollTrigger: {
              trigger: '#hero',
              start: 'bottom bottom',
              end: 'bottom 25%',
              scrub: 1
            }
          }"
        >
          <Tween :from="{ scale: 0 }">
            <Tween
              is="div"
              seamless
              class="size-1 bg-white rounded-1/2"
              tween-target="self"
              :to="{
                yPercent: 500,
                duration: 2,
                delay: 0.5,
                ease: 'power2.inOut',
                repeat: -1,
                yoyo: true
              }"
            />
          </Tween>
        </Tween>
      </Tween>
    </div>
  </section>
</template>

<style scoped>
section {
  height: 100vh;
  height: 100svh;
}
</style>