<script setup lang="ts">
import VpEditor from '@/components/VpEditor.vue'
import { useAllTools } from '@/composables/tools/useAllTools'
import type { Shape } from '@/types'
import { useStorage } from '@vueuse/core'

const history = useStorage<Shape[]>('history', [
  {
    type: 'crop',
    x: 50,
    y: 50,
    width: 150,
    height: 150
  }
])

const { tools } = useAllTools()
defineEmits(['save'])
</script>

<template>
  <h2>Persist history</h2>
  <p>
    Using <code>v-model:history</code> you can set initial state, modify the state programmatically,
    add shapes, save current state (like in localStorage or on a server). Try to draw something and
    reload the page to see localStorage in action.
  </p>
  <vp-editor v-model:history="history" @save="$emit('save', $event)" :tools></vp-editor>
</template>
