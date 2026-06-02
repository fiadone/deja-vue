# Components API

Canonical prop, event, and slot reference. Usage guides: [Tween](../guide/tween.md), [Timeline](../guide/timeline.md), [Nesting](../guide/nesting.md), [Split text](../guide/split-text.md).

## Tween

Single GSAP tween per instance.

### Tween props

| Prop | Type | Description |
|------|------|-------------|
| `from` | `gsap.TweenVars` | Starting vars for a from or fromTo tween |
| `to` | `gsap.TweenVars` | End vars for a to or fromTo tween |
| `effect` | `string` | Registered GSAP effect name |
| `effectOptions` | `gsap.TweenVars` | Vars passed to the effect |
| `seamless` | `boolean` | Contribute this instance’s resolved target to the parent tween scope |
| `tweenTarget` | `gsap.DOMTarget` | How to resolve DOM targets (`'self'`, `'children'`, selector, or element) |
| `progress` | `number` | Two-way scrub value (0–1) via `v-model:progress` |
| `trigger` | `unknown` | Watched value; each change runs `trigger-action` (default `play`) |
| `triggerAction` | `TweenAction` | `Animation.run()` action when `trigger` changes |
| `triggerOptions` | `AnimationTriggerOptions` | Vue `WatchOptions` for the trigger watcher, plus optional `actionArgs` for `Animation.run` |
| `parent` | `DejaVueAnimationParent \| null` | Parent timeline for nesting — usually omit (inject); override with slot **`parent`** or **`:parent="null"`** to opt out of inject ([Nesting](../guide/nesting.md#manual-parent-assignment)) |
| `position` | `gsap.Position` | Insertion point on the parent timeline |

One tween kind per instance: **`to`**, **`from`**, **`from`** + **`to`**, or **`effect`**. Key the component when switching kind at runtime — see **[Troubleshooting](../guide/troubleshooting.md#tween-kind-prop-mismatch)**.

Put **`scrollTrigger`** in **`from`** / **`to`** vars for scroll-linked playback — see **[Animation targets — ScrollTrigger](../guide/targeting.md#scrolltrigger)**.

Root attribute: **`is`**. See [Animation targets](../guide/targeting.md).

### Tween events

**`(animation, parent)`** — use **`animation.timeline`** for GSAP.

`start`, `complete`, `update`, `repeat`, `reverseComplete`, `interrupt`.

### Tween slot

**`animation`**, **`direction`**, **`parent`**, **`progress`**.

## Timeline

Container for nested **`Tween`**, **`Timeline`**, **`Marker`**, etc. Place **`SplitText` inside a `Tween` slot** — see **[SplitText](#splittext)**.

### Timeline props

| Prop | Type | Description |
|------|------|-------------|
| `duration` | `number` | Fixed total duration; clearing restores natural timing |
| `options` | `gsap.TimelineVars` | GSAP timeline vars (may include `scrollTrigger`) |
| `seamless` | `boolean` | Contribute this instance’s resolved target to the parent tween scope |
| `tweenTarget` | `gsap.DOMTarget` | How to resolve DOM targets |
| `progress` | `number` | Two-way scrub value (0–1) via `v-model:progress` |
| `trigger` | `unknown` | Watched value; each change runs `trigger-action` (default `play`) |
| `triggerAction` | `TweenAction` | `Animation.run()` action when `trigger` changes |
| `triggerOptions` | `AnimationTriggerOptions` | Vue `WatchOptions` for the trigger watcher, plus optional `actionArgs` for `Animation.run` |
| `parent` | `DejaVueAnimationParent \| null` | Parent timeline for nesting — usually omit (inject); override with slot **`parent`** or **`:parent="null"`** to opt out of inject ([Nesting](../guide/nesting.md#manual-parent-assignment)) |
| `position` | `gsap.Position` | Insertion point on the parent timeline |

Same events and slot as **`Tween`**. Same **`parent`** typing note as **[Tween](#tween)**.

## SplitText

GSAP SplitText integration. Place inside a **`Tween` slot**. See [Split text](../guide/split-text.md).

### SplitText props

[`SplitTextOptions`](./composables.md#usesplittext) — `type` defaults to `'lines,words,chars'`.

| Prop | Type | Description |
|------|------|-------------|
| `tweenTarget` | `'lines' \| 'words' \| 'chars'` | Which split level the parent tween animates (defaults to the last segment of `type`) |

Root attribute: **`is`**.

Slot: **`chars`**, **`lines`**, **`words`**.

### SplitText events

**`(splitText: SplitText)`** — GSAP SplitText instance.

| Event | When |
|-------|------|
| `split` | After the text is split |
| `revert` | After the split is reverted |

Use **`@split`** / **`@revert`** on the component. The composable **`useSplitText`** accepts **`onSplit`** / **`onRevert`** in its options object instead.

## Marker

Timeline label (optional) and callback at **`position`**. Emits **`cross`** with **`direction`** (`1` forward, `-1` reverse). Slot: **`crossed`**, **`parent`**. Slot **`crossed`** is **`true`** only after a forward crossing; **`@cross`** receives direction on every crossing.

### Marker props

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Optional GSAP label at this position |
| `parent` | `DejaVueAnimationParent \| null` | Parent timeline — defaults to inject; override with slot **`parent`** or **`:parent="null"`** |
| `position` | `gsap.Position` | Where the callback (and label) are placed |

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
    <Tween :to="{ x: 56 }">
      <div class="target" />
    </Tween>
  </Timeline>
</template>
```

Marker-driven trigger (canonical example): **[Nesting — Marker-driven trigger](../guide/nesting.md#marker-driven-trigger)**.
