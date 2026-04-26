# Timeline Component

The `Timeline` component allows you to both create complex sequences of animations using multiple tweens or manage animations nesting. It provides a declarative way to build GSAP timelines.

## Basic Timeline

```vue
<template>
  <Timeline :tweens="tweens">
    <div>Animated Content</div>
  </Timeline>
</template>

<script setup>
import { Timeline } from 'deja-vue'

const tweens = [
  { method: 'to', vars: { x: 100, duration: 1 } },
  { method: 'to', vars: { y: 100, duration: 1 }, position: '+=0.5' }
]
</script>
```

## Props

### tweens
- **Type:** `Array<TweenAnimationDefinition & { position?: gsap.Position }>`
- **Required:** Yes (when using timeline mode)
- Array of tween definitions with optional positioning.

### duration
- **Type:** `number`
- Total duration of the timeline.

### options
- **Type:** `gsap.TimelineVars`
- Additional GSAP timeline options.

### group
- **Type:** `boolean`
- **Default:** `false`
- Whether to animate children as a group.

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
- Control the timeline progress (0-1).

### toggle
- **Type:** `boolean`
- Control play/reverse state.

### parent
- **Type:** `AnimationInstance | null`
- The parent animation for nesting.

### position
- **Type:** `gsap.Position`
- Position in parent timeline.

## Timeline with Nested Components

You can also use the Timeline component with nested Tween components:

```vue
<template>
  <Timeline>
    <Tween method="to" :vars="{ x: 100, duration: 1 }">
      <div>First element</div>
    </Tween>
    <Tween method="to" :vars="{ y: 100, duration: 1 }" position="+=0.5">
      <div>Second element</div>
    </Tween>
  </Timeline>
</template>
```

## Positioning

Use the `position` prop to control when each animation starts:

- `"+=1"`: Start 1 second after the previous animation
- `"-=0.5"`: Start 0.5 seconds before the previous animation ends
- `"label"`: Start at a specific label
- `1`: Start at absolute time 1 second

## Labels and Callbacks

You can add labels and callbacks to your timeline:

```vue
<template>
  <Timeline>
    <Label>start</Label>
    <Tween method="to" :vars="{ x: 100, duration: 1 }" />
    <Label>middle</Label>
    <Tween method="to" :vars="{ y: 100, duration: 1 }" />
    <Callback :fn="onComplete" position="+=0" />
  </Timeline>
</template>

<script setup>
import { Label, Callback } from 'deja-vue'

const onComplete = (timeline) => {
  console.log('Timeline completed!')
}
</script>
```

## Events

Same events as Tween component:

- `start`, `complete`, `update`, `repeat`, `reverseComplete`, `interrupt`