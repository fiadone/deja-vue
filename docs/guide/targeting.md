# Animation targets

> [!TIP]
> Read **[Core concepts](./concepts.md)** first.

`Tween` and `Timeline` resolve **which DOM nodes** GSAP tweens via **[`useAnimationScope`](../api/composables.md#useanimationscope)** and **[vue-unwrap](https://www.npmjs.com/package/vue-unwrap)**.

## Default: slot content

```vue
<Tween method="to" :vars="{ x: 80, duration: 0.6 }">
  <div class="target">Target</div>
</Tween>
```

## `target="self"` with `is`

```vue
<Tween is="section" target="self" method="to" :vars="{ opacity: 0.4, duration: 0.5 }">
  <div class="target">Target</div>
</Tween>
```

## `is` + selector

```vue
<Tween
  is="div"
  target=".highlight"
  method="to"
  :vars="{ scale: 1.05, duration: 0.3 }"
>
  <div class="target">Target</div>
  <div class="highlight">Highlighted target</div>
</Tween>
```

## Multiple nodes and stagger

Several slot roots → array target; use **`stagger`** in **`vars`**.

## `seamless` on Tween

Set **`seamless`** on a nested **`Tween`** so the **parent** scope uses that child’s **`target`** (not only its wrapper DOM). Used for chained tweens on the same elements:

```vue
<Tween method="from" :vars="{ scale: 0, stagger: 0.1 }">
  <Tween seamless method="to" :vars="{ x: 200, stagger: 0.1 }">
    <div class="target">Target</div>
  </Tween>
</Tween>
```

## `SplitText`

**`SplitText`** sets **`seamless: true`** and exposes **`target`** (split lines/words/chars). Place it **inside a `Tween` slot** — see [Split text](./split-text.md).

## Target changes

Changing the resolved target kills tweens on the previous target and clears inline props before recompose.

Attributes such as **`is`**, **`target`**, and nesting **`position`** are intended as setup-style inputs. Prefer recreating the component with a key when changing the shape of the scope or nesting relationship at runtime.

## See also

- [Tween](./tween.md#animation-target)
- [Troubleshooting](./troubleshooting.md)
