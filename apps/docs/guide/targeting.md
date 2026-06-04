# Animation targets

## Default: slot content

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

```html
<script setup>
import { Tween } from 'deja-vue'
</script>

<template>
  <Tween :to="{ opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }">
    <div
      v-for="n in 4"
      :key="n"
      class="target"
    />
  </Tween>
</template>
```

## `tween-target="children"`

With a custom root (**`is`**), set **`tween-target="children"`** (or omit **`tween-target`**) to animate **slotted children** instead of the wrapper element. This is the default when **`is`** is not set: slot roots resolve directly.

```html
<script setup>
import { Tween } from 'deja-vue'
</script>

<template>
  <Tween
    is="section"
    tween-target="children"
    :to="{ opacity: 1, stagger: 0.05 }"
  >
    <p v-for="n in 3" :key="n" class="line">
      Line {{ n }}
    </p>
  </Tween>
</template>
```

When the resolved target list changes, running tweens on the previous target are killed and inline styles cleared before recomposing.

## `seamless` {#seamless}

**`seamless`** lets a nested **`Tween`** or **`SplitText`** contribute its **`tweenTarget`** to the **parent tween’s** animated nodes. Use it to chain multiple tweens on the **same elements** inside one wrapper.

**`seamless`** shares DOM targets between nested tweens. On a **`Timeline`**, seamless siblings still register as separate **`Animation`** children on that timeline. See **[How nesting works](./concepts.md#nesting-at-a-glance)**.

<ClientOnly>
  <TimelineSeamlessDemo />
</ClientOnly>

```html
<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>

<template>
  <Timeline>
    <Tween :from="{ scale: 0, stagger: 0.1 }">
      <Tween
        seamless
        :to="{ rotate: 180, stagger: 0.1 }"
      >
        <Tween
          seamless
          :to="{ x: 56, stagger: 0.1 }"
        >
          <div v-for="n in 3" :key="n" class="target" />
        </Tween>
      </Tween>
    </Tween>
  </Timeline>
</template>
```

**`SplitText`** is always seamless: place it inside a **`Tween`** so split chars, words, or lines become that tween’s target. See **[Split text](./split-text.md)**.

## ScrollTrigger {#scrolltrigger}

Use **`scrollTrigger`** in **`Tween`** **`from`** / **`to`** vars, or in **`Timeline`** **`options`**. Déjà Vue extracts it from GSAP vars and attaches a **`ScrollTrigger`** to the component timeline. No **`gsap.registerPlugin(ScrollTrigger)`** is required — see **[Getting started — GSAP plugins](./getting-started.md#gsap-plugins)**.

```html
<script setup>
import { Tween } from 'deja-vue'
</script>

<template>
  <Tween
    is="section"
    tween-target="children"
    :to="{
      y: 100,
      scrollTrigger: {
        start: 'top center',
        end: 'bottom center',
        scrub: true
      }
    }"
  >
    <div class="target" />
  </Tween>
</template>
```

### Default `scrollTrigger.trigger` {#scrolltrigger-default-trigger}

When **`scrollTrigger.trigger`** is omitted, Déjà Vue sets it to the **component root** — the DOM element rendered for **`Tween`** / **`Timeline`** when the root attribute **`is`** is set (the same element as **`$el`** on the exposed instance).

This default does **not** use the resolved **tween target**. Targets are **`gsap.TweenTarget`**, which can include values that are valid for tweens but not for ScrollTrigger’s **`trigger`**. The component root is always a concrete **`Element`**.

**Requirement:** for the automatic default to work, set **`is`** so a single root element exists. Without **`is`**, there is no component root to bind — either add **`is`** or set **`scrollTrigger.trigger`** explicitly (selector, element, or another scroll sensor).

Set **`scrollTrigger.trigger`** when the scroll sensor should differ from the component wrapper — for example scrubbing slotted children while observing a parent section:

```html
<Tween
  :to="{
    y: 100,
    scrollTrigger: {
      trigger: '.target',
      start: 'top center',
      scrub: true
    }
  }"
>
  <div class="target" />
</Tween>
```

For **`fromTo`**, put **`scrollTrigger`** on the **`to`** vars.

When **`scrollTrigger`** is removed or cleared from props, the linked instance is destroyed. Config changes re-attach after the DOM updates.

If **`toggleActions`** includes **`reset`** on an edge, Déjà Vue emits **`update`** when that edge fires so **`v-model:progress`** and **`Marker`** slot **`crossed`** stay aligned after ScrollTrigger rewinds the timeline.

### Smooth scroll {#smooth-scroll}

With smooth-scroll libraries (Lenis, etc.), call **`ScrollTrigger.update()`** on their scroll event so scrub positions stay in sync.

## See also

- [Tween](./tween.md#animation-target)
- [Troubleshooting](./troubleshooting.md)
