<script setup lang="ts">
import { ref } from 'vue';
import { type ImageHistory, VpEditor, createSettings, useAllTools, type DrawEvent } from 'vue-paint'

const { tools } = useAllTools()
const history = ref<ImageHistory<typeof tools>>([])
const settings = createSettings(tools)
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
  <vp-editor v-model:history="history" v-model:settings="settings" @save="$emit('save', $event)" :tools @draw-start="logEvent"
    @draw-end="logEvent"></vp-editor>
</template>
