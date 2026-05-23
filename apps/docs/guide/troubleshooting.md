# Troubleshooting

> [!TIP]
> **[Core concepts](./concepts.md)** and **[Animation targets](./targeting.md)** first.

## Nothing moves

1. **Empty target** — No slot content or `v-if` hid nodes on first compose.
2. **Wrong layer** — Default targets are **slot children**, not the scope root; use **`is`** + **`target="self"`** if needed.
3. **Selector without `is`** — String selectors need **`is`** for scoped `gsap.utils.toArray`.

## Wrong element animated

1. **Nested `Tween` without `seamless`** — Parent may tween wrapper DOM; set **`seamless`** on inner tweens for chains.
2. **`SplitText` outside `Tween` slot** — Parent must wrap **`SplitText`** so **`seamless`** / **`target`** apply ([SplitText](./split-text.md)).

## `progress` does not scrub

Use **`v-model:progress`**. Bind a defined number, not `undefined`. Pause manually if **`trigger`** also drives playback.

## `trigger` does unexpected action

Each **`trigger`** change runs **`trigger-action`** (default **`play`**) in the trigger watcher. Bind the action in the **same template** as **`trigger`**, e.g. **`:trigger-action="trigger ? 'reverse' : 'play'"`**.

Avoid updating **`trigger-action`** only in a separate **`watch(trigger, …, { flush: 'post' })`** — that can run **after** the library watcher has already fired. The docs **`Demo`** wrapper uses a post watcher to supply **`trigger-action`** to slot demos; in your app, prefer inline bindings. Use **`trigger-options`** (e.g. **`{ flush: 'post' }`**) only when you intentionally need to align watcher timing. See **[Animation controls](./controls.md)**.

## Tween kind / prop mismatch

Use only one kind per **`Tween`**: **`to`**, **`from`**, **`from`** + **`to`**, or **`effect`**. Switching kind at runtime can leave stale keys on stable objects — use a **`:key`** so Vue recreates the component:

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
- Manual **`parent`** must be the **`DejaVueInstance`** ref (template ref on **`Timeline`** / **`Tween`**), not only `animation`.

## Conditional tweens land in the wrong order

Each nestable registers independently. Without **`position`**, a child added after **`v-if`** becomes true is appended at the **timeline end**, not reinserted at its template slot. **Remove** still collapses trailing siblings. Set an explicit **`position`** (label, absolute time, **`+=`**, etc.) or see **[Dynamic children](./nesting.md#dynamic-children-v-if-lists)**.

## Marker `cross` fires oddly

**`@cross`** receives **`direction`** from the **parent** animation’s **`direction`** ref at crossing time. Use `direction === 1` vs `-1` for forward vs reverse.

## SplitText flicker

Avoid recreating large **`SplitText`** option objects every render. **`type`** defaults to **`lines,words,chars`** if omitted.

## Still stuck

[Open an issue](https://github.com/fiadone/deja-vue/issues) with a minimal SFC and package versions.
