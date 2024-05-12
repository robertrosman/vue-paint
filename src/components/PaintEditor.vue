<script setup lang="ts">
import { useElementBounding, usePointerSwipe } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue';
import type { DrawEvent, SaveParameters, Settings, Shape, Tool, ToolComposable } from '../types'
import PaintRenderer from './PaintRenderer.vue';

const emit = defineEmits<{
    (e: 'save', { svg, tools, history }: SaveParameters): void
    (e: 'drawStart', event: DrawEvent): void
    (e: 'draw', event: DrawEvent): void
    (e: 'drawEnd', event: DrawEvent): void
    (e: 'clear'): void
}>()

const settings = defineModel<Settings>("settings", {
    default: () => ({
        tool: "freehand",
        thickness: 5,
        color: "#c82d2d"
    })
})

const props = defineProps<{
    tools: ToolComposable<unknown>[]
}>()

const history = defineModel<Shape[]>("history", { default: [] })

const container = ref()
const svgRef = ref()
const activeShape = ref<Shape | undefined>()

defineExpose({
    svgRef,
    container
})

function getActiveTool() {
    return props.tools?.find(tool => tool.type === settings.value.tool)
}

const drawEvent = computed<DrawEvent>(() => ({
    settings: settings.value,
    activeShape,
    isDrawing: isSwiping,
    tools: props.tools,
    posStart, posEnd,
    left, right, top, bottom,
    width, height,
    x, y, minX, maxX, minY, maxY
}))

const { posStart, posEnd, isSwiping } = usePointerSwipe(svgRef, {
    threshold: 0,
    onSwipeStart(e) {
        activeShape.value = getActiveTool()?.onDrawStart?.(drawEvent.value) ?? activeShape.value
        emit('drawStart', drawEvent.value)
    },
    onSwipe(e) {
        activeShape.value = getActiveTool()?.onDraw?.(drawEvent.value) ?? activeShape.value
        emit('draw', drawEvent.value)
    },
    onSwipeEnd() {
        activeShape.value = getActiveTool()?.onDrawEnd?.(drawEvent.value) ?? activeShape.value
        emit('drawEnd', drawEvent.value)
        if (activeShape.value) {
            history.value.push(activeShape.value)
            activeShape.value = undefined
        }
    }
})
const { top, left, right, bottom, width, height } = useElementBounding(container)

const x = computed(() => Math.round(posEnd.x - left.value))
const y = computed(() => Math.round(posEnd.y - top.value))
const minX = computed(() => Math.max(0, Math.min(Math.round(posStart.x) - left.value, x.value)))
const minY = computed(() => Math.max(0, Math.min(Math.round(posStart.y) - top.value, y.value)))
const maxX = computed(() => Math.min(width.value, Math.max(Math.round(posStart.x - left.value), x.value)))
const maxY = computed(() => Math.min(height.value, Math.max(Math.round(posStart.y - top.value), y.value)))

onMounted(() => {
    if (!history.value?.length) {
        clear()
    }
})

function setTool(tool: Tool) {
    settings.value.tool = tool
}

function undo() {
    if (history.value.length) {
        history.value = history.value.slice(0, -1)
    }
}

function save() {
    const svg = container.value.querySelector("svg")
    if (!svg) {
        throw new Error("Couldn't find the svg")
    }
    emit('save', { svg, tools: props.tools, history: history.value })
}

function clear() {
    history.value = []
    Promise.all(props.tools
        .filter(tool => "initialize" in tool)
        .flatMap(async tool => await tool.initialize?.({ tools: props.tools }))
    ).then(shapes => history.value = [...(shapes as Shape[]), ...history.value])
    emit('clear')
}

</script>

<template>
    <div ref="container" class="container">
        <paint-renderer ref="svgRef" :tools :activeShape :history :width :height />

        <div class="toolbar">
            <button @click="setTool('freehand')">Freehand</button>
            <button @click="setTool('line')">Line</button>
            <button @click="setTool('arrow')">Arrow</button>
            <button @click="setTool('rectangle')">Rectangle</button>
            <button @click="setTool('crop')">Crop</button>
            <input type="range" min="1" max="10" v-model="settings.thickness" />
            <input type="color" v-model="settings.color" />
            <button @click="undo">Undo</button>
            <button @click="clear">Clear</button>
            <button @click="save">Save</button>
        </div>
    </div>
</template>

<style scoped>
.container {
    position: relative;
    cursor: crosshair;
}

.toolbar {
    position: absolute;
}
</style>
