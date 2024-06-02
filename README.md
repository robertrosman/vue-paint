# vue-paint

vue-paint is a simple and lightweight paint component for vue projects. It can be used to add annotations to images, videos, or just draw some simple shapes to a canvas-like area.

Demo: <https://robertrosman.github.io/vue-paint>

## Getting started

First install `vue-paint` with your favorite package manager, like this `npm i vue-paint`. Then you need to choose what tools you want to include, setup
history and you're good to go.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { VpEditor, useFreehand, useRectangle, downloadSvg, createSettings, type ImageHistory } from 'vue-paint'

// Add the tools you like to use, or call useAllTools to make use of all available tools
const tools = [useFreehand(), useRectangle()]

// The history can be manipulated programmatically, and used to persist the image
const history = ref<ImageHistory<typeof tools>>([])

// Settings are mainly changed through the toolbar, but you have full control over the settings, if you want to change active tool, color, thickness etc.
// Use the utility function createSettings to set it up, where you pass the tools you're using along with any start settings.
const settings = createSettings(tools, { color: "#c82d2d" })
</script>

<template>
  <vp-editor v-model:history="history" v-model:settings="settings" @save="downloadSvg" :tools></vp-editor>
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


## Deeper concepts

### Tools

vue-paint provides a bunch of tools that you can import. Only the tools imported will be available in the editor. Every tool may or may not produce a shape that is pushed to the [history](#history).
A shape is a plain javascript object that keeps all information needed about that specific action. The shapes can then be rendered by the tool if it is providing an ShapeSvgComponent. Some tools 
may not render a component for every shape, but rather one per history. Take the crop tool for example, where it makes sense to only render one crop overlay per image. It is therefore providing a
ToolSvgComponent instead to handle that scenario once.

Note that you need to import the same tools every time you edit an image, otherwise there would be no way to render the shapes that might have already been pushed to the history.

### History

The history of an image is basically every shape and action the user has made to the image in a sequence. So to undo a shape, you just pop the last item of the history array. This also means you can
push any new shapes or actions to the history programmatically like `history.push({ type: 'eraser', id: 'eraseline', targets: ['ka9v1sl'] })` (which will erase a shape earlier in the history with id ka9v1sl).
Since the user might want to undo the erase, it is actually just a new object pushed to the history that can be undone. The eraser tool is then responsible to do the actual cleanup in it's simplifyHistory
method. So if you ever want the simplified version of a history (where deleted shapes are actually removed, and moved objects are actually moved, and so on), you can use the composable useSimplifiedHistory like so:
```
const simplifiedHistory = useSimplifiedHistory({ history, tools, activeShape, includeActiveShape: false })
```

Each editor writes to and reads from your ImageHistory, which is passed to the editor with `v-model:history="history"`. If you don't want the image to be editable, you can pass the history to the component VpImage
like this instead `<vp-image :history="history" :tools="tools" :width="1280" :height="720" />`.

### Settings

The editor needs a settings object to work properly. This object contains information about the selected tool, current color and thickness. These values can be changed by the user through the toolbar,
or programmatically by changing the values respectively. Note that changing the settings does not affect the [history](#history) of the image, only new shapes.

### Theming

To use the default theme you can import it like `import "vue-paint/themes/default.css"`. There's not that much styling going on, most of it relates to the toolbar. More themes are welcome, just open a PR!
If you want to skip the theme completely and write your own css, that's of course an option as well.

### Saving and exporting images

There is a save button in the toolbar and it's completely up to you what you want to do with the save event. Either just store the [history](#history) somewhere to be picked up later, or export it to another format.
The image is based on svg, so the default export function would be exportSvg or downloadSvg, but you may also export it to a canvas. All available export functions are
[found here](https://github.com/robertrosman/vue-paint/tree/main/src/utils/export).

## Development

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