# Tween Component

The `Tween` component is the basic building block for creating single animations in Déjà Vue. It wraps GSAP's tween methods in a declarative Vue component.

## What is a Tween?

A tween animates one or more properties of an element from one value to another over a specified duration. GSAP provides several tween methods, all supported by Déjà Vue's `Tween` component.

## Basic Tween

```vue
<template>
  <Tween method="to" :vars="{ x: 100, duration: 1 }">
    <div>Move me!</div>
  </Tween>
</template>

<script setup>
import { Tween } from 'deja-vue'
</script>
```

## Tween Methods

Déjà Vue supports all standard GSAP tween methods:

### `to` - Animate to values
Animates from the element's current state to the specified values.

```vue
<Tween method="to" :vars="{ x: 100, opacity: 0.5, duration: 1 }">
  <div>Animate to...</div>
</Tween>
```

### `from` - Animate from values
Animates from the specified values to the element's current state.

```vue
<Tween method="from" :vars="{ opacity: 0, y: -50, duration: 1 }">
  <div>Fade in from above</div>
</Tween>
```

### `fromTo` - Animate between two states
Explicitly define both the starting and ending values.

```vue
<Tween
  method="fromTo"
  :vars="[
    { x: 0, opacity: 0 },
    { x: 100, opacity: 1, duration: 1 }
  ]"
>
  <div>Custom animation</div>
</Tween>
```

### `effect:%NAME%` - GSAP Effects
Use GSAP's built-in effects (requires GSAP 3.12+).

```vue
<Tween method="effect:wiggle" :vars="{ duration: 1 }">
  <div>Wiggle effect</div>
</Tween>
```

## Props Reference

### animation Method and Variables

| Prop | Type | Description |
|------|------|-------------|
| `method` | `'from' \| 'to' \| 'fromTo' \| 'effect:%NAME%'` | **Required.** The GSAP tween method |
| `vars` | `gsap.TweenVars \| [gsap.TweenVars, gsap.TweenVars]` | **Required.** Animation variables |

### Wrapper Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `group` | `boolean` | `false` | Animate all children together |
| `initiallyHidden` | `boolean` | `true` | Hide until animation is ready |
| `tag` | `string` | `'div'` | HTML tag for wrapper |

### Animation Control

| Prop | Type | Description |
|------|------|-------------|
| `progress` | `number` | Scrub animation (0-1) |
| `toggle` | `boolean` | Play/reverse control |

### Nesting

| Prop | Type | Description |
|------|------|-------------|
| `parent` | `Animation \| null` | Parent animation |
| `position` | `gsap.Position` | Position in parent |

## Group Animations

Animate multiple elements as a group with the `group` prop:

```vue
<template>
  <Tween
    group
    method="to"
    :vars="{ rotation: 360, duration: 2 }"
  >
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
  </Tween>
</template>

<script setup>
import { Tween } from 'deja-vue'
</script>
```

All children will rotate 360 degrees together.

## Animation Events

Listen to animation lifecycle events:

```vue
<template>
  <Tween 
    method="to" 
    :vars="{ x: 100, duration: 1 }"
    @start="console.log('Started')"
    @complete="console.log('Finished')"
    @update="console.log('Updating')"
    @repeat="console.log('Repeated')"
  >
    <div>Events</div>
  </Tween>
</template>

<script setup>
import { Tween } from 'deja-vue'
</script>
```

Available events:
- `start` - Animation started
- `update` - Animation frame updated
- `complete` - Animation finished
- `repeat` - Animation repeated (if repeat > 0)
- `reverseComplete` - Reverse animation finished
- `interrupt` - Animation interrupted

## Accessing the Animation

Use template refs to access the animation instance:

```vue
<template>
  <button @click="tweenRef.animation.timeline.play()">Play</button>
  <Tween
    ref="tweenRef"
    method="to"
    :vars="{ x: 100, duration: 1 }"
  >
    <div>Programmatic Control</div>
  </Tween>
</template>

<script setup>
import { ref } from 'vue'
import { Tween } from 'deja-vue'

const tweenRef = ref()
</script>
```

## Examples

### Fade In

```vue
<Tween method="from" :vars="{ opacity: 0, duration: 0.5 }">
  <div>Fade in</div>
</Tween>
```

### Slide In

```vue
<Tween method="from" :vars="{ x: -100, opacity: 0, duration: 0.8 }">
  <div>Slide in from left</div>
</Tween>
```

### Scale Up

```vue
<Tween method="from" :vars="{ scale: 0, duration: 0.6 }">
  <div>Scale up</div>
</Tween>
```

### Staggered Children

Combine with `group` and GSAP's stagger option:

```vue
<Tween
  group
  method="from"
  :vars="{ opacity: 0, y: 20, duration: 0.5, stagger: 0.1 }"
>
  <div v-for="item in 5" :key="item">Item {{ item }}</div>
</Tween>
```