# Components API

## Tween

The basic animation component for single tweens.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `method` | `'from' \| 'to' \| 'fromTo' \| 'effect:%NAME%'` | - | GSAP tween method |
| `vars` | `gsap.TweenVars \| [gsap.TweenVars, gsap.TweenVars]` | - | Animation variables |
| `group` | `boolean` | `false` | Animate children as group |
| `initiallyHidden` | `boolean` | `true` | Hide element initially |
| `tag` | `string` | `'div'` | Wrapper element tag |
| `progress` | `number` | - | Animation progress (0-1) |
| `toggle` | `boolean` | - | Play/reverse control |
| `parent` | `AnimationInstance \| null` | - | Parent animation |
| `position` | `gsap.Position` | - | Position in parent |

### Events

| Event | Description |
|-------|-------------|
| `start` | Animation started |
| `complete` | Animation completed |
| `update` | Animation updated |
| `repeat` | Animation repeated |
| `reverseComplete` | Reverse animation completed |
| `interrupt` | Animation interrupted |

### Exposed

| Property | Type | Description |
|----------|------|-------------|
| `animation` | `AnimationInstance` | Animation instance |

## Timeline

Component for creating complex animation sequences.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tweens` | `Array<TweenAnimationDefinition & { position?: gsap.Position }>` | - | Array of tween definitions |
| `duration` | `number` | - | Total timeline duration |
| `options` | `gsap.TimelineVars` | - | GSAP timeline options |
| `group` | `boolean` | `false` | Animate children as group |
| `initiallyHidden` | `boolean` | `true` | Hide element initially |
| `tag` | `string` | `'div'` | Wrapper element tag |
| `progress` | `number` | - | Timeline progress (0-1) |
| `toggle` | `boolean` | - | Play/reverse control |
| `parent` | `AnimationInstance \| null` | - | Parent animation |
| `position` | `gsap.Position` | - | Position in parent |

### Events

Same as Tween component.

### Exposed

| Property | Type | Description |
|----------|------|-------------|
| `animation` | `AnimationInstance` | Animation instance |

## Label

Component for adding labels to timelines.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `parent` | `AnimationInstance \| null` | - | Parent animation |
| `position` | `gsap.Position` | - | Label position |

### Events

| Event | Description |
|-------|-------------|
| `cross` | Label crossed during playback |

## Callback

Component for adding callbacks to timelines.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fn` | `(animation: gsap.core.Timeline) => void` | - | Callback function |
| `parent` | `AnimationInstance \| null` | - | Parent animation |
| `position` | `gsap.Position` | - | Callback position |