# Nesting Animations

> [!NOTE]
> Overview: **[Nesting at a glance](./concepts.md#nesting-at-a-glance)** in *Core concepts*.

Child animations attach to a parent timeline via Vue **provide / inject**. The parent **`Timeline`** provides a **`DejaVueInstance`** instance; children call **`parent.animation.add(...)`** through **`useAnimationNesting`**.

## Automatic nesting

<ClientOnly>
  <TimelineSequenceDemo />
</ClientOnly>

```vue
<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>

<template>
  <Timeline>
    <Tween method="to" :vars="{ x: 100, duration: 1 }">
      <div class="target">First target</div>
    </Tween>
    <Tween method="to" position="+=0.5" :vars="{ y: 100, duration: 1 }">
      <div class="target">Second target</div>
    </Tween>
  </Timeline>
</template>
```

## Timeline inside timeline

<ClientOnly>
  <TimelineNestedDemo />
</ClientOnly>

```vue
<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>

<template>
  <Timeline>
    <Tween method="to" :vars="{ x: 100, duration: 1 }" />
    <Timeline position="+=0.5">
      <Tween method="to" :vars="{ y: 50, duration: 0.5 }" />
      <Tween method="to" position="<" :vars="{ rotation: 90, duration: 0.5 }" />
    </Timeline>
  </Timeline>
</template>
```

## Marker (labels + cross events)

**`Marker`** registers an optional **label** and a **callback** when the playhead crosses **`position`**. It emits **`cross`** with **`direction`** (`1` forward, `-1` reverse).

```vue
<script setup>
import { Timeline, Tween, Marker } from 'deja-vue'

function onMain (direction) {
  console.log('Crossed main', direction)
}
</script>

<template>
  <Timeline>
    <Marker label="intro" />
    <Tween method="from" :vars="{ opacity: 0, duration: 1 }" />
    <Marker label="main" @cross="onMain" />
    <Tween method="to" :vars="{ x: 200, duration: 2 }" />
  </Timeline>
</template>
```

Slot pattern (drive a child tween from marker state):

```vue
<script setup>
import { Marker, SplitText, Tween } from 'deja-vue'

function onCross (direction) {
  console.log('Crossed', direction)
}
</script>

<template>
  <Marker v-slot="{ crossed }" label="split" @cross="onCross">
    <Tween
      :trigger="crossed"
      :trigger-actions="['play', 'restart']"
      method="from"
      :vars="{ opacity: 0 }"
    >
      <SplitText type="chars">
        <p class="target">Split text</p>
      </SplitText>
    </Tween>
  </Marker>
</template>
```

## Manual parent assignment

```vue
<script setup>
import { ref } from 'vue'
import { Timeline, Tween } from 'deja-vue'

const mainTimeline = ref()
</script>

<template>
  <Timeline ref="mainTimeline">
    <Tween method="to" :vars="{ x: 100, duration: 1 }" />
  </Timeline>

  <Tween
    :parent="mainTimeline"
    position="+=0.5"
    method="to"
    :vars="{ y: 100, duration: 1 }"
  />
</template>
```

Use the template ref’s exposed component instance (the ref value **is** the **`DejaVueInstance`**).

## Preventing automatic nesting

```vue
<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>

<template>
  <Timeline>
    <Tween method="to" :vars="{ x: 100, duration: 1 }" />
    <Tween :parent="null" method="to" :vars="{ y: 100, duration: 1 }" />
  </Timeline>
</template>
```

## Parallel animations

```vue
<script setup>
import { Timeline, Tween, Marker } from 'deja-vue'
</script>

<template>
  <Timeline>
    <Marker label="parallel" />
    <Tween method="to" position="parallel" :vars="{ x: 100, duration: 1 }" />
    <Tween method="to" position="parallel" :vars="{ y: 100, duration: 1 }" />
  </Timeline>
</template>
```

## Staggered list

```vue
<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>

<template>
  <Timeline>
    <Tween method="from" :vars="{ opacity: 0, y: 20, duration: 0.5, stagger: 0.1 }">
      <div v-for="item in items" :key="item" class="box">Box {{ item }}</div>
    </Tween>
  </Timeline>
</template>
```
