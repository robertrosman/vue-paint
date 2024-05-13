<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { DrawEvent, SaveParameters, Settings, Shape, ToolComposable } from '../types'
import PaintRenderer from './PaintRenderer.vue';
import DefaultToolbar from './DefaultToolbar.vue';
import { useDraw } from '@/composables/useDraw';

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
    tools: ToolComposable<Shape>[]
}>()

const history = defineModel<Shape[]>("history", { default: [] })

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
    width, height,
    x, y, minX, maxX, minY, maxY
}))

const {
    x, y,
    minX, minY, maxX, maxY,
    top, left, bottom, right, width, height,
    posStart, posEnd,
    isDrawing
} = useDraw({
    container,
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
            activeShape.value = undefined
        }
    }
})

onMounted(() => {
    if (!history.value?.length) {
        clear()
    }
})

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
        <paint-renderer :tools :activeShape :history :width :height />

        <slot name="toolbar" :undo :save :clear :settings>
            <DefaultToolbar v-model:settings="settings" @undo="undo" @save="save" @clear="clear" :tools
                v-model:active-tool="settings.tool" />
            <!-- :settings="settings"
                @update:settings="$emit('update:settings', $event)" -->
        </slot>
    </div>
</template>

<style scoped>
.container {
    position: relative;
    cursor: crosshair;
}

:deep(.toolbar) {
    position: absolute;
}
</style>
