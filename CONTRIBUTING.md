# Contributing

Thanks for helping with Déjà Vue. This file is for repository contributors; it is not part of the published docs site.

## Development

See the [README](./README.md) for install, workspace layout, and common scripts (`dev:lib`, `dev:docs`, `typecheck`, `lint`, `build:lib`, `build:docs`).

Before opening a PR:

1. Run `npm run typecheck`, `npm run lint:script`, and `npm run test` (library) — the same checks run in [Quality](.github/workflows/quality.yml) on every pull request.
2. If you changed docs, run `npm run build:docs`.
3. If you changed the library, run `npm run build:lib`.

### Workflows (quality, release, pages)

| Workflow | When it runs | What it does |
|----------|----------------|--------------|
| **[Quality](.github/workflows/quality.yml)** | Every PR; push to `main` / `develop` | `lint:script` → `typecheck` (lib + landing + docs) → `test` |
| **[Release](.github/workflows/release.yml)** | Push to `main` with publish-relevant `paths`, or manual `workflow_dispatch` | Waits for Quality on the same commit (push only) → `npm audit signatures` → `semantic-release` |
| **[Pages](.github/workflows/pages.yml)** | Push to `main` with `apps/docs/`, `apps/landing/`, or `pages.yml` changes | Waits for Quality on the same commit → build docs + landing → GitHub Pages deploy |

Quality and Release/Pages start in parallel on matching pushes; deploy/publish jobs block until Quality succeeds. Push to `main` that only touches the library does not start Pages; publish-only doc changes do not start Release. Configure branch protection on `main` so merges require the **Quality / check** status.

npm publish uses [trusted publishing](https://docs.npmjs.com/trusted-publishers/) (OIDC, no `NPM_TOKEN`). On npmjs.com the trusted publisher must target workflow file **`release.yml`** in this repository (not `quality.yml`).

## Documentation (`apps/docs`)

Published at `/deja-vue/docs/` via VitePress. Source lives in `apps/docs/guide/` (guides) and `apps/docs/api/` (reference).

### What each layer is for

| Layer | Purpose |
|-------|---------|
| **Home** (`index.md`) | Pitch in eight feature cards; marketing-lean tone |
| **Getting started** | Install and first examples; link out early |
| **Concepts** | One-screen map with links, not a full manual |
| **Guides** | One topic per page with examples |
| **API** | Canonical props, types, and composable signatures |
| **Troubleshooting** | Symptoms and fixes; link to guides, do not duplicate them |
| **Migration** | v1 → v2 deltas only |

### One canonical page per topic

Each idea should have a single home; elsewhere pages get a sentence and a link.

| Topic | Canonical page |
|-------|----------------|
| ScrollTrigger | [guide/targeting.md — ScrollTrigger](./apps/docs/guide/targeting.md#scrolltrigger) |
| Instance / template ref types | [api/types.md — Component instance types](./apps/docs/api/types.md#component-instance-types) |
| Nesting / inject | [guide/concepts.md — Nesting](./apps/docs/guide/concepts.md#nesting-at-a-glance) |
| Controls (progress / trigger) | [guide/controls.md](./apps/docs/guide/controls.md) |
| Marker patterns | [guide/nesting.md — Marker](./apps/docs/guide/nesting.md#marker) |

When behavior changes, update the canonical section first, then grep for outdated copies.

### Tone

- Use component and GSAP names readers expect (`Tween`, `Timeline`, `ScrollTrigger`, `SplitText`).
- **Home / marketing copy:** no prop syntax or internal type names.
- **Guides:** prop names in code examples; descriptions in plain sentences.
- **API tables:** precise types; describe props in prose (avoid `"**from** vars"`).
- Prefer short sentences. Avoid long clauses joined by em dashes.

### Facts to keep consistent

- **`Timeline`** calls `provide(dejaVueParentInstance)` for automatic nesting.
- **`SplitText`** goes inside a **`Tween` slot**.
- **`seamless`** shares DOM targets between nested tweens.
- Trigger-driven playback: **`trigger`** + **`trigger-action`**.

### Deduplication

- Prop tables live in **`api/components.md`**. Component guides link there instead of copying tables.
- Do not repeat full ScrollTrigger setup outside **targeting.md**.
- Keep one Marker + trigger example in **nesting.md**; split-text and API link to it.

### Live demos (`.vitepress/components/`)

- **`Demo`** — interactive Play/Reverse, custom **`#controls`**, or **`observe-intersection`** (VueUse) for scroll-into-view playback with **`trigger`** + **`play`** / **`reset`**.

## Library (`packages/deja-vue`)

### Imports (ESLint)

- Use **`import type { … } from '…'`** on its own line — never mix type and value bindings in one import.
- **`@typescript-eslint/consistent-type-imports`** (`prefer: 'type-imports'`, `fixStyle: 'separate-type-imports'`) moves type-only symbols into a separate `import type` on `eslint --fix` (e.g. `import { PropType, computed }` with `PropType` used only as a type → `import type { PropType }` plus `import { computed }`).
- **`perfectionist/sort-imports`** keeps import tiers in order (builtin → external → internal → relative), with a blank line between tiers. Within a tier, imports are sorted by module path; for the same path, the **`import type`** line comes immediately before the value import (e.g. both `vue` lines stay together, not split by other packages).

Export public types and composable option interfaces from `src/index.ts` when they are part of the package API. Update **migration.md** and **api/types.md** when exports or breaking types change.

### Tests (`packages/deja-vue/tests`)

- All tests live under **`tests/`**, mirroring **`src/`** (e.g. `tests/core/Animation.test.ts`, `tests/components/Tween.test.ts`, `tests/composables/useTweenVars.test.ts`). Shared utilities sit in **`tests/shared/`** (not a mirror of `src`).
- Shared utilities: **`tests/shared/helpers.ts`**, GSAP cleanup: **`tests/shared/setup.ts`**.
- Run: `npm run test` (from repo root or the `deja-vue` workspace).
- Coverage: `npm run test:coverage` (Vitest + `@vitest/coverage-v8`, reports under `packages/deja-vue/coverage/`). The package enforces **100%** statements, branches, functions, and lines on `src/**` (see `vitest.config.ts`).

Key animation types in `src/types.ts`:

- **`DejaVueAnimationInstance`** — raw instance (`defineExpose`, `inject`)
- **`DejaVueAnimationExposed`** — template ref surface (`ShallowUnwrapRef`)
- **`DejaVueAnimationParent`** — `Instance | Exposed` for `:parent` and nesting
