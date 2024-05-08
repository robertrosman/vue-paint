<script setup lang="ts">
import { useElementBounding, usePointerSwipe } from '@vueuse/core'
import { computed, ref, watchEffect } from 'vue';
import type { State, Crop, Shape } from '../types'

const emit = defineEmits<{
  (e: 'crop', crop: Crop | undefined): void
}>()
const state = defineModel<State>({ default: () => ({
    crop: undefined,
    history: [],
    thickness: 3,
    color: "red"
})})
const container = ref()
const crop = ref<Crop>()
const activeShape = computed(() => ({
    type: state.value.tool,
    x: minX.value,
    y: minY.value,
    width: (maxX.value - minX.value),
    height: (maxY.value - minY.value),
    thickness: state.value.thickness,
    color: state.value.color
}))
const allShapes = computed(() => [
    activeShape.value,
    ...state.value.history
])


const { posStart, posEnd, distanceX, distanceY, isSwiping } = usePointerSwipe(container, { 
    threshold: 0,
    onSwipe(e) {
        if (state.value.tool === 'crop') {
            crop.value = {
                x: minX.value,
                y: minY.value,
                width: (maxX.value - minX.value),
                height: (maxY.value - minY.value),
            }
        }
    },
    onSwipeEnd() {
        if (state.value.tool === 'crop') {
            emit('crop', state.value.crop)
        }
        else {
            console.log(activeShape.value)
            state.value.history.push(activeShape.value)
        }
    }
})
const { top, left, width, height } = useElementBounding(container)

watchEffect(() => {
    state.value.crop = crop.value
})

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
                <rect :key="i" v-if="shape.type === 'rectangle'" :x="shape.x" :y="shape.y" :width="shape.width" :height="shape.height" :stroke="shape.color" :stroke-width="`${shape.thickness}px;`"  />
            </template>
        </svg>
        <div class="toolbar">
            <button @click="state.tool = 'crop'">Crop</button>
            <button @click="state.tool = 'line'">Line</button>
            <button @click="state.tool = 'rectangle'">Rectangle</button>
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

rect {
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
