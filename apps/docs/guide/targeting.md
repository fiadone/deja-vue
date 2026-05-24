# Animation targets

## Default: slot content

```html
<script setup>
import { Tween } from 'deja-vue'
</script>

<template>
  <Tween :to="{ x: 80, duration: 0.6 }">
    <div class="target" />
  </Tween>
</template>
```

## `tween-target="self"` with `is`

```html
<script setup>
import { Tween } from 'deja-vue'
</script>

<template>
  <Tween
    is="section"
    tween-target="self"
    :to="{ opacity: 0.4, duration: 0.5 }"
  >
    <div class="content" />
  </Tween>
</template>
```

## `is` + selector

```html
<script setup>
import { Tween } from 'deja-vue'
</script>

<template>
  <Tween
    is="div"
    tween-target=".target"
    :to="{ scale: 1.05, duration: 0.3 }"
  >
    <div class="ignored" />
    <div class="target" />
  </Tween>
</template>
```

## Multiple nodes and stagger

Several slot roots → array target. Use **`stagger`** in the tween definition.

## `seamless`

Chain tweens on the same elements:

```html
<script setup>
import { Tween } from 'deja-vue'
</script>

<template>
  <Tween
    :from="{ scale: 0, stagger: 0.1 }"
    v-slot="parent"
  >
    <Tween
      seamless
      :parent
      :to="{ x: 200, stagger: 0.1 }"
    >
      <div class="target" />
    </Tween>
  </Tween>
</template>
```

## `SplitText`

Place **`SplitText`** inside a **`Tween` slot** — see [Split text](./split-text.md).

## ScrollTrigger

Omit **`scrollTrigger.trigger`** in tween vars to default it to the scope root element.

## See also

- [Tween](./tween.md#animation-target)
- [Troubleshooting](./troubleshooting.md)
