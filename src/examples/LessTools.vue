<script setup lang="ts">
import VpEditor from '@/components/VpEditor.vue'
import { useRectangle } from '@/composables/tools/useRectangle/useRectangle'
import { useArrow } from '@/composables/tools/useArrow/useArrow'

const tools = [useRectangle(), useArrow()]
defineEmits(['save'])
</script>

<template>
  <h1>With less tools</h1>
  <p>The editor will only support the tools you provide it</p>
  <vp-editor @save="$emit('save', $event)" :tools></vp-editor>
</template>
