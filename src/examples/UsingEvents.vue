<script setup lang="ts">
import { VpEditor, useAllTools, type DrawEvent } from 'vue-paint'

const { tools } = useAllTools()
defineEmits(['save'])

function logEvent(event: DrawEvent) {
  console.log(event)
}
</script>

<template>
  <h2>Using events</h2>
  <p>
    You can hook into events that are emitted from the component. Watch the console while drawing to
    see it in action.
  </p>
  <vp-editor @save="$emit('save', $event)" :tools @draw-start="logEvent" @draw-end="logEvent"></vp-editor>
</template>
