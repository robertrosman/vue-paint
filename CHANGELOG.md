# [0.4.0](https://github.com/robertrosman/vue-paint/compare/v0.3.1...v0.4.0) (2024-06-02)


### Bug Fixes

* add width and height from viewBox if missing ([27d95c8](https://github.com/robertrosman/vue-paint/commit/27d95c8203deb1bfa6a99ab2cf712d7cc2a3c8bd))
* export useTextarea ([a33366e](https://github.com/robertrosman/vue-paint/commit/a33366e30166c1e75deb9977e2acd571216e6590))
* handle kebab-cased id:s in move tool ([9d07f67](https://github.com/robertrosman/vue-paint/commit/9d07f670f403fb00ed8eee100bfdbfe8c32216a5))
* remove unused style + font from exported svg ([763a18a](https://github.com/robertrosman/vue-paint/commit/763a18a5718de4826d803c27febaeb6c224fabb2))
* set user-select on whole svg. fixes [#6](https://github.com/robertrosman/vue-paint/issues/6) ([c61e318](https://github.com/robertrosman/vue-paint/commit/c61e318c1214a9fca2fd2e5575b681b6b44aad8a))
* update bounding rect onDrawStart (fixes [#2](https://github.com/robertrosman/vue-paint/issues/2)) ([12fa944](https://github.com/robertrosman/vue-paint/commit/12fa94454c4a953f18e2b2a9c40e5b265d2dfd47))
* use dimensions of svg instead of container ([b1eb3a8](https://github.com/robertrosman/vue-paint/commit/b1eb3a8b37662389d7af509c4da277dea4aff090))
* **demo:** animate onMounted instead of reset ([291a4c2](https://github.com/robertrosman/vue-paint/commit/291a4c261eac78e2be8be28a38a243f340f40a35))


### Features

* add more export and download functions ([0fe38af](https://github.com/robertrosman/vue-paint/commit/0fe38af9d09c7dffabcc3beb0d5d608606cf95d8))
* add util function createSettings ([62a51f5](https://github.com/robertrosman/vue-paint/commit/62a51f547897c18149880f19c15b2e6c8aad7a09))


### Reverts

* Revert "refactor(demo): rename App.vue to Demo.vue" ([1027a12](https://github.com/robertrosman/vue-paint/commit/1027a12a4c86cb675fd6e877028aea68c253e4fe))



## [0.3.1](https://github.com/robertrosman/vue-paint/compare/v0.3.0...v0.3.1) (2024-05-30)


### Bug Fixes

* add tools prop to shapeSvgComponent ([7146808](https://github.com/robertrosman/vue-paint/commit/7146808299c5180b1ed7755ffeffc014f6011c26))
* disable handlesOnActiveShape by default ([61c7342](https://github.com/robertrosman/vue-paint/commit/61c734242352496ab8648a12e0b7b8f88d051d20))
* remove all handles before export ([d3bc80b](https://github.com/robertrosman/vue-paint/commit/d3bc80bf55da188d7f6a8d5b4879c37c4b31bbc9))



# [0.3.0](https://github.com/robertrosman/vue-paint/compare/v0.2.3...v0.3.0) (2024-05-30)


### Bug Fixes

* add handles to crop ([6f1faf2](https://github.com/robertrosman/vue-paint/commit/6f1faf2ebd732972398ec19b6f10cf6bdb25981c))
* don't push eraser or move event if targets are empty ([a62be7f](https://github.com/robertrosman/vue-paint/commit/a62be7fd6d7bee390d39dd1dd45e3a23f9cb01a7))
* export eraser and move ([2675c60](https://github.com/robertrosman/vue-paint/commit/2675c6093231451ca50a07511b163c2c31529674))
* only show handles when move tool is active ([6429fa3](https://github.com/robertrosman/vue-paint/commit/6429fa3ae7830b57e4be41fd8536c3da85c0c264))
* replace onMove in Freehand with handle ([b1df551](https://github.com/robertrosman/vue-paint/commit/b1df551caf022ce226868ce2ff66d2d4306e93d5))
* sort toolSvgs by layer ([1b7d5b2](https://github.com/robertrosman/vue-paint/commit/1b7d5b2c902751a13406ddbfe7947d28664b29b0))


### Features

* add a unique id to every shape ([d839370](https://github.com/robertrosman/vue-paint/commit/d8393702104832911005c972a5af136312a8b1c0))
* add eraser tool ([61f4baf](https://github.com/robertrosman/vue-paint/commit/61f4baf4108f446c3d78f6a3d5b572caf5380399))
* add handles to activeShape ([5a459cd](https://github.com/robertrosman/vue-paint/commit/5a459cd514054d84ce9dc0a90a7830199303ba14))
* add handles to the move tool ([0e0d57f](https://github.com/robertrosman/vue-paint/commit/0e0d57f497ce52a38fb696f4f8680e7d3f9070ad))
* add includeActiveShape option to useSimplifiedHistory ([59348a7](https://github.com/robertrosman/vue-paint/commit/59348a7513fd9849d8168c846bb5013cbc6d5a69))
* add move tool ([5b7392d](https://github.com/robertrosman/vue-paint/commit/5b7392d79aa1de2ffb8c1e8dff3e4a26e79ab621))



## [0.2.3](https://github.com/robertrosman/vue-paint/compare/v0.2.2...v0.2.3) (2024-05-27)


### Bug Fixes

* look if pointer is actually moving, or user is just scrolling. closes [#4](https://github.com/robertrosman/vue-paint/issues/4) ([5085cb0](https://github.com/robertrosman/vue-paint/commit/5085cb098182619ffd8e5650dc5f052b48d31dca))



## [0.2.2](https://github.com/robertrosman/vue-paint/compare/v0.2.1...v0.2.2) (2024-05-26)


### Bug Fixes

* unshift is not triggering reactivity? ([e978cae](https://github.com/robertrosman/vue-paint/commit/e978cae1ed26a3817cd0f3337c5ce2f8f3e9e071))



