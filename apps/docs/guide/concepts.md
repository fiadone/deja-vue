---
outline: deep
title: Core concepts
---

# Core concepts

## The `Animation` class

**`Animation`** wraps **`gsap.core.Timeline`**. Use **`animation.timeline`** for raw GSAP. Component events use **`(animation, parent)`**.

## Target resolution

Slotted DOM nodes are the default target. Override with **`is`** + **`tweenTarget`**, or **`seamless`** children (**`SplitText`**, nested **`Tween`**). See **[Animation targets](./targeting.md)**.

## Nesting {#nesting-at-a-glance}

Nest **`Tween`**, **`Timeline`**, and **`Marker`** inside a parent **`Timeline`**. They register on the parent timeline via **`parent`** and **`position`**. Place **`SplitText` inside a `Tween` slot** — see **[Split text](./split-text.md)** and **[Nesting](./nesting.md)**.

::: info How nesting works
- **`Timeline`** calls **`provide(dejaVueParentInstance, …)`**. Descendants **`inject`** it to register on that timeline unless they opt out with **`:parent="null"`** or an explicit **`:parent`**.
- A **`Tween`** nested in another **`Tween`** slot registers on the nearest ancestor **`Timeline`**, as a sibling **Animation** child on that timeline.
- **`seamless`** affects **which DOM nodes** a tween animates (target resolution). See **[Animation targets — seamless](./targeting.md#seamless)**.
:::

Component **`Instance`**, **`Exposed`**, **`Parent`**, and slot types are documented under **[Component instance types](../api/types.md#component-instance-types)**.

## Compose and rebuild

**`Tween`** recomposes when **`tweenTarget`**, tween kind, or **`from`** / **`to`** / **`effect-options`** change. Use **`progress`** / **`trigger`** for playback control.

## ScrollTrigger

Put **`scrollTrigger`** in tween vars or timeline **`options`**. Déjà Vue registers ScrollTrigger and attaches instances to the component timeline — see **[Getting started — GSAP plugins](./getting-started.md#gsap-plugins)** and **[Animation targets — ScrollTrigger](./targeting.md#scrolltrigger)**.

## Direction

**`direction`** is **`0`** until the playhead moves for the first time, then **`1`** or **`-1`** for the last detected forward or reverse movement; it stays at that value when the timeline is paused or complete (no reset to **`0`** after motion). Available in the default slot. **`Marker`** **`@cross`** passes direction at the crossing.

## Where next

| Goal | Guide |
|------|--------|
| Setup | [Getting started](./getting-started.md) |
| DOM targeting | [Animation targets](./targeting.md) |
| Single tweens | [Tween](./tween.md) |
| Sequences | [Timeline](./timeline.md) |
| Scrub / trigger | [Controls](./controls.md) |
| Nesting, Marker | [Nesting](./nesting.md) |
| SplitText | [Split text](./split-text.md) |
| Upgrading | [Upgrading to v2](./migration.md) |
| Issues | [Troubleshooting](./troubleshooting.md) |
| API | [Components](../api/components.md), [Composables](../api/composables.md), [Types](../api/types.md) |
