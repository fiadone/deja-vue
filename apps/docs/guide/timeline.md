# Timeline Component

The `Timeline` component sequences nested **`Tween`**, **`Timeline`**, and **`Marker`** components. Place **`SplitText`** inside a **`Tween` slot** (see **[Split text](./split-text.md)**). Nesting rules: **[Core concepts](./concepts.md#nesting-at-a-glance)**, **[Nesting](./nesting.md)**.

## Basic timeline sequence {#basic-timeline-sequence}

<ClientOnly>
  <TimelineSequenceDemo />
</ClientOnly>

```html
<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>

<template>
  <Timeline>
    <Tween :to="{ x: 56 }">
      <div class="target" />
    </Tween>
    <Tween :to="{ y: -56, rotate: 90 }">
      <div class="target" />
    </Tween>
  </Timeline>
</template>
```

Use **`position`** for GSAP placement on the parent timeline. More patterns (nested timelines, markers, parallel tweens, manual **`parent`**) live in **[Nesting](./nesting.md)**.

## Seamless tween chains {#seamless-tween-chains}

Seamless nested tweens share the same DOM target inside a wrapper. See **[Animation targets — seamless](./targeting.md#seamless)** (canonical example with **`Timeline`**).

## Props, events, and slot

Full prop and event reference: **[Components API — Timeline](../api/components.md#timeline)**.

**Default slot:** **`animation`**, **`direction`**, **`parent`**, **`progress`** (same as **[Tween — Default slot](./tween.md#default-slot)**).

**Events:** **`(animation, parent)`** — `start`, `update`, `complete`, `repeat`, `reverseComplete`, `interrupt`.

## Imperative playback

Use **`trigger`** + **`trigger-action`** for button-driven **`play`**, **`reverse`**, **`reset`**, **`restart`**, and so on — see **[Animation controls — Trigger](./controls.md#trigger)**. To pass **`parent`** to a nested child, use the inner **`Timeline`** slot — **[Nesting — Manual parent assignment](./nesting.md#manual-parent-assignment)**.

## Timeline duration

```html
<Timeline :duration="3">
  <Tween :to="{ x: 56 }">
    <div class="target" />
  </Tween>
</Timeline>
```

A positive **`duration`** preserves fixed total timing as children are added or removed.

## GSAP timeline options

```html
<Timeline :options="{ repeat: 2, yoyo: true, paused: true }">
  <Tween :to="{ x: 56 }">
    <div class="target" />
  </Tween>
</Timeline>
```

**`options`** updates apply to the timeline vars and to children added after the change. Remount with **`:key`** if every child must pick up new vars.

## ScrollTrigger

Pass **`scrollTrigger`** inside **`options`**. Full setup, defaults, and smooth-scroll notes: **[Animation targets — ScrollTrigger](./targeting.md#scrolltrigger)**.
