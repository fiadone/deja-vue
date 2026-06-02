<template>
  <Demo v-slot="scope">
    <Tween
      :to="{ x: 56 }"
      :trigger="scope.trigger"
      :trigger-action="scope.triggerAction"
    >
      <div class="demo-box" />
    </Tween>
  </Demo>
</template>
