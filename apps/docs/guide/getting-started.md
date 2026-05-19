# Getting Started

> [!TIP]
> Read **[Core concepts](./concepts.md)** first (~2 minutes).

Déjà Vue (*Declarative Elements* for *Javascript Animations* in *Vue*) lets you define and nest GSAP animations as Vue components.

> [!NOTE]
> Examples often pass `vars` inline because that keeps the documentation focused on the animation concept being introduced. In application code, always prefer moving tween definitions into named constants, refs, or computed values and pass those references to the component. Déjà Vue keeps inline vars stable enough to avoid unnecessary recomposition, but referenced definitions still remain the best practice and make animation intent clearer, easier to reuse, easier to type, and easier to change deliberately.

## Installation

```bash
npm install deja-vue gsap vue
```

- **vue**: ^3.5.0  
- **gsap**: ^3.0.0  

Includes **[vue-unwrap](https://www.npmjs.com/package/vue-unwrap)** for slot/DOM unwrapping.

GSAP plugins are not registered by the library. Register any plugin you use, such as **`SplitText`** or **`ScrollTrigger`**, in your app setup with **`gsap.registerPlugin(...)`**.

## Basic usage

```vue
<script setup>
import { Tween } from 'deja-vue'
</script>

<template>
  <Tween method="to" :vars="{ x: 100, duration: 1 }">
    <div class="target">Target</div>
  </Tween>
</template>
```

The slotted element is the tween **target** (not an extra wrapper).

## Programmatic control

### Trigger

<ClientOnly>
  <TweenTriggerDemo />
</ClientOnly>

```vue
<script setup>
import { ref } from 'vue'
import { Tween } from 'deja-vue'

const trigger = ref(false)
</script>

<template>
  <Tween
    v-model:trigger="trigger"
    method="to"
    :vars="{ x: 100, duration: 1 }"
  >
    <div class="target">Target</div>
  </Tween>
</template>
```

See [Animation controls](./controls.md) for **`trigger`** and **`triggerActions`**.

Use **`v-model:trigger.once`** when a trigger should run only for the first defined value change:

```vue
<script setup>
import { ref } from 'vue'
import { Tween } from 'deja-vue'

const entered = ref(false)
</script>

<template>
  <Tween
    v-model:trigger.once="entered"
    :trigger-actions="['play', 'restart']"
    method="from"
    :vars="{ opacity: 0 }"
  />
</template>
```

### Progress

<ClientOnly>
  <ControlsProgressDemo />
</ClientOnly>

```vue
<script setup>
import { ref } from 'vue'
import { Tween } from 'deja-vue'

const progress = ref(0)
</script>

<template>
  <Tween
    v-model:progress="progress"
    method="to"
    :vars="{ x: 100, duration: 1 }"
  >
    <div class="target">Target</div>
  </Tween>
</template>
```

## Declarative sequences

Use nested components inside **`Timeline`** (no `tweens` array prop):

<ClientOnly>
  <TimelineSequenceDemo />
</ClientOnly>

```vue
<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>

<template>
  <Timeline>
    <Tween method="to" :vars="{ x: 100, duration: 1 }" />
    <Tween method="to" :vars="{ y: 50, duration: 0.5 }" />
  </Timeline>
</template>
```

## Reactivity of `vars`

**`vars`** are synced in place (stable reference) when properties change, and the tween recomposes when **`target`**, **`method`**, or **`vars`** meaningfully change. For playback, prefer **`progress`** / **`trigger`**.

Keep **`vars`** shape compatible with **`method`**. If you switch between a single vars object and a **`fromTo`** tuple, key the **`Tween`** so Vue recreates it.

## What you'll learn

- [Core concepts](./concepts.md)
- [Animation targets](./targeting.md)
- [Tween](./tween.md) — methods, seamless nesting, slot scope
- [Timeline](./timeline.md) — nested sequences, Marker
- [Animation controls](./controls.md) — progress, trigger, direction
- [Nesting](./nesting.md)
- [Split text](./split-text.md) — `SplitText` inside `Tween`
- [Upgrading](./migration.md)
- [Troubleshooting](./troubleshooting.md)
