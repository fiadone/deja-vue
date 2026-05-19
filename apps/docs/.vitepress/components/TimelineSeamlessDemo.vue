<script setup lang="ts">
//
</script>

<template>
  <Demo v-slot="scope">
    <Timeline v-model:trigger="scope.trigger">
      <Tween method="from" :vars="{ scale: 0, stagger: 0.1 }">
        <Tween
          seamless
          method="to"
          :vars="{ rotate: 360, stagger: 0.1 }"
        >
          <Tween
            seamless
            method="to"
            :vars="{ x: 100, stagger: 0.1 }"
          >
            <div
              v-for="n in 3"
              :key="n"
              class="demo-box"
            >
              {{ n }}
            </div>
          </Tween>
        </Tween>
      </Tween>
    </Timeline>
  </Demo>
</template>
