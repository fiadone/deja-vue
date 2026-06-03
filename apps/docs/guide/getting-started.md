# Getting Started

Déjà Vue lets you define and nest GSAP animations as Vue components.

## Installation

```bash
npm install deja-vue@latest
```

Déjà Vue does not bundle **Vue** or **GSAP** — your app must provide them as [peer dependencies](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#peerdependencies):

| Package | Version |
|---------|---------|
| `vue` | ^3.5.0 |
| `gsap` | ^3.0.0 |

If they are not already in your project:

```bash
npm install vue gsap
```

::: tip Greenfield projects
Install everything in one step:

```bash
npm install deja-vue@latest vue gsap
```
:::

npm 7+ may install missing peers automatically; if you see peer warnings, add `vue` and `gsap` explicitly.

## GSAP plugins {#gsap-plugins}

Déjà Vue registers the plugins its components use. You do **not** need **`gsap.registerPlugin()`** in app setup for:

| Plugin | Registered when you import |
|--------|---------------------------|
| **ScrollTrigger** | **`Tween`**, **`Timeline`**, or **`Animation`** |
| **SplitText** | **`SplitText`** or **`useSplitText`** |

Register other GSAP plugins yourself (e.g. **MorphSVG**) if you use them in tween vars or imperative code.

If you call **ScrollTrigger** or **SplitText** APIs directly — outside deja-vue components — import the matching export from **`deja-vue`** first, or call **`gsap.registerPlugin()`** yourself.

## Basic usage

```html
<script setup>
import { Tween } from 'deja-vue'
</script>

<template>
  <Tween :to="{ x: 56 }">
    <div class="target" />
  </Tween>
</template>
```

## Trigger

<ClientOnly>
  <TweenTriggerDemo />
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
    :to="{ x: 56 }"
  >
    <div class="target" />
  </Tween>
</template>
```

See [Animation controls](./controls.md).

## Progress

<ClientOnly>
  <ControlsProgressDemo />
</ClientOnly>

```html
<script setup>
import { ref } from 'vue'

import { Tween } from 'deja-vue'

const progress = ref(0)
</script>

<template>
  <Tween
    v-model:progress="progress"
    :to="{ x: 56 }"
  >
    <div class="target" />
  </Tween>
</template>
```

## Sequences

<ClientOnly>
  <TimelineSequenceDemo />
</ClientOnly>

See **[Timeline — Basic timeline sequence](./timeline.md#basic-timeline-sequence)** and **[Nesting](./nesting.md)**.

## Next

- [Core concepts](./concepts.md)
- [Animation targets](./targeting.md)
- [Tween](./tween.md)
- [Timeline](./timeline.md)
- [Controls](./controls.md)
- [Nesting](./nesting.md)
- [Split text](./split-text.md)
