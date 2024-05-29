<script setup lang="ts">
import VpEditor from '@/components/VpEditor.vue'
import { useAllTools } from '@/composables/tools/useAllTools'
import type { ImageHistory, Settings, Shape } from '@/types'
import { computed, onMounted, ref } from 'vue'
import anime from 'animejs';
import { randomId } from '@/utils/randomId';

const settings = ref<Settings>({
  tool: 'line',
  thickness: 5,
  color: '#c82d2d'
})

const { tools } = useAllTools()
const history = ref<ImageHistory<typeof tools>>([])
defineEmits(['save'])

const historyJson = computed({
  get() {
    return JSON.stringify(history.value, null, 2)
  },
  set(value: string) {
    history.value = JSON.parse(value)
  }
})

const settingsJson = computed({
  get() {
    return JSON.stringify(settings.value, null, 2)
  },
  set(value: string) {
    settings.value = JSON.parse(value)
  }
})

const shapes: Shape[] = [
  { type: 'textarea', id: randomId(), x: 40, y: 450, width: 580, height: 70, fontSize: 6, color: '#ffffff', content: 'Use the tools, Luke!' },
  { type: 'line', id: randomId(), x1: 240, y1: 525, x2: 240, y2: 525, thickness: 6, color: '#c82d2d' },
  { type: 'arrow', id: randomId(), x1: 250, y1: 550, x2: 250, y2: 550, thickness: 6, color: '#c82d2d' },
  { type: 'textarea', id: randomId(), x: 900, y: 450, width: 600, height: 100, fontSize: 6, color: '#ffffff', content: 'Try some settings' },
  { type: 'line', id: randomId(), x1: 1140, y1: 525, x2: 1140, y2: 525, thickness: 6, color: '#c82d2d' },
  { type: 'arrow', id: randomId(), x1: 1145, y1: 550, x2: 1145, y2: 550, thickness: 6, color: '#c82d2d' },
  { type: 'freehand', id: randomId(), x: 1278, y: 400, path: 'c0,0 -3.3,0.9 -5,1c-8,0.3 -16,-0.2 -24,0c-26,0.5 -52,1.4 -78,2c-89,2 -178,2.1 -267,3c-144.6,1.5 -289.4,2.2 -434,5c-74,1.4 -148,4.5 -222,6c-83.6,1.7 -167.4,2.7 -251,4c-67.7,1 -105.7,0.2 -170,3c-82.7,3.6 -165.4,11.5 -248,17', thickness: 6, color: '#ffffff' }
]

const animations = [
  { color: '#c82d2d' },
  { x1: 193, x2: 275 },
  { x2: 300, y2: 681 },
  { color: '#c82d2d' },
  { x1: 1085, x2: 1218 },
  { x2: 870, y2: 683 },
  { color: '#bbbbbb' }
]

function animateHistory() {
  const duration = 800
  const delay = duration * 0.3
  shapes.forEach((shape, i) => setTimeout(() => {
    history.value.push(structuredClone(shape))
    anime({
      targets: history.value[i],
      ...animations[i],
      easing: 'easeOutCubic',
      duration,
      round: 1,
    })
  }, i * delay))
}

</script>

<template>
  <vp-editor @save="$emit('save', $event)" v-model:settings="settings" v-model:history="history" :tools
    @reset="animateHistory" />
  <div class="flex">
    <div class="history">
      <h2>History</h2>
      <textarea v-model="historyJson"></textarea>
      <p>
        You can inspect and modify the history and settings objects down below to see it update
        automatically. This can of course be done programmatically as well.
      </p>
    </div>
    <div class="settings">
      <h2>Settings</h2>
      <textarea v-model="settingsJson"></textarea>
      <p>The settings affect the active tool and can be changed in the toolbar, or programmatically.</p>
    </div>
  </div>
</template>

<style scoped>
textarea {
  width: 100%;
  height: 500px;
}

.history,
.settings {
  width: 100%;
}

@media (min-width: 600px) {
  .flex {
    display: flex;
    gap: 3em;
  }

  .flex div {
    flex-grow: 1;
    flex-basis: 0;
  }
}
</style>
