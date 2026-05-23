<template>
  <Demo v-slot="scope">
    <Tween
      is="div"
      class="demo-boxes"
      :from="{ opacity: 0, stagger: 0.1 }"
      :trigger="scope.trigger"
      :trigger-action="scope.triggerAction"
    >
      <div v-for="n in 5" :key="n" class="demo-box" />
    </Tween>
  </Demo>
</template>
