<script setup lang="ts">
import { ref } from 'vue'
import type { SaveParameters } from './types'
import { exportToCanvas } from './utils/export/exportToCanvas'
import { exportSvg } from './utils/export/exportSvg'
import InteractiveHistory from '@/examples/InteractiveHistory.vue'
import PersistHistory from './examples/PersistHistory.vue'
import UsingEvents from './examples/UsingEvents.vue'
import LessTools from './examples/LessTools.vue'
import WithBackground from './examples/WithBackground.vue'
import VpImage from './components/VpImage.vue'

const canvasRef = ref()
const imgSrc = ref<string>()
const exportedHistory = ref()
const exportedTools = ref()

function save({ svg, tools, history }: SaveParameters) {
  imgSrc.value = exportSvg({ svg, tools, history })
  exportToCanvas({ svg, canvas: canvasRef, tools, history })
  exportedTools.value = tools
  exportedHistory.value = history
}
</script>

<template>
  <div v-if="imgSrc" class="save-modal" @click="imgSrc = ''">
    <section>
      Exported to image
      <img v-if="imgSrc" :src="imgSrc" />
    </section>
    <section>
      Exported to canvas
      <canvas ref="canvasRef"></canvas>
    </section>
    <section>
      Readonly VpImage
      <vp-image :tools="exportedTools" :history="exportedHistory" :width="1280" :height="720" />
    </section>
  </div>

  <section>
    <InteractiveHistory @save="save" />
  </section>

  <section>
    <WithBackground @save="save" />
  </section>

  <section>
    <PersistHistory @save="save" />
  </section>

  <section>
    <UsingEvents @save="save" />
  </section>

  <section>
    <LessTools @save="save" />
  </section>

</template>
