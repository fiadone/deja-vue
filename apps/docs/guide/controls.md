# Animation Controls

`Tween` and `Timeline` support **`v-model:progress`** and **`v-model:trigger`**.

## Progress

Scrub between **0** and **1**. **`direction`** is **`1`** or **`-1`** while scrubbing.

<ClientOnly>
  <ControlsProgressDemo />
</ClientOnly>

```html
<script setup>
import { ref } from 'vue'

import { Tween } from 'deja-vue'

const progress = ref(0.5)
const tweenRef = ref()

function pauseForScrub () {
  tweenRef.value?.animation.timeline.pause()
}
</script>

<template>
  <input
    v-model.number="progress"
    max="1"
    min="0"
    step="0.01"
    type="range"
    @keydown="pauseForScrub"
    @pointerdown="pauseForScrub"
  >
  <Tween
    ref="tweenRef"
    v-model:progress="progress"
    :to="{ x: 200, duration: 2 }"
  >
    <div class="target" />
  </Tween>
</template>
```

## Trigger

Each **`trigger`** change runs **`trigger-action`** (default **`play`**). Bind **`trigger-action`** in the same template as **`trigger`**.

<ClientOnly>
  <ControlsTriggerDemo />
</ClientOnly>

```html
<script setup>
import { ref } from 'vue'

import { Tween } from 'deja-vue'

const isPlaying = ref(false)
</script>

<template>
  <button @click="isPlaying = !isPlaying">
    {{ isPlaying ? 'Reverse' : 'Play' }}
  </button>
  <Tween
    :trigger="isPlaying"
    :trigger-action="isPlaying ? 'play' : 'reverse'"
    :to="{ rotation: 360, duration: 3, repeat: -1 }"
  >
    <div class="box" />
  </Tween>
</template>
```

One-shot trigger:

```html
<Tween
  :from="{ opacity: 0 }"
  :trigger="crossed"
  :trigger-action="'restart'"
  :trigger-options="{ once: true }"
/>
```

## Progress and trigger together

Pause the timeline when the user scrubs so playback and **`v-model:progress`** do not conflict.

## Template ref

```html
// tweenRef.value.animation.timeline.play()
// tweenRef.value.direction
```
