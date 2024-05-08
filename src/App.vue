<script setup lang="ts">
import { ref } from 'vue';
import VueDraw from './components/VueDraw.vue'
import type { Settings, Crop } from './types'
import { toCanvas } from './utils/toCanvas';
import { toImgSrc } from './utils/toImgSrc';

const settings = ref<Settings>()
const crop = ref<Crop>()
const canvasRef = ref()
const imgSrc = ref<string>()
const vueDrawRef = ref()

function onCrop(crop: Crop | undefined) {
  console.log(crop)
}

async function save() {
  imgSrc.value = await toImgSrc(vueDrawRef.value.svgRef, crop.value)
  toCanvas(vueDrawRef.value.svgRef, canvasRef, crop.value)
}

</script>

<template>
  <vue-draw ref="vueDrawRef" v-model:crop="crop" class="vue-draw" @crop="onCrop"></vue-draw>
  <button @click="save">Save</button>
  <canvas ref="canvasRef"></canvas>
  <img v-if="imgSrc" :src="imgSrc" />
</template>

<style scoped>
.vue-draw {
  outline: 1px dashed #777;
  border-radius: 5px;
  width: 500px;
  height: 300px;
}
</style>