<template>
  <Demo v-slot="scope">
    <Tween
      :to="{ x: 100 }"
      :trigger="scope.trigger"
      :trigger-action="scope.triggerAction"
      v-slot="{ progress }"
    >
      <div class="demo-box">
        <span class="demo-label">
          {{ ~~(progress * 100) }}%
        </span>
      </div>
    </Tween>
  </Demo>
</template>
