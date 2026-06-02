<template>
  <Demo observe-intersection v-slot="scope">
    <Timeline
      :trigger="scope.trigger"
      :trigger-action="scope.triggerAction"
    >
      <Tween
        :from="{
          y: 56,
          opacity: 0,
          duration: 0.8,
          stagger: 0.04,
          ease: 'power2.out'
        }"
      >
        <SplitText type="chars">
          <p class="demo-split">
            Split text
          </p>
        </SplitText>
      </Tween>
    </Timeline>
  </Demo>
</template>
