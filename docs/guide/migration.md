# Upgrading

> [!TIP]
> Pair this checklist with **[Core concepts](./concepts.md)**.

Summary of changes when moving to the current scope-based API.

## Removed or replaced

| Old | New |
|-----|-----|
| **`useAnimation`** | Logic inside **`Tween`** / **`Timeline`**; use template refs |
| **`group` / `tag` props** | Slot children + **`stagger`**; **`is`** / **`target`** attrs |
| **`Timeline` `tweens` prop** | Nest **`Tween`** / **`Timeline`** in the template only |
| **`Callback`** + **`PositionMarker`** | Single **`Marker`** component |
| **`asCallback` / `@call`** | Use **`Marker`** callbacks or nested structure |
| **`triggerMode`** | **`triggerActions`** (`TweenAction` or tuple) + optional **`v-model:trigger.once`** |
| Parent inject = raw **`Animation`** | Inject **`DejaVueInstance`**; use **`parent.animation`** for GSAP |

## `Marker`

- Optional **`label`** on the parent timeline
- **`@cross`** receives **`AnimationDirection`** (`1` | `-1`)
- Default slot: **`{ crossed, parent }`**

## Event payloads

**`(animation, parent)`** — `parent` is **`DejaVueInstance | null`**, not only `Animation`.

## Slot scope restored

**`Tween`** / **`Timeline`** default slots receive **`animation`**, **`controlled`**, **`direction`**, **`parent`**, **`progress`**, **`target`**.

## New APIs

| API | Purpose |
|-----|---------|
| **`direction`** | Scrub / playback direction (`1` \| `-1` \| `0`) |
| **`triggerActions`** | Custom play/pause/reverse/restart mapping |
| **`v-model:trigger.once`** | Run trigger control once |
| **`seamless`** on **`Tween`** | Nested tween target chains |
| **`useStableTweenVars`** | Stable `vars` identity for compose watcher |
| **`SplitText`** | Text splitting (child of **`Tween`**) |

## Types

- **`TweenDefinition`** (no separate `TweenDefinitionDefinition` / `TimelineAnimation`)
- **`DejaVueInstance`**, **`AnimationDirection`**, **`TweenAction`**
- **`ANIMATION_EVENTS`** — no `call` event

Match your installed version with [Components](../api/components.md) and [Types](../api/types.md) API pages.
