<script setup lang="ts">
import VpEditor from '@/components/VpEditor.vue'
import { useAllTools } from '@/composables/tools/useAllTools'
import type { ImageHistory, Settings } from '@/types'
import { computed, ref } from 'vue'

const settings = ref<Settings>({
  tool: 'line',
  thickness: 3,
  color: '#cf7520'
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

function addRandomLine() {
  history.value.push({
    type: 'line',
    x1: Math.floor(Math.random() * 500),
    y1: Math.floor(Math.random() * 300),
    x2: Math.floor(Math.random() * 500),
    y2: Math.floor(Math.random() * 300),
    thickness: Math.floor(Math.random() * 5 + 1),
    color: settings.value.color
  })
}
</script>

<template>
  <h2>Interactive history</h2>
  <p>
    You can inspect and modify the history and settings objects down below to see it update
    automatically. This can of course be done programmatically as well.
  </p>
  <vp-editor @save="$emit('save', $event)" v-model:settings="settings" v-model:history="history" :tools />
  <button @click="addRandomLine">Add random line</button>
  <textarea v-model="historyJson"></textarea>
  <textarea v-model="settingsJson"></textarea>
</template>

<style>
textarea {
  width: 250px;
  height: 500px;
}
</style>
