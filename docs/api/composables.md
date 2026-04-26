# Composables API

## useAnimation

Core composable for creating animations. Used internally by components.

```typescript
function useAnimation(
  wrapper: Readonly<ShallowRef<HTMLElement | null>>,
  props: TimelineAnimation | TweenAnimation,
  emit: (event: typeof ANIMATION_EVENTS[number], animation: gsap.core.Timeline) => void,
  options?: gsap.TimelineVars
): {
  animation: AnimationInstance
  controlled: ComputedRef<boolean>
  parent: { parent: AnimationInstance | null }
  ready: ShallowRef<boolean>
}
```

### Parameters

- `wrapper`: Reference to the wrapper element
- `props`: Animation properties
- `emit`: Event emitter function
- `options`: Additional GSAP options

### Returns

- `animation`: The animation instance
- `controlled`: Whether the animation is controlled
- `parent`: Parent animation info
- `ready`: Whether the animation is ready

## useAnimationControls

Composable for controlling animations with reactive props.

```typescript
function useAnimationControls(
  animation: AnimationInstance,
  controls: {
    progress?: MaybeRefOrGetter<number>
    toggle?: MaybeRefOrGetter<boolean | undefined>
  }
): {
  controlled: ComputedRef<boolean>
}
```

### Parameters

- `animation`: The animation instance to control
- `controls`: Reactive control values

### Returns

- `controlled`: Whether controls are active

## useAnimationNesting

Composable for nesting animations in timelines.

```typescript
function useAnimationNesting(
  child: AnimationInstance | gsap.Callback | string,
  options?: NestableAnimation
): {
  parent: AnimationInstance | null
}
```

### Parameters

- `child`: The child animation, callback, or label
- `options`: Nesting options

### Returns

- `parent`: The parent animation instance