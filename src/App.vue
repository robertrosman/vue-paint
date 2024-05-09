<script setup lang="ts">
import { ref } from 'vue';
import VueDraw from './components/VueDraw.vue'
import type { Settings, Crop, SaveParameters } from './types'
import { toCanvas } from './utils/toCanvas';
import { toImgSrc } from './utils/toImgSrc';
import { useAsyncState } from '@vueuse/core';
import { urlToBlob } from './utils/urlToBlob';

const canvasRef = ref()
const imgSrc = ref<string>()

const { state: backgroundImage } = useAsyncState(
  urlToBlob('/pexels-apasaric.jpg'),
  undefined
)

function save({ svg, crop }: SaveParameters) {
  imgSrc.value = toImgSrc({ svg, crop })
  toCanvas({ svg, canvas: canvasRef, crop })
}

</script>

<template>
  <div v-if="imgSrc" class="save-modal" @click="imgSrc = ''">
    <div class="bg-white">
      Exported to image
      <img v-if="imgSrc" :src="imgSrc" />
    </div>
    <div class="bg-white hidden">
      Exported to canvas
      <canvas ref="canvasRef"></canvas>
    </div>
  </div>
  <h1>Barebones example</h1>
  <vue-draw class="vue-draw" @save="save"></vue-draw>

  <h1>With background</h1>
  <vue-draw v-if="backgroundImage" class="vue-draw" @save="save" :background="backgroundImage"></vue-draw>
</template>