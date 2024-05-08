<script setup lang="ts">
import { ref } from 'vue';
import VueDraw from './components/VueDraw.vue'
import type { Settings, Crop } from './types'
const settings = ref<Settings>()
function onCrop(crop: Crop | undefined) {
  console.log(crop)
}
</script>

<template>
  <vue-draw v-model:settings="settings" class="vue-draw" @crop="onCrop"></vue-draw>
</template>

<style scoped>
.vue-draw {
  outline: 1px dashed #777;
  border-radius: 5px;
  width: 500px;
  height: 300px;
}
</style>