<script setup lang="ts">
import { ref } from 'vue';
import { VpEditor, useAllTools, urlToBlob, type ImageHistory, createSettings } from 'vue-paint'

const { tools } = useAllTools({ backgroundImage: urlToBlob('./pexels-apasaric.jpg') })
const history = ref<ImageHistory<typeof tools>>([])
const settings = createSettings(tools)
defineEmits(['save'])
</script>

<template>
  <h2>With background</h2>
  <p>
    You can set a custom background with useBackground(), or pass a background to useAllTools().
  </p>
  <vp-editor v-model:history="history" v-model:settings="settings" @save="$emit('save', $event)" :tools></vp-editor>
</template>
