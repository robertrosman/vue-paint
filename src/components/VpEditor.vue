<script setup lang="ts">
import { onMounted, ref, toRef } from 'vue'
import type { DrawEvent, SaveParameters, Settings, Shape, Tool } from '../types'
import VpToolbar from './VpToolbar.vue'
import { defaultSettings } from '@/utils/createSettings'
import { useEditor } from '@/composables/useEditor'
import VpImage from './VpImage.vue'

const emit = defineEmits<{
  save: [event: SaveParameters]
  drawStart: [event: DrawEvent]
  draw: [event: DrawEvent]
  drawEnd: [event: DrawEvent]
  reset: []
}>()

const settings = defineModel<Settings>('settings', {
  default: () => defaultSettings
})

const props = withDefaults(
  defineProps<{
    tools: Tool<any>[]
    width: number
    height: number
  }>(),
  { width: 1280, height: 720 }
)

const history = defineModel<Shape[]>('history', { default: [] })

const vpImage = ref()

const { activeShape, setTool, undo, redo, save, reset } = useEditor({
  vpImage,
  tools: props.tools,
  history: toRef(history),
  settings: toRef(settings),
  width: props.width,
  height: props.height,
  emit
})

onMounted(() => {
  if (!history.value?.length) {
    reset()
  }
})


</script>

<template>
  <div class="vue-paint vp-editor" :class="`active-tool-${settings.tool}`">
    <vp-image ref="vpImage" :tools :activeShape :history :width :height />

    <slot name="toolbar" :set-tool :undo :save :reset :settings>
      <vp-toolbar v-model:settings="settings" @set-tool="setTool" @undo="undo" @redo="redo" @save="save" @reset="reset"
        :tools />
    </slot>
  </div>
</template>