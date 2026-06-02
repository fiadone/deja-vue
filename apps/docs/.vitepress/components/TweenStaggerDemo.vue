<template>
  <Demo observe-intersection v-slot="scope">
    <Tween
      :from="{ opacity: 0, y: 56, stagger: 0.1 }"
      :trigger="scope.trigger"
      :trigger-action="scope.triggerAction"
    >
      <div
        v-for="n in 3"
        :key="n"
        class="demo-box"
      />
    </Tween>
  </Demo>
</template>
