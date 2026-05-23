<template>
  <Demo v-slot="scope">
    <Timeline
      :trigger="scope.trigger"
      :trigger-action="scope.triggerAction"
    >
      <Tween :from="{ opacity: 0, stagger: 0.1 }">
        <Tween seamless :to="{ rotate: 90, stagger: 0.1 }">
          <Tween seamless :to="{ x: 100, stagger: 0.1 }">
            <div v-for="n in 3" :key="n" class="demo-box" />
          </Tween>
        </Tween>
      </Tween>
    </Timeline>
  </Demo>
</template>
