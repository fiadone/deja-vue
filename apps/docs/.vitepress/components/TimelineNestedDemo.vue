<script setup lang="ts">
//
</script>

<template>
  <Demo v-slot="scope">
    <Timeline v-model:trigger="scope.trigger">
      <Tween method="to" :vars="{ x: 72 }">
        <div class="demo-box">
          Box
        </div>
      </Tween>
      <Timeline>
        <Tween method="to" :vars="{ y: 36 }">
          <div class="demo-box">
            Box
          </div>
        </Tween>
        <Tween
          method="to"
          position="<"
          :vars="{ rotation: 90 }"
        >
          <div class="demo-box">
            Box
          </div>
        </Tween>
      </Timeline>
    </Timeline>
  </Demo>
</template>
