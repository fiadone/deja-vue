# Nesting Animations

Nest **`Tween`**, **`Timeline`**, and **`Marker`** inside a parent **`Timeline`**. Use **`position`** to control placement on the parent timeline.

Place **`SplitText` inside a `Tween` slot**. Wrap that **`Tween`** in a **`Timeline`** when you need sequencing. See **[Split text](./split-text.md)**.

How inject and **`seamless`** interact with nesting: **[Core concepts — How nesting works](./concepts.md#nesting-at-a-glance)**.

## Getting started with sequences

For a first timeline walkthrough (with demo), see **[Timeline — Basic timeline sequence](./timeline.md#basic-timeline-sequence)**.

## Dynamic children (`v-if`, lists)

Without **`position`**, re-added children append at the timeline end. Set explicit **`position`** when conditional composition must land at a specific time.

Removing a nested child (e.g. **`v-if`** turned off) uses the same **`Animation.remove`** rules as the imperative API: removal is **immediate** when the parent timeline is **paused**, and **deferred** until **`complete`** or **`reverseComplete`** while the parent is **playing**. Component unmount always forces removal. See **[Types API — `remove`](../api/types.md#animation)**.

```html
<script setup>
import { ref } from 'vue'

import { Timeline, Tween } from 'deja-vue'

const showSecond = ref(true)
</script>

<template>
  <Timeline>
    <Tween :to="{ x: 56 }">
      <div class="target" />
    </Tween>
    <Tween
      v-if="showSecond"
      position="start"
      :to="{ y: 56 }"
    >
      <div class="target" />
    </Tween>
  </Timeline>
</template>
```

## Timeline inside timeline

<ClientOnly>
  <TimelineNestedDemo />
</ClientOnly>

```html
<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>

<template>
  <Timeline>
    <Tween :to="{ x: 56 }">
      <div class="target" />
    </Tween>
    <Timeline>
      <Tween :to="{ y: 56 }">
        <div class="target" />
      </Tween>
      <Tween
        position="<"
        :to="{ rotation: 90 }"
      >
        <div class="target" />
      </Tween>
    </Timeline>
  </Timeline>
</template>
```

## Marker {#marker}

```html
<script setup>
import { Marker, Timeline, Tween } from 'deja-vue'

function onMain (direction) {
  console.log('Crossed main', direction)
}
</script>

<template>
  <Timeline>
    <Marker label="intro" />
    <Tween :from="{ opacity: 0 }">
      <div class="target" />
    </Tween>
    <Marker label="main" @cross="onMain" />
    <Tween :to="{ x: 56 }">
      <div class="target" />
    </Tween>
  </Timeline>
</template>
```

Slot **`crossed`** is **`true`** on forward crossings only. Full API notes: **[Components API — Marker](../api/components.md#marker)**.

### Marker-driven trigger {#marker-driven-trigger}

Inner **`Tween`** uses **`:parent="null"`** so playback follows **`crossed`** from the marker slot. Bookend the **`Marker`** with **`Tween`** steps so the timeline has duration to scrub. Drive the outer **`Timeline`** with **`trigger`** + **`trigger-action`** (Play/Reverse in the demo). Split-text variant: **[Split text — Marker + trigger](./split-text.md#marker-trigger)**.

<ClientOnly>
  <MarkerTriggerDemo />
</ClientOnly>

```html
<script setup>
import { ref } from 'vue'

import { Marker, Timeline, Tween } from 'deja-vue'

const isPlaying = ref(false)

function onCross (direction) {
  console.log('Crossed', direction)
}
</script>

<template>
  <button @click="isPlaying = !isPlaying">
    {{ isPlaying ? 'Reverse' : 'Play' }}
  </button>
  <Timeline
    :trigger="isPlaying"
    :trigger-action="isPlaying ? 'play' : 'reverse'"
  >
    <Tween :to="{ x: 56 }">
      <div class="target" />
    </Tween>
    <Marker
      @cross="onCross"
      v-slot="{ crossed }"
    >
      <Tween
        :from="{ opacity: 0 }"
        :parent="null"
        :trigger="crossed"
        :trigger-action="crossed ? 'play' : 'reverse'"
      >
        <div class="target" />
      </Tween>
    </Marker>
    <Tween :to="{ x: 56 }">
      <div class="target" />
    </Tween>
  </Timeline>
</template>
```

## Manual parent assignment {#manual-parent-assignment}

Inside a **`Timeline`**, descendants nest automatically via **`inject`**. You only need **`:parent`** when registration must target a **different** timeline than the nearest inject parent.

### From the default slot

On a **nested** **`Timeline`**, the default slot exposes **`parent`**: the injected parent timeline (the outer one). Pass it to **`:parent`** on a child that should register there instead of on the inner timeline:

```html
<script setup>
import { Marker, Timeline, Tween } from 'deja-vue'
</script>

<template>
  <Timeline>
    <Timeline v-slot="{ parent: outerTimeline }">
      <Marker
        :parent="outerTimeline"
        label="on-outer"
      />
      <Tween :to="{ x: 56 }">
        <div class="target" />
      </Tween>
    </Timeline>
  </Timeline>
</template>
```

Slot **`parent`** is the same value **`inject`** would resolve for that **`Timeline`** — usable as **`DejaVueAnimationParent`** on the **`parent`** prop. On a root **`Timeline`**, slot **`parent`** is **`null`**. Prefer nesting inside the **`Timeline`** tree; a component that cannot live in that tree is an edge case — see **[Troubleshooting — Nesting / parent](./troubleshooting.md#nesting-parent-not-found)**.

## Preventing automatic nesting

```html
<Timeline>
  <Tween :to="{ x: 56 }">
    <div class="target" />
  </Tween>
  <Tween :parent="null" :to="{ y: 56 }">
    <div class="target" />
  </Tween>
</Timeline>
```

## Parallel animations

Place a **`Marker`** label, then set sibling **`position`** to that label name so tweens start at the same time:

```html
<script setup>
import { Marker, Timeline, Tween } from 'deja-vue'
</script>

<template>
  <Timeline>
    <Marker label="parallel" />
    <Tween position="parallel" :to="{ x: 56 }">
      <div class="target" />
    </Tween>
    <Tween position="parallel" :to="{ y: 56 }">
      <div class="target" />
    </Tween>
  </Timeline>
</template>
```

## Staggered list

```html
<Timeline>
  <Tween :from="{ opacity: 0, y: 56, stagger: 0.1 }">
    <div v-for="n in 3" :key="n" class="target" />
  </Tween>
</Timeline>
```

Seamless chains on shared targets: **[Animation targets — seamless](./targeting.md#seamless)**.
