# Split text

> [!TIP]
> Put **`SplitText` inside a `Tween` slot** so the parent tween animates split nodes. See **[Animation targets](./targeting.md)**.

**`SplitText`** and **`useSplitText`** integrate GSAP SplitText. Register the GSAP plugin in your app setup before using them:

```typescript
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)
```

The library does not register GSAP plugins for you; the same applies to plugins such as **`ScrollTrigger`**.

[SplitText plugin docs](https://gsap.com/docs/v3/Plugins/SplitText/)

## SplitText component

### Props (`SplitTextOptions`)

| Prop | Type | Notes |
|------|------|--------|
| **`type`** | `string` | Optional; defaults to **`'lines,words,chars'`** |
| `mask`, `linesClass`, `wordsClass`, `charsClass`, … | | See [composables API](../api/composables.md#usesplittext) |

Slot content is split unless **`is`** targets the root element.

### `tweenTarget` attribute

**`lines`**, **`words`**, or **`chars`** — which split level the **parent `Tween`** receives as **`target`**. Defaults to the last segment of **`type`**.

### Example

```vue
<template>
  <Timeline>
    <Tween
      method="from"
      :vars="{
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.04,
        ease: 'power2.out'
      }"
    >
      <SplitText type="chars" :reduce-white-space="true">
        <p class="target">Split text target</p>
      </SplitText>
    </Tween>
  </Timeline>
</template>

<script setup>
import { Timeline, Tween, SplitText } from 'deja-vue'
</script>
```

A single **`Tween`** without **`Timeline`** works the same way.

### Marker + trigger pattern

Wrap the tween in **`Marker`** and drive **`trigger`** from the slot:

```vue
<Marker v-slot="{ crossed }" @cross="onCross">
  <Tween
    :trigger="crossed"
    :trigger-actions="['play', 'restart']"
    :parent="null"
    method="from"
    :vars="{ rotate: 360, scale: 0, stagger: 0.1 }"
  >
    <SplitText type="chars">
      <p class="target">Split text target</p>
    </SplitText>
  </Tween>
</Marker>
```

## useSplitText

For custom components when you already hold a DOM ref:

```vue
<script setup>
import { ref } from 'vue'
import { useSplitText } from 'deja-vue'

const root = ref(null)
const { state } = useSplitText(root, { type: 'words,chars' })
</script>

<template>
  <p ref="root" class="target">Split text target</p>
</template>
```

## See also

- [Animation targets](./targeting.md) — **`seamless`**
- [Components API: SplitText](../api/components.md#splittext)
- [Composables API: useSplitText](../api/composables.md#usesplittext)
