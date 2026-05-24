# Déjà Vue

Declarative GSAP animations for Vue 3.

Déjà Vue lets you compose GSAP tweens and timelines with Vue components, so
animation logic can live next to the markup it animates.

## Links

Open the [landing page](https://fiadone.github.io/deja-vue/) or jump straight
to the [documentation](https://fiadone.github.io/deja-vue/docs/).

## Install

```bash
npm install deja-vue gsap
```

`vue` and `gsap` are peer dependencies. This library targets Vue 3.

## Usage

```html
<script setup lang="ts">
import { Tween } from 'deja-vue'
</script>

<template>
  <Tween :from="{ opacity: 0, y: 24, duration: 0.6, ease: 'power3.out' }">
    <h1>Animated with Déjà Vue</h1>
  </Tween>
</template>
```

Use `Tween` for single animations, `Timeline` to coordinate sequences,
`Marker` for timeline checkpoints, and `SplitText` for text-based effects.

## Repository

This repository is an npm workspace monorepo:

- `packages/deja-vue` contains the published library.
- `apps/landing` contains the public landing page.
- `apps/docs` contains the VitePress documentation, deployed under `/docs`.

## Development

Install dependencies:

```bash
npm install
```

Run the landing page:

```bash
npm run dev:landing
```

Run the docs locally:

```bash
npm run dev:docs
```

Run the library watcher:

```bash
npm run dev:lib
```

Run type checks:

```bash
npm run typecheck
```

Run lint:

```bash
npm run lint
```

Build the library:

```bash
npm run build:lib
```

Build the landing page and docs locally:

```bash
npm run build:landing
npm run build:docs
```

Preview local production builds:

```bash
npm run preview:landing
npm run preview:docs
```
