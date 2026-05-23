<template>
  <Demo v-slot="scope">
    <Timeline
      :trigger="scope.trigger"
      :trigger-action="scope.triggerAction"
    >
      <Tween :to="{ x: 100 }">
        <div class="demo-box" />
      </Tween>
      <Timeline position="<">
        <Tween :to="{ y: 56 }">
          <div class="demo-box" />
        </Tween>
        <Tween position="<" :to="{ rotation: 90 }">
          <div class="demo-box" />
        </Tween>
      </Timeline>
    </Timeline>
  </Demo>
</template>
