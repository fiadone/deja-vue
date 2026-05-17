# Troubleshooting

> [!TIP]
> **[Core concepts](./concepts.md)** and **[Animation targets](./targeting.md)** first.

## Nothing moves

1. **Empty target** — No slot content or `v-if` hid nodes on first compose.
2. **Wrong layer** — Default targets are **slot children**, not the scope root; use **`is`** + **`target="self"`** if needed.
3. **Selector without `is`** — String selectors need **`is`** for scoped `gsap.utils.toArray`.

## Wrong element animated

1. **Nested `Tween` without `seamless`** — Parent may tween wrapper DOM; set **`seamless`** on inner tweens for chains.
2. **`SplitText` outside `Tween` slot** — Parent must wrap **`SplitText`** so **`seamless`** / **`target`** apply ([Split text](./split-text.md)).

## `progress` does not scrub

Use **`v-model:progress`**. Bind a defined number, not `undefined`. Pause manually if **`trigger`** also drives playback.

## `trigger` does unexpected action

Check **`triggerActions`**. Default is **`play`** / **`reverse`**. Use e.g. **`['play', 'restart']`** for different off behavior.

## Tween vars shape warning

Keep **`vars`** compatible with **`method`**. If you switch between a single vars object and a **`fromTo`** tuple, use a key so Vue recreates the component:

```vue
<Tween :key="method" :method="method" :vars="vars" />
```

## Nesting / parent not found

- **`parent="null"`** opts out of inject.
- Manual **`parent`** must be the **`DejaVueInstance`** ref (template ref on **`Timeline`** / **`Tween`**), not only `animation`.

## Marker `cross` fires oddly

**`@cross`** receives **`direction`** from the **parent** animation’s **`direction`** ref at crossing time. Use `direction === 1` vs `-1` for forward vs reverse.

## Split text flicker

Avoid recreating large **`SplitText`** option objects every render. **`type`** defaults to **`lines,words,chars`** if omitted.

## Still stuck

[Open an issue](https://github.com/fiadone/deja-vue/issues) with a minimal SFC and package versions.
