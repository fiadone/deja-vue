# Déjà Vue

Declarative GSAP animations for Vue 3.

Déjà Vue lets you compose GSAP tweens and timelines with Vue components, so
animation logic can live next to the markup it animates.

## Documentation

View the [documentation](https://fiadone.github.io/deja-vue/docs/) or explore
the [landing page](https://fiadone.github.io/deja-vue/).

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
  <Tween
    method="from"
    :vars="{ opacity: 0, y: 24, duration: 0.6, ease: 'power3.out' }"
  >
    <h1>
      Animated
      with
      Déjà
      Vue
    </h1>
  </Tween>
</template>
```

Use `Tween` for single animations, `Timeline` to coordinate sequences,
`Marker` for timeline checkpoints, and `SplitText` for text-based effects.

## Development

Install dependencies from the repository root:

```bash
npm install
```

Build the library package:

```bash
npm run build -w deja-vue
```

Run library type checks:

```bash
npm run typecheck -w deja-vue
```
