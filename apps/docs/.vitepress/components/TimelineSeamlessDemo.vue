<template>
  <Demo observe-intersection v-slot="scope">
    <Timeline
      :trigger="scope.trigger"
      :trigger-action="scope.triggerAction"
    >
      <Tween :from="{ scale: 0, stagger: 0.1 }">
        <Tween
          seamless
          :to="{ rotate: 180, stagger: 0.1 }"
        >
          <Tween
            seamless
            :to="{ x: 56, stagger: 0.1 }"
          >
            <div
              v-for="n in 3"
              :key="n"
              class="demo-box"
            />
          </Tween>
        </Tween>
      </Tween>
    </Timeline>
  </Demo>
</template>
