# Getting Started

Déjà Vue (*Declarative Elements* for *Javascript Animations* in *Vue*) is a Vue 3 library that provides declarative components for creating and managing GSAP animations directly in your templates. It allows you to define and nest animations using Vue components, making them more readable and maintainable.

## Installation

Install Déjà Vue along with its peer dependencies:

```bash
npm install deja-vue gsap vue
```

## Basic Usage

Here's a simple example of using the `Tween` component to animate an element:

```vue
<template>
  <Tween method="to" :vars="{ x: 100, duration: 1 }">
    <div>Animated Element</div>
  </Tween>
</template>

<script setup>
import { Tween } from 'deja-vue'
</script>
```

This will animate the div to move 100px to the right over 1 second.

## Next Steps

- Learn about the [Tween Component](./tween.md)
- Explore the [Timeline Component](./timeline.md)
- Understand [Animation Controls](./controls.md)
- Master [Nesting Animations](./nesting.md)