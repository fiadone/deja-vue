# Types API

## Core Types

### Animation

The main animation class that extends EventBus to provide both a GSAP timeline and multi-listener event support.

```typescript
class Animation extends EventBus<typeof ANIMATION_EVENTS[number]> {
  public timeline: gsap.core.Timeline
  
  constructor(options?: gsap.TimelineVars)
  add(child: Animation | gsap.Callback | string, position?: gsap.Position): void
  remove(child: Animation | gsap.Callback | string): void
  compose(target: HTMLElement | HTMLCollection, definition: TweenAnimationDefinition | TweenAnimationDefinition[]): void
  dispose(): void
}
```

### EventBus

A generic event system that allows multiple listeners per event, unlike GSAP's single-handler limitation (check out the [GSAP's *eventCallback* documentation](https://gsap.com/docs/v3/GSAP/Timeline/eventCallback()) to learn more).

```typescript
class EventBus<E extends string> {
  on(event: E | E[], callback: CallableFunction): void
  once(event: E | E[], callback: CallableFunction): void
  off(event: E | E[], callback: CallableFunction): void
  dispatch(event: E, ...args: any[]): void
  dispose(): void
}
```

### ControllableAnimation

Configuration for animations that can be controlled via progress and toggle props.

```typescript
interface ControllableAnimation {
  progress?: number
  toggle?: boolean | undefined
}
```

### NestableAnimation

Configuration for animations that can be nested within other animations.

```typescript
interface NestableAnimation {
  parent?: Animation | null
  position?: gsap.Position
}
```

### WrappableAnimation

Configuration for the wrapper element around animations.

```typescript
interface WrappableAnimation {
  group?: boolean
  initiallyHidden?: boolean
  tag?: string
}
```

## Animation Types

### BaseAnimation

Base type combining controllable, nestable, and wrappable animation properties.

```typescript
type BaseAnimation = ControllableAnimation & NestableAnimation & WrappableAnimation
```

### TweenAnimationDefinition

Definition object for a single tween animation.

```typescript
type TweenAnimationDefinition = (
  | { method: 'from' | 'to', vars: gsap.TweenVars }
  | { method: 'fromTo', vars: [gsap.TweenVars, gsap.TweenVars] }
  | { method: `effect:${string}`, vars?: object }
) & Pick<NestableAnimation, 'position'>
```

### TweenAnimation

Type for Tween component props.

```typescript
type TweenAnimation = BaseAnimation & TweenAnimationDefinition
```

### TimelineAnimation

Type for Timeline component props.

```typescript
type TimelineAnimation = BaseAnimation & {
  duration?: number
  options?: gsap.TimelineVars
  tweens?: TweenAnimationDefinition[]
}
```

## Constants

### ANIMATION_EVENTS

Tuple of all available animation event names.

```typescript
const ANIMATION_EVENTS = ['complete', 'interrupt', 'repeat', 'reverseComplete', 'start', 'update'] as const

type AnimationEvent = typeof ANIMATION_EVENTS[number]
// Expands to: 'complete' | 'interrupt' | 'repeat' | 'reverseComplete' | 'start' | 'update'
```

### parentAnimationInjectionKey

Vue injection key for providing parent animation context to nested animations.

```typescript
const parentAnimationInjectionKey: InjectionKey<Animation> = Symbol('parent-animation')
```

## Event System

### Multiple Event Listeners

Unlike GSAP which allows only one handler per event, Déjà Vue's EventBus enables multiple listeners:

```vue
<script setup>
const tweenRef = ref()

onMounted(() => {
  const { animation } = tweenRef.value
  
  // Multiple listeners for the same event
  animation.on('complete', () => console.log('Listener 1'))
  animation.on('complete', () => console.log('Listener 2'))
  animation.on('complete', () => console.log('Listener 3'))
  
  // Listen to multiple events at once
  animation.on(['start', 'complete'], () => console.log('Started or completed'))
  
  // One-time listener
  animation.once('complete', () => console.log('Only once'))
})
</script>
```

This is particularly useful for components that need to listen to animation events without conflicting with user-provided event handlers.