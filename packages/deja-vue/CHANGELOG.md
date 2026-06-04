## [2.0.1](https://github.com/fiadone/deja-vue/compare/v2.0.0...v2.0.1) (2026-06-04)


### Bug Fixes

* update deps ([748c90f](https://github.com/fiadone/deja-vue/commit/748c90f2c24c3b15d80f8bd24436807cbb4e291a))

# [2.0.0](https://github.com/fiadone/deja-vue/compare/v1.0.1...v2.0.0) (2026-06-04)


### Code Refactoring

* harden animation lifecycle and public types ([2cbc942](https://github.com/fiadone/deja-vue/commit/2cbc9422c3494c9000502c2e76f103cd01d23bc8))
* improve code structure and API ([dc87574](https://github.com/fiadone/deja-vue/commit/dc875748d9fbaead82614baf47721b465c7fa8d7))
* replace Tween method/vars with from/to/effect API ([d6a0ddc](https://github.com/fiadone/deja-vue/commit/d6a0ddcb24541a0fac119928a698c99e78f6b160))


### Features

* add SplitText integration ([7c7749b](https://github.com/fiadone/deja-vue/commit/7c7749be6e59d65012fd626c9ed31d53ddbff091))
* ship renewed scoped animation api!: ship renewed scoped animation api ([85cfcfa](https://github.com/fiadone/deja-vue/commit/85cfcfa128e3be48bded18fd61aae4e9e1198c94))


### BREAKING CHANGES

* Changes useAnimationNesting signature.
* Renames Tween and Timeline prop from target to tweenTarget.
* Renames wrapper element in useAnimationScope from $el to root.
* Removes Tween method and vars props. Use from, to, effect, and effect-options instead.
* Changes Animation.compose signature from compose(target, definition) to compose({ target, method, vars }).
* Removes useAnimation as the central public composition API.
* Removes Callback and PositionMarker. Use Marker instead.
* Removes Timeline tweens prop. Declare nested Tween/Timeline children instead; use seamless when parent and child should target the same resolved children.
* Replaces toggle-based control with trigger-based control. Use trigger and triggerAction.
* Changes the useAnimationControls controls parameter interface.
* Renames parentAnimationInjectionKey to dejaVueParentInstance. The injection now provides DejaVueInstance instead of a raw Animation.
* Refactors public TypeScript types. Some previous interfaces/types were renamed, removed, or now expose different shapes.

# [1.0.1](https://github.com/fiadone/deja-vue/compare/v0.2.0...v1.0.0) (2026-05-04)


### Code Refactoring

* **useAnimation:** automatically retrieve props and emit from current instance ([92892e0](https://github.com/fiadone/deja-vue/commit/92892e069424f2ad7767fa4fbd1c67011052d591))


### Features

* **useAnimation:** expose progress ([5383382](https://github.com/fiadone/deja-vue/commit/5383382d9a367c5da8ad65d55766e181ef322b01))


### BREAKING CHANGES

* **useAnimation:** useAnimation doesn't accept props and emit params anymore nor expose the ready ref

# [0.2.0](https://github.com/fiadone/deja-vue/compare/v0.1.0...v0.2.0) (2026-05-02)


### Features

* expose Animation ([7053ad1](https://github.com/fiadone/deja-vue/commit/7053ad1323d71ca0c3d0ff5c3d14981b286dcd45))

### Bug Fixes

* remove unnecessary initiallyHidden property to prevent style conflicts when initializing gsap on wrapper elements ([aec5fff](https://github.com/fiadone/deja-vue/commit/aec5fff5b31f62d8fbd9e5e5f7f872f7dd4b2db6))
* properly handle event name reconstruction in Animation's constructor ([b754392](https://github.com/fiadone/deja-vue/commit/b7543920cb5b6d8f2f4a0a64a517a29fab1e5bff))
