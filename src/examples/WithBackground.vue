<script setup lang="ts">
import VpEditor from '@/components/VpEditor.vue'
import { useAllTools } from '@/composables/tools/useAllTools'
import { urlToBlob } from '@/utils/urlToBlob'

const { tools } = useAllTools({ background: urlToBlob('./pexels-apasaric.jpg') })
defineEmits(['save'])
</script>

<template>
  <h1>With background</h1>
  <p>
    You can set a custom background with useBackground(), or pass a background to useAllTools().
  </p>
  <vp-editor class="vue-draw" @save="$emit('save', $event)" :tools></vp-editor>
</template>
