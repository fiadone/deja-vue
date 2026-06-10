# Upgrading to v2

This guide upgrades from **v1** (published **1.x**, [latest release: v1.0.1](https://github.com/fiadone/deja-vue/releases/tag/v1.0.1)) to **v2**.

**Requirements:** Vue **3.5+**, GSAP **3.x**.

## Component model

| v1 | v2 |
|--------|-----|
| **`useAnimation`** composable (internal to components; also exported) | Logic built into **`Tween`** / **`Timeline`**; use **`trigger`** / slot props, or template refs when script access is required |
| **`tag`** prop — renders a wrapper **`component :is="tag"`** as the default target | **`is`** attribute — scope root element when you need a wrapper; default targets are **slotted nodes** (no extra wrapper) |
| **`group`** prop (animate wrapper children) | Multiple slot roots + **`stagger`**; **`is`** + **`tweenTarget`** prop for custom resolution |
| **`Timeline` `tweens` prop** — sequence of definitions on the **same** wrapper target | Nested **`Tween`** chain with **`seamless`** on inner steps (same target, sequenced on the parent timeline) |
| **`Callback`** + **`PositionMarker`** | Single **`Marker`** component |
| **`provide(parentAnimationInjectionKey)`** = raw **`Animation`** | **`provide(dejaVueParentInstance)`** → **`DejaVueAnimationInstance`**; use **`parent.animation`** for GSAP |
| Manual **`parent`** = **`Animation`** ref | **`parent`** from nested slot, or **`DejaVueAnimationParent`** when override is required |
| **`defineExpose({ animation, … })`** | Registers **`DejaVueAnimationInstance`**; template refs surface **`DejaVueAnimationExposed`** (unwrapped) |

```html
<!-- v1 — tag="div" wraps slot; GSAP targets the wrapper (or its children with group) -->
<Tween
  tag="div"
  :toggle="playing"
  :vars="{ x: 100 }"
>
  <span>Content</span>
</Tween>

<!-- v2 — slot content is the target; use is when you still need a wrapper element -->
<Tween
  :to="{ x: 100 }"
  :trigger="playing"
  :trigger-action="playing ? 'play' : 'reverse'"
>
  <span>Content</span>
</Tween>

<!-- v2 — equivalent to v1 tag="section" targeting the wrapper -->
<Tween
  is="section"
  tween-target="self"
  :to="{ x: 100 }"
  :trigger="playing"
  :trigger-action="playing ? 'play' : 'reverse'"
>
  <span>Content</span>
</Tween>
```

```html
<!-- v1 — tweens[] runs a sequence on the Timeline wrapper target -->
<Timeline
  tag="div"
  :tweens="[
    { method: 'to', vars: { x: 100 } },
    { method: 'to', vars: { y: 50 }, position: '+=0.5' }
  ]"
>
  <div class="target" />
</Timeline>

<!-- v2 — same target, sequenced on the parent timeline via nested seamless Tweens -->
<Timeline>
  <Tween :to="{ x: 100 }">
    <Tween
      seamless
      position="+=0.5"
      :to="{ y: 50 }"
    >
      <div class="target" />
    </Tween>
  </Tween>
</Timeline>
```

For **different** targets per step (not the v1 **`tweens`** model), nest sibling **`Tween`** components without **`seamless`**. For labels and callbacks use **`Marker`**; for nested timelines use child **`Timeline`** components; for split text place **`SplitText`** **inside a `Tween` slot** — see **[Timeline](./timeline.md)**, **[Nesting](./nesting.md)**, and **[Split text](./split-text.md)**.

## Tween definition

v1 used **`method`** + **`vars`** on **`Tween`**. v2 replaces that pair with explicit props:

| v1 | v2 |
|--------|-----|
| **`method="to"`** + **`:vars`** | **`:to="{ … }"`** |
| **`method="from"`** + **`:vars`** | **`:from="{ … }"`** |
| **`method="fromTo"`** + **`:vars="[from, to]"`** | **`:from`** + **`:to`** |
| **`method="effect:NAME"`** + **`:vars`** | **`effect="NAME"`** + optional **`effect-options`** |

```html
<!-- v1 -->
<Tween
  method="fromTo"
  :vars="[{ opacity: 0 }, { opacity: 1 }]"
>
  <div class="target" />
</Tween>

<!-- v2 -->
<Tween
  :from="{ opacity: 0 }"
  :to="{ opacity: 1 }"
>
  <div class="target" />
</Tween>
```

Only one tween kind per **`Tween`** — the types enforce mutually exclusive props. When switching kind at runtime, add a **`:key`** (see **[Troubleshooting](./troubleshooting.md#tween-kind-prop-mismatch)**).

## Animation controls

| v1 | v2 |
|--------|-----|
| **`toggle`** (`boolean`) — **`play`** when `true`, **`reverse`** when `false` | **`:trigger`** (any watched value) + **`:trigger-action`** (single action per change; default **`play`**) |
| **`progress`** prop | **`v-model:progress`** |
| Toggle/play on mount when **`toggle`** already `true` | Controlled timelines start **paused** when **`progress`** or **`trigger`** is bound |

```html
<!-- v1 -->
<Tween
  :toggle="playing"
  :vars="{ x: 100 }"
/>

<!-- v2 -->
<Tween
  :to="{ x: 100 }"
  :trigger="playing"
  :trigger-action="playing ? 'play' : 'reverse'"
/>
```

```html
<!-- v1 -->
<Tween
  method="from"
  :progress="0.5"
  :vars="{ opacity: 0 }"
/>

<!-- v2 -->
<Tween
  v-model:progress="progress"
  :from="{ opacity: 0 }"
/>
```

Bind **`trigger-action`** in the **same template** as **`trigger`** — v2 uses a single **`triggerAction`** per change (default **`play`**), not a true/false action pair. Use **`trigger-options`** for Vue watch flags (e.g. **`{ once: true }`**) and **`actionArgs`** for GSAP parameters forwarded to **`Animation.run`**. See **[Animation controls](./controls.md)**.

## Targeting

| v1 | v2 |
|--------|-----|
| **`tag="div"`** (default) — wrapper element is the target | Slotted DOM nodes are the default target (no wrapper) |
| **`tag="section"`** (etc.) — custom wrapper element | **`is="section"`** + **`tween-target="self"`** when the scope root should be animated |
| **`group`** → wrapper **`children`** | Multiple slot roots; **`stagger`** in tween vars |
| **`Timeline` `tweens`** on one wrapper target | Nested **`Tween`** + **`seamless`** chain on a shared target |
| — | **`is`** + **`tween-target`** selector for scoped queries inside the slot |

See **[Animation targets](./targeting.md)** and **[Animation targets — seamless](./targeting.md#seamless)**.

## `Marker`

| v1 | v2 |
|--------|-----|
| **`Callback`** with **`fn`** | **`Marker`** callback at **`position`** |
| **`PositionMarker`** with **`label`** + **`@cross`** | **`Marker`** with optional **`label`**, **`@cross`**, slot **`{ crossed, parent }`** |
| **`@cross`** without direction payload | **`@cross`** receives **`AnimationDirection`** (`1` forward, `-1` reverse) |

```html
<!-- v1 -->
<PositionMarker
  label="middle"
  @cross="onCross"
/>

<!-- v2 -->
<Marker
  label="middle"
  @cross="onCross"
/>
<!-- onCross(direction: AnimationDirection) -->
```

## SplitText

Place **`SplitText`** **inside a `Tween` slot**. v2 registers **SplitText** and **ScrollTrigger** automatically — remove **`gsap.registerPlugin(SplitText)`** / **`gsap.registerPlugin(ScrollTrigger)`** from app setup when you only use them through deja-vue. Listen with **`@split`** / **`@revert`** on the component.

See **[SplitText](./split-text.md)** and **[Getting started — GSAP plugins](./getting-started.md#gsap-plugins)**.

## Events and slot scope

| v1 | v2 |
|--------|-----|
| **`@complete="(timeline) => …"`** (raw **`gsap.core.Timeline`**) | **`@complete="(animation, parent) => …"`** |
| Slot: **`animation`**, **`controlled`**, **`parent`**, **`progress`** | Slot: **`animation`**, **`direction`**, **`parent`**, **`progress`** |

Use **`animation.timeline`** for imperative GSAP access.

## Tween re-compose

| v1 | v2 |
|--------|-----|
| **`compose`** ran once on mount; changing **`method`** / **`vars`** did not rebuild | Changing **`tweenTarget`**, tween kind, or **`from`** / **`to`** / **`effect-options`** triggers **`clear(revertOnDispose)`** and **`compose`** again (default keeps inline styles; pass **`revert-on-dispose`** to restore DOM state) |

## `Animation.compose` (imperative)

| v1 | v2 |
|--------|-----|
| **`compose(target, { method, vars })`** | **`compose({ target, method, vars, scope? })`** |

```typescript
// v1
animation.compose(el, { method: 'to', vars: { x: 100 } })

// v2
animation.compose({ target: el, method: 'to', vars: { x: 100 } })
```

## Timeline nesting

| v1 | v2 |
|--------|-----|
| Nesting registered on **`onMounted`** only | **`useAnimationNesting`** watches children and **`position`**; re-registers on change |
| **`add`** — raw **`timeline.add`**, no sibling shifting | **`add`** — raw **`timeline.add`** by default; imperative **`timeShift: true`** on **`Animation.add`** (not exposed on **`Tween`** / **`Timeline`** / **`Marker`**) |
| **`remove`** (nested **`Animation`**) — always deferred until **`complete`** / **`reverseComplete`**, then manual collapse | **`remove`** — immediate when paused; **`shiftChildren`** collapse; deferred while parent is **playing** |
| No fixed-duration helper beyond setting **`data.totalDuration`** | **`applyTimelineTotalDuration`** after add/remove when parent **`duration`** prop is set |

Labels and callbacks (**`Marker`**) still use raw GSAP **`add`** / **`remove`** without **`shiftChildren`** in v2.

Without an explicit **`position`**, each add resolves to the parent timeline **end**. That affects runtime changes such as **`v-if`**: removing a child collapses trailing siblings, but re-adding appends at the end rather than restoring a middle template slot. Use explicit **`position`** when conditional composition must land at a specific time. See **[Dynamic children](./nesting.md#dynamic-children-v-if-lists)**.

## `useAnimationNesting` (breaking)

| v1 | v2 |
|--------|-----|
| **`useAnimationNesting(target, position?)`** | **`useAnimationNesting(target?, options?)`** with **`AnimationNestingOptions`** |
| **`parent`** read from **`useAttrs()`** (fallthrough from the **`parent`** prop) | **`parent`** passed as **`options.parent`** (built-in **`Tween`** / **`Timeline`** / **`Marker`** wire **`props.parent`**) |
| **`target`** required | **`target`** optional (empty children allowed) |

```typescript
// v1 — second argument is position only; parent from attrs
useAnimationNesting({ animation }, () => props.position)

// v2 — options object; pass parent explicitly when wrapping the composable
useAnimationNesting({ animation }, {
  parent: props.parent,
  position: () => props.position
})
```

If you call **`useAnimationNesting`** in your own component, mirror the built-in components: accept **`parent`** / **`position`** as props and forward them in **`options`**. Relying on attrs inside the composable is no longer supported.

## Exports

| v1 | v2 |
|--------|-----|
| **`useAnimation`** | — (built into **`Tween`** / **`Timeline`**; use **`trigger`** / slot props) |
| **`Callback`**, **`PositionMarker`** | **`Marker`** |
| — | **`SplitText`**, **`useSplitText`**, **`useAnimationScope`**, **`useStableObjectProp`**, **`useTweenVars`** |
| — | **`syncData`**, **`patchObject`**, **`patchArray`**, **`isObject`**, **`cloneObject`** |
| — | **`applyTimelineTotalDuration`**, **`resolveTimelinePosition`**, **`stripScrollTriggerVars`** |
| — | **`AnimationControls`**, **`AnimationNestingTarget`**, **`AnimationNestingOptions`**, **`AnimationScopeOptions`**, **`SplitTextOptions`**, **`AnimationTriggerOptions`** |
| — | **`DejaVueMarkerInstance`**, **`DejaVueMarkerExposed`**, **`DejaVueMarkerScopeProps`**, **`DejaVueSplitTextInstance`**, **`DejaVueSplitTextExposed`**, **`DejaVueSplitTextScopeProps`**, **`AnimationNestableChild`** |
| **`parentAnimationInjectionKey`** (`InjectionKey<Animation>`) | **`dejaVueParentInstance`** (`InjectionKey<DejaVueAnimationInstance>`) |

Unchanged: **`Tween`**, **`Timeline`**, **`Animation`**, **`useAnimationControls`**, **`ANIMATION_EVENTS`**.

If you **`inject`** the parent timeline in custom components, rename the import and expect **`DejaVueAnimationInstance`** (refs) instead of a raw **`Animation`**.

## Types reference

- **`TweenDefinition`** — **`from` / `to` / `effect`** union (replaces component-level **`method` / `vars`**)
- **`AnimationComposeDefinition`** — **`{ target, method, vars, scope? }`**
- **`ControllableAnimation`** — **`trigger`**, **`triggerAction`**, **`triggerOptions`** (**`AnimationTriggerOptions`**: **`WatchOptions`** + **`actionArgs`**), **`progress`**
- **`AnimationNestingTarget`**, **`AnimationNestingOptions`**, **`AnimationScopeOptions`**, **`AnimationControls`**, **`DejaVueNode`**, **`PlainObject`**, **`NonEmptyArray`**
- **`DejaVueAnimationInstance`**, **`DejaVueAnimationExposed`**, **`DejaVueAnimationParent`**, **`DejaVueAnimationScopeProps`**, **`DejaVueMarkerInstance`**, **`DejaVueMarkerExposed`**, **`DejaVueMarkerScopeProps`**, **`DejaVueSplitTextInstance`**, **`DejaVueSplitTextExposed`**, **`DejaVueSplitTextScopeProps`**, **`AnimationNestableChild`**, **`AnimationDirection`**, **`TweenAction`** (prop and composable signatures also use GSAP types such as **`gsap.TweenTarget`** from the **`gsap`** package)

Match your installed version with [Components](../api/components.md) and [Types](../api/types.md) API pages.
