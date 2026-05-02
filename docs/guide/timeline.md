# Timeline Component

The `Timeline` component allows you to create complex animations. It provides a declarative way to build and manage GSAP (nested) timelines.

## What is a Timeline?

A timeline is a container that manages multiple animations (tweens, labels, callbacks) and controls when they play relative to each other. Déjà Vue's `Timeline` component makes it easy to compose these sequences declaratively.

## Basic Timeline

Use the `tweens` prop to define an array of animations:

```vue
<template>
  <Timeline :tweens>
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

## Timeline with Nested Components

Use nested `Tween` components for more control:

```vue
<template>
  <Timeline>
    <Tween method="to" :vars="{ x: 100, duration: 1 }">
      <div>First animation</div>
    </Tween>
    <Tween
      method="to"
      position="+=0.5"
      :vars="{ y: 100, duration: 1 }"
    >
      <div>Second animation (delayed)</div>
    </Tween>
  </Timeline>
</template>

<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>
```

## Props Reference

### Sequence Definition

| Prop | Type | Description |
|------|------|-------------|
| `tweens` | `TweenAnimationDefinition[]` | Array of tween definitions |

### Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `duration` | `number` | - | Total timeline duration |
| `options` | `gsap.TimelineVars` | - | GSAP timeline options |
| `group` | `boolean` | `false` | Animate all children as group |
| `tag` | `string` | `'div'` | HTML tag for wrapper |

### Control

| Prop | Type | Description |
|------|------|-------------|
| `progress` | `number` | Scrub timeline (0-1) |
| `toggle` | `boolean` | Play/reverse control |

### Nesting

| Prop | Type | Description |
|------|------|-------------|
| `parent` | `Animation \| null` | Parent animation |
| `position` | `gsap.Position` | Position in parent |

## Positioning Animations

Control when each animation starts in the timeline using the `position` prop:

```vue
<template>
  <Timeline>
    <!-- Starts immediately -->
    <Tween method="to" :vars="{ x: 100, duration: 1 }">
      <div>Animation 1</div>
    </Tween>
    
    <!-- Starts 0.5s after animation 1 ends (+=0.5) -->
    <Tween
      method="to"
      position="+=0.5"
      :vars="{ y: 100, duration: 1 }"
    >
      <div>Animation 2</div>
    </Tween>
    
    <!-- Starts 0.3s before animation 2 ends (-=0.3) -->
    <Tween
      method="to"
      position="-=0.3"
      :vars="{ rotation: 360, duration: 1 }"
    >
      <div>Animation 3</div>
    </Tween>
  </Timeline>
</template>

<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>
```

### Position Syntax

GSAP's position syntax works within timelines:

- `"+=1"` - Start 1 second after parent's current time
- `"-=0.5"` - Start 0.5 seconds before parent's current time
- `"1"` - Start at absolute time 1
- `"label"` - Start at named label
- Not specified - Start immediately after previous

## Timeline with Position Markers and Callbacks

Use `PositionMarker` and `Callback` components for advanced control:

```vue
<template>
  <Timeline>
    <PositionMarker label="start" />
    
    <Tween method="from" :vars="{ opacity: 0, duration: 1 }">
      <div>Fade in</div>
    </Tween>
    
    <PositionMarker label="middle" />
    
    <Tween method="to" :vars="{ x: 200, duration: 2 }">
      <div>Move right</div>
    </Tween>
    
    <Callback :fn="onMiddle" position="middle" />
    
    <PositionMarker label="end" />
    
    <Tween
      method="to"
      position="+=0.5"
      :vars="{ opacity: 0, duration: 1 }"
    >
      <div>Fade out</div>
    </Tween>
    
    <Callback :fn="onComplete" position="end" />
  </Timeline>
</template>

<script setup>
import { Timeline, Tween, PositionMarker, Callback } from 'deja-vue'

const onMiddle = (timeline) => {
  console.log('Middle of timeline reached')
}

const onComplete = (timeline) => {
  console.log('Timeline complete!', timeline)
}
</script>
```

## Timeline Duration

Set an explicit duration for the timeline:

```vue
<template>
  <Timeline :duration="3">
    <Tween method="to" :vars="{ x: 100 }">
      <div>Will take 3 seconds total</div>
    </Tween>
  </Timeline>
</template>

<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>
```

## GSAP Timeline Options

Pass any GSAP timeline options:

```vue
<template>
  <Timeline 
    :options="{ 
      repeat: 2,           // Repeat 2 times
      repeatDelay: 1,      // 1 second between repeats
      yoyo: true,          // Play backwards between repeats
      paused: true,        // Start paused
    }"
  >
    <Tween method="to" :vars="{ x: 100, duration: 1 }">
      <div>Advanced timeline</div>
    </Tween>
  </Timeline>
</template>

<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>
```

## Events

Timelines emit the same events as tweens:

```vue
<Timeline 
  :tweens
  @start="onStart"
  @update="onUpdate"
  @complete="onComplete"
>
  <!-- ... -->
</Timeline>
```

Available events:
- `start` - Timeline started
- `update` - Timeline frame updated
- `complete` - Timeline finished
- `repeat` - Timeline repeated
- `reverseComplete` - Reverse finished
- `interrupt` - Timeline interrupted

## Complex Example

Combine multiple concepts:

```vue
<template>
  <Timeline :duration="5">
    <PositionMarker label="intro" />
    <Tween method="from" :vars="{ opacity: 0, duration: 1 }">
      <div class="title">Welcome</div>
    </Tween>
    
    <PositionMarker label="content" />
    <Tween 
      group
      method="from" 
      position="+=0.5"
      :vars="{ x: -50, opacity: 0, duration: 0.5, stagger: 0.1 }" 
    >
      <div v-for="item in 3" :key="item" class="item">
        Item {{ item }}
      </div>
    </Tween>
    
    <Callback :fn="logContent" position="content" />
    
    <PositionMarker label="outro" />
    <Tween
      method="to"
      position="+=1"
      :vars="{ opacity: 0, duration: 1 }"
    >
      <div>Goodbye</div>
    </Tween>
  </Timeline>
</template>

<script setup>
import { Timeline, Tween, PositionMarker, Callback } from 'deja-vue'

const logContent = (timeline) => {
  console.log('Content section reached', timeline.progress())
}
</script>
```