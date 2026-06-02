# Split text

Place **`SplitText` inside a `Tween` slot** so the parent tween animates split nodes. See **[Nesting](./nesting.md)** and **[Core concepts](./concepts.md#nesting-at-a-glance)**.

No manual plugin registration — see **[Getting started — GSAP plugins](./getting-started.md#gsap-plugins)**. [SplitText plugin docs](https://gsap.com/docs/v3/Plugins/SplitText/)

## Props

| Prop | Type | Notes |
|------|------|--------|
| **`type`** | `string` | Defaults to **`'lines,words,chars'`** |
| **`tweenTarget`** | `'lines' \| 'words' \| 'chars'` | Split level for parent scope (defaults to last segment of **`type`**) |
| `mask`, `linesClass`, `wordsClass`, `charsClass`, … | | See [composables API](../api/composables.md#usesplittext) |

Root attribute: **`is`**.

## Events

**`@split`** and **`@revert`** receive the GSAP **`SplitText`** instance:

```html
<script setup>
import { SplitText, Tween } from 'deja-vue'

function onSplit (splitText) {
  console.log(splitText.chars)
}

function onRevert (splitText) {
  console.log('reverted', splitText)
}
</script>

<template>
  <Tween :from="{ opacity: 0, stagger: 0.04 }">
    <SplitText
      type="chars"
      @split="onSplit"
      @revert="onRevert"
    >
      <p>Split text</p>
    </SplitText>
  </Tween>
</template>
```

## Example

<ClientOnly>
  <SplitTextDemo />
</ClientOnly>

```html
<script setup>
import { SplitText, Timeline, Tween } from 'deja-vue'
</script>

<template>
  <Timeline>
    <Tween
      :from="{
        y: 56,
        opacity: 0,
        duration: 0.8,
        stagger: 0.04,
        ease: 'power2.out'
      }"
    >
      <SplitText type="chars">
        <p>Split text</p>
      </SplitText>
    </Tween>
  </Timeline>
</template>
```

## Marker + trigger {#marker-trigger}

**`Marker`** must sit inside a **`Timeline`**. Use **`:parent="null"`** on the inner **`Tween`** so playback is driven only by **`crossed`**. Bookend the **`Marker`** with **`Tween`** steps on the timeline. See **[Nesting — Marker-driven trigger](./nesting.md#marker-driven-trigger)** for the full Play/Reverse pattern.

```html
<script setup>
import { Marker, SplitText, Timeline, Tween } from 'deja-vue'
</script>

<template>
  <Timeline>
    <Tween :to="{ x: 56 }">
      <div class="target" />
    </Tween>
    <Marker v-slot="{ crossed }">
      <Tween
        :from="{ opacity: 0 }"
        :parent="null"
        :trigger="crossed"
        :trigger-action="crossed ? 'play' : 'reverse'"
      >
        <SplitText type="chars">
          <p>Split text</p>
        </SplitText>
      </Tween>
    </Marker>
    <Tween :to="{ x: 56 }">
      <div class="target" />
    </Tween>
  </Timeline>
</template>
```

## useSplitText

Headless usage — pass **`onSplit`** / **`onRevert`** in the options object (the **`SplitText`** component uses **`@split`** / **`@revert`** instead):

```html
<script setup>
import { ref } from 'vue'
import { useSplitText } from 'deja-vue'

const root = ref(null)
const { chars, words } = useSplitText(root, { type: 'words,chars' })
</script>

<template>
  <p ref="root" class="target">
    Split text
  </p>
</template>
```
