# Timeline Component

> [!TIP]
> Read **[Core concepts](./concepts.md)** for nesting and rebuild behavior.

The `Timeline` component sequences nested **`Tween`**, **`Timeline`**, **`Marker`**, **`SplitText`**, and other nestables. There is **no `tweens` prop** — build sequences in the template.

## What is a Timeline?

A timeline holds child animations, labels, and callbacks on one GSAP timeline. Target resolution matches **`Tween`** ([Animation targets](./targeting.md)).

## Basic timeline

```vue
<template>
  <Timeline>
    <Tween method="to" :vars="{ x: 100, duration: 1 }">
      <div class="target">First target</div>
    </Tween>
    <Tween method="to" position="+=0.5" :vars="{ y: 100, duration: 1 }">
      <div class="target">Second target</div>
    </Tween>
  </Timeline>
</template>

<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>
```

## Props reference

| Prop | Type | Description |
|------|------|-------------|
| `duration` | `number` | Fixed total duration |
| `options` | `gsap.TimelineVars` | GSAP options |
| `progress` | `number` | `v-model:progress` |
| `trigger` | `boolean` | `v-model:trigger` |
| `triggerActions` | `TweenAction \| [TweenAction, TweenAction]` | Trigger mapping |
| `parent` | `DejaVueInstance \| null` | Parent |
| `position` | `gsap.Position` | Position on parent |

Use **`v-model:trigger.once`** to run the trigger watcher once.

## Positioning

Use **`position`** on nested children:

```vue
<Timeline>
  <Tween method="to" :vars="{ x: 100, duration: 1 }" />
  <Tween method="to" position="+=0.5" :vars="{ y: 100, duration: 1 }" />
  <Tween method="to" position="-=0.3" :vars="{ rotation: 360, duration: 1 }" />
</Timeline>
```

## Markers

Use **`Marker`** for labels and cross events (replaces separate callback/label components):

```vue
<template>
  <Timeline>
    <Marker label="start" />

    <Tween method="from" :vars="{ opacity: 0, duration: 1 }">
      <div class="target">Fade target</div>
    </Tween>

    <Marker label="middle" @cross="onMiddle" />

    <Tween method="to" :vars="{ x: 200, duration: 2 }">
      <div class="target">Move target</div>
    </Tween>

    <Marker label="end" />
  </Timeline>
</template>

<script setup>
import { Timeline, Tween, Marker } from 'deja-vue'

function onMiddle (direction) {
  console.log('Crossed middle', direction === 1 ? 'forward' : 'reverse')
}
</script>
```

## Timeline duration

```vue
<Timeline :duration="3">
  <Tween method="to" :vars="{ x: 100 }">
    <div class="target">Target</div>
  </Tween>
</Timeline>
```

When **`duration`** is a positive number, the timeline preserves that fixed total duration as children are added or removed. **`0`**, **`undefined`**, or clearing the prop restores natural timing by removing the stored total duration, resetting **`timeScale(1)`**, and invalidating the timeline.

## GSAP timeline options

```vue
<Timeline :options="{ repeat: 2, yoyo: true, paused: true }">
  <Tween method="to" :vars="{ x: 100, duration: 1 }">
    <div class="target">Target</div>
  </Tween>
</Timeline>
```

## Events and slot

Same as **`Tween`**: events **`(animation, parent)`**; slot scope includes **`direction`**, **`progress`**, etc.

## Nested timeline

```vue
<Timeline>
  <Tween method="to" :vars="{ x: 100, duration: 1 }" />
  <Timeline position="+=0.5">
    <Tween method="to" :vars="{ y: 50, duration: 0.5 }" />
    <Tween method="to" position="<" :vars="{ rotation: 90, duration: 0.5 }" />
  </Timeline>
</Timeline>
```
