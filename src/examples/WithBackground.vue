<script setup lang="ts">
import { VpEditor, useAllTools, urlToBlob } from 'vue-paint'

const { tools } = useAllTools({ background: urlToBlob('./pexels-apasaric.jpg') })
defineEmits(['save'])
</script>

<template>
  <h2>With background</h2>
  <p>
    You can set a custom background with useBackground(), or pass a background to useAllTools().
  </p>
  <vp-editor @save="$emit('save', $event)" :tools></vp-editor>
</template>
