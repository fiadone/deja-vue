<template>
  <Demo observe-intersection v-slot="scope">
    <Timeline
      :trigger="scope.trigger"
      :trigger-action="scope.triggerAction"
    >
      <Tween :to="{ x: 56 }">
        <div class="demo-box" />
      </Tween>
      <Timeline>
        <Tween :to="{ y: 56 }">
          <div class="demo-box" />
        </Tween>
        <Tween
          position="<"
          :to="{ rotation: 90 }"
        >
          <div class="demo-box" />
        </Tween>
      </Timeline>
    </Timeline>
  </Demo>
</template>
