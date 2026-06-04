<script setup lang="ts">
import PageLayout from '@/components/organisms/PageLayout.vue'

import SectionClaim from './sections/SectionClaim.vue'
import SectionFeatures from './sections/SectionFeatures.vue'
import SectionHero from './sections/SectionHero.vue'
import SectionQuickstart from './sections/SectionQuickstart.vue'
</script>

<template>
  <PageLayout>
    <SectionHero />
    <SectionClaim />
    <SectionFeatures />
    <SectionQuickstart />
  </PageLayout>
</template>