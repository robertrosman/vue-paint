<script setup lang="ts">
import { useElementBounding, usePointerSwipe } from '@vueuse/core'
import { computed, ref } from 'vue';
import type { Crop, Settings, Shape } from '../types'

const emit = defineEmits<{
  (e: 'crop', crop: Crop | undefined): void
}>()
const settings = defineModel<Settings>("settings", { default: () => ({
    tool: "line",
    crop: undefined,
    thickness: 5,
    color: "red"
})})

const history = defineModel<Shape[]>("history", { default: []})

const crop = defineModel<Crop>("crop", { default: undefined})

const container = ref()
const activeShape = computed<Shape | undefined>(() => {
    if (settings.value.tool === 'rectangle') {
        return {
            type: settings.value.tool,
            x: minX.value,
            y: minY.value,
            width: (maxX.value - minX.value),
            height: (maxY.value - minY.value),
            thickness: settings.value.thickness,
            color: settings.value.color
        }
    }
    if (settings.value.tool === 'line') {
        return {
            type: settings.value.tool,
            x1: posStart.x - left.value,
            y1: posStart.y - top.value,
            x2: posEnd.x - left.value,
            y2: posEnd.y - top.value,
            thickness: settings.value.thickness,
            color: settings.value.color
        }
    }
    return undefined
})
const allShapes = computed(() => activeShape.value ? [
    activeShape.value,
    ...history.value
] : history.value)


const { posStart, posEnd, distanceX, distanceY, isSwiping } = usePointerSwipe(container, { 
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
    },
    onSwipeEnd() {
        if (settings.value.tool === 'crop') {
            emit('crop', crop.value)
        }
        else {
            console.log(activeShape.value)
            if (activeShape.value) {
                history.value.push(activeShape.value)
            }
        }
    }
})
const { top, left, width, height } = useElementBounding(container)

const minX = computed(() => Math.min(posStart.x - left.value, posEnd.x - left.value))
const minY = computed(() => Math.min(posStart.y - top.value, posEnd.y - top.value))
const maxX = computed(() => Math.max(posStart.x - left.value, posEnd.x - left.value))
const maxY = computed(() => Math.max(posStart.y - top.value, posEnd.y - top.value))

</script>

<template>
    <div ref="container" class="container">
        <svg
            :width="width"
            :height="height"
            class="absolute inset-0"
            :viewBox="`0 0 ${width} ${height}`"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                v-if="crop"
                class="overlay"
                :d="`
                    M 0,0 V ${height} H ${width} V 0 Z
                    M ${crop.x},${crop.y} H ${crop.x + crop.width} V ${crop.y + crop.height} H ${crop.x} Z
                `"
            />
            <template v-for="shape, i in allShapes">
                <rect :key="i" v-if="shape.type === 'rectangle'" :x="shape.x" :y="shape.y" :width="shape.width" :height="shape.height" :stroke="shape.color" :stroke-width="shape.thickness"  />
                <line :key="i" v-if="shape.type === 'line'" :x1="shape.x1" :y1="shape.y1" :x2="shape.x2" :y2="shape.y2" :stroke="shape.color" :stroke-width="shape.thickness"  />
            </template>
        </svg>
        <div class="toolbar">
            <button @click="settings.tool = 'crop'">Crop</button>
            <button @click="settings.tool = 'line'">Line</button>
            <button @click="settings.tool = 'rectangle'">Rectangle</button>
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

rect, line {
    stroke-linecap: round;
    stroke-linejoin: round;
    fill-opacity: 0;
}

.overlay {
    opacity: 0.5;
    fill: #020202;
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
    stroke-dashoffset:0;
}
</style>
