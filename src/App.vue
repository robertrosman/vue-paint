<script setup lang="ts">
import { ref } from 'vue'
import VpEditor from './components/VpEditor.vue'
import type { SaveParameters } from './types'
import { exportToCanvas } from './utils/export/exportToCanvas'
import { exportSvg } from './utils/export/exportSvg'
import { useAllTools } from '@/composables/tools/useAllTools'
import InteractiveHistory from '@/examples/InteractiveHistory.vue'
import PersistHistory from './examples/PersistHistory.vue'
import UsingEvents from './examples/UsingEvents.vue'
import LessTools from './examples/LessTools.vue'
import WithBackground from './examples/WithBackground.vue'

const canvasRef = ref()
const imgSrc = ref<string>()

const { tools } = useAllTools()

function save({ svg, tools, history }: SaveParameters) {
  imgSrc.value = exportSvg({ svg, tools, history })
  exportToCanvas({ svg, canvas: canvasRef, tools, history })
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
