# Types API

## Core types

### Animation

Wraps **`gsap.core.Timeline`**. Use **`animation.timeline`** for imperative GSAP.

```typescript
class Animation extends EventBus<AnimationEvent> {
  public timeline: gsap.core.Timeline
  constructor(options?: gsap.TimelineVars)
  add(child: AnimationChild, position?: gsap.Position, timeShift?: boolean): void
  remove(child: AnimationChild): void
  compose(definition: AnimationComposeDefinition, withContext?: boolean): void
  run(action?: TweenAction): void
  clear(revert?: boolean): void
  dispose(): void
}
```

**`add`** — labels and callbacks use raw GSAP placement. Nested **`Animation`** children use raw **`timeline.add`** by default; pass **`timeShift: true`** to shift later siblings on insert. Defers while the parent timeline is active.

**`remove`** — collapses trailing siblings for nested **`Animation`** children.

### DejaVueComponent

```typescript
interface DejaVueComponent {
  $el: ShallowRef<Element | null>
  seamless?: MaybeRefOrGetter<boolean>
  tweenTarget: ComputedRef<gsap.TweenTarget>
}
```

### DejaVueAnimationPublicInstance

Exposed by **`Tween`** / **`Timeline`** and provided via **`dejaVueParentInstance`**:

```typescript
interface DejaVueAnimationPublicInstance extends DejaVueComponent {
  animation: Animation
  controlled: boolean
  direction: Ref<AnimationDirection>
  parent: DejaVueAnimationPublicInstance | null
  progress: ModelRef<number | undefined>
}
```

### DejaVueAnimationScopeProps

Default slot props on **`Tween`** / **`Timeline`**:

```typescript
type DejaVueAnimationScopeProps = {
  animation: Animation
  direction: AnimationDirection
  progress: number | undefined
} & {
  parent: DejaVueAnimationPublicInstance | null
}
```

### AnimationEvent / AnimationEventEmitter

```typescript
type AnimationEvent =
  | 'complete' | 'interrupt' | 'repeat' | 'reverseComplete' | 'start' | 'update'

type AnimationEventEmitter = (
  e: AnimationEvent,
  animation: Animation,
  parent: DejaVueAnimationPublicInstance | null
) => void
```

### ControllableAnimation

```typescript
type ControllableAnimation = {
  progress?: number
} & (
  | { trigger?: unknown; triggerAction?: TweenAction; triggerOptions?: WatchOptions }
  | { trigger?: never; triggerAction?: never; triggerOptions?: never }
)
```

### TweenAction

```typescript
type TweenAction = 'play' | 'pause' | 'restart' | 'resume' | 'reverse'
```

### TweenDefinition

```typescript
type TweenDefinition = (
  | { from: gsap.TweenVars; to: gsap.TweenVars; effect?: never; effectOptions?: never }
  | { from: gsap.TweenVars; to?: never; effect?: never; effectOptions?: never }
  | { from?: never; to: gsap.TweenVars; effect?: never; effectOptions?: never }
  | { from?: never; to?: never; effect: string; effectOptions?: Record<string, unknown> }
)
```

### AnimationComposeDefinition

```typescript
type AnimationComposeDefinition = {
  scope?: Element
  target: gsap.TweenTarget
} & (
  | { method: 'fromTo'; vars: [gsap.TweenVars, gsap.TweenVars] }
  | { method: 'from' | 'to'; vars: gsap.TweenVars }
  | { method: string; vars: Record<string, unknown> }
)
```

Omit **`scrollTrigger.trigger`** in tween vars to default it to **`scope`**.

### AnimationTarget

```typescript
type AnimationTarget = gsap.TweenTarget | 'self' | 'children'
```

**`'self'`** and selector strings require root attribute **`is`**.

### AnimationNestingTarget

```typescript
type AnimationNestingTarget =
  | { animation: Animation }
  | { callback: gsap.Callback }
  | { label: MaybeRefOrGetter<string | undefined> }
```

### AnimationNestableChild

```typescript
type AnimationNestableChild = {
  parent?: DejaVueAnimationPublicInstance | null
  position?: gsap.Position
}
```

### AnimationDirection

```typescript
type AnimationDirection = 1 | -1 | 0
```

### WrappableComponent

```typescript
interface WrappableComponent {
  is?: string | Component
}
```

### AnimationChild

```typescript
type AnimationChild = Animation | gsap.Callback | string
```

## Constants

```typescript
const ANIMATION_EVENTS: AnimationEvent[]
const dejaVueParentInstance: InjectionKey<DejaVueAnimationPublicInstance>
```

## Exported utilities

```typescript
function cloneObject<T extends object>(target: T): T
function isObject(value: unknown): value is Record<string, unknown>
function syncData(target: unknown, changes: unknown): boolean
function patchArray(target: unknown[], changes: unknown[]): void
function patchObject<T extends object>(target: T, changes: T): void
function toNonEmptyArray<T>(data: T[]): NonEmptyArray<T> | null
```
