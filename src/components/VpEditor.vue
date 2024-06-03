<script setup lang="ts">
import { computed, onMounted, ref, toRef } from 'vue'
import type { DrawEvent, SaveParameters, Settings, Shape, Tool } from '../types'
import VpImage from './VpImage.vue'
import VpToolbar from './VpToolbar.vue'
import { useDraw } from '@/composables/useDraw'
import { randomId } from '@/utils/randomId'
import { defaultSettings } from '@/utils/createSettings'

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
const redoHistory = ref<Shape[]>([])

const vpImageRef = ref()
const activeShape = ref<Shape | undefined>()
const temporaryTool = ref<string>()

function getActiveTool() {
  return props.tools?.find((tool) => tool.type === (temporaryTool.value ?? settings.value.tool))
}

const drawEvent = computed<DrawEvent>(() => ({
  settings: settings.value,
  activeShape: activeShape.value,
  id: activeShape.value?.id ?? randomId(),
  isDrawing: isDrawing.value,
  tools: props.tools,
  posStart,
  posEnd,
  left: left.value,
  right: right.value,
  top: top.value,
  bottom: bottom.value,
  width: props.width,
  height: props.height,
  x: x.value,
  y: y.value,
  minX: minX.value,
  maxX: maxX.value,
  minY: minY.value,
  maxY: maxY.value,
  absoluteX: absoluteX.value,
  absoluteY: absoluteY.value
}))

const {
  x,
  y,
  minX,
  minY,
  maxX,
  maxY,
  top,
  left,
  bottom,
  right,
  posStart,
  posEnd,
  width,
  height,
  isDrawing,
  absoluteX,
  absoluteY
} = useDraw({
  container: vpImageRef,
  width: props.width,
  height: props.height,
  onDrawStart() {
    temporaryTool.value = document.elementsFromPoint(absoluteX.value, absoluteY.value)?.[0]
      ?.getAttribute('class')?.split(' ')
      .find(c => c.startsWith('use-tool-'))
      ?.substring(9)
    activeShape.value = getActiveTool()?.onDrawStart?.(drawEvent.value) ?? activeShape.value
    emit('drawStart', drawEvent.value)
  },
  onDraw() {
    activeShape.value = getActiveTool()?.onDraw?.(drawEvent.value) ?? activeShape.value
    emit('draw', drawEvent.value)
  },
  async onDrawEnd() {
    activeShape.value = getActiveTool()?.onDrawEnd
      ? await getActiveTool()?.onDrawEnd?.(drawEvent.value)
      : activeShape.value
    temporaryTool.value = undefined
    emit('drawEnd', drawEvent.value)
    if (activeShape.value) {
      history.value.push(activeShape.value)
      redoHistory.value = []
      activeShape.value = undefined
    }
  }
})

onMounted(() => {
  if (!history.value?.length) {
    reset()
  }
})

function undo() {
  if (history.value.length) {
    redoHistory.value.push(...history.value.slice(-1))
    history.value = history.value.slice(0, -1)
  }
}

function redo() {
  if (redoHistory.value.length) {
    history.value.push(...redoHistory.value.slice(-1))
    redoHistory.value = redoHistory.value.slice(0, -1)
  }
}

function save() {
  const svg = vpImageRef.value.$refs.svg
  if (!svg) {
    throw new Error("Couldn't find the svg")
  }
  emit('save', { svg, tools: props.tools, history: history.value })
}

async function reset() {
  redoHistory.value = history.value.reverse()
  history.value = []
  const shapes = await Promise.all(
    props.tools
      .filter((tool) => 'onInitialize' in tool)
      .flatMap(async (tool) => await tool.onInitialize?.({ tools: props.tools, settings: toRef(settings), history: toRef(history) }))
  )
  history.value = [...shapes.filter(Boolean), ...history.value]
  emit('reset')
}
</script>

<template>
  <div class="vue-paint vp-editor" :class="`active-tool-${settings.tool}`">
    <vp-image ref="vpImageRef" :tools :activeShape :history :width="width" :height="height" />

    <slot name="toolbar" :undo :save :reset :settings>
      <vp-toolbar v-model:settings="settings" @undo="undo" @redo="redo" @save="save" @reset="reset" :tools />
    </slot>
  </div>
</template>