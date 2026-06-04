<script setup lang="ts">
import DemoCard from '@/components/organisms/DemoCard.vue'

import DemoBinding from './SectionFeaturesDemoBinding.vue'
import DemoCueing from './SectionFeaturesDemoCueing.vue'
import DemoLayering from './SectionFeaturesDemoLayering.vue'
import DemoTweening from './SectionFeaturesDemoTweening.vue'
</script>

<template>
  <section id="features" class="grid portrait:lt-md:grid-cols-1 grid-cols-2 lg:grid-cols-3 gap-12 p-12 bg-foreground">
    <div class="lt-md:hidden" />
    <DemoCard
      class="c-white"
      source="https://github.com/fiadone/deja-vue/apps/landing/src/page/sections/SectionFeaturesDemoTweening.vue"
      subtitle="Wrap elements, props drive motion"
      title="Animate in markup"
    >
      <DemoTweening />
    </DemoCard>
    <DemoCard
      class="c-primary"
      source="https://github.com/fiadone/deja-vue/apps/landing/src/page/sections/SectionFeaturesDemoLayering.vue"
      subtitle="Timelines from nested components"
      title="Nest & sequence"
    >
      <DemoLayering />
    </DemoCard>
    <DemoCard
      class="c-secondary"
      source="https://github.com/fiadone/deja-vue/apps/landing/src/page/sections/SectionFeaturesDemoBinding.vue"
      subtitle="Scrub and trigger from state"
      title="Bind playback"
    >
      <DemoBinding />
    </DemoCard>
    <div class="lt-lg:hidden" />
    <DemoCard
      class="c-white"
      source="https://github.com/fiadone/deja-vue/apps/landing/src/page/sections/SectionFeaturesDemoCueing.vue"
      subtitle="Labels and checkpoints on timelines"
      title="Mark the beat"
    >
      <DemoCueing />
    </DemoCard>
  </section>
</template>
