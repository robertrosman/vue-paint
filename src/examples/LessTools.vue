<script setup lang="ts">

import PaintEditor from '@/components/PaintEditor.vue'
import { useRectangle } from '@/composables/tools/useRectangle';
import { useArrow } from '@/composables/tools/useArrow';

</script>

<template>
  <h1>With less tools</h1>
  <p>The editor will only support the tools you provide it</p>
  <paint-editor class="vue-draw" @save="$emit('save', $event)" :tools="[useRectangle(), useArrow()]" ></paint-editor>
</template>