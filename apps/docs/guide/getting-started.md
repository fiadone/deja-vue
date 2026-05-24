# Getting Started

Déjà Vue lets you define and nest GSAP animations as Vue components.

## Installation

```bash
npm install deja-vue gsap vue
```

- **vue**: ^3.5.0
- **gsap**: ^3.0.0

Register GSAP plugins (e.g. **`ScrollTrigger`**) in your app setup. **`SplitText`** is registered automatically when imported from **`deja-vue`**.

## Basic usage

```html
<script setup>
import { Tween } from 'deja-vue'
</script>

<template>
  <Tween :to="{ x: 100, duration: 1 }">
    <div class="target" />
  </Tween>
</template>
```

## Trigger

<ClientOnly>
  <TweenTriggerDemo />
</ClientOnly>

```html
<script setup>
import { ref } from 'vue'

import { Tween } from 'deja-vue'

const trigger = ref(false)
</script>

<template>
  <Tween :to="{ x: 100, duration: 1 }" :trigger>
    <div class="target" />
  </Tween>
</template>
```

See [Animation controls](./controls.md).

## Progress

<ClientOnly>
  <ControlsProgressDemo />
</ClientOnly>

```html
<script setup>
import { ref } from 'vue'

import { Tween } from 'deja-vue'

const progress = ref(0)
</script>

<template>
  <Tween
    v-model:progress="progress"
    :to="{ x: 100, duration: 1 }"
  >
    <div class="target" />
  </Tween>
</template>
```

## Sequences

<ClientOnly>
  <TimelineSequenceDemo />
</ClientOnly>

```html
<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>

<template>
  <Timeline>
    <Tween :to="{ x: 100, duration: 1 }">
      <div class="target" />
    </Tween>
    <Tween :to="{ y: 50, duration: 0.5 }">
      <div class="target" />
    </Tween>
  </Timeline>
</template>
```

## Next

- [Core concepts](./concepts.md)
- [Animation targets](./targeting.md)
- [Tween](./tween.md)
- [Timeline](./timeline.md)
- [Controls](./controls.md)
- [Nesting](./nesting.md)
- [Split text](./split-text.md)
