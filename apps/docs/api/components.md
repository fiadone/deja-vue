# Components API

## Tween

Single GSAP tween per instance.

### Tween props

| Prop | Type | Description |
|------|------|-------------|
| `from` | `gsap.TweenVars` | **`from`** vars |
| `to` | `gsap.TweenVars` | **`to`** vars |
| `effect` | `string` | GSAP effect name |
| `effectOptions` | `Record<string, unknown>` | Effect options |
| `seamless` | `boolean` | Parent scope uses this instance’s **`tweenTarget`** |
| `tweenTarget` | [`AnimationTarget`](./types.md#animationtarget) | DOM resolution (`'self'`, `'children'`, selector, or `gsap.TweenTarget`) |
| `progress` | `number` | `v-model:progress` — scrub 0–1 |
| `trigger` | `unknown` | Watched value; use with **`v-model:trigger`** |
| `triggerAction` | `TweenAction` | Action on each **`trigger`** change (default **`play`**) |
| `triggerOptions` | `WatchOptions` | Trigger watcher options |
| `parent` | `DejaVueAnimationPublicInstance \| null` | Parent timeline |
| `position` | `gsap.Position` | Position on parent timeline |

One tween kind per instance: **`to`**, **`from`**, **`from`** + **`to`**, or **`effect`**. Key the component when switching kind at runtime — see **[Troubleshooting](../guide/troubleshooting.md#tween-kind-prop-mismatch)**.

Root attribute: **`is`**. See [Animation targets](../guide/targeting.md).

### Tween events

**`(animation, parent)`** — use **`animation.timeline`** for GSAP.

`start`, `complete`, `update`, `repeat`, `reverseComplete`, `interrupt`.

### Tween slot

**`animation`**, **`direction`**, **`parent`**, **`progress`**.

## Timeline

Container for nested **`Tween`**, **`Timeline`**, **`Marker`**, **`SplitText`**, etc.

### Timeline props

| Prop | Type | Description |
|------|------|-------------|
| `duration` | `number` | Fixed total duration; clearing restores natural timing |
| `options` | `gsap.TimelineVars` | GSAP timeline options |
| `seamless` | `boolean` | Parent scope uses this instance’s **`tweenTarget`** |
| `tweenTarget` | [`AnimationTarget`](./types.md#animationtarget) | DOM resolution |
| `progress` | `number` | `v-model:progress` |
| `trigger` | `unknown` | Watched value; use with **`v-model:trigger`** |
| `triggerAction` | `TweenAction` | Action on each **`trigger`** change (default **`play`**) |
| `triggerOptions` | `WatchOptions` | Trigger watcher options |
| `parent` | `DejaVueAnimationPublicInstance \| null` | Parent |
| `position` | `gsap.Position` | Position on parent |

Same events and slot as **`Tween`**.

## SplitText

GSAP SplitText integration. Place inside a **`Tween` slot**. See [Split text](../guide/split-text.md).

### SplitText props

[`SplitTextOptions`](./composables.md#usesplittext) — `type` defaults to `'lines,words,chars'`.

| Prop | Type | Description |
|------|------|-------------|
| `tweenTarget` | `'lines' \| 'words' \| 'chars'` | Split level for parent scope (defaults to last segment of **`type`**) |

Root attribute: **`is`**.

Slot: **`chars`**, **`lines`**, **`words`**.

## Marker

Timeline label (optional) and callback at **`position`**. Emits **`cross`** with **`direction`** (`1` forward, `-1` reverse). Slot: **`crossed`**, **`parent`**.

### Marker props

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Label name (optional) |
| `parent` | `DejaVueAnimationPublicInstance \| null` | Parent |
| `position` | `gsap.Position` | Callback position |

### Marker usage

```html
<script setup>
import { Marker, Timeline, Tween } from 'deja-vue'

function onCross (direction) {
  console.log('Crossed', direction === 1 ? 'forward' : 'reverse')
}
</script>

<template>
  <Timeline>
    <Marker label="intro" @cross="onCross" />
    <Tween :to="{ x: 100, duration: 1 }">
      <div class="target" />
    </Tween>
  </Timeline>
</template>
```

Slot-driven trigger:

```html
<script setup>
import { Marker, Tween } from 'deja-vue'

function onCross (direction) {
  console.log('Crossed', direction)
}
</script>

<template>
  <Marker @cross="onCross" v-slot="{ crossed }">
    <Tween
      :from="{ opacity: 0 }"
      :trigger="crossed"
      :trigger-action="crossed ? 'play' : 'restart'"
    >
      <div class="target" />
    </Tween>
  </Marker>
</template>
```
