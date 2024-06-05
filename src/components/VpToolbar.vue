<script setup lang="ts">
import type { Settings, Shape, ToolType, Tool } from '@/types'

defineProps<{
  tools: Tool<Shape>[]
}>()

const emit = defineEmits<{
  (e: 'set-tool', tool: ToolType): void
  (e: 'save'): void
  (e: 'undo'): void
  (e: 'redo'): void
  (e: 'reset'): void
}>()

const settings = defineModel<Settings>('settings', {
  default: () => ({
    tool: 'freehand',
    thickness: 5,
    color: '#c82d2d'
  })
})

</script>

<template>
  <div class="vp-toolbar">
    <div class="vp-tools">
      <button v-for="tool in tools.filter((tool) => tool.icon)" :key="tool.type"
        :class="[settings.tool === tool.type ? 'active' : '', `vp-tool-${tool.type}`]"
        @click="emit('set-tool', tool.type)" :title="tool.type" v-html="tool.icon"></button>
    </div>
    <div class="vp-settings">
      <input type="range" min="1" max="10" v-model="settings.thickness" />
      <input type="color" v-model="settings.color" />
    </div>
    <div class="vp-actions">
      <button @click="emit('undo')"><img src="/src/assets/icons/undo.svg" /></button>
      <button @click="emit('redo')"><img src="/src/assets/icons/redo.svg" /></button>
      <button @click="emit('reset')"><img src="/src/assets/icons/reset.svg" /></button>
      <button @click="emit('save')"><img src="/src/assets/icons/save.svg" /></button>
    </div>
  </div>
</template>
