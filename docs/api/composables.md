# Composables API

> [!TIP]
> Read **[Core concepts](../guide/concepts.md)** for how these composables fit together.

## useAnimationScope

Resolves **DOM targets** for `Tween` / `Timeline` and renders **`AnimationScope`** (slot props: `animation`, `controlled`, `direction`, `parent`, `progress`, `target`).

```typescript
function useAnimationScope(): {
  $el: ShallowRef<Element | null>
  target: ComputedRef<gsap.TweenTarget>
  AnimationScope: Component
}
```

Root attributes on the component: **`is`**, **`target`**. When **`target`** changes, previous targets get `killTweensOf` + `clearProps`.

Seamless children (`seamless: true`, e.g. **`SplitText`** or nested **`Tween`**) contribute **`child.target`** to the parent list.

## useAnimationControls

Syncs **`defineModel`** refs with a timeline and tracks scrub **direction**.

```typescript
function useAnimationControls(
  animation: Animation,
  controls: AnimationControls
): {
  controlled: boolean
  direction: Ref<AnimationDirection> // 1 | -1 | 0
}
```

### AnimationControls

```typescript
interface AnimationControls {
  progress: ModelRef<number | undefined>
  trigger: {
    actions: MaybeRefOrGetter<TweenAction | [TweenAction, TweenAction] | undefined>
    once: true | undefined
    value: ModelRef<boolean | undefined>
  }
}
```

- **`progress`**: scrubs `animation.timeline.progress()`; updates **`direction`** when the value moves up/down.
- **`trigger`**: `true` → first action (or single action); `false` → second action or same if one action. Default actions: **`play`** / **`reverse`**.
- **`trigger.actions`**: e.g. `['play', 'restart']` or `'pause'` (string applies to both sides).
- **`trigger.once`**: pass the **`.once`** modifier from **`v-model:trigger.once`**.

## useAnimationNesting

Registers one or more children on the injected parent’s **`animation`** timeline.

```typescript
type NestableChild =
  | { animation: Animation }
  | { callback: gsap.Callback }
  | { label: MaybeRefOrGetter<string | undefined> }

function useAnimationNesting(
  input: NestableChild | NestableChild[]
): {
  parent: DejaVueInstance | null
}
```

Non-prop attributes: **`parent`**, **`position`**. Watches children + position; **`parent.animation.add`** / **`remove`** after `nextTick`. Supports **multiple** children (e.g. **`Marker`**: callback + label).

## useStableTweenVars

Keeps a **stable object reference** for `vars` while syncing property changes, so `watch` on tween definition does not thrash on new object identity every render.

```typescript
function useStableTweenVars(
  vars: MaybeRefOrGetter<gsap.TweenVars | [gsap.TweenVars, gsap.TweenVars]>
): gsap.TweenVars | [gsap.TweenVars, gsap.TweenVars]
```

Used internally by **`Tween`**; export for custom animation components.

The root shape must stay stable. Switching between a single vars object and a **`fromTo`** tuple at runtime is not supported in place; key the **`Tween`** by **`method`** or another shape key to recreate it.

## useSplitText

```typescript
function useSplitText(
  target: MaybeRefOrGetter<gsap.DOMTarget>,
  options?: SplitTextOptions
): {
  instance: ShallowRef<SplitText | undefined>
  state: { lines: Element[]; words: Element[]; chars: Element[] }
}
```

`type` defaults to **`'lines,words,chars'`**. The composable waits for a real target before creating SplitText and reverts/kills the instance during cleanup.

Register **`SplitText`** with GSAP in your app setup before using this composable. The library does not register GSAP plugins on its own.

See [`SplitText` component](./components.md#splittext) — place inside a **`Tween`** slot.
