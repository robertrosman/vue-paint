<script setup lang="ts">
import type { Settings, Shape, ToolType, Tool } from '@/types'

const props = defineProps<{
  tools: Tool<Shape>[]
}>()

const emit = defineEmits<{
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

// Why is it not updating immediately? Is a separate model really needed at all, or can we make the settings.tool reactive too?
const activeTool = defineModel<ToolType>('activeTool')
</script>

<template>
  <div class="vp-toolbar">
    <div class="tools">
      <button v-for="tool in tools.filter((tool) => tool.icon)" :key="tool.type"
        :class="[activeTool === tool.type ? 'active' : '', `tool-${tool.type}`]"
        @click="activeTool = tool.type as ToolType" :title="tool.type" v-html="tool.icon"></button>
    </div>
    <div class="settings">
      <input type="range" min="1" max="10" v-model="settings.thickness" />
      <input type="color" v-model="settings.color" />
    </div>
    <div class="actions">
      <button @click="emit('undo')"><img src="/src/assets/icons/undo.svg" /></button>
      <button @click="emit('redo')"><img src="/src/assets/icons/redo.svg" /></button>
      <button @click="emit('reset')"><img src="/src/assets/icons/reset.svg" /></button>
      <button @click="emit('save')"><img src="/src/assets/icons/save.svg" /></button>
    </div>
  </div>
</template>
