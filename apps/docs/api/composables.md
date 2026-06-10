# Composables API

Building blocks used by components. Most apps import **`Tween`**, **`Timeline`**, and related components rather than these directly.

## useAnimationScope

Resolves DOM targets for **`Tween`** / **`Timeline`**.

```typescript
interface AnimationScopeOptions {
  tweenTarget?: MaybeRefOrGetter<gsap.TweenTarget | undefined>
  resolveChildrenTweenTarget?: (children: DejaVueNode[]) => Element[]
}

function useAnimationScope(options?: AnimationScopeOptions): {
  AnimationScope: Component
  root: ShallowRef<Element | null>
  tweenTarget: ComputedRef<gsap.TweenTarget>
}
```

Root attribute **`is`**. Seamless children contribute **`child.tweenTarget`** to the parent list. Pass **`resolveChildrenTweenTarget`** when you need custom child-to-element resolution.

Type **`AnimationScopeOptions`**: [Types API — AnimationScopeOptions](./types.md#animationscopeoptions).

## useAnimationControls

Syncs **`v-model:progress`** and **`trigger`**; tracks **`direction`** (`0` before the first playhead movement, then the last detected **`1`** / **`-1`**, without resetting when paused or complete). On each **`trigger`** change, calls **`animation.run(action, ...actionArgs)`** where **`actionArgs`** comes from **`trigger-options.actionArgs`**.

```typescript
interface AnimationControls {
  progress: ModelRef<number | undefined>
  trigger: MaybeRefOrGetter<unknown>
  triggerAction: MaybeRefOrGetter<TweenAction | undefined>
  triggerOptions: MaybeRefOrGetter<AnimationTriggerOptions | undefined>
}

function useAnimationControls(
  animation: Animation,
  controls: AnimationControls
): {
  controlled: boolean
  direction: Ref<AnimationDirection>
}
```

When **`progress`** or **`trigger`** is bound, the timeline starts paused. If only **`trigger`** is set, progress initializes to **0**. See **[Animation controls](../guide/controls.md)**.

Type **`AnimationControls`**: [Types API — AnimationControls](./types.md#animationcontrols).

## useAnimationNesting

Registers children on the parent **`animation`** timeline.

```typescript
type AnimationNestingTarget =
  | { animation: Animation }
  | { callback: gsap.Callback }
  | { label: MaybeRefOrGetter<string | undefined> }

interface AnimationNestingOptions {
  parent?: DejaVueAnimationParent | null
  position?: MaybeRefOrGetter<gsap.Position | undefined>
  revertOnDispose?: MaybeRefOrGetter<boolean>
}

function useAnimationNesting(
  target?: AnimationNestingTarget | AnimationNestingTarget[],
  options?: AnimationNestingOptions
): {
  parent: DejaVueAnimationParent | null
}
```

**`options.parent`** resolution:

| Value | Effect |
|-------|--------|
| omitted / `undefined` | `inject(dejaVueParentInstance)` (nearest **`Timeline`**) |
| `null` | opt out of nesting |
| slot **`parent`** / explicit **`DejaVueAnimationParent`** | override inject target |

Watches children and **`options.position`**; re-registers on change. Without **`position`**, children append at the parent timeline end. Removing children defers **`Animation.remove`** while the parent is playing ( **`force`** on unmount) — see **[Nesting — Dynamic children](../guide/nesting.md#dynamic-children-v-if-lists)**. On unmount, nested **`Animation`** children call **`dispose(revertOnDispose)`** — see **`revertOnDispose`** on **[Tween](./components.md#tween)** / **[Timeline](./components.md#timeline)**. Does not pass **`Animation.add`**’s **`timeShift`** flag — use imperative **`animation.add(..., true)`** from script if you need sibling shifting.

**`parent`** is resolved once at component setup. If an explicit **`parent`** is not ready when the child mounts, mount the child after the parent or guard with **`v-if`**. See **[Troubleshooting — Nesting / parent](../guide/troubleshooting.md#nesting-parent-not-found)**.

Types **`AnimationNestingTarget`** and **`AnimationNestingOptions`**: [Types API](./types.md#animationnestingtarget).

## useTweenVars

Derives GSAP **method** and **vars** from [`TweenDefinition`](./types.md#tweendefinition):

```typescript
function useTweenVars(definition: TweenDefinition): {
  method: ComputedRef<'from' | 'to' | 'fromTo' | string>
  vars: ComputedRef<gsap.TweenVars | [gsap.TweenVars, gsap.TweenVars]>
}
```

## useStableObjectProp

Stabilizes object props so nested watchers do not fire on every render when the parent passes a new object literal. Used internally by **`Tween`** and **`Timeline`**.

```typescript
function useStableObjectProp<T extends object>(
  objectProp: MaybeRefOrGetter<PlainObject<T> | null | undefined>,
  watchOptions?: WatchOptions
): Reactive<T>
```

## useSplitText

```typescript
interface SplitTextOptions {
  type?: string
  mask?: 'lines' | 'words' | 'chars'
  wordDelimiter?: string | RegExp | SplitText.WordDelimiterConfig
  linesClass?: string
  wordsClass?: string
  charsClass?: string
  aria?: 'auto' | 'hidden' | 'none'
  tag?: string
  propIndex?: boolean
  deepSlice?: boolean
  smartWrap?: boolean
  specialChars?: string[] | RegExp
  reduceWhiteSpace?: boolean
  autoSplit?: boolean
  ignore?: SplitText.SplitTextTarget
  prepareText?: SplitText.PrepareTextFunction
  overwrite?: boolean
  onSplit?: (splitText: SplitText) => void
  onRevert?: (splitText: SplitText) => void
}

function useSplitText(
  target: MaybeRefOrGetter<gsap.DOMTarget>,
  options: MaybeRefOrGetter<SplitTextOptions>
): {
  instance: ShallowRef<SplitText | undefined>
  state: { lines: Element[]; words: Element[]; chars: Element[] }
  lines: Ref<Element[]>
  words: Ref<Element[]>
  chars: Ref<Element[]>
}
```

`type` defaults to `'lines,words,chars'`. Registers SplitText automatically — see **[Getting started — GSAP plugins](../guide/getting-started.md#gsap-plugins)**. On the **`SplitText`** component, use **`@split`** / **`@revert`** instead of **`onSplit`** / **`onRevert`**.
