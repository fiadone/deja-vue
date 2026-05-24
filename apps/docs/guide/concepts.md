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

Nest **`Tween`**, **`Timeline`**, **`Marker`**, and **`SplitText`** inside a parent **`Timeline`**. Children register on the parent timeline via **`position`**. See **[Nesting](./nesting.md)**.

## Compose and rebuild

**`Tween`** recomposes when **`tweenTarget`**, tween kind, or **`from`** / **`to`** / **`effect-options`** change. Use **`progress`** / **`trigger`** for playback control.

## Direction

**`direction`** is **`1`**, **`-1`**, or **`0`**. Available in the default slot and on template refs. **`Marker`** **`@cross`** passes direction at the crossing.

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
| API | [Components](../api/components.md), [Types](../api/types.md) |
