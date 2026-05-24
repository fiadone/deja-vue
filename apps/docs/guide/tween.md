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
  <Tween :to="{ x: 100, duration: 1 }">
    <div class="target" />
  </Tween>
</template>
```

## Animation target

Slotted elements are the default target. See **[Animation targets](./targeting.md)** for **`is`**, **`tween-target`**, and **`seamless`**.

## Tween kinds

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
  />
</template>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `from` | `gsap.TweenVars` | **`from`** vars |
| `to` | `gsap.TweenVars` | **`to`** vars |
| `effect` | `string` | GSAP effect name |
| `effectOptions` | `Record<string, unknown>` | Effect options |
| `seamless` | `boolean` | Parent scope uses this tween’s **`tweenTarget`** |
| `tweenTarget` | [`AnimationTarget`](../api/types.md#animationtarget) | DOM resolution |
| `progress` | `number` | `v-model:progress` |
| `trigger` | `unknown` | Watched value |
| `triggerAction` | `TweenAction` | Action on each **`trigger`** change (default **`play`**) |
| `triggerOptions` | `WatchOptions` | Trigger watcher options |
| `parent` | `DejaVueAnimationPublicInstance \| null` | Parent timeline |
| `position` | `gsap.Position` | Insertion on parent |

## Default slot

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
    :to="{ x: 100, duration: 1 }"
    v-slot="{ progress }"
  >
    <div class="target">
      {{ progress }}
    </div>
  </Tween>
</template>
```

## Events

**`(animation, parent)`** — `start`, `update`, `complete`, `repeat`, `reverseComplete`, `interrupt`.

## Template ref

```html
<script setup>
import { ref } from 'vue'

import { Tween } from 'deja-vue'

const tweenRef = ref()
</script>

<template>
  <Tween
    ref="tweenRef"
    :to="{ x: 100, duration: 1 }"
  >
    <div class="target" />
  </Tween>

  <!-- tweenRef.animation.timeline.play() -->
</template>
```

## Examples

<ClientOnly>
  <TweenStaggerDemo />
</ClientOnly>

```html
<script setup>
import { Tween } from 'deja-vue'
</script>

<template>
  <Tween :from="{ opacity: 0, duration: 0.5 }">
    <div class="target" />
  </Tween>
</template>
```

```html
<script setup>
import { Tween } from 'deja-vue'
</script>

<template>
  <Tween :from="{ opacity: 0, y: 20, duration: 0.5, stagger: 0.1 }">
    <div v-for="item in 5" :key="item" class="target" />
  </Tween>
</template>
```
