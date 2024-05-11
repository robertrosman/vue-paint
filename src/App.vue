<script setup lang="ts">
import { ref } from 'vue';
import PaintEditor from './components/PaintEditor.vue'
import type { Settings, Crop, SaveParameters, Shape } from './types'
import { toCanvas } from './utils/toCanvas';
import { exportSvg } from './utils/exportSvg';
import { useAsyncState, useStorage } from '@vueuse/core';
import { urlToBlob } from './utils/urlToBlob';
import { useAllTools } from '@/composables/tools/useAllTools'

const canvasRef = ref()
const imgSrc = ref<string>()

const { tools } = useAllTools()

const { state: backgroundImage } = useAsyncState(
  urlToBlob('/pexels-apasaric.jpg'),
  undefined
)

function save({ svg, tools, history }: SaveParameters) {
  imgSrc.value = exportSvg({ svg, tools, history })
  toCanvas({ svg, canvas: canvasRef, tools, history })
}

const history = useStorage<Shape[]>("history", [{
  type: "crop",
  x: 50,
  y: 50,
  width: 150,
  height: 150
},
])
</script>

<template>
  <div v-if="imgSrc" class="save-modal" @click="imgSrc = ''">
    <div class="bg-white">
      Exported to image
      <img v-if="imgSrc" :src="imgSrc" />
    </div>
    <div class="bg-white">
      Exported to canvas
      <canvas ref="canvasRef"></canvas>
    </div>
  </div>
  <h1>Barebones example</h1>
  <paint-editor class="vue-draw" @save="save" :tools></paint-editor>

  <h1>With background</h1>
  <paint-editor v-if="backgroundImage" class="vue-draw" @save="save" :background="backgroundImage"
    :tools></paint-editor>

  <h1>With history v-model</h1>
  <p> Using <code>v-model:history</code> you can set initial state, modify the state programmatically, add shapes, save
    current state (like in localStorage or on a server). Try to draw something and reload the page to see localStorage
    in action. </p>
  <paint-editor v-model:history="history" class="vue-draw" @save="save" :tools></paint-editor>
</template>