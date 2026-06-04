# Troubleshooting

## Nothing moves

1. **Empty target** — No slot content, or `v-if` hid nodes on first compose.
2. **Wrong layer** — Default targets are slot children; use **`is`** + **`tween-target="self"`** for the scope root.
3. **Selector without `is`** — String selectors need **`is`**.

## Wrong element animated

1. **Nested `Tween` without `seamless`** — Set **`seamless`** on inner tweens for chains.
2. **`SplitText` outside `Tween` slot** — Wrap with a parent **`Tween`** ([SplitText](./split-text.md)).

## `progress` does not scrub

Use **`v-model:progress`** with a defined number. Scrubbing pauses the timeline automatically; avoid changing **`trigger`** while scrubbing if both are bound.

## `trigger` does unexpected action

Bind **`trigger-action`** in the same template as **`trigger`**, e.g. **`:trigger-action="trigger ? 'play' : 'reverse'"`**. See **[Controls](./controls.md)** and **[Controls — Trigger](./controls.md#trigger)**.

## Tween kind / prop mismatch

One kind per **`Tween`**: **`to`**, **`from`**, **`from`** + **`to`**, or **`effect`**. Use **`:key`** when switching kind at runtime — see **[Tween — Tween kinds](./tween.md#tween-kinds)**.

## Nesting / parent not found {#nesting-parent-not-found}

- **`:parent="null"`** (boolean binding) opts out of inject — not the string **`"null"`**.
- **`:parent="parent"`** from a nested **`Timeline`** slot — see **[Nesting — Manual parent assignment](./nesting.md#manual-parent-assignment)**.
- **`:parent="timelineRef"`** — only when the nestable cannot live inside the target **`Timeline`** tree; use **`useTemplateRef<DejaVueAnimationExposed>`**. See **[Component instance types](../api/types.md#component-instance-types)**.
- **`inject(dejaVueParentInstance)`** yields **`DejaVueAnimationInstance`** (raw refs).
- **`parent`** is resolved at component setup. If an explicit **`parent`** is not ready when the child mounts, delay the child (**`v-if`**) or ensure the parent is mounted first.
- Reading **`parent.direction`** in custom code when **`parent`** is **`DejaVueAnimationParent`**: use **`toValue(parent?.direction)`** from Vue.

## Conditional tweens land in the wrong order

Set explicit **`position`** — see **[Dynamic children](./nesting.md#dynamic-children-v-if-lists)**.

## Child removed with `v-if` but timeline still references it briefly

While the parent **`Timeline`** is **playing**, **`useAnimationNesting`** defers **`remove`** until the parent finishes its current cycle (same as **[Types API — `remove`](../api/types.md#animation)**). Pause the parent or wait for **`complete`** / **`reverseComplete`** if you need the child off the GSAP timeline immediately. Unmounting the child component forces removal.

## Marker `cross` or `crossed` out of sync

**`@cross`** passes **`direction`** at the crossing (`1` forward, `-1` reverse). Slot **`crossed`** follows playhead position relative to the marker. During scroll-driven playback, see **[ScrollTrigger](./targeting.md#scrolltrigger)** if **`crossed`** or **`progress`** lag after a **`toggleActions`** **`reset`**.

## SplitText flicker

Avoid recreating **`SplitText`** option objects every render.

## ScrollTrigger

See **[Animation targets — ScrollTrigger](./targeting.md#scrolltrigger)** for setup, defaults, **`fromTo`**, and smooth-scroll libraries.

Quick checks:

1. Put **`scrollTrigger`** in tween **`from`** / **`to`** vars or timeline **`options`**.
2. Import **`Tween`**, **`Timeline`**, or **`Animation`** from **`deja-vue`** once so the plugin registers — **[Getting started — GSAP plugins](./getting-started.md#gsap-plugins)**.

## Still stuck

[Open an issue](https://github.com/fiadone/deja-vue/issues) with a minimal SFC and package versions.
