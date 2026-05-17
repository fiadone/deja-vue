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
