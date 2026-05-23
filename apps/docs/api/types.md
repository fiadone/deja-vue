# Types API

> [!TIP]
> Start with **[Core concepts](../guide/concepts.md)** if **`Animation`** vs **`animation.timeline`** is unclear.

## Core types

### Animation

**`Animation`** (`src/core/Animation.ts`) wraps **`gsap.core.Timeline`** (use **`animation.timeline`** for imperative GSAP) and extends **[`EventBus`](#eventbus)**.

```typescript
class Animation extends EventBus<AnimationEvent> {
  public timeline: gsap.core.Timeline
  constructor(options?: gsap.TimelineVars)
  add(child: AnimationChild, position?: gsap.Position, timeShift?: boolean): void // timeShift defaults to true
  remove(child: AnimationChild): void
  compose(definition: AnimationComposeDefinition, withContext?: boolean): void
  run(action?: TweenAction): void
  clear(revert?: boolean): void
  dispose(): void
}
```

**`add`** behavior depends on **`child`** type:

- **`string`** (label) — **`timeline.addLabel`**, no **`timeShift`**
- **`function`** (callback) — raw **`timeline.add`**, no **`timeShift`**
- **`Animation`** (`Tween` / nested **`Timeline`**) — if the parent timeline **`isActive()`**, the add is deferred until **`complete`** or **`reverseComplete`**. Otherwise, with **`timeShift: true`** (default): resolve **`position`** via **`resolveTimelinePosition`** (**`undefined`** → parent timeline end), call GSAP **`shiftChildren(duration, false, targetTime + ε)`** so siblings starting **strictly after** the insert time move forward (co-located parallel siblings at the same start time are not shifted), then **`add`** at **`targetTime`**. With **`timeShift: false`**, use raw **`timeline.add(child.timeline, position)`** without shifting.

**`remove`** mirrors the same deferral when the parent is active. For **`Animation`** children: remove from the timeline, then **`shiftChildren(-duration, false, endTime)`** to collapse siblings that start at or after the removed block’s end. Labels and callbacks use raw GSAP **`remove`** / **`removeLabel`** without shifting.

Pass **`timeShift: false`** on **`add`** to skip **`shiftChildren`** for nested **`Animation`** instances.

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
  | { trigger?: unknown; triggerAction?: TweenAction; triggerOptions?: WatchOptions }
  | { trigger?: never; triggerAction?: never; triggerOptions?: never }
)
```

**`trigger`**, **`trigger-action`**, and **`trigger-options`** are declared on **`Tween`** / **`Timeline`** via **`ControllableAnimation`**. **`progress`** uses **`defineModel`**.

### TweenAction

```typescript
type TweenAction = 'play' | 'pause' | 'restart' | 'resume' | 'reverse'
```

### TweenDefinition

Component props (strict union — only one tween kind):

```typescript
type TweenDefinition = (
  | { from: gsap.TweenVars; to: gsap.TweenVars; effect?: never; effectOptions?: never }
  | { from: gsap.TweenVars; to?: never; effect?: never; effectOptions?: never }
  | { from?: never; to: gsap.TweenVars; effect?: never; effectOptions?: never }
  | { from?: never; to?: never; effect: string; effectOptions?: Record<string, unknown> }
)
```

### AnimationComposeDefinition

Internal payload passed to **`Animation.compose`** (built by **`Tween`**):

```typescript
type AnimationComposeDefinition = { target: gsap.TweenTarget } & (
  | { method: 'fromTo'; vars: [gsap.TweenVars, gsap.TweenVars] }
  | { method: 'from' | 'to'; vars: gsap.TweenVars }
  | { method: string; vars: Record<string, unknown> }
)
```

### AnimationNestingTarget

Used by **`useAnimationNesting`**:

```typescript
type AnimationNestingTarget =
  | { animation: Animation }
  | { callback: gsap.Callback }
  | { label: MaybeRefOrGetter<string | undefined> }
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

## Exported utilities

Also exported from **`deja-vue`** for advanced use:

```typescript
function cloneObject<T extends object>(target: T): T
function isObject(value: unknown): value is Record<string, unknown>
function patch(target: unknown, change: unknown): boolean
function patchArray(target: unknown[], changes: unknown[]): void
function patchObject<T extends object>(target: T, changes: T): void
function toNonEmptyArray<T>(data: T[]): NonEmptyArray<T> | null
```

Timeline helpers in **`utils/timeline`** (**`applyTimelineTotalDuration`**, **`resolveTimelinePosition`**) support **`Animation.add`** / **`remove`**. Nested **`Animation`** children use GSAP **`shiftChildren`** to keep sibling timing aligned on add/remove; labels and callbacks do not.

## Event system

**`Animation`** also uses an internal event bus (not exported) so multiple listeners can subscribe with **`animation.on(...)`**. Component **`@complete`** handlers mirror that API with **`(animation, parent)`**.
