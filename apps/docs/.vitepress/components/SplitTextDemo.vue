<template>
  <Demo v-slot="scope">
    <Timeline
      :trigger="scope.trigger"
      :trigger-action="scope.triggerAction"
    >
      <Tween :from="{ opacity: 0, y: 10, stagger: 0.05 }">
        <SplitText type="chars">
          <p class="demo-split">
            Lorem ipsum
          </p>
        </SplitText>
      </Tween>
    </Timeline>
  </Demo>
</template>
