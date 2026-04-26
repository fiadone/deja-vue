# Nesting Animations

Deja Vue supports nesting animations to create complex hierarchical animation structures. Child animations can be positioned relative to their parent timelines.

## Basic Nesting

```vue
<template>
  <Timeline>
    <Tween method="to" :vars="{ x: 100, duration: 1 }">
      <div>Parent Animation</div>
    </Tween>
    <Timeline position="+=0.5">
      <Tween method="to" :vars="{ y: 50, duration: 0.5 }">
        <div>Child Animation 1</div>
      </Tween>
      <Tween method="to" :vars="{ rotation: 90, duration: 0.5 }" position="+=0">
        <div>Child Animation 2</div>
      </Tween>
    </Timeline>
  </Timeline>
</template>

<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>
```

## Automatic Nesting

When you place animation components inside other animation components, they automatically nest:

```vue
<template>
  <Timeline>
    <Label>start</Label>
    <Tween method="to" :vars="{ scale: 1.2, duration: 1 }" />
    <Timeline position="+=0.5">
      <Tween method="to" :vars="{ x: 50, duration: 0.5 }" />
      <Tween method="to" :vars="{ y: 50, duration: 0.5 }" position="+=0" />
    </Timeline>
    <Label>end</Label>
  </Timeline>
</template>
```

## Labels and Callbacks

Use `Label` and `Callback` components for more control:

```vue
<template>
  <Timeline>
    <Label>intro</Label>
    <Tween method="from" :vars="{ opacity: 0, duration: 1 }" />
    <Label>main</Label>
    <Tween method="to" :vars="{ x: 200, duration: 2 }" />
    <Callback :fn="showMessage" position="main+=1" />
    <Label>outro</Label>
    <Tween method="to" :vars="{ opacity: 0, duration: 1 }" />
  </Timeline>
</template>

<script setup>
import { Timeline, Tween, Label, Callback } from 'deja-vue'

const showMessage = (timeline) => {
  console.log('Main animation halfway done!')
}
</script>
```

## Manual Parent Assignment

You can manually assign a parent animation using the `parent` prop:

```vue
<template>
  <div>
    <Timeline ref="mainTimeline">
      <Tween method="to" :vars="{ x: 100, duration: 1 }" />
    </Timeline>
    <Tween :parent="mainTimeline.animation" method="to" :vars="{ y: 100, duration: 1 }" position="+=0.5">
      <div>Manually nested</div>
    </Tween>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Timeline, Tween } from 'deja-vue'

const mainTimeline = ref()
</script>
```

## Complex Hierarchies

Create deep nesting structures:

```vue
<template>
  <Timeline>
    <Timeline>
      <Timeline>
        <Tween method="to" :vars="{ rotation: 360, duration: 3 }" />
      </Timeline>
      <Tween method="to" :vars="{ scale: 2, duration: 2 }" position="+=1" />
    </Timeline>
    <Tween method="to" :vars="{ x: 300, duration: 4 }" />
  </Timeline>
</template>
```

## Positioning in Nested Timelines

Child animations inherit positioning context from their parents:

- Relative positions (`"+=1"`, `"-=0.5"`) are relative to the parent's current time
- Absolute positions (`1`, `2.5`) are absolute within the parent's timeline
- Label references work within the parent's scope

## Performance Considerations

Deep nesting can impact performance. Consider flattening your animation structure when possible, or use manual parent assignment for better control.