---
outline: deep
title: Core concepts
---

# Core concepts

Read this page once, then use the focused guides for syntax and examples.

## Who this is for

Comfort with **Vue 3** (`<script setup>`, props, refs, `v-model`, slots) and **GSAP** (tweens, timelines, **`position`**). New to timelines? See [GSAP get started](https://gsap.com/resources/get-started/).

## The `Animation` class

**`Animation`** wraps **`gsap.core.Timeline`**. Use **`animation.timeline`** for raw GSAP.

**`Animation`** also provides an **`EventBus`** (multiple listeners per event). Component handlers use **`(animation, parent)`**:

- **`animation`** — `Animation` instance
- **`parent`** — **`DejaVueInstance`** (parent `Tween` / `Timeline` instance) or `null`

## Target resolution

**[`useAnimationScope`](../api/composables.md#useanimationscope)** + **[vue-unwrap](https://www.npmjs.com/package/vue-unwrap)** pick DOM targets from slots, **`is` / `target`**, and **`seamless`** children (**`SplitText`**, nested **`Tween`**). Details: **[Animation targets](./targeting.md)**.

## Nesting at a glance {#nesting-at-a-glance}

```text
  Timeline.vue
  provide(dejaVueParentInstance → DejaVueInstance)
         │
         └── instance.animation → gsap.timeline()

  Child (Tween, Timeline, Marker, …)
         │
         inject(parent) ──► useAnimationNesting
                                   │
                                   └── parent.animation.add / remove
                                       (Animation children: timeShift + shiftChildren)
```

**`Marker`** can register both a **label** and a **callback** in one nesting call (raw GSAP placement, no **`shiftChildren`**).

Patterns: **[Nesting animations](./nesting.md)**.

## Compose, stable props, and rebuild

**`Tween`** watches **`target`**, the derived GSAP **method** (`to`, `from`, `fromTo`, or **`effect`**), and stable **`from` / `to` / `effect-options`** (patched in place via [`useStableObjectProp`](../api/composables.md#usestableobjectprop); the compose watcher is **deep**). On change it **`clear(true)`** and **`compose`** again with an [`AnimationComposeDefinition`](../api/types.md#animationcomposedefinition). Prefer **`progress` / `trigger`** for playback UI; use GSAP **`repeat`**, **`yoyo`** for loop behavior inside one definition.

The docs use inline tween objects to keep examples compact. Déjà Vue stabilizes those values internally, so inline objects are safe; in application code, naming definitions in script and passing them by reference remains best practice for reuse, typing, and clarity.

## Direction

**`direction`** (`1` | `-1` | `0`) reflects scrub direction and is available on the component instance and default slot. **`Marker`** **`@cross`** passes the parent’s direction at the crossing.

## Documentation voice

Guides: imperative, instructional. API: tables-first. Cross-links avoid duplicating full explanations.

## Where next

| Goal | Guide |
|------|--------|
| First-time setup | [Getting started](./getting-started.md) |
| DOM targeting | [Animation targets](./targeting.md) |
| Single tweens, seamless chains | [Tween](./tween.md) |
| Sequences (nested only) | [Timeline](./timeline.md) |
| Scrub / trigger / trigger-action | [Controls](./controls.md) |
| Parent `position`, Marker | [Nesting](./nesting.md) |
| SplitText in Tween slot | [SplitText](./split-text.md) |
| Upgrading to v2 | [Upgrading to v2](./migration.md) |
| Issues | [Troubleshooting](./troubleshooting.md) |
| Props / types | [Components API](../api/components.md), [Types](../api/types.md) |
