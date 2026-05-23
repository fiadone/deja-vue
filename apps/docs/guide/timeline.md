# Timeline Component

> [!TIP]
> Read **[Core concepts](./concepts.md)** for nesting and rebuild behavior.

The `Timeline` component sequences nested **`Tween`**, **`Timeline`**, **`Marker`**, **`SplitText`**, and other nestables. There is **no `tweens` prop** — build sequences in the template.

## What is a Timeline?

A timeline holds child animations, labels, and callbacks on one GSAP timeline. Target resolution matches **`Tween`** ([Animation targets](./targeting.md)).

## Basic timeline sequence

<ClientOnly>
  <TimelineSequenceDemo />
</ClientOnly>

```html
<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>

<template>
  <Timeline>
    <Tween
      method="to"
      :vars="{ x: 100 }"
    >
      <div
        class="target"
      >
        First
        target
      </div>
    </Tween>
    <Tween
      method="to"
      position="+=0.5"
      :vars="{ y: 100 }"
    >
      <div
        class="target"
      >
        Second
        target
      </div>
    </Tween>
  </Timeline>
</template>
```

## Timeline with seamless tween nesting

Use the *seamless* prop when nesting Tween components within a Timeline to create a sequence of tweens on the same target.

<ClientOnly>
  <TimelineSeamlessDemo />
</ClientOnly>

```html
<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>

<template>
  <Timeline>
    <Tween
      method="from"
      :vars="{ scale: 0, stagger: 0.1 }"
    >
      <Tween
        seamless
        method="to"
        :vars="{ rotate: 360, stagger: 0.1 }"
      >
        <Tween
          seamless
          method="to"
          :vars="{ x: 100, stagger: 0.1 }"
        >
          <div
            v-for="n in 3"
            :key="n"
            class="demo-box"
          >
            {{ n }}
          </div>
        </Tween>
      </Tween>
    </Tween>
  </Timeline>
</template>
```

## Props reference

| Prop | Type | Description |
|------|------|-------------|
| `duration` | `number` | Fixed total duration |
| `options` | `gsap.TimelineVars` | GSAP options |
| `progress` | `number` | `v-model:progress` |
| `trigger` | `boolean` | `v-model:trigger` |
| `triggerActions` | `TweenAction \| [TweenAction, TweenAction]` | Trigger mapping |
| `parent` | `DejaVueInstance \| null` | Parent |
| `position` | `gsap.Position` | Position on parent |

Use **`v-model:trigger.once`** to run the trigger watcher once.

## Positioning

Use **`position`** on nested children:

```html
<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>

<template>
  <Timeline>
    <Tween
      method="to"
      :vars="{ x: 100, duration: 1 }"
    />
    <Tween
      method="to"
      position="+=0.5"
      :vars="{ y: 100, duration: 1 }"
    />
    <Tween
      method="to"
      position="-=0.3"
      :vars="{ rotation: 360, duration: 1 }"
    />
  </Timeline>
</template>
```

## Markers

Use **`Marker`** for labels and cross events (replaces separate callback/label components):

```html
<script setup>
import { Marker, Timeline, Tween } from 'deja-vue'

function onMiddle (direction) {
  console.log('Crossed middle', direction === 1 ? 'forward' : 'reverse')
}
</script>

<template>
  <Timeline>
    <Marker
      label="start"
    />

    <Tween
      method="from"
      :vars="{ opacity: 0, duration: 1 }"
    >
      <div
        class="target"
      >
        Fade
        target
      </div>
    </Tween>

    <Marker
      label="middle"
      @cross="onMiddle"
    />

    <Tween
      method="to"
      :vars="{ x: 200, duration: 2 }"
    >
      <div
        class="target"
      >
        Move
        target
      </div>
    </Tween>

    <Marker
      label="end"
    />
  </Timeline>
</template>
```

## Timeline duration

```html
<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>

<template>
  <Timeline
    :duration="3"
  >
    <Tween
      method="to"
      :vars="{ x: 100 }"
    >
      <div class="target">
        Target
      </div>
    </Tween>
  </Timeline>
</template>
```

When **`duration`** is a positive number, the timeline preserves that fixed total duration as children are added or removed. **`0`**, **`undefined`**, or clearing the prop restores natural timing by removing the stored total duration, resetting **`timeScale(1)`**, and invalidating the timeline.

## GSAP timeline options

```html
<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>

<template>
  <Timeline
    :options="{ repeat: 2, yoyo: true, paused: true }"
  >
    <Tween
      method="to"
      :vars="{ x: 100, duration: 1 }"
    >
      <div class="target">
        Target
      </div>
    </Tween>
  </Timeline>
</template>
```

## Events and slot

Same as **`Tween`**: events **`(animation, parent)`**; slot scope includes **`direction`**, **`progress`**, etc.

## Nested timeline

```html
<script setup>
import { Timeline, Tween } from 'deja-vue'
</script>

<template>
  <Timeline>
    <Tween
      method="to"
      :vars="{ x: 100, duration: 1 }"
    />
    <Timeline
      position="+=0.5"
    >
      <Tween
        method="to"
        :vars="{ y: 50, duration: 0.5 }"
      />
      <Tween
        method="to"
        position="<"
        :vars="{ rotation: 90, duration: 0.5 }"
      />
    </Timeline>
  </Timeline>
</template>
```
