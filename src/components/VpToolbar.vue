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
    <slot>
      <slot name="tools">
        <div class="vp-tools">
          <slot v-for="tool in tools.filter((tool) => tool.icon)" :name="`tool-${tool.type}`">
            <button :key="tool.type"
              :class="[settings.tool === tool.type ? 'active' : '', `vp-tool-${tool.type}`]"
              @click="emit('set-tool', tool.type)" :title="tool.type" v-html="tool.icon"></button>
          </slot>
        </div>
      </slot>
      <slot name="settings">
        <div class="vp-settings">
          <slot name="setting-thickness">
            <input type="range" min="1" max="10" class="vp-setting-thickness" v-model="settings.thickness" />
          </slot>
          <slot name="setting-color">
            <input type="color" class="vp-setting-color" v-model="settings.color" />
          </slot>
        </div>
      </slot>
      <slot name="actions">
        <div class="vp-actions">
          <slot name="action-undo">
            <button @click="emit('undo')" class="vp-action-undo"><img src="/src/assets/icons/undo.svg" /></button>
          </slot>
          <slot name="action-redo">
            <button @click="emit('redo')" class="vp-action-redo"><img src="/src/assets/icons/redo.svg" /></button>
          </slot>
          <slot name="action-reset">
            <button @click="emit('reset')" class="vp-action-reset"><img src="/src/assets/icons/reset.svg" /></button>
          </slot>
          <slot name="action-save">
            <button @click="emit('save')" class="vp-action-save"><img src="/src/assets/icons/save.svg" /></button>
          </slot>
        </div>
      </slot>
    </slot>
  </div>
</template>
