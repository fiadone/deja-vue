# Animation Controls

Deja Vue provides reactive props to control your animations dynamically.

## Progress Control

Use the `progress` prop to scrub through an animation:

```vue
<template>
  <div>
    <input v-model.number="progress" type="range" min="0" max="1" step="0.01">
    <Tween method="to" :vars="{ x: 200, duration: 2 }" :progress="progress">
      <div>Controlled Animation</div>
    </Tween>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Tween } from 'deja-vue'

const progress = ref(0)
</script>
```

## Toggle Control

Use the `toggle` prop to play/reverse animations:

```vue
<template>
  <div>
    <button @click="playing = !playing">
      {{ playing ? 'Pause' : 'Play' }}
    </button>
    <Tween method="to" :vars="{ rotation: 360, duration: 3, repeat: -1 }" :toggle="playing">
      <div>Spinning Element</div>
    </Tween>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Tween } from 'deja-vue'

const playing = ref(false)
</script>
```

## Combining Controls

You can use both progress and toggle together:

```vue
<template>
  <div>
    <button @click="playing = !playing">Toggle</button>
    <input v-model.number="progress" type="range" min="0" max="1" step="0.01">
    <Timeline :tweens="tweens" :progress="progress" :toggle="playing">
      <div>Complex Animation</div>
    </Timeline>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Timeline } from 'deja-vue'

const playing = ref(false)
const progress = ref(0)
const tweens = [
  { method: 'to', vars: { x: 100, duration: 1 } },
  { method: 'to', vars: { y: 100, duration: 1 } }
]
</script>
```

## Reactive Updates

Controls are reactive, so you can bind them to computed properties or watch for changes:

```vue
<template>
  <Tween method="to" :vars="{ x: targetX, duration: 1 }" :progress="animationProgress">
    <div>Moving Element</div>
  </Tween>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Tween } from 'deja-vue'

const position = ref(0)
const targetX = computed(() => position.value * 200)
const animationProgress = computed(() => position.value)
</script>
```

## Programmatic Control

You can also access the animation instance for more advanced control:

```vue
<template>
  <Tween ref="tweenRef" method="to" :vars="{ x: 100, duration: 1 }">
    <div>Programmatic Control</div>
  </Tween>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Tween } from 'deja-vue'

const tweenRef = ref()

onMounted(() => {
  // Access the GSAP timeline directly
  tweenRef.value.animation.timeline.play()
})
</script>
```