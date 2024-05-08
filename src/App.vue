<script setup lang="ts">
import { ref } from 'vue';
import VueDraw, { type Crop } from './components/VueDraw.vue'
import { type State} from './components/VueDraw.vue'
const state = ref<State>()
function onCrop(crop: Crop) {
  console.log(crop)
}
</script>

<template>
  <vue-draw v-model="state" class="vue-draw" @crop="onCrop"></vue-draw>
    {{ state }}
</template>

<style scoped>
.vue-draw {
  border: 1px dashed #777;
  border-radius: 5px;
  width: 500px;
  height: 300px;
}
</style>