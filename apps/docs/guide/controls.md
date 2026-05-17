# Animation Controls

> [!TIP]
> See **[Core concepts](./concepts.md)** for **`direction`** and when to scrub vs rebuild tweens.

`Tween` and `Timeline` support **`v-model:progress`** and **`v-model:trigger`**, wired by [`useAnimationControls`](../api/composables.md#useanimationcontrols).

## Progress

Scrub between **0** and **1**. While scrubbing, **`direction`** becomes **`1`** or **`-1`** depending on whether progress increased or decreased (useful for **`Marker`** **`@cross`** logic).

```vue
<template>
  <input
    v-model.number="progress"
    type="range"
    min="0"
    max="1"
    step="0.01"
  >
  <Tween
    v-model:progress="progress"
    method="to"
    :vars="{ x: 200, duration: 2 }"
  >
    <div class="target">Target</div>
  </Tween>
</template>

<script setup>
import { ref } from 'vue'
import { Tween } from 'deja-vue'

const progress = ref(0.5)
</script>
```

## Trigger

Default: **`true`** → **`play`**, **`false`** → **`reverse`**.

Override with **`triggerActions`**:

| `triggerActions` | `trigger === true` | `trigger === false` |
|----------------|-------------------|---------------------|
| (default) | `play` | `reverse` |
| `['play', 'restart']` | `play` | `restart` |
| `'pause'` | `pause` | `pause` |

A single action string applies to both **`true`** and **`false`**.

```vue
<template>
  <button @click="isPlaying = !isPlaying">
    {{ isPlaying ? 'Reverse' : 'Play' }}
  </button>
  <Tween
    method="to"
    v-model:trigger="isPlaying"
    :vars="{ rotation: 360, duration: 3, repeat: -1 }"
  >
    <div class="box" />
  </Tween>
</template>

<script setup>
import { ref } from 'vue'
import { Tween } from 'deja-vue'

const isPlaying = ref(false)
</script>
```

Custom actions:

```vue
<Tween
  v-model:trigger="crossed"
  :trigger-actions="['play', 'restart']"
  method="from"
  :vars="{ opacity: 0 }"
/>
```

Listen only once by adding the **`.once`** modifier to the trigger model:

```vue
<Tween
  v-model:trigger.once="crossed"
  :trigger-actions="['play', 'restart']"
  method="from"
  :vars="{ opacity: 0 }"
/>
```

## Combining progress and trigger

Both models can be bound on the same component. Pause the timeline manually when scrubbing if you need exclusive control.

## Programmatic control

```vue
const tweenRef = ref()
// tweenRef.value.animation.timeline.play()
// tweenRef.value.direction // Ref<1 | -1 | 0>
```

## Scroll / hover patterns

Map external state to **`progress`** or **`trigger`** — no special APIs required.
