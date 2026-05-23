# Composables API

> [!TIP]
> Read **[Core concepts](../guide/concepts.md)** if **`Animation`** vs **`animation.timeline`** is unclear.

## useAnimationScope

Resolves **DOM targets** for `Tween` / `Timeline` and renders **`AnimationScope`** (slot props: `animation`, `controlled`, `direction`, `parent`, `progress`, `target`).

```typescript
function useAnimationScope(
  childrenTargetResolver?: typeof resolveChildrenTarget
): {
  $el: ShallowRef<Element | null>
  target: ComputedRef<gsap.TweenTarget>
  AnimationScope: Component
}
```

Root attributes on the component: **`is`**, **`target`**. When **`target`** changes, previous targets get `killTweensOf` + `clearProps`.

Seamless children (`seamless: true`, e.g. **`SplitText`** or nested **`Tween`**) contribute **`child.target`** to the parent list.

## useAnimationControls

Syncs **`v-model:progress`** and watches **`trigger`** with a timeline; tracks scrub **direction**.

```typescript
interface AnimationControls {
  progress: ModelRef<number | undefined>
  trigger: ComputedRef<unknown>
  triggerAction: MaybeRefOrGetter<TweenAction | undefined>
  triggerOptions: Reactive<WatchOptions>
}

function useAnimationControls(
  animation: Animation,
  controls: AnimationControls
): {
  controlled: boolean
  direction: Ref<AnimationDirection> // 1 | -1 | 0
}
```

### Progress

- **`v-model:progress`**: timeline **`update`** writes progress; the progress watcher scrubs **`animation.timeline.progress()`** and updates **`direction`** when the value moves up/down (watcher **`flush: 'post'`**).
- When **`progress`** or **`trigger`** is bound, the timeline starts **paused**.

### Trigger

| Prop / attribute | Type | Description |
|------------------|------|-------------|
| **`trigger`** | `unknown` | Watched for changes |
| **`trigger-action`** | `TweenAction` | Action run on each change (default **`play`**) |
| **`trigger-options`** | `WatchOptions` | Passed to the trigger **`watch`** (e.g. **`{ once: true }`**, **`{ flush: 'post' }`**) |

Bind **`trigger-action`** together with **`trigger`** in the same template:

```html
<Tween
  :to="{ x: 100 }"
  :trigger="trigger"
  :trigger-action="trigger ? 'reverse' : 'play'"
/>
```

## useAnimationNesting

Registers one or more children on the injected parent’s **`animation`** timeline.

```typescript
type AnimationNestingTarget =
  | { animation: Animation }
  | { callback: gsap.Callback }
  | { label: MaybeRefOrGetter<string | undefined> }

function useAnimationNesting(
  input: AnimationNestingTarget | AnimationNestingTarget[]
): {
  parent: DejaVueInstance | null
}
```

Non-prop attributes: **`parent`**, **`position`**. Watches children and **`position`**; on change, **`parent.animation.remove`** then **`add`** after **`nextTick`**. Each nestable registers independently — omitting **`position`** appends at the parent timeline end on add. Nested **`Animation`** children use **`timeShift: true`** by default (**`shiftChildren`** on add/remove); labels and callbacks do not. See **[Nesting animations](../guide/nesting.md#dynamic-children-v-if-lists)** for **`v-if`** behavior.

Supports **multiple** children (e.g. **`Marker`**: callback + label).

## useStableObjectProp

Keeps a **reactive object reference stable** while patching properties in place (used for **`from`**, **`to`**, **`effect-options`**, **`trigger-options`**).

```typescript
function useStableObjectProp<T extends object>(
  objectProp: MaybeRefOrGetter<PlainObject<T>>
): Reactive<T>
```

Incoming objects are cloned once; later updates use **`patchObject`** (sync flush) so nested keys update without replacing the root reference. **`Tween`**’s compose watcher can stay **deep** without re-running on every parent re-render that passes a new object literal with the same values.

## useSplitText

```typescript
interface SplitTextOptions {
  type?: string
  mask?: 'lines' | 'words' | 'chars'
  wordDelimiter?: string | RegExp
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
  ignore?: gsap.DOMTarget
  prepareText?: (text: string) => string
  overwrite?: boolean
  onSplit?: (splitText: SplitText) => void
  onRevert?: (splitText: SplitText) => void
}

function useSplitText(
  target: MaybeRefOrGetter<gsap.DOMTarget>,
  options?: SplitTextOptions
): {
  instance: ShallowRef<SplitText | undefined>
  state: { lines: Element[]; words: Element[]; chars: Element[] }
}
```

`type` defaults to **`'lines,words,chars'`**. The composable waits for a real target before creating SplitText and reverts/kills the instance during cleanup.

**`SplitText`** is registered with GSAP when this module loads, so manual **`gsap.registerPlugin(SplitText)`** is not required.

Option descriptions and template prop names: [SplitText guide — Props](../guide/split-text.md#props-splittextoptions).

See [`SplitText` component](./components.md#splittext) — place inside a **`Tween`** slot.
