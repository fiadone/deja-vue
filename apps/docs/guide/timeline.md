# Timeline Component

The `Timeline` component sequences nested **`Tween`**, **`Timeline`**, **`Marker`**, **`SplitText`**, and other nestables.

## Basic timeline sequence

<ClientOnly>
  <TimelineSequenceDemo />
</ClientOnly>

```html
<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>

<template>
  <Timeline>
    <Tween :to="{ x: 100 }">
      <div class="target" />
    </Tween>
    <Tween position="+=0.5" :to="{ y: 100 }">
      <div class="target" />
    </Tween>
  </Timeline>
</template>
```

## Seamless tween nesting

<ClientOnly>
  <TimelineSeamlessDemo />
</ClientOnly>

```html
<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>

<template>
  <Timeline>
    <Tween :from="{ scale: 0, stagger: 0.1 }">
      <Tween seamless :to="{ rotate: 360, stagger: 0.1 }">
        <Tween seamless :to="{ x: 100, stagger: 0.1 }">
          <div v-for="n in 3" :key="n" class="target" />
        </Tween>
      </Tween>
    </Tween>
  </Timeline>
</template>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `duration` | `number` | Fixed total duration |
| `options` | `gsap.TimelineVars` | GSAP timeline options |
| `seamless` | `boolean` | Parent scope uses this timeline’s **`tweenTarget`** |
| `tweenTarget` | [`AnimationTarget`](../api/types.md#animationtarget) | DOM resolution |
| `progress` | `number` | `v-model:progress` |
| `trigger` | `unknown` | Watched value |
| `triggerAction` | `TweenAction` | Action on each **`trigger`** change (default **`play`**) |
| `triggerOptions` | `WatchOptions` | Trigger watcher options |
| `parent` | `DejaVueAnimationPublicInstance \| null` | Parent |
| `position` | `gsap.Position` | Position on parent |

## Positioning

```html
<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>

<template>
  <Timeline>
    <Tween :to="{ x: 100, duration: 1 }">
      <div class="target" />
    </Tween>
    <Tween
      position="+=0.5"
      :to="{ y: 100, duration: 1 }"
    >
      <div class="target" />
    </Tween>
    <Tween
      position="-=0.3"
      :to="{ rotation: 360, duration: 1 }"
    >
      <div class="target" />
    </Tween>
  </Timeline>
</template>
```

## Markers

```html
<script setup>
import { Marker, Timeline, Tween } from 'deja-vue'

function onMiddle (direction) {
  console.log('Crossed middle', direction === 1 ? 'forward' : 'reverse')
}
</script>

<template>
  <Timeline>
    <Marker label="start" />

    <Tween :from="{ opacity: 0, duration: 1 }">
      <div class="target" />
    </Tween>

    <Marker label="middle" @cross="onMiddle" />

    <Tween :to="{ x: 200, duration: 2 }">
      <div class="target" />
    </Tween>

    <Marker label="end" />
  </Timeline>
</template>
```

## Timeline duration

```html
<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>

<template>
  <Timeline :duration="3">
    <Tween :to="{ x: 100 }">
      <div class="target" />
    </Tween>
  </Timeline>
</template>
```

A positive **`duration`** preserves fixed total timing as children are added or removed.

## GSAP timeline options

```html
<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>

<template>
  <Timeline :options="{ repeat: 2, yoyo: true, paused: true }">
    <Tween :to="{ x: 100, duration: 1 }">
      <div class="target" />
    </Tween>
  </Timeline>
</template>
```

**`options`** updates apply to the timeline vars and to children added after the change. Remount with **`:key`** if every child must pick up new vars.

## Nested timeline

```html
<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>

<template>
  <Timeline>
    <Tween :to="{ x: 100, duration: 1 }">
      <div class="target" />
    </Tween>
    <Timeline position="+=0.5">
      <Tween :to="{ y: 50, duration: 0.5 }">
        <div class="target" />
      </Tween>
      <Tween position="<" :to="{ rotation: 90, duration: 0.5 }">
        <div class="target" />
      </Tween>
    </Timeline>
  </Timeline>
</template>
```
