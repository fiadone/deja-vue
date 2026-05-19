<script setup lang="ts">
//
</script>

<template>
  <Demo v-slot="scope">
    <Timeline v-model:trigger="scope.trigger">
      <Tween method="to" :vars="{ x: 100 }">
        <div class="demo-target">
          First target
        </div>
      </Tween>
      <Tween method="to" :vars="{ y: 48 }">
        <div class="demo-target">
          Second target
        </div>
      </Tween>
    </Timeline>
  </Demo>
</template>
