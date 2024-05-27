<script lang="ts">
const defaultSettings: Settings = {
  tool: 'freehand',
  thickness: 5,
  color: '#c82d2d'
}
</script>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { DrawEvent, SaveParameters, Settings, Shape, Tool } from '../types'
import VpImage from './VpImage.vue'
import VpToolbar from './VpToolbar.vue'
import { useDraw } from '@/composables/useDraw'
import { randomId } from '@/utils/randomId'

const emit = defineEmits<{
  (e: 'save', { svg, tools, history }: SaveParameters): void
  (e: 'drawStart', event: DrawEvent): void
  (e: 'draw', event: DrawEvent): void
  (e: 'drawEnd', event: DrawEvent): void
  (e: 'reset'): void
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

const container = ref()
const activeShape = ref<Shape | undefined>()

defineExpose({
  container
})

function getActiveTool() {
  return props.tools?.find((tool) => tool.type === settings.value.tool)
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
  maxY: maxY.value
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
  isDrawing
} = useDraw({
  container,
  width: props.width,
  height: props.height,
  onDrawStart() {
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
  const svg = container.value.querySelector('svg')
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
      .filter((tool) => 'initialize' in tool)
      .flatMap(async (tool) => await tool.initialize?.({ tools: props.tools }))
  )
  history.value = [...shapes.filter(Boolean), ...history.value]
  emit('reset')
}
</script>

<template>
  <div ref="container" class="vue-paint vp-container">
    <vp-image :tools :activeShape :history :width="width" :height="height" />

    <slot name="toolbar" :undo :save :reset :settings>
      <vp-toolbar v-model:settings="settings" @undo="undo" @redo="redo" @save="save" @reset="reset" :tools
        v-model:active-tool="settings.tool" />
    </slot>
  </div>
</template>