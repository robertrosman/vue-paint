<script setup lang="ts">
import { ref } from 'vue';
import { VpEditor, VpToolbar, useAllTools, type ImageHistory, createSettings } from 'vue-paint'

const { tools } = useAllTools()
const history = ref<ImageHistory<typeof tools>>([])
const settings = createSettings(tools)
defineEmits(['save'])

const showPalette = ref(false)

const palette = [
  '#6b7280',
  '#ef4444',
  '#f59e0b',
  '#eab308',
  '#22c55e',
  '#14b8a6',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
]

function setColor(color: string) {
  settings.value.color = color
  showPalette.value = false
}
</script>

<template>
  <h2>Custom toolbar</h2>
  <p>There are a couple of ways to customize the toolbar. You can change styling, and/or hide buttons and sections with
    css.</p>
  <p>You can also use the slots to replace the whole toolbar or specific parts of it. Checkout the color picker in this
    example.</p>

  <vp-editor v-model:history="history" v-model:settings="settings" @save="$emit('save', $event)" :tools>
    <template #toolbar="{ setTool, undo, redo, save, reset }">
      <vp-toolbar v-model:settings="settings" @set-tool="setTool" @undo="undo" @redo="redo" @save="save" @reset="reset"
        :tools>

        <template v-if="showPalette">
          <div class="palette">
            <button v-for="color in palette" :key="color" @click="setColor(color)">
              <div class="color" :style="`background: ${color};`"></div>
            </button>
          </div>
        </template>

        <template #setting-color>
          <button @click="showPalette = true">
            <div class="color" :style="{ background: settings.color }"></div>
          </button>
        </template>

      </vp-toolbar>
    </template>
  </vp-editor>
</template>

<style scoped>
/* Hide save button completely. You can of course apply more fine grained styling to any part of the toolbar. */
:deep(.vp-action-save) {
  display: none;
}

:deep(.vp-toolbar button) {
  border-radius: 15%;
}

.color {
  width: 20px;
  height: 20px;
  border-radius: 15%;
}
</style>