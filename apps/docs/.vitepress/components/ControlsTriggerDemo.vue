<template>
  <Demo v-slot="scope">
    <Tween
      :from="{ opacity: 0 }"
      :trigger="scope.trigger"
      :trigger-action="scope.triggerAction"
    >
      <div class="demo-box" />
    </Tween>
  </Demo>
</template>
