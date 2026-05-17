# Nesting Animations

> [!NOTE]
> Overview: **[Nesting at a glance](./concepts.md#nesting-at-a-glance)** in *Core concepts*.

Child animations attach to a parent timeline via Vue **provide / inject**. The parent **`Timeline`** provides a **`DejaVueInstance`** instance; children call **`parent.animation.add(...)`** through **`useAnimationNesting`**.

## Automatic nesting

```vue
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

<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>
```

## Timeline inside timeline

```vue
<Timeline>
  <Tween method="to" :vars="{ x: 100, duration: 1 }" />
  <Timeline position="+=0.5">
    <Tween method="to" :vars="{ y: 50, duration: 0.5 }" />
    <Tween method="to" position="<" :vars="{ rotation: 90, duration: 0.5 }" />
  </Timeline>
</Timeline>
```

## Marker (labels + cross events)

**`Marker`** registers an optional **label** and a **callback** when the playhead crosses **`position`**. It emits **`cross`** with **`direction`** (`1` forward, `-1` reverse).

```vue
<Timeline>
  <Marker label="intro" />
  <Tween method="from" :vars="{ opacity: 0, duration: 1 }" />
  <Marker label="main" @cross="onMain" />
  <Tween method="to" :vars="{ x: 200, duration: 2 }" />
</Timeline>
```

Slot pattern (drive a child tween from marker state):

```vue
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
```

## Manual parent assignment

```vue
<Timeline ref="mainTimeline">
  <Tween method="to" :vars="{ x: 100, duration: 1 }" />
</Timeline>

<Tween
  :parent="mainTimeline"
  position="+=0.5"
  method="to"
  :vars="{ y: 100, duration: 1 }"
/>
```

Use the template ref’s exposed component instance (the ref value **is** the **`DejaVueInstance`**).

## Preventing automatic nesting

```vue
<Timeline>
  <Tween method="to" :vars="{ x: 100, duration: 1 }" />
  <Tween :parent="null" method="to" :vars="{ y: 100, duration: 1 }" />
</Timeline>
```

## Parallel animations

```vue
<Timeline>
  <Marker label="parallel" />
  <Tween method="to" position="parallel" :vars="{ x: 100, duration: 1 }" />
  <Tween method="to" position="parallel" :vars="{ y: 100, duration: 1 }" />
</Timeline>
```

## Staggered list

```vue
<Timeline>
  <Tween method="from" :vars="{ opacity: 0, y: 20, duration: 0.5, stagger: 0.1 }">
    <div v-for="item in items" :key="item" class="box">Box {{ item }}</div>
  </Tween>
</Timeline>
```
