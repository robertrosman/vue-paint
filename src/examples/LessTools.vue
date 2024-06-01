<script setup lang="ts">
import { VpEditor, useRectangle, useArrow } from 'vue-paint'

const tools = [useRectangle(), useArrow()]
defineEmits(['save'])
</script>

<template>
  <h2>With less tools</h2>
  <p>The editor will only support the tools you provide it</p>
  <vp-editor @save="$emit('save', $event)" :tools></vp-editor>
</template>
