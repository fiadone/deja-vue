# Types API

## Core Types

### EventBus

A custom event system that allows multiple listeners per event, unlike GSAP's single-handler limitation (check out the [GSAP's *eventCallback* documentation](https://gsap.com/docs/v3/GSAP/Timeline/eventCallback()) to learn more).

```typescript
class EventBus {
  on(event: string, callback: CallableFunction): void
  off(event: string, callback: CallableFunction): void
  dispatch(event: string, ...args: any[]): void
  dispose(): void
}
```

### AnimationInstance

```typescript
interface AnimationInstance {
  eventBus: EventBus
  timeline: gsap.core.Timeline
}
```

The `eventBus` is a custom event system that wraps GSAP's timeline events. GSAP allows only a single handler for each event on the same animation instance, but Deja Vue needs to use some events internally (e.g., the `update` event in the `useAnimationNesting` composable). The EventBus enables multiple listeners per event without conflicts.

### ControllableAnimation

```typescript
interface ControllableAnimation {
  progress?: number
  toggle?: boolean | undefined
}
```

### NestableAnimation

```typescript
interface NestableAnimation {
  parent?: AnimationInstance | null
  position?: gsap.Position
}
```

### WrappableAnimation

```typescript
interface WrappableAnimation {
  group?: boolean
  initiallyHidden?: boolean
  tag?: string
}
```

## Animation Types

### BaseAnimation

```typescript
type BaseAnimation = ControllableAnimation & NestableAnimation & WrappableAnimation
```

### TweenAnimationDefinition

```typescript
type TweenAnimationDefinition = (
  | { method: 'from' | 'to', vars: gsap.TweenVars }
  | { method: 'fromTo', vars: [gsap.TweenVars, gsap.TweenVars] }
  | { method: 'effect:%NAME%', vars?: object }
)
```

### TweenAnimation

```typescript
type TweenAnimation = BaseAnimation & TweenAnimationDefinition
```

### TimelineAnimation

```typescript
type TimelineAnimation = BaseAnimation & {
  duration?: number
  options?: gsap.TimelineVars
  tweens?: (TweenAnimationDefinition & { position?: gsap.Position })[]
}
```

## Constants

### ANIMATION_EVENTS

```typescript
const ANIMATION_EVENTS = ['complete', 'interrupt', 'repeat', 'reverseComplete', 'start', 'update'] as const
```

### parentAnimationInjectionKey

```typescript
const parentAnimationInjectionKey: InjectionKey<AnimationInstance> = Symbol('parent-animation')
```