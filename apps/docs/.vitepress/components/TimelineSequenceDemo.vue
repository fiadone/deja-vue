<template>
  <Demo v-slot="scope">
    <Timeline
      :trigger="scope.trigger"
      :trigger-action="scope.triggerAction"
    >
      <Tween :to="{ x: 100 }">
        <div class="demo-box" />
      </Tween>
      <Tween :to="{ x: 100 }">
        <div class="demo-box" />
      </Tween>
    </Timeline>
  </Demo>
</template>
