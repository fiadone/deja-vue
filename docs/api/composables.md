# Composables API

## useAnimation

Core composable for creating and managing animations. Used internally by the `Tween` and `Timeline` components.

```typescript
function useAnimation(
  wrapper: Readonly<ShallowRef<HTMLElement | null>>,
  props: TimelineAnimation | TweenAnimation,
  emit: (event: typeof ANIMATION_EVENTS[number], timeline: gsap.core.Timeline) => void,
  options?: gsap.TimelineVars
): {
  animation: Animation
  controlled: ComputedRef<boolean>
  parent: { parent: Animation | null }
  ready: ShallowRef<boolean>
}
```

### useAnimation Parameters

- `wrapper`: Ref to the wrapper element that will be animated
- `props`: Animation configuration (TimelineAnimation or TweenAnimation)
- `emit`: Event emitter function for animation events
- `options`: Additional GSAP timeline options (merged with props.options if present)

### useAnimation Returns

- `animation`: The Animation instance with eventBus and timeline
- `controlled`: Computed ref indicating if animation is controlled (via progress or toggle)
- `parent`: Object containing the parent animation instance or null
- `ready`: Shallow ref indicating when animation is ready for use

### useAnimation Behavior

- Initializes the animation on mount
- Automatically composes tweens if using Timeline mode
- Sets up event listeners for all GSAP timeline events
- Cleans up on unmount

## useAnimationControls

Composable for controlling animations with reactive props.

```typescript
function useAnimationControls(
  animation: Animation,
  controls: {
    progress?: MaybeRefOrGetter<number>
    toggle?: MaybeRefOrGetter<boolean | undefined>
  }
): {
  controlled: ComputedRef<boolean>
}
```

### useAnimationControls Parameters

- `animation`: The Animation instance to control
- `controls`: Object with optional progress and toggle control values
- `progress`: Controls scrubbing (0-1). When provided, animation pauses at that position
- `toggle`: Controls play/pause state. `true` plays, `false` reverses animation

### useAnimationControls Returns

- `controlled`: ComputedRef\<boolean> that indicates if any controls are active

### useAnimationControls Behavior

- If both progress and toggle are provided, progress takes precedence
- Changes to progress continuously scrub the animation
- Changes to toggle trigger play/reverse actions
- Animation pauses when controls are active (unless toggle is true)

## useAnimationNesting

Composable for nesting animations in parent timelines via provide/inject.

```typescript
function useAnimationNesting(
  child?: Animation | gsap.Callback | string,
  options?: NestableAnimation
): {
  parent: Animation | null
}
```

### useAnimationNesting Parameters

- `child`: The child animation, callback function, or label string to nest
- `options`: Nesting configuration
  - `parent`: Explicitly set parent (overrides injected parent if provided)
  - `position`: GSAP position parameter for when to add the child in parent timeline

### useAnimationNesting Returns

- `parent`: The parent animation instance or null if no parent found

### useAnimationNesting Behavior

- Automatically injects parent animation from Timeline context (if available)
- Only adds child to parent animation on mount (after nextTick)
- Removes child from parent on unmount
- Handles different child types: Animation instances, callbacks, and labels
- If child is an Animation and no parent exists, disposes the animation on unmount

### Positioning

When nesting animations, use GSAP position syntax:

- `"+=1"` - Start 1 second after parent's current time
- `"-=0.5"` - Start 0.5 seconds before parent's current time
- `1` - Start at absolute time 1
- `"label"` - Start at named label
- `undefined` or not provided - Start immediately after previous animation
