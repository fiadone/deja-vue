# Split text

Place **`SplitText` inside a `Tween` slot** so the parent tween animates split nodes.

**`SplitText`** is registered automatically when imported from **`deja-vue`**. [SplitText plugin docs](https://gsap.com/docs/v3/Plugins/SplitText/)

## Props

| Prop | Type | Notes |
|------|------|--------|
| **`type`** | `string` | Defaults to **`'lines,words,chars'`** |
| **`tweenTarget`** | `'lines' \| 'words' \| 'chars'` | Split level for parent scope (defaults to last segment of **`type`**) |
| `mask`, `linesClass`, `wordsClass`, `charsClass`, … | | See [composables API](../api/composables.md#usesplittext) |

Root attribute: **`is`**.

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
        y: 40,
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

## Marker + trigger

```html
<script setup>
import { Marker, SplitText, Tween } from 'deja-vue'

function onCross (direction) {
  console.log('Crossed', direction)
}
</script>

<template>
  <Marker @cross="onCross" v-slot="{ crossed }">
    <Tween
      :from="{ rotate: 360, scale: 0, stagger: 0.1 }"
      :parent="null"
      :trigger="crossed"
      :trigger-action="crossed ? 'restart' : 'play'"
    >
      <SplitText type="chars">
        <p>Split text</p>
      </SplitText>
    </Tween>
  </Marker>
</template>
```

## useSplitText

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
