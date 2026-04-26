# Tween Component

The `Tween` component is the basic building block for creating single animations in Deja Vue. It wraps GSAP's tween methods in a declarative Vue component.

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

Deja Vue supports all standard GSAP tween methods:

- `to`: Animate from current state to specified values
- `from`: Animate from specified values to current state
- `fromTo`: Animate from one set of values to another
- `effect:%NAME%`: Use GSAP custom effects

## Props

### method
- **Type:** `'from' | 'to' | 'fromTo' | 'effect:%NAME%'`
- **Required:** Yes
- The GSAP method to use for the animation.

### vars
- **Type:** `gsap.TweenVars | [gsap.TweenVars, gsap.TweenVars]` (for `fromTo`)
- **Required:** Yes
- The animation variables. For `fromTo`, pass an array of two objects.

### group
- **Type:** `boolean`
- **Default:** `false`
- Whether to animate the wrapper's children as a group instead of the wrapper itself.

### initiallyHidden
- **Type:** `boolean`
- **Default:** `true`
- Whether the element should be hidden initially.

### tag
- **Type:** `string`
- **Default:** `'div'`
- The HTML tag to use for the wrapper element.

### progress
- **Type:** `number`
- Control the animation progress (0-1).

### toggle
- **Type:** `boolean`
- Control play/reverse state.

### parent
- **Type:** `AnimationInstance | null`
- The parent animation for nesting.

### position
- **Type:** `gsap.Position`
- Position in parent timeline.

## Events

The Tween component emits the following events:

- `start`: When the animation starts
- `complete`: When the animation completes
- `update`: On each animation frame
- `repeat`: When the animation repeats
- `reverseComplete`: When reverse animation completes
- `interrupt`: When the animation is interrupted

## Examples

### From Animation

```vue
<Tween method="from" :vars="{ opacity: 0, y: 50, duration: 0.5 }">
  <div>Fade in from below</div>
</Tween>
```

### FromTo Animation

```vue
<Tween method="fromTo" :vars="[{ x: 0 }, { x: 200, duration: 1 }]" />
```

### Group Animation

```vue
<Tween method="to" :vars="{ rotation: 360, duration: 2 }" group>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Tween>
```