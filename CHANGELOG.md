# [0.2.0](https://github.com/robertrosman/vue-paint/compare/v0.1.1...v0.2.0) (2024-05-26)


### Features

* add useTextarea tool ([b301a0e](https://github.com/robertrosman/vue-paint/commit/b301a0ec6b7e6805c97ebed42e5e4f530c2df3af))
* allow custom fonts in useTextarea ([bfbc192](https://github.com/robertrosman/vue-paint/commit/bfbc1920e7b0e782a84a60e77f642b5b9d5a53e9))



## [0.1.1](https://github.com/robertrosman/vue-paint/compare/v0.1.0...v0.1.1) (2024-05-24)


### Bug Fixes

* make headers semantically correct ([42e6b8a](https://github.com/robertrosman/vue-paint/commit/42e6b8ae2754d668a5cf54a498f46e2a6ad6a923))
* replace vue-draw class to vue-paint ([904634b](https://github.com/robertrosman/vue-paint/commit/904634bf6dbf1705ad526e98639b6218a13a2dc0))



# [0.1.0](https://github.com/robertrosman/vue-paint/compare/47e375b4a90cb5afdd2282e05cfc8e899d9fbba2...v0.1.0) (2024-05-23)


### Bug Fixes

* add missing save event ([8d6d7a8](https://github.com/robertrosman/vue-paint/commit/8d6d7a87b1f204eeaa04e174c2f50fa08119084e))
* define emits in examples ([288b707](https://github.com/robertrosman/vue-paint/commit/288b7073fc22dc5c0db90806474c8769d37f95c2))
* export types correctly ([c2e1e30](https://github.com/robertrosman/vue-paint/commit/c2e1e300d9d17ea63a0c84e48daa4237952332ee))
* handle reactivity issue when cropping has happened ([7f0bd10](https://github.com/robertrosman/vue-paint/commit/7f0bd108df9636648282d36fe5432670a9d1a053))
* listen to pointer events on whole window and handle isInside manually. closes [#3](https://github.com/robertrosman/vue-paint/issues/3) ([3e36520](https://github.com/robertrosman/vue-paint/commit/3e36520fc67ba99f51a53d4f0d09b605966703e4))
* never crop outside boundaries ([c860cef](https://github.com/robertrosman/vue-paint/commit/c860cef5474ada7eb0f391b8d97747d4e9bcf0c5))
* public assets are served from / ([684879b](https://github.com/robertrosman/vue-paint/commit/684879bfc9c1ffd2ad36847a59effad14a0872db))
* register svg-prefixed elements as custom elements ([211f1f1](https://github.com/robertrosman/vue-paint/commit/211f1f1de42e09485bccf17928673197b8f793b9))
* remove dead code ([24ee1af](https://github.com/robertrosman/vue-paint/commit/24ee1aff31421d12653d091bbd4b6c6e2e0f7b33))
* reset history onMounted ([8e56225](https://github.com/robertrosman/vue-paint/commit/8e5622514c3e9e4bcb3efad608ba199bf2ea77cd))
* use correct build script ([333e6a3](https://github.com/robertrosman/vue-paint/commit/333e6a32a0455427ef07b6a50455e31d0629018d))
* use new :deep syntax ([15270c7](https://github.com/robertrosman/vue-paint/commit/15270c71bc8105f9eb60a9b3ac808acd3d3b94aa))


### Features

* add arrow shape ([a0cb38d](https://github.com/robertrosman/vue-paint/commit/a0cb38d8fb1cbfb622be2e1bf1ee3a0d46f8a6ef))
* add clear button ([e6052e1](https://github.com/robertrosman/vue-paint/commit/e6052e10b72ac91deec79dd057231682faafdc4f))
* add composable useDraw to better handle pointer events. also resolves [#1](https://github.com/robertrosman/vue-paint/issues/1) ([02a4a5c](https://github.com/robertrosman/vue-paint/commit/02a4a5c045bf8c0651a864a4c809036dfa905b2f))
* add draw events to PaintEditor ([fc0526d](https://github.com/robertrosman/vue-paint/commit/fc0526d518ebf4d262f8af7992805ca3f9278a91))
* add export functions ([4dc04a3](https://github.com/robertrosman/vue-paint/commit/4dc04a308781c060403f4acf34a95857de8e0548))
* add freehand tool ([29153f6](https://github.com/robertrosman/vue-paint/commit/29153f614de1eab376fbbf9dd660c863ed276ddd))
* add function canvasToBlob ([ad96efc](https://github.com/robertrosman/vue-paint/commit/ad96efc21d12dba91f763761cbebadb3c490a1a1))
* add hooks onDrawStart, onDraw and onDrawEnd ([508a09f](https://github.com/robertrosman/vue-paint/commit/508a09f14ed83a25db60cff1b55115689be2b0af))
* add layer to svgOnce ([5d50e39](https://github.com/robertrosman/vue-paint/commit/5d50e396b24b04730b31b3c1800607aece2e9a84))
* add line tool ([42eb357](https://github.com/robertrosman/vue-paint/commit/42eb357ca3250e407811af6843398d9d3a92a9fd))
* add rectangle tool ([ebb76a7](https://github.com/robertrosman/vue-paint/commit/ebb76a72f2fa5b51d4519913f70a2862c6526bdb))
* add redo button ([0bbc631](https://github.com/robertrosman/vue-paint/commit/0bbc6316138fbc7d9d0e7673c7c4b4e0fa59340b))
* add save button ([1c11369](https://github.com/robertrosman/vue-paint/commit/1c11369c902fca85766fb3ec6c4ac47f9ac440af))
* add styling to toolbar ([3501153](https://github.com/robertrosman/vue-paint/commit/35011532a359e9ce1ee874e88047ee2f7539ac91))
* add support for background image ([685b568](https://github.com/robertrosman/vue-paint/commit/685b56803ea754986a2b7a8488f3a60889268fc8))
* add toCanvas and toImgSrc ([3e4f623](https://github.com/robertrosman/vue-paint/commit/3e4f6238b38a91bee0640ea68f102a5fba2ce5b4))
* add undo button and add SvgShape component ([ebcdee1](https://github.com/robertrosman/vue-paint/commit/ebcdee1ea22a31fec3c86151af97fb9de7b9c5d9))
* add util function downloadSvg ([32030e5](https://github.com/robertrosman/vue-paint/commit/32030e51c3c9d3b04a8cce9c6545ac96fe0e8079))
* basic crop functionality ([47e375b](https://github.com/robertrosman/vue-paint/commit/47e375b4a90cb5afdd2282e05cfc8e899d9fbba2))
* introducing svgOnce ([c9a85b2](https://github.com/robertrosman/vue-paint/commit/c9a85b2d0ed75d16e7322d88db5a294d68a1b28a))
* make package public ([fded5f7](https://github.com/robertrosman/vue-paint/commit/fded5f74fa2392b1ba206c245075376b36fd6ed2))
* support scaling ([cf900ec](https://github.com/robertrosman/vue-paint/commit/cf900ecb9711e656c389f0249b6c81e130cf4b2b))
* use simplify-svg-path to smoothen freehand paths ([fdd1b88](https://github.com/robertrosman/vue-paint/commit/fdd1b880226f6081899fc5955931ab8632e91eb3))


### Reverts

* Revert "style: change cursor to a crosshair dot" ([72323ea](https://github.com/robertrosman/vue-paint/commit/72323ea3f6ced61152a6a8e2c1a6075e39b8f1ca))



