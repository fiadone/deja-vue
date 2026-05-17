# Types API

> [!TIP]
> Start with **[Core concepts](../guide/concepts.md)** if **`Animation`** vs **`animation.timeline`** is unclear.

## Core types

### Animation

**`Animation`** wraps **`gsap.core.Timeline`** (use **`animation.timeline`** for imperative GSAP) and adds an **[`EventBus`](#eventbus)**.

```typescript
class Animation extends EventBus<AnimationEvent> {
  public timeline: gsap.core.Timeline
  constructor(options?: gsap.TimelineVars)
  add(child: AnimationChild, position?: gsap.Position, timeShift?: boolean): void
  remove(child: AnimationChild): void
  compose(target: gsap.TweenTarget, definition: TweenDefinition | TweenDefinition[], withContext?: boolean): void
  run(action?: TweenAction): void
  clear(revert?: boolean): void
  dispose(): void
}
```

### DejaVueInstance

What **`Tween`** / **`Timeline`** expose and **`provide`** via **`dejaVueParentInstance`**:

```typescript
interface DejaVueInstance extends DejaVueComponent {
  animation: Animation
  controlled: boolean
  direction: Ref<AnimationDirection> // 1 | -1 | 0
  parent: DejaVueInstance | null
  progress: ModelRef<number | undefined>
}
```

### AnimationEvent / AnimationEventEmitter

```typescript
type AnimationEvent =
  | 'complete' | 'interrupt' | 'repeat' | 'reverseComplete' | 'start' | 'update'

type AnimationEventEmitter = (
  e: AnimationEvent,
  animation: Animation,
  parent: DejaVueInstance | null
) => void
```

### ControllableAnimation

```typescript
type ControllableAnimation = {
  progress?: number
} & (
  | { trigger?: boolean; triggerActions?: TweenAction | [TweenAction, TweenAction] }
  | { trigger?: never; triggerActions?: never }
)
```

### TweenAction

```typescript
type TweenAction = 'play' | 'pause' | 'restart' | 'resume' | 'reverse'
```

### TweenDefinition

```typescript
type TweenDefinition = (
  | { method: 'from' | 'to'; vars: gsap.TweenVars }
  | { method: 'fromTo'; vars: [gsap.TweenVars, gsap.TweenVars] }
  | { method: `effect:${string}`; vars?: gsap.TweenVars }
)
```

### AnimationNestableChild

```typescript
type AnimationNestableChild = {
  parent?: DejaVueInstance | null
  position?: gsap.Position
}
```

### AnimationDirection

```typescript
type AnimationDirection = 1 | -1 | 0
```

Used by **`useAnimationControls`** (scrub direction) and **`Marker`** **`@cross`**.

### WrappableAnimation

Scope attributes: **`is`**, **`target`** (`'self'`, `'children'`, selector string, or `gsap.TweenTarget`).

### AnimationChild

```typescript
type AnimationChild = Animation | gsap.Callback | string
```

## Constants

```typescript
const ANIMATION_EVENTS: AnimationEvent[]
const dejaVueParentInstance: InjectionKey<DejaVueInstance>
```

## Event system

Multiple listeners per event on **`animation.on(...)`**. Component **`@complete`** mirrors **`(animation, parent)`**.
