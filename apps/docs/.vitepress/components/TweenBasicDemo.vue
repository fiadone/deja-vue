<template>
  <Demo v-slot="scope">
    <Tween
      :to="{ x: 100 }"
      :trigger="scope.trigger"
      :trigger-action="scope.triggerAction"
    >
      <div class="demo-box" />
    </Tween>
  </Demo>
</template>
