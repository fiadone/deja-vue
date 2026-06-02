<template>
  <Demo observe-intersection v-slot="scope">
    <Timeline
      :trigger="scope.trigger"
      :trigger-action="scope.triggerAction"
    >
      <Tween :to="{ x: 56 }">
        <div class="demo-box" />
      </Tween>
      <Tween :to="{ y: -56, rotate: 90 }">
        <div class="demo-box" />
      </Tween>
    </Timeline>
  </Demo>
</template>
