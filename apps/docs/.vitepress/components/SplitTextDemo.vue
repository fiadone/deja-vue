<script setup lang="ts">
//
</script>

<template>
  <Demo v-slot="scope">
    <Timeline v-model:trigger="scope.trigger">
      <Tween method="from" :vars="{ y: 24, opacity: 0, stagger: 0.04 }">
        <SplitText type="chars" :reduce-white-space="true">
          <p class="demo-split">
            Split text target
          </p>
        </SplitText>
      </Tween>
    </Timeline>
  </Demo>
</template>
