# Getting Started

> [!TIP]
> Read **[Core concepts](./concepts.md)** first (~2 minutes).

Déjà Vue (*Declarative Elements* for *Javascript Animations* in *Vue*) lets you define and nest GSAP animations as Vue components.

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
<template>
  <Tween method="to" :vars="{ x: 100, duration: 1 }">
    <div class="target">Target</div>
  </Tween>
</template>

<script setup>
import { Tween } from 'deja-vue'
</script>
```

The slotted element is the tween **target** (not an extra wrapper).

## Declarative sequences

Use nested components inside **`Timeline`** (no `tweens` array prop):

```vue
<Timeline>
  <Tween method="to" :vars="{ x: 100, duration: 1 }" />
  <Tween method="to" :vars="{ y: 50, duration: 0.5 }" />
</Timeline>
```

## Reactive controls

```vue
<Tween
  v-model:progress="progress"
  method="to"
  :vars="{ x: 100, duration: 1 }"
>
  <div class="target">Target</div>
</Tween>
```

See [Animation controls](./controls.md) for **`trigger`** and **`triggerActions`**.

Use **`v-model:trigger.once`** when a trigger should run only for the first defined value change:

```vue
<Tween
  v-model:trigger.once="entered"
  :trigger-actions="['play', 'restart']"
  method="from"
  :vars="{ opacity: 0 }"
/>
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
