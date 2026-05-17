# Components API

> [!TIP]
> Narrative explanations: **[Core concepts](../guide/concepts.md)** and **[Animation targets](../guide/targeting.md)**.

## Tween

Single-tween component backed by an internal GSAP timeline (one composed tween per instance).

Targets are resolved by [`useAnimationScope`](./composables.md#useanimationscope). Pass root attributes **`is`** and **`target`** on `Tween` when you need a custom scope (see [Animation targets](../guide/targeting.md)).

### Tween props

| Prop | Type | Description |
|------|------|-------------|
| `method` | `'from' \| 'to' \| 'fromTo' \| 'effect:%NAME%'` | GSAP tween method |
| `vars` | `gsap.TweenVars \| [gsap.TweenVars, gsap.TweenVars]` | Tween variables (updated in place via [`useStableTweenVars`](./composables.md#usestabletweenvars)) |
| `seamless` | `boolean` | When `true`, parent scope uses this instance’s **`target`** instead of its root DOM (nested tween chains) |
| `progress` | `number` | `v-model:progress` — scrub 0–1 |
| `trigger` | `boolean \| undefined` | `v-model:trigger` or `v-model:trigger.once` — paired with optional **`triggerActions`** |
| `triggerActions` | `TweenAction \| [TweenAction, TweenAction]` | Action when trigger is `true` / `false` (default `['play', 'reverse']`; a string applies to both) |
| `parent` | `DejaVueInstance \| null` | Parent (non-prop attribute or inject) |
| `position` | `gsap.Position` | Position on parent timeline |

`vars` shape must stay compatible with **`method`**. When switching between a single vars object and a **`fromTo`** tuple, key the component by method or another shape key.

Root attributes: **`is`**, **`target`** (see [targeting](../guide/targeting.md)).

### Tween events

Handlers receive **`(animation, parent)`**:

- **`animation`** — [`Animation`](./types.md#animation) wrapper; use **`animation.timeline`** for GSAP.
- **`parent`** — Parent **`DejaVueInstance`** or `null`.

| Event | Description |
|-------|-------------|
| `start` | Started |
| `complete` | Completed |
| `update` | Updated |
| `repeat` | Repeated |
| `reverseComplete` | Reverse completed |
| `interrupt` | Interrupted |

### Tween exposed / slot

Default slot receives scope props from **`AnimationScope`**: **`animation`**, **`controlled`**, **`direction`**, **`parent`**, **`progress`**, **`target`**.

`defineExpose` matches **`DejaVueInstance`**: **`$el`**, **`animation`**, **`controlled`**, **`direction`**, **`parent`**, **`progress`**, **`seamless`**, **`target`**.

## Timeline

Container timeline for nested **`Tween`**, **`Timeline`**, **`Marker`**, **`SplitText`**, etc.

Does **not** accept a **`tweens`** array — define sequences with nested components only.

### Timeline props

| Prop | Type | Description |
|------|------|-------------|
| `duration` | `number` | Positive fixed total duration (`data.totalDuration` + GSAP `duration`); `0` / clearing restores natural timing |
| `options` | `gsap.TimelineVars` | GSAP timeline options |
| `progress` | `number` | `v-model:progress` |
| `trigger` | `boolean \| undefined` | `v-model:trigger` or `v-model:trigger.once` |
| `triggerActions` | `TweenAction \| [TweenAction, TweenAction]` | Trigger actions (default `['play', 'reverse']`; a string applies to both) |
| `parent` | `DejaVueInstance \| null` | Parent |
| `position` | `gsap.Position` | Position on parent |

### Timeline events

Same as **`Tween`**: **`(animation, parent)`**.

### Timeline exposed / slot

Same scope props as **`Tween`**. **`provide(dejaVueParentInstance)`** injects the full **`DejaVueInstance`** instance (not only the inner `Animation`).

## SplitText

GSAP **SplitText** integration. Register the GSAP plugin in your app setup, then place **`SplitText` in a `Tween` slot** so the parent scope animates split nodes via **`seamless`** / **`target`**. See [Split text](../guide/split-text.md).

### SplitText props

[`SplitTextOptions`](./composables.md#usesplittext) — `type` defaults to `'lines,words,chars'` if omitted.

Root attributes: **`is`**, **`tweenTarget`** (`'lines' \| 'words' \| 'chars'`).

### SplitText exposed

| Property | Description |
|----------|-------------|
| `$el` | Root element |
| `target` | Elements for parent tween scope |
| `seamless` | `true` |
| `lines`, `words`, `chars` | Reactive element arrays |

## Marker

Adds a **timeline label** (optional) and a **callback** when playback crosses that position. Emits **`cross`** with playback **`direction`** (`1` forward, `-1` reverse). Exposes a default slot: **`{ crossed, parent }`**.

### Marker props

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Label name on parent timeline (optional) |
| `parent` | `DejaVueInstance \| null` | Parent (attribute / inject) |
| `position` | `gsap.Position` | Callback position (defaults with label when used) |

### Marker events

| Event | Payload | Description |
|-------|---------|-------------|
| `cross` | `AnimationDirection` | Playhead crossed this marker (`1` or `-1`) |

### Marker usage

```vue
<template>
  <Timeline>
    <Marker label="intro" @cross="onCross" />
    <Tween method="to" :vars="{ x: 100, duration: 1 }">
      <div class="target">Target</div>
    </Tween>
  </Timeline>
</template>

<script setup>
import { Marker, Timeline, Tween } from 'deja-vue'

function onCross (direction) {
  console.log('Crossed', direction === 1 ? 'forward' : 'reverse')
}
</script>
```

Slot-driven trigger:

```vue
<Marker v-slot="{ crossed }" @cross="onCross">
  <Tween
    method="from"
    :trigger="crossed"
    :trigger-actions="['play', 'restart']"
    :vars="{ opacity: 0 }"
  >
    <div class="target">Target</div>
  </Tween>
</Marker>
```
