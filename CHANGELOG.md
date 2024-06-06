## [0.5.2](https://github.com/robertrosman/vue-paint/compare/v0.5.1...v0.5.2) (2024-06-06)


### Bug Fixes

* set selection background to none ([0d08f77](https://github.com/robertrosman/vue-paint/commit/0d08f779cdcda20b25f50d387aed5f9698514b38))



## [0.5.1](https://github.com/robertrosman/vue-paint/compare/v0.5.0...v0.5.1) (2024-06-06)


### Bug Fixes

* update broken workflow ([a9c0056](https://github.com/robertrosman/vue-paint/commit/a9c0056fad16663a4a671761e571f738378bdbd1))



# [0.5.0](https://github.com/robertrosman/vue-paint/compare/v0.4.0...v0.5.0) (2024-06-06)


### Bug Fixes

* add missing import ([33087e4](https://github.com/robertrosman/vue-paint/commit/33087e4e9768842c4712e726e66fb0e357bf507d))
* add px to handle radius, fixes firefox issue ([a786bab](https://github.com/robertrosman/vue-paint/commit/a786babd477312c665ba08160d259edcfb6dabc0))
* export keyboard shortcuts ([c70b3de](https://github.com/robertrosman/vue-paint/commit/c70b3def822439dcec97e17c0d0d9e6bc9d46720))
* export the other composables ([b04fbd3](https://github.com/robertrosman/vue-paint/commit/b04fbd3724268046011fe816ea991e517ab7732f))
* scope the svgStyle to prevent style bleeding ([9a86367](https://github.com/robertrosman/vue-paint/commit/9a863676e05f5ddc4dc000818c4bda964a0bce9b))


### Features

* add color support to useBackground [#5](https://github.com/robertrosman/vue-paint/issues/5) ([ccc673b](https://github.com/robertrosman/vue-paint/commit/ccc673b2b1cb2ee2e7e6607c553a2b36f5ed312f))
* add composable useEditor ([6fa1854](https://github.com/robertrosman/vue-paint/commit/6fa1854e2e8a00806ab05fd04ff70db1dc8fde82))
* add tool useKeyboardShortcuts ([d7e29dd](https://github.com/robertrosman/vue-paint/commit/d7e29dd862471cf23941698d19a13eb1d94286ab))
* add undo and redo ([20e86be](https://github.com/robertrosman/vue-paint/commit/20e86bebf3bb3ff6feea6996fdceb9df3fa53082))
* let keyboard shortcuts only affect active editor ([f080fe5](https://github.com/robertrosman/vue-paint/commit/f080fe5a7e2a0d1d596877bc3c1842af17d12b57))



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



