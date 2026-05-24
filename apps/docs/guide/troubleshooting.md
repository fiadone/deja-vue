# Troubleshooting

## Nothing moves

1. **Empty target** — No slot content, or `v-if` hid nodes on first compose.
2. **Wrong layer** — Default targets are slot children; use **`is`** + **`tween-target="self"`** for the scope root.
3. **Selector without `is`** — String selectors need **`is`**.

## Wrong element animated

1. **Nested `Tween` without `seamless`** — Set **`seamless`** on inner tweens for chains.
2. **`SplitText` outside `Tween` slot** — Wrap with a parent **`Tween`** ([SplitText](./split-text.md)).

## `progress` does not scrub

Use **`v-model:progress`** with a defined number. Pause manually if **`trigger`** also drives playback.

## `trigger` does unexpected action

Bind **`trigger-action`** in the same template as **`trigger`**, e.g. **`:trigger-action="trigger ? 'reverse' : 'play'"`**. See **[Controls](./controls.md)**.

## Tween kind / prop mismatch

One kind per **`Tween`**: **`to`**, **`from`**, **`from`** + **`to`**, or **`effect`**. Use **`:key`** when switching kind at runtime:

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

## Nesting / parent not found

- **`parent="null"`** opts out of inject.
- **`parent`** must be a template ref on **`Timeline`** / **`Tween`**.

## Conditional tweens land in the wrong order

Set explicit **`position`** — see **[Dynamic children](./nesting.md#dynamic-children-v-if-lists)**.

## Marker `cross` fires oddly

**`@cross`** receives **`direction`** from the parent at crossing time (`1` forward, `-1` reverse).

## SplitText flicker

Avoid recreating **`SplitText`** option objects every render.

## Still stuck

[Open an issue](https://github.com/fiadone/deja-vue/issues) with a minimal SFC and package versions.
