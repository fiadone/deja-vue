# Nesting Animations

Nest **`Tween`**, **`Timeline`**, **`Marker`**, and **`SplitText`** inside a parent **`Timeline`**. Use **`position`** to control placement on the parent timeline.

## Dynamic children (`v-if`, lists)

Without **`position`**, re-added children append at the timeline end. Set explicit **`position`** when conditional composition must land at a specific time.

## Automatic nesting

<ClientOnly>
  <TimelineSequenceDemo />
</ClientOnly>

```html
<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>

<template>
  <Timeline>
    <Tween :to="{ x: 100, duration: 1 }">
      <div class="target" />
    </Tween>
    <Tween position="+=0.5" :to="{ y: 100, duration: 1 }">
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
    <Tween :to="{ x: 100, duration: 1 }">
      <div class="target" />
    </Tween>
    <Timeline position="+=0.5">
      <Tween :to="{ y: 50, duration: 0.5 }">
        <div class="target" />
      </Tween>
      <Tween position="<" :to="{ rotation: 90, duration: 0.5 }">
        <div class="target" />
      </Tween>
    </Timeline>
  </Timeline>
</template>
```

## Marker

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
    <Tween :from="{ opacity: 0, duration: 1 }">
      <div class="target" />
    </Tween>
    <Marker label="main" @cross="onMain" />
    <Tween :to="{ x: 200, duration: 2 }">
      <div class="target" />
    </Tween>
  </Timeline>
</template>
```

Slot pattern:

```html
<script setup>
import { Marker, SplitText, Tween } from 'deja-vue'

function onCross (direction) {
  console.log('Crossed', direction)
}
</script>

<template>
  <Marker
    label="split"
    @cross="onCross"
    v-slot="{ crossed }"
  >
    <Tween
      :from="{ opacity: 0 }"
      :trigger="crossed"
      :trigger-action="crossed ? 'play' : 'restart'"
    >
      <SplitText type="chars">
        <p>Split text</p>
      </SplitText>
    </Tween>
  </Marker>
</template>
```

## Manual parent assignment

```html
<script setup>
import { ref } from 'vue'

import { Timeline, Tween } from 'deja-vue'

const mainTimeline = ref()
</script>

<template>
  <Timeline ref="mainTimeline">
    <Tween :to="{ x: 100, duration: 1 }">
      <div class="target" />
    </Tween>
  </Timeline>

  <Tween
    :parent="mainTimeline"
    :position="'+=0.5'"
    :to="{ y: 100, duration: 1 }"
  >
    <div class="target" />
  </Tween>
</template>
```

## Preventing automatic nesting

```html
<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>

<template>
  <Timeline>
    <Tween :to="{ x: 100, duration: 1 }">
      <div class="target" />
    </Tween>
    <Tween
      :parent="null"
      :to="{ y: 100, duration: 1 }"
    >
      <div class="target" />
    </Tween>
  </Timeline>
</template>
```

## Parallel animations

```html
<script setup>
import { Marker, Timeline, Tween } from 'deja-vue'
</script>

<template>
  <Timeline>
    <Marker label="parallel" />
    <Tween
      position="parallel"
      :to="{ x: 100, duration: 1 }"
    >
      <div class="target" />
    </Tween>
    <Tween
      position="parallel"
      :to="{ y: 100, duration: 1 }"
    >
      <div class="target" />
    </Tween>
  </Timeline>
</template>
```

## Staggered list

```html
<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>

<template>
  <Timeline>
    <Tween :from="{ opacity: 0, y: 20, duration: 0.5, stagger: 0.1 }">
      <div v-for="n in 3" :key="n" class="target" />
    </Tween>
  </Timeline>
</template>
```
