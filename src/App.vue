<script setup lang="ts">
import { ref } from 'vue';
import PaintEditor from './components/PaintEditor.vue'
import type { SaveParameters } from './types'
import { toCanvas } from './utils/toCanvas';
import { exportSvg } from './utils/exportSvg';
import { useAllTools } from '@/composables/tools/useAllTools'
import InteractiveHistory from '@/examples/InteractiveHistory.vue'
import PersistHistory from './examples/PersistHistory.vue';
import UsingEvents from './examples/UsingEvents.vue';
import LessTools from './examples/LessTools.vue';
import WithBackground from './examples/WithBackground.vue';

const canvasRef = ref()
const imgSrc = ref<string>()

const { tools } = useAllTools()

function save({ svg, tools, history }: SaveParameters) {
  imgSrc.value = exportSvg({ svg, tools, history })
  toCanvas({ svg, canvas: canvasRef, tools, history })
}

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

  <WithBackground @save="save" />

  <PersistHistory @save="save" />

  <UsingEvents @save="save" />

  <LessTools @save="save" />

  <InteractiveHistory />
</template>