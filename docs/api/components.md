# Components API

## Tween

The basic animation component for single tweens. Under the hood, `Tween` uses a GSAP timeline so it behaves consistently with nested timeline-based animations while still representing a single atomic animation.

### Tween Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `method` | `'from' \| 'to' \| 'fromTo' \| 'effect:%NAME%'` | - | GSAP tween method |
| `vars` | `gsap.TweenVars \| [gsap.TweenVars, gsap.TweenVars]` | - | Animation variables |
| `group` | `boolean` | `false` | Animate children as group |
| `tag` | `string` | `'div'` | Wrapper element tag |
| `progress` | `number` | - | Animation progress (0-1) |
| `toggle` | `boolean \| undefined` | - | Play/reverse control |
| `parent` | `Animation \| null` | - | Parent animation |
| `position` | `gsap.Position` | - | Position in parent |

### Tween Events

| Event | Description |
|-------|-------------|
| `start` | Animation started |
| `complete` | Animation completed |
| `update` | Animation updated |
| `repeat` | Animation repeated |
| `reverseComplete` | Reverse animation completed |
| `interrupt` | Animation interrupted |

### Tween Exposed

| Property | Type | Description |
|----------|------|-------------|
| `animation` | `Animation` | Animation instance |
| `controlled` | `ComputedRef<boolean>` | Whether animation is controlled |
| `parent` | `{ parent: Animation \| null }` | Parent animation info |
| `ready` | `ShallowRef<boolean>` | Whether animation is ready |

### Slot Props

The default slot receives the same exposed properties:

```vue
<template>
  <Tween
    method="to"
    :vars="{ x: 100, duration: 1 }"
    v-slot="{ animation, controlled, ready }"
  >
    <div>Animated Element</div>
  </Tween>
</template>
```

## Timeline

Component for creating complex animation sequences. `Timeline` can manage nested child animations and also compose multi-step animations from an array of definitions using the `tweens` prop.

### Timeline Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tweens` | `Array<TweenAnimationDefinition & { position?: gsap.Position }>` | - | Array of tween definitions |
| `duration` | `number` | - | Total timeline duration |
| `options` | `gsap.TimelineVars` | - | GSAP timeline options |
| `group` | `boolean` | `false` | Animate children as group |
| `tag` | `string` | `'div'` | Wrapper element tag |
| `progress` | `number` | - | Timeline progress (0-1) |
| `toggle` | `boolean \| undefined` | - | Play/reverse control |
| `parent` | `Animation \| null` | - | Parent animation |
| `position` | `gsap.Position` | - | Position in parent |

### Timeline Events

Same as Tween component:
- `start`, `complete`, `update`, `repeat`, `reverseComplete`, `interrupt`

### Timeline Exposed

| Property | Type | Description |
|----------|------|-------------|
| `animation` | `Animation` | Animation instance |
| `controlled` | `ComputedRef<boolean>` | Whether animation is controlled |
| `parent` | `{ parent: Animation \| null }` | Parent animation info |
| `ready` | `ShallowRef<boolean>` | Whether animation is ready |

### Usage Modes

The Timeline component can be used in two ways:

1. **With tweens prop** - Define animations as an array:
```vue
<Timeline :tweens>
  <div>Content</div>
</Timeline>
```

2. **With nested components** - Manage nested animations via provide/inject:
```vue
<Timeline>
  <Tween method="to" :vars="{ x: 100, duration: 1 }">
    <div>Child animation</div>
  </Tween>
</Timeline>
```

## PositionMarker

Component for adding position markers (i.e. labels) to timelines.

### PositionMarker Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Marker label |
| `parent` | `Animation \| null` | Injected | Parent animation |
| `position` | `gsap.Position` | - | Marker position |

### PositionMarker Events

| Event | Description |
|-------|-------------|
| `cross` | Marker crossed during playback |

### PositionMarker Usage

```vue
<template>
  <Timeline>
    <PositionMarker label="start" />
    <Tween method="to" :vars="{ x: 100, duration: 1 }" />
    <PositionMarker label="middle" />
    <Tween method="to" :vars="{ y: 100, duration: 1 }" />
  </Timeline>
</template>
```

::: warning Note
The `label` prop of the PositionMarker component is read immediately upon component instantiation and is not reactive. Any changes to the prop value after instantiation will not trigger updates or re-registration of the marker.
:::

## Callback

Component for adding callbacks to timelines.

### Callback Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fn` | `(timeline: gsap.core.Timeline) => void` | - | Callback function |
| `parent` | `Animation \| null` | Injected | Parent animation |
| `position` | `gsap.Position` | - | Callback position |

### Callback Usage

```vue
<template>
  <Timeline>
    <Tween method="to" :vars="{ x: 100, duration: 1 }" />
    <Callback :fn="onComplete" position="+=0.5" />
  </Timeline>
</template>

<script setup>
const onComplete = (timeline) => {
  console.log('Animation complete!', timeline)
}
</script>
```