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
                                   └── parent.animation.add(child, position)
```

**`Marker`** can register both a **label** and a **callback** in one nesting call.

Patterns: **[Nesting animations](./nesting.md)**.

## Compose, stable vars, and rebuild

**`Tween`** watches **`target`**, **`method`**, and stable **`vars`** ([`useStableTweenVars`](../api/composables.md#usestabletweenvars)). On change it **`clear(true)`** and **`compose`** again. Prefer **`progress` / `trigger`** for playback UI; use GSAP **`repeat`**, **`yoyo`** for loop behavior inside one definition.

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
| Scrub / trigger / triggerActions | [Controls](./controls.md) |
| Parent `position`, Marker | [Nesting](./nesting.md) |
| Split text in Tween slot | [Split text](./split-text.md) |
| Upgrading | [Upgrading](./migration.md) |
| Issues | [Troubleshooting](./troubleshooting.md) |
| Props / types | [Components API](../api/components.md), [Types](../api/types.md) |
