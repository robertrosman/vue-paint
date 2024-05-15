<script lang="ts">

const defaultSettings: Settings = {
    tool: "freehand",
    thickness: 5,
    color: "#c82d2d",
    width: 3000,
    height: 1500
}

</script>


<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { DrawEvent, SaveParameters, Settings, Shape, ToolComposable } from '../types'
import VpImage from './VpImage.vue';
import VpToolbar from './VpToolbar.vue';
import { useDraw } from '@/composables/useDraw';

const emit = defineEmits<{
    (e: 'save', { svg, tools, history }: SaveParameters): void
    (e: 'drawStart', event: DrawEvent): void
    (e: 'draw', event: DrawEvent): void
    (e: 'drawEnd', event: DrawEvent): void
    (e: 'clear'): void
}>()

const settings = defineModel<Settings>("settings", {
    default: () => defaultSettings
})

const props = defineProps<{
    tools: ToolComposable<Shape>[]
}>()

const history = defineModel<Shape[]>("history", { default: [] })
const redoHistory = ref<Shape[]>([])

const container = ref()
const activeShape = ref<Shape | undefined>()

defineExpose({
    container
})

function getActiveTool() {
    return props.tools?.find(tool => tool.type === settings.value.tool)
}

const drawEvent = computed<DrawEvent>(() => ({
    settings: settings.value,
    activeShape,
    isDrawing,
    tools: props.tools,
    posStart, posEnd,
    left, right, top, bottom,
    width: settings.value.width, height: settings.value.height,
    x, y, minX, maxX, minY, maxY
}))

const {
    x, y,
    minX, minY, maxX, maxY,
    top, left, bottom, right,
    posStart, posEnd,
    width, height,
    isDrawing
} = useDraw({
    container,
    width: settings.value.width,
    height: settings.value.height,
    onDrawStart() {
        activeShape.value = getActiveTool()?.onDrawStart?.(drawEvent.value) ?? activeShape.value
        emit('drawStart', drawEvent.value)
    },
    onDraw() {
        activeShape.value = getActiveTool()?.onDraw?.(drawEvent.value) ?? activeShape.value
        emit('draw', drawEvent.value)
    },
    onDrawEnd() {
        activeShape.value = getActiveTool()?.onDrawEnd?.(drawEvent.value) ?? activeShape.value
        emit('drawEnd', drawEvent.value)
        if (activeShape.value) {
            history.value.push(activeShape.value)
            redoHistory.value = []
            activeShape.value = undefined
        }
    }
})

onMounted(() => {
    settings.value.width ??= defaultSettings.width
    settings.value.height ??= defaultSettings.height
    if (!history.value?.length) {
        clear()
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
    const svg = container.value.querySelector("svg")
    if (!svg) {
        throw new Error("Couldn't find the svg")
    }
    emit('save', { svg, tools: props.tools, history: history.value })
}

function clear() {
    redoHistory.value = history.value.reverse()
    history.value = []
    Promise.all(props.tools
        .filter(tool => "initialize" in tool)
        .flatMap(async tool => await tool.initialize?.({ tools: props.tools }))
    ).then(shapes => history.value = [...(shapes as Shape[]), ...history.value])
    emit('clear')
}

const widthPx = computed(() => `${width}px`)
</script>

<template>
    <div ref="container" class="container">
        <vp-image :tools :activeShape :history :width="width" :height="height" />

        <slot name="toolbar" :undo :save :clear :settings>
            <vp-toolbar v-model:settings="settings" @undo="undo" @redo="redo" @save="save" @clear="clear" :tools
                v-model:active-tool="settings.tool" />
        </slot>
    </div>
</template>

<style scoped>
.container {
    position: relative;
    cursor: crosshair;
    height: auto;
    max-width: v-bind(widthPx);
    display: flex;
}
</style>
