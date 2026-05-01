# Getting Started

Déjà Vue (*Declarative Elements* for *Javascript Animations* in *Vue*) is a Vue 3 library that provides declarative components for creating and managing GSAP animations directly in your templates. It allows you to define and nest animations using Vue components, making them more readable and maintainable.

## Installation

Install Déjà Vue along with its peer dependencies:

```bash
npm install deja-vue gsap vue
```

You need:
- **vue**: ^3.5.0
- **gsap**: ^3.0.0

## Basic Usage

Here's a simple example of using the `Tween` component to animate an element:

```vue
<template>
  <Tween method="to" :vars="{ x: 100, duration: 1 }">
    <div>Animated Element</div>
  </Tween>
</template>

<script setup>
import { Tween } from 'deja-vue'
</script>
```

This will animate the div to move 100px to the right over 1 second.

## Key Concepts

### Components vs Code-Based Animations

Instead of writing imperative animation code:

```typescript
// ❌ Imperative way
const timeline = gsap.timeline()
timeline.to(element, { x: 100, duration: 1 })
timeline.to(element, { y: 50, duration: 0.5 })
```

You write declarative Vue templates:

```vue
<!-- ✅ Declarative way -->
<Timeline>
  <Tween method="to" :vars="{ x: 100, duration: 1 }" />
  <Tween method="to" :vars="{ y: 50, duration: 0.5 }" />
</Timeline>
```

### Reactive Controls

Déjà Vue composes animation when the component mounts, so `vars` are read once on mount. If you need dynamic playback, use reactive control props such as `progress` and `toggle`.

```vue
<template>
  <button @click="progress = progress === 0 ? 1 : 0">
    Toggle Animation
  </button>
  <Tween 
    method="to" 
    :progress
    :vars="{ x: 100, duration: 1 }"
  >
    <div>Animated Element</div>
  </Tween>
</template>

<script setup>
import { ref } from 'vue'
import { Tween } from 'deja-vue'

const progress = ref(0)
</script>
```

## Known Limitations

- `vars` are currently composed only on mount. Changing the object passed to `vars` after the component is mounted does not rebuild the animation.
- Dynamic playback should be handled with `progress` and `toggle` for now.
- Future releases may add support for rebuilding animations when `vars`, `options`, or rendered content change.

## What You'll Learn

- [Tween Component](./tween.md) - Create single animations
- [Timeline Component](./timeline.md) - Compose sequences
- [Animation Controls](./controls.md) - Control playback dynamically
- [Nesting Animations](./nesting.md) - Create complex hierarchies