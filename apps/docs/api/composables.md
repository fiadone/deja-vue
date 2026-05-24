# Composables API

## useAnimationScope

Resolves DOM targets for **`Tween`** / **`Timeline`**.

```typescript
function useAnimationScope(options?: {
  tweenTarget?: MaybeRefOrGetter<AnimationTarget>
  resolveChildrenTweenTarget?: (children: DejaVueNode[]) => gsap.TweenTarget[]
}): {
  AnimationScope: Component
  root: ShallowRef<Element | null>
  tweenTarget: ComputedRef<gsap.TweenTarget>
}
```

Root attribute: **`is`**. Seamless children contribute **`child.tweenTarget`** to the parent list.

## useAnimationControls

Syncs **`v-model:progress`** and **`trigger`**; tracks scrub **`direction`**.

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
  direction: Ref<AnimationDirection>
}
```

When **`progress`** or **`trigger`** is bound, the timeline starts paused.

## useAnimationNesting

Registers children on the parent **`animation`** timeline.

```typescript
type AnimationNestingTarget =
  | { animation: Animation }
  | { callback: gsap.Callback }
  | { label: MaybeRefOrGetter<string | undefined> }

function useAnimationNesting(
  input: AnimationNestingTarget | AnimationNestingTarget[],
  position?: MaybeRefOrGetter<gsap.Position | undefined>
): {
  parent: DejaVueAnimationPublicInstance | null
}
```

Watches children and **`position`**; re-registers on change. Without **`position`**, children append at the parent timeline end. See **[Nesting](../guide/nesting.md#dynamic-children-v-if-lists)**.

## useTweenVars

Derives GSAP **method** and **vars** from [`TweenDefinition`](./types.md#tweendefinition):

```typescript
function useTweenVars(definition: TweenDefinition): {
  method: ComputedRef<'from' | 'to' | 'fromTo' | string>
  vars: ComputedRef<gsap.TweenVars | [gsap.TweenVars, gsap.TweenVars] | Record<string, unknown>>
}
```

## useStableObjectProp

```typescript
function useStableObjectProp<T extends object>(
  objectProp: MaybeRefOrGetter<PlainObject<T>>
): Reactive<T>
```

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
  lines: Ref<Element[]>
  words: Ref<Element[]>
  chars: Ref<Element[]>
}
```

`type` defaults to **`'lines,words,chars'`**. SplitText is registered automatically when this module loads.
