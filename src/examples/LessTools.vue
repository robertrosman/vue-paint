<script setup lang="ts">
import { ref } from 'vue';
import { VpEditor, useRectangle, useArrow, useTextarea, type ImageHistory, createSettings } from 'vue-paint'

const tools = [useRectangle(), useArrow(), useTextarea()]
const history = ref<ImageHistory<typeof tools>>([])
const settings = createSettings(tools)
defineEmits(['save'])
</script>

<template>
  <h2>With less tools</h2>
  <p>The editor will only support the tools you provide it</p>
  <vp-editor v-model:history="history" v-model:settings="settings" @save="$emit('save', $event)" :tools></vp-editor>
</template>
