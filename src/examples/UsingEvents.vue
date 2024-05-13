<script setup lang="ts">

import PaintEditor from '@/components/PaintEditor.vue'
import { useAllTools } from '@/composables/tools/useAllTools'
import type { DrawEvent } from '@/types';

const { tools } = useAllTools()

function logEvent(event: DrawEvent) {
  console.log(event)
}

</script>

<template>
  <h1>Using events</h1>
  <p>You can hook into events that are emitted from the component. Watch the console while drawing to see it in action.
  </p>
  <paint-editor class="vue-draw" @save="$emit('save', $event)" :tools @draw-start="logEvent" @draw-end="logEvent"></paint-editor>
</template>