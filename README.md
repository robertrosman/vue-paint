# vue-paint

vue-paint is a simple and lightweight paint component for vue projects. It can be used to add annotations to images, videos, or just draw some simple shapes to a canvas-like area.

Demo: [https://github.com/robertrosman/vue-paint]

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