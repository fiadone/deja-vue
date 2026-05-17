# Tween Component

> [!TIP]
> Read **[Core concepts](./concepts.md)** and **[Animation targets](./targeting.md)** first.

The `Tween` component maps GSAP tween methods through **`method`** and **`vars`**. Each instance owns one composed tween on an internal timeline.

## Basic Tween

```vue
<template>
  <Tween method="to" :vars="{ x: 100, duration: 1 }">
    <div class="target">Target</div>
  </Tween>
</template>

<script setup>
import { Tween } from 'deja-vue'
</script>
```

## Animation target

Slotted elements are the default target. Use **`is`** / **`target`** on `Tween` for other resolution rules — see **[Animation targets](./targeting.md)**.

## Tween methods

### `to` / `from` / `fromTo` / `effect:%NAME%`

Same as GSAP. For **`fromTo`**, pass **`vars`** as a two-element array.

`vars` may update reactively, but its shape must stay compatible with **`method`**. If you switch between a single vars object (`from`, `to`, `effect:%NAME%`) and a **`fromTo`** tuple, key the component so Vue recreates it:

```vue
<Tween
  :key="method"
  :method="method"
  :vars="method === 'fromTo'
    ? [{ opacity: 0 }, { opacity: 1 }]
    : { opacity: 1 }"
/>
```

## Props reference

### Tween definition

| Prop | Type | Description |
|------|------|-------------|
| `method` | `'from' \| 'to' \| 'fromTo' \| 'effect:%NAME%'` | **Required** |
| `vars` | `gsap.TweenVars \| [...]` | **Required**; kept stable across updates |
| `seamless` | `boolean` | Parent scope uses this tween’s **`target`** (nested chains) |

### Controls and nesting

| Prop | Type | Description |
|------|------|-------------|
| `progress` | `number` | `v-model:progress` |
| `trigger` | `boolean` | `v-model:trigger` |
| `triggerActions` | `TweenAction \| [TweenAction, TweenAction]` | Default `play` / `reverse`; e.g. `['play', 'restart']` |
| `parent` | `DejaVueInstance \| null` | Parent timeline |
| `position` | `gsap.Position` | Insertion on parent |

Use **`v-model:trigger.once`** to run the trigger watcher once.

## Default slot

Scope props: **`animation`**, **`controlled`**, **`direction`**, **`parent`**, **`progress`**, **`target`**.

```vue
<Tween method="to" :vars="{ x: 100, duration: 1 }" v-slot="{ progress }">
  <div class="target">Progress: {{ progress }}</div>
</Tween>
```

## Nested seamless tweens

Chain tweens that each target the previous layer’s elements:

```vue
<Tween method="from" :vars="{ scale: 0, stagger: 0.1 }">
  <Tween seamless method="to" :vars="{ x: 200, stagger: 0.1 }">
    <Tween seamless method="to" :vars="{ rotate: 180, stagger: 0.1 }">
      <div v-for="n in 3" :key="n" class="box" />
    </Tween>
  </Tween>
</Tween>
```

## Events

**`(animation, parent)`** — `animation` is the library wrapper; `parent` is the parent component instance or `null`.

`start`, `update`, `complete`, `repeat`, `reverseComplete`, `interrupt`.

## Template ref

```vue
<Tween ref="tweenRef" method="to" :vars="{ x: 100, duration: 1 }">
  <div class="target">Target</div>
</Tween>

<!-- tweenRef.animation.timeline.play() -->
```

## Examples

```vue
<Tween method="from" :vars="{ opacity: 0, duration: 0.5 }">
  <div class="target">Target</div>
</Tween>
```

```vue
<Tween
  method="from"
  :vars="{ opacity: 0, y: 20, duration: 0.5, stagger: 0.1 }"
>
  <div v-for="item in 5" :key="item" class="box">Box {{ item }}</div>
</Tween>
```
