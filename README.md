# vue-paint

vue-paint is a simple and lightweight paint component for vue projects. It can be used to add annotations to images, videos, or just draw some simple shapes to a canvas-like area.

Demo: [https://github.com/robertrosman/vue-paint]

## Getting started

First install `vue-paint` with your favorite package manager, like this `npm i vue-paint`. Then you need to choose what tools you want to include, setup
history and you're good to go.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { VpEditor, useFreehand, useRectangle, downloadSvg, type ImageHistory } from 'vue-paint'

// Add the tools you like to use, or call useAllTools to make use of all available tools
const tools = [useFreehand(), useRectangle()]

// The history can be manipulated programmatically, and used to persist the image
const history = ref<ImageHistory<typeof tools>>([])
</script>

<template>
  <vp-editor v-model:history="history" @save="downloadSvg" :tools></vp-editor>
</template>
```

## Key features

### Tree shakable

Only include the tools you need and leave the rest outside of your bundle.

### Non-destructive

Support for both undo and redo, even after result is exported.

### Clean format

The state is a simple javascript array of objects you can serialize to JSON, manipulate programmatically, store in your database or local storage.

### Easily extendable

Create your own tools if you want to extend the library. 

### Type safe

Written in Typescript and fully typed.


## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Contribute

Contributions are welcome! Fork and create a new Pull request. Try to follow the patterns in `src/composables/tools` when creating new tools. 