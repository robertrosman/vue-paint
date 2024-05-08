<script setup lang="ts">
import { useElementBounding, usePointerSwipe } from '@vueuse/core'
import { computed, ref } from 'vue';
import type { Crop, Settings, Shape, Tool } from '../types'
import { getArrowId } from '@/utils/getArrowId';
import SvgShape from './SvgShape.vue';

const emit = defineEmits<{
    (e: 'crop', crop: Crop | undefined): void
}>()

const settings = defineModel<Settings>("settings", {
    default: () => ({
        tool: "line",
        thickness: 5,
        color: "#c82d2d"
    })
})

const history = defineModel<Shape[]>("history", { default: [] })

const crop = defineModel<Crop>("crop", { default: undefined })

const container = ref()
const svgRef = ref()
const activeShape = ref<Shape | undefined>()

defineExpose({
    svgRef,
    container
})

function updateActiveShape() {
    if (settings.value.tool === 'rectangle') {
        activeShape.value = {
            type: settings.value.tool,
            x: minX.value,
            y: minY.value,
            width: (maxX.value - minX.value),
            height: (maxY.value - minY.value),
            thickness: settings.value.thickness,
            color: settings.value.color
        }
    }
    else if (settings.value.tool === 'line' || settings.value.tool === 'arrow') {
        activeShape.value = {
            type: settings.value.tool,
            x1: posStart.x - left.value,
            y1: posStart.y - top.value,
            x2: posEnd.x - left.value,
            y2: posEnd.y - top.value,
            thickness: settings.value.thickness,
            color: settings.value.color
        }
    }
    else {
        activeShape.value = undefined
    }
}

const allShapes = computed(() => activeShape.value ? [
    activeShape.value,
    ...history.value
] : history.value)


const { posStart, posEnd, distanceX, distanceY, isSwiping } = usePointerSwipe(svgRef, {
    threshold: 0,
    onSwipe(e) {
        if (settings.value.tool === 'crop') {
            crop.value = {
                x: minX.value,
                y: minY.value,
                width: (maxX.value - minX.value),
                height: (maxY.value - minY.value),
            }
        }
        else {
            updateActiveShape()
        }
    },
    onSwipeEnd() {
        if (settings.value.tool === 'crop') {
            emit('crop', crop.value)
        }
        else {
            if (activeShape.value) {
                history.value.push(activeShape.value)
                activeShape.value = undefined
            }
        }
    }
})
const { top, left, width, height } = useElementBounding(container)

const minX = computed(() => Math.min(posStart.x - left.value, posEnd.x - left.value))
const minY = computed(() => Math.min(posStart.y - top.value, posEnd.y - top.value))
const maxX = computed(() => Math.max(posStart.x - left.value, posEnd.x - left.value))
const maxY = computed(() => Math.max(posStart.y - top.value, posEnd.y - top.value))

function setTool(tool: Tool) {
    settings.value.tool = tool
}

function undo() {
    if (history.value.length) {
        history.value = history.value.slice(0, -1)
    }
}

const arrowMarkers = computed(() =>
    allShapes.value
        .filter(shape => shape.type === 'arrow')
        .filter((shape, index, self) => self.findIndex(s => getArrowId(s) === getArrowId(shape)) === index) // Unique matches only
        .map(shape => ({
            id: getArrowId(shape),
            color: shape.color
        }))
)


</script>

<template>
    <div ref="container" class="container">
        <svg ref="svgRef" :width="width" :height="height" class="absolute inset-0" :viewBox="`0 0 ${width} ${height}`"
            xmlns="http://www.w3.org/2000/svg">
            <svg-shape v-for="shape, i in history" :key="i" :shape="shape" />
            <svg-shape v-if="activeShape" :shape="activeShape" />
            <path v-if="crop" class="overlay" :d="`
                    M 0,0 V ${height} H ${width} V 0 Z
                    M ${crop.x},${crop.y} H ${crop.x + crop.width} V ${crop.y + crop.height} H ${crop.x} Z
                `" />
            <defs>
                <marker v-for="marker in arrowMarkers" :id="marker.id" :key="marker.id" viewBox="0 0 10 10" refX="2.5"
                    refY="2.5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                    <polygon points="0,5 1.7,2.5 0,0 5,2.5" :fill="marker.color"></polygon>
                </marker>
            </defs>
            <svg:style>
                rect,
                line {
                stroke-linecap: round;
                stroke-linejoin: round;
                fill-opacity: 0;
                }
                .overlay {
                opacity: 0.7;
                fill: #020202;
                }
            </svg:style>
        </svg>
        <div class="toolbar">
            <button @click="setTool('crop')">Crop</button>
            <button @click="setTool('line')">Line</button>
            <button @click="setTool('arrow')">Arrow</button>
            <button @click="setTool('rectangle')">Rectangle</button>
            <input type="range" min="1" max="10" v-model="settings.thickness" />
            <input type="color" v-model="settings.color" />
            <button @click="undo">Undo</button>
        </div>
    </div>
</template>

<style scoped>
.container {
    position: relative;
    cursor: crosshair;
}

svg {
    z-index: 100;
}

.toolbar {
    position: absolute;
}

.dashed-line {
    fill: none;
    stroke: #ffffff;
    stroke-width: 1;
    stroke-linecap: round;
    stroke-linejoin: miter;
    stroke-opacity: 1;
    stroke-dasharray: 4, 8;
    stroke-dashoffset: 0;
}
</style>
