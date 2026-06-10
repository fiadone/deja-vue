# Tween Component

The `Tween` component composes one GSAP tween from **`from`**, **`to`**, or **`effect`** props.

## Basic Tween

<ClientOnly>
  <TweenBasicDemo />
</ClientOnly>

```html
<script setup>
import { Tween } from 'deja-vue'
</script>

<template>
  <Tween :to="{ x: 56 }">
    <div class="target" />
  </Tween>
</template>
```

## Animation target {#animation-target}

Slotted elements are the default target. See **[Animation targets](./targeting.md)** for **`is`**, **`tween-target`**, and **`seamless`**.

## Revert on dispose {#revert-on-dispose}

By default, clearing or unmounting a **`Tween`** kills its GSAP context — animations stop but inline styles may remain. Set **`revert-on-dispose`** when you want DOM state restored (for example after **`v-if`** teardown or when tween vars change and the tween recomposes). Nested **`Timeline`** instances use the same prop on unmount only.

## Tween kinds {#tween-kinds}

Use **`:to`**, **`:from`**, both for **`fromTo`**, or **`effect`** + **`effect-options`**. One kind per **`Tween`**. Key the component when switching kind at runtime — see **[Troubleshooting](./troubleshooting.md#tween-kind-prop-mismatch)**:

```html
<script setup>
import { ref } from 'vue'

import { Tween } from 'deja-vue'

const mode = ref<'to' | 'fromTo'>('to')
</script>

<template>
  <Tween
    :key="mode"
    v-bind="mode === 'fromTo'
      ? { from: { opacity: 0 }, to: { opacity: 1 } }
      : { to: { opacity: 1 } }"
  >
    <div class="target" />
  </Tween>
</template>
```

## Props, events, and slot

Full prop and event reference: **[Components API — Tween](../api/components.md#tween)**.

Scroll-linked tweens: put **`scrollTrigger`** in **`from`** / **`to`** vars — **[Animation targets — ScrollTrigger](./targeting.md#scrolltrigger)**.

## Default slot {#default-slot}

**`animation`**, **`direction`**, **`parent`**, **`progress`**.

<ClientOnly>
  <TweenProgressSlotDemo />
</ClientOnly>

```html
<script setup>
import { Tween } from 'deja-vue'
</script>

<template>
  <Tween
    :to="{ x: 56 }"
    v-slot="{ progress }"
  >
    <div class="target">
      {{ ~~(progress * 100) }}%
    </div>
  </Tween>
</template>
```

## Events

**`(animation, parent)`** — `start`, `update`, `complete`, `repeat`, `reverseComplete`, `interrupt`.

## Instance access

See **[Component instance types](../api/types.md#component-instance-types)** when you need script-side access. For playback, use **[Animation controls — Trigger](./controls.md#trigger)**.

## Examples

<ClientOnly>
  <TweenStaggerDemo />
</ClientOnly>

```html
<script setup>
import { Tween } from 'deja-vue'
</script>

<template>
  <Tween :from="{ opacity: 0, y: 56, stagger: 0.1 }">
    <div
      v-for="n in 3"
      :key="n"
      class="target"
    />
  </Tween>
</template>
```
