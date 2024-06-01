<script setup lang="ts">
import { VpEditor, createSettings, randomId, useAllTools, type Shape } from 'vue-paint'
import { useStorage } from '@vueuse/core'

const history = useStorage<Shape[]>('vue-paint-history', [
  {
    type: "textarea",
    id: randomId(),
    x: 180,
    y: 160,
    width: 960,
    height: 400,
    fontSize: 5,
    color: "#c82d2d",
    content: "Draw something here and hit refresh.\n\nThe history will be persisted thanks to localStorage."
  }
])

const { tools } = useAllTools()
const settings = createSettings(tools)
defineEmits(['save'])
</script>

<template>
  <h2>Persist history</h2>
  <p>
    Using <code>v-model:history</code> you can set initial state, modify the state programmatically,
    add shapes, save current state (like in localStorage or on a server). Try to draw something and
    reload the page to see localStorage in action.
  </p>
  <vp-editor v-model:history="history" v-model:settings="settings" @save="$emit('save', $event)" :tools></vp-editor>
</template>
