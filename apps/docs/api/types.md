# Types API

Canonical type reference. For prose and examples, see the [guide](../guide/concepts.md).

## Core types

### Animation

Wraps **`gsap.core.Timeline`**. Use **`animation.timeline`** for imperative GSAP.

```typescript
class Animation extends EventBus<AnimationEvent, [animation: Animation]> {
  public timeline: gsap.core.Timeline
  constructor(options?: gsap.TimelineVars)
  add(child: AnimationChild, position?: gsap.Position, timeShift?: boolean): void
  remove(child: AnimationChild, force?: boolean): void
  compose(definition: AnimationComposeDefinition, withContext?: boolean): void
  attachScrollTrigger(vars: ScrollTrigger.Vars | null | undefined): void
  run(action?: TweenAction, ...args: any[]): void
  clear(revert?: boolean): void
  dispose(revert?: boolean): void
  // EventBus<AnimationEvent, [animation: Animation]>
  on(event: AnimationEvent | AnimationEvent[], callback: (animation: Animation) => void): void
  once(event: AnimationEvent | AnimationEvent[], callback: (animation: Animation) => void): void
  off(event: AnimationEvent | AnimationEvent[], callback: (animation: Animation) => void): void
  dispatch(event: AnimationEvent, animation: Animation): void
}
```

**Events** — GSAP timeline hooks call **`dispatch(event, this)`**. Listeners registered with **`on`** / **`once`** receive the emitting **`Animation`** instance as their first argument (today the only argument). Example:

```typescript
animation.on('update', instance => {
  instance.timeline.progress()
})
```

This is separate from Vue **`AnimationEventEmitter`** on **`Tween`** / **`Timeline`**, which emits **`(event, animation, parent)`** to the template.

**`clear`** — removes timeline children. When **`revert`** is **`true`**, calls **`gsap.Context.revert()`** (restores inline styles). Otherwise calls **`gsap.Context.kill()`**.

**`dispose`** — tears down the animation. Same **`revert`** / **`kill`** behavior on the GSAP context, then kills any linked ScrollTrigger and timeline. **`Tween`** / **`Timeline`** pass their **`revertOnDispose`** prop through **`useAnimationNesting`** on unmount and to **`clear`** when tween vars change.

**`add`** — labels and callbacks use raw GSAP placement. Nested **`Animation`** children use raw **`timeline.add`** by default. Defers while the parent timeline is active.

**`timeShift`** — optional third argument on imperative **`Animation.add`** only (script / **`instance.animation.add(child, position, true)`**). Resolves **`position`** and **`shiftChildren`** before insert. **`Tween`**, **`Timeline`**, and **`Marker`** register through **`useAnimationNesting`**, which does not pass **`timeShift`**; set explicit **`position`** on the component instead.

**`remove`** — collapses trailing siblings for nested **`Animation`** children. Defers while the parent timeline is active unless **`force`** is **`true`** (component unmount and **`useAnimationNesting`** teardown). Dynamic **`v-if`** removal uses the same rules — see **[Nesting — Dynamic children](../guide/nesting.md#dynamic-children-v-if-lists)**.

**`run`** — forwards **`...args`** to the matching GSAP timeline method. **`reset`** calls **`timeline.pause(atTime, ...rest)`** with **`atTime`** defaulting to **`0`** (equivalent to **`pause(0)`**). Used by **`trigger-action`** on **`Tween`** / **`Timeline`** (via **`trigger-options.actionArgs`**) and by **`animation.run(...)`** in script.

### DejaVueComponent

Shared shape on animation-related components (`Tween`, `Timeline`, `SplitText`, …):

```typescript
interface DejaVueComponent {
  $el: ShallowRef<Element | null>
  seamless?: MaybeRef<boolean | undefined>
  tweenTarget: ComputedRef<gsap.TweenTarget>
}
```

## Component instance types {#component-instance-types}

Animation components expose four related type surfaces. Pick the one that matches how you access the component:

| Surface | Type | When to use |
|---------|------|-------------|
| **Instance** | `DejaVueAnimationInstance` | `inject(dejaVueParentInstance)`; internal wiring with **`Ref`** fields |
| **Exposed** | `DejaVueAnimationExposed` | **`useTemplateRef`** / template ref on **`Tween`** / **`Timeline`** |
| **Parent** | `DejaVueAnimationParent` | **`parent` prop** — which timeline to nest on |
| **Scope props** | `DejaVueAnimationScopeProps` | Default slot — **`parent`** is the injected parent timeline; pass it to **`:parent`** when overriding the nearest inject target |

On **Exposed**, Vue shallow-unwraps **`Ref`** fields (**`direction`**, **`progress`**, **`$el`**, …). On **Instance**, those stay **`Ref`** / **`ModelRef`**. Nested **`parent`** on an exposed ref is often still an **Instance** object (from inject), not unwrapped again.

Use **`toValue(parent?.direction)`** when **`parent`** is typed as **`DejaVueAnimationParent`** and you need the scalar direction in custom code.

```typescript
import { useTemplateRef } from 'vue'
import type { ComponentInstance } from 'vue'
import { Timeline, type DejaVueAnimationExposed } from 'deja-vue'

const timeline = useTemplateRef<DejaVueAnimationExposed>('timeline')
timeline.value?.animation.run('play')
timeline.value?.animation.run('reset')
timeline.value?.animation.run('play', 'intro')
timeline.value?.direction // AnimationDirection — not Ref

// Equivalent alternative:
const timelineAlt = useTemplateRef<ComponentInstance<typeof Timeline>>('timeline')
```

### DejaVueAnimationInstance

Raw object passed to **`defineExpose`**. **`Timeline`** also passes it to **`provide(dejaVueParentInstance, …)`** so descendants can nest automatically.

```typescript
interface DejaVueAnimationInstance extends DejaVueComponent {
  animation: Animation
  controlled: boolean
  direction: Ref<AnimationDirection>
  parent: DejaVueAnimationParent | null
  progress: ModelRef<number | undefined>
}
```

**`Tween`** and **`Timeline`** call **`defineExpose<DejaVueAnimationInstance>(instance)`**.

### DejaVueAnimationExposed

Template-ref surface on **`Tween`** / **`Timeline`**:

```typescript
type DejaVueAnimationExposed = ShallowUnwrapRef<DejaVueAnimationInstance>
```

### DejaVueAnimationParent

Accepted by the **`parent`** prop and returned from **`useAnimationNesting`**:

```typescript
type DejaVueAnimationParent = DejaVueAnimationInstance | DejaVueAnimationExposed
```

### DejaVueAnimationComponentProps

Shared props on **`Tween`** and **`Timeline`**:

```typescript
interface DejaVueAnimationComponentProps {
  revertOnDispose?: boolean
  seamless?: boolean
  tweenTarget?: 'children' | 'self' | gsap.TweenTarget
}
```

### DejaVueAnimationScopeProps

Default slot props on **`Tween`** / **`Timeline`**:

```typescript
type DejaVueAnimationScopeProps = Pick<
  DejaVueAnimationExposed,
  'animation' | 'direction' | 'parent' | 'progress'
>
```

**`parent`** in the slot is the injected parent timeline. On a nested **`Timeline`**, that is the outer timeline — pass it to **`:parent`** on a descendant that must register there (see **[Nesting — Manual parent assignment](../guide/nesting.md#manual-parent-assignment)**). For script-side instance access, see **`DejaVueAnimationExposed`** below.

### DejaVueMarkerInstance / DejaVueMarkerExposed / DejaVueMarkerScopeProps

Same **Instance → Exposed → ScopeProps** pattern as animation components; **`defineExpose<DejaVueMarkerInstance>(instance)`**. See **[Marker](./components.md#marker)** for usage.

```typescript
interface DejaVueMarkerInstance {
  crossed: Ref<boolean>
  parent: DejaVueAnimationParent | null
}

type DejaVueMarkerExposed = ShallowUnwrapRef<DejaVueMarkerInstance>
type DejaVueMarkerScopeProps = Pick<DejaVueMarkerExposed, 'crossed' | 'parent'>
```

### DejaVueSplitTextInstance / DejaVueSplitTextExposed / DejaVueSplitTextScopeProps

**`SplitText`** props are **[`SplitTextOptions`](./composables.md#usesplittext)**; slot scope exposes split nodes. **`defineExpose<DejaVueSplitTextInstance>(instance)`**. See **[SplitText](./components.md#splittext)**.

```typescript
interface DejaVueSplitTextInstance extends DejaVueComponent {
  chars: Ref<Element[]>
  lines: Ref<Element[]>
  words: Ref<Element[]>
}

type DejaVueSplitTextExposed = ShallowUnwrapRef<DejaVueSplitTextInstance>
type DejaVueSplitTextScopeProps = Pick<DejaVueSplitTextExposed, 'chars' | 'lines' | 'words'>
```

### AnimationEvent / AnimationEventEmitter

```typescript
type AnimationEvent =
  | 'complete' | 'interrupt' | 'repeat' | 'reverseComplete' | 'start' | 'update'
```

**`Animation.on(event, callback)`** — **`callback(animation)`** with the **`Animation`** that fired the event (see **[Animation — Events](#animation)**).

**`AnimationEventEmitter`** — Vue emit signature on **`Tween`** / **`Timeline`** (not **`Animation.on`**):

```typescript
type AnimationEventEmitter = (
  e: AnimationEvent,
  animation: Animation,
  parent: DejaVueAnimationParent | null
) => void
```

### AnimationTriggerOptions

**`trigger-options`** on **`Tween`** / **`Timeline`**. Extends Vue **`WatchOptions`**; **`actionArgs`** are spread into **`Animation.run`** on each **`trigger`** change.

```typescript
interface AnimationTriggerOptions extends WatchOptions {
  actionArgs?: any[]
}
```

### ControllableAnimation

```typescript
type ControllableAnimation = {
  progress?: number
} & (
  | { trigger?: unknown; triggerAction?: TweenAction; triggerOptions?: AnimationTriggerOptions }
  | { trigger?: never; triggerAction?: never; triggerOptions?: never }
)
```

### TweenAction

```typescript
type TweenAction = 'play' | 'pause' | 'reset' | 'restart' | 'resume' | 'reverse'
```

### TweenDefinition

```typescript
type TweenDefinition = (
  | { from: gsap.TweenVars; to: gsap.TweenVars; effect?: never; effectOptions?: never }
  | { from: gsap.TweenVars; to?: never; effect?: never; effectOptions?: never }
  | { from?: never; to: gsap.TweenVars; effect?: never; effectOptions?: never }
  | { from?: never; to?: never; effect: string; effectOptions?: gsap.TweenVars }
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

**`scope`** is the component root element passed to **`stripScrollTriggerVars`** as the default ScrollTrigger **`trigger`** when tween vars omit **`scrollTrigger.trigger`**. It is **not** derived from **`target`** — see **[Default scrollTrigger.trigger](../guide/targeting.md#scrolltrigger-default-trigger)**.

For **`fromTo`**, put **`scrollTrigger`** on the **`to`** vars.

### DejaVueNode

Slotted child reference used by scope and nesting helpers (`vue-unwrap` **`NodeRef`** or an unwrapped component instance):

```typescript
type DejaVueNode = NodeRef | ShallowUnwrapRef<DejaVueComponent>
```

### PlainObject / NonEmptyArray

```typescript
type PlainObject<T> = [T] extends [readonly unknown[]] ? never : T
type NonEmptyArray<T> = [T, ...T[]]
```

### AnimationControls {#animationcontrols}

Input shape for **`useAnimationControls`** (exported from **`deja-vue`**):

```typescript
interface AnimationControls {
  progress: ModelRef<number | undefined>
  trigger: MaybeRefOrGetter<unknown>
  triggerAction: MaybeRefOrGetter<TweenAction | undefined>
  triggerOptions: MaybeRefOrGetter<AnimationTriggerOptions | undefined>
}
```

### AnimationNestingTarget

```typescript
type AnimationNestingTarget =
  | { animation: Animation }
  | { callback: gsap.Callback }
  | { label: MaybeRefOrGetter<string | undefined> }
```

First argument to **`useAnimationNesting`**. Full behavior: **[Composables — useAnimationNesting](./composables.md#useanimationnesting)**.

### AnimationNestingOptions {#animationnestingoptions}

Second argument to **`useAnimationNesting`**. Exported from **`deja-vue`**.

```typescript
interface AnimationNestingOptions {
  parent?: DejaVueAnimationParent | null
  position?: MaybeRefOrGetter<gsap.Position | undefined>
  revertOnDispose?: MaybeRefOrGetter<boolean>
}
```

### AnimationScopeOptions {#animationscopeoptions}

Argument to **`useAnimationScope`**. Exported from **`deja-vue`**.

```typescript
interface AnimationScopeOptions {
  tweenTarget?: MaybeRefOrGetter<gsap.TweenTarget | undefined>
  resolveChildrenTweenTarget?: (children: DejaVueNode[]) => Element[]
}
```

Full behavior: **[Composables — useAnimationScope](./composables.md#useanimationscope)**.

### AnimationNestableChild

Shared nestable props on **`Tween`**, **`Timeline`**, and **`Marker`**:

```typescript
type AnimationNestableChild = {
  parent?: DejaVueAnimationParent | null
  position?: gsap.Position
}
```

### AnimationDirection

```typescript
type AnimationDirection = 1 | -1 | 0
```

**`0`** — before the playhead has moved. **`1`** / **`-1`** — last detected forward or reverse movement; not reset when the timeline is paused or complete. See **[Animation controls — Progress](../guide/controls.md#progress)**.

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
const dejaVueParentInstance: InjectionKey<DejaVueAnimationInstance>
```

**`Timeline`** calls **`provide(dejaVueParentInstance, …)`**. Nested **`Tween`** and **`Marker`** components **`inject`** it to register on the parent timeline unless they opt out with **`:parent="null"`** or an explicit **`:parent`**.

## Exported utilities {#exported-utilities}

Low-level helpers exported for advanced use and custom composables. Components use these internally; most apps do not import them directly.

```typescript
function cloneObject<T extends object>(target: T): T
function isObject(value: unknown): value is Record<string, unknown>
function syncData(target: unknown, changes: unknown): boolean
function patchArray(target: unknown[], changes: unknown[]): void
function patchObject<T extends object>(target: T, changes: T): void
function toNonEmptyArray<T>(data: T[]): NonEmptyArray<T> | null

function applyTimelineTotalDuration(timeline: gsap.core.Timeline): void
function resolveTimelinePosition(
  timeline: gsap.core.Timeline,
  position?: gsap.Position
): number | null
function stripScrollTriggerVars(
  vars: gsap.AnimationVars,
  defaultTrigger?: gsap.DOMTarget // component root Element; not the tween target
): ScrollTrigger.Vars | null
```

When **`defaultTrigger`** is set and vars omit **`scrollTrigger.trigger`**, that element becomes the ScrollTrigger sensor. **`Tween`** / **`Timeline`** pass the root from **`is`**. See **[Default scrollTrigger.trigger](../guide/targeting.md#scrolltrigger-default-trigger)**.
