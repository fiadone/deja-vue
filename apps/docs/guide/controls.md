# Animation Controls

`Tween` and `Timeline` support **`v-model:progress`** for scrubbing and **`trigger`** with **`trigger-action`** for value-driven playback.

## Controlled playback

Binding **`v-model:progress`** and/or **`trigger`** puts the instance in **controlled** mode: the underlying timeline **starts paused** and waits for progress scrubbing or trigger-driven actions.

| Binding | Effect |
|---------|--------|
| **`v-model:progress`** only | Scrub between **0** and **1**; timeline stays paused until progress moves |
| **`trigger`** only | Each change runs **`trigger-action`**; internal progress initializes to **0** |
| Both | Same pause behavior; pause manually while scrubbing so playback and progress do not fight |

Uncontrolled instances (no progress or trigger bound) compose and run according to GSAP vars as usual.

## Progress

Scrub between **0** and **1**. Slot **`direction`** is **`0`** until the playhead moves for the first time, then **`1`** (forward) or **`-1`** (reverse) for the **last detected** movement. It does **not** reset to **`0`** when the timeline is paused or complete — only the initial state is **`0`**.

<ClientOnly>
  <ControlsProgressDemo show-direction />
</ClientOnly>

```html
<script setup>
import { ref } from 'vue'

import { Tween } from 'deja-vue'

const progress = ref(0.5)
</script>

<template>
  <input
    v-model.number="progress"
    max="1"
    min="0"
    step="0.01"
    type="range"
  >
  <Tween
    v-model:progress="progress"
    :to="{ x: 56 }"
    v-slot="{ direction }"
  >
    <div class="target">
      {{ direction }}
    </div>
  </Tween>
</template>
```

## Trigger {#trigger}

Each **`trigger`** change runs **`trigger-action`** (default **`play`**) via **`Animation.run`**, with optional GSAP arguments from **`trigger-options.actionArgs`**. Bind **`trigger-action`** in the same template as **`trigger`**.

**`trigger-options`** extends Vue **`WatchOptions`** with an optional **`actionArgs`** array forwarded to **`Animation.run`**. By default the watcher does **not** run on mount; pass **`{ immediate: true }`** to run once when the component is ready.

```html
<!-- WatchOptions only -->
<Tween
  :trigger="flag"
  :trigger-options="{ once: true }"
  :to="{ x: 56 }"
>
  <div class="target" />
</Tween>

<!-- GSAP args on each trigger change -->
<Tween
  :trigger="flag"
  trigger-action="play"
  :trigger-options="{ actionArgs: ['intro'] }"
  :to="{ x: 56 }"
>
  <div class="target" />
</Tween>
```

### Trigger actions

| **`trigger-action`** | **`Animation.run`** |
|----------------------|---------------------|
| **`play`** | `timeline.play(...actionArgs)` (default) |
| **`pause`** | `timeline.pause(...actionArgs)` |
| **`reset`** | `timeline.pause(atTime, ...rest)` — **`atTime`** defaults to **`0`** (shortcut for **`pause`** at the start, still paused) |
| **`restart`** | `timeline.restart(...actionArgs)` |
| **`resume`** | `timeline.resume(...actionArgs)` |
| **`reverse`** | `timeline.reverse(...actionArgs)` |

**`reset`** vs **`restart`**: **`reset`** (default **`actionArgs`**) is equivalent to **`trigger-action="pause"`** with **`actionArgs: [0]`** — back to the start, **paused**. **`restart`** returns to the start and **plays**.

**`reset`** vs **`pause`**: same GSAP call; **`reset`** supplies **`0`** when you omit **`actionArgs`**. For **`suppressEvents`**, pass the full **`pause`** signature, e.g. **`actionArgs: [0, false]`** with **`reset`**, or use **`pause`** directly.

<ClientOnly>
  <ControlsTriggerDemo />
</ClientOnly>

```html
<script setup>
import { ref } from 'vue'

import { Tween } from 'deja-vue'

const isPlaying = ref(false)
</script>

<template>
  <button @click="isPlaying = !isPlaying">
    {{ isPlaying ? 'Reverse' : 'Play' }}
  </button>
  <Tween
    :trigger="isPlaying"
    :trigger-action="isPlaying ? 'play' : 'reverse'"
    :from="{ opacity: 0 }"
  >
    <div class="target" />
  </Tween>
</template>
```

One-shot trigger inside a **`Marker`** slot (full pattern: **[Nesting — Marker-driven trigger](./nesting.md#marker-driven-trigger)**):

```html
<Timeline>
  <Tween :to="{ x: 56 }">
    <div class="target" />
  </Tween>
  <Marker v-slot="{ crossed }">
    <Tween
      :from="{ opacity: 0 }"
      :parent="null"
      :trigger="crossed"
      :trigger-action="crossed ? 'play' : 'reverse'"
      :trigger-options="{ once: true }"
    >
      <div class="target" />
    </Tween>
  </Marker>
  <Tween :to="{ x: 56 }">
    <div class="target" />
  </Tween>
</Timeline>
```

## Progress and trigger together

Binding **`v-model:progress`** pauses the timeline before each seek, so scrubbing does not fight active playback. If you also drive playback with **`trigger`**, avoid overlapping triggers while scrubbing.

Scroll-scrubbed timelines (**`scrollTrigger`** with **`scrub`**) follow scroll position; pairing them with manual progress scrubbing is usually redundant. See **[Animation targets — ScrollTrigger](./targeting.md#scrolltrigger)**.

## Instance access {#template-ref}

Prefer **`trigger`**, **`v-model:progress`**, and slot props for playback and nesting. **`useTemplateRef<DejaVueAnimationExposed>`** is for script-side access when the template alone is not enough — see **[Component instance types](../api/types.md#component-instance-types)**:

```typescript
tweenRef.value?.animation.run('play')
tweenRef.value?.animation.run('reset') // pause(0)
tweenRef.value?.animation.run('play', 'intro') // GSAP args forwarded
tweenRef.value?.direction // AnimationDirection — not Ref
```
