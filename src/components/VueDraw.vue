<script setup lang="ts">
import { useElementBounding, usePointerSwipe } from '@vueuse/core'
import { computed, ref } from 'vue';
import type { State, Crop } from '../types'

const emit = defineEmits<{
  (e: 'crop', crop: Crop | undefined): void
}>()
const container = ref()
const state = defineModel<State>({ default: () => ({
    crop: undefined
})})

const { posStart, posEnd, distanceX, distanceY, isSwiping } = usePointerSwipe(container, { 
    threshold: 0,
    onSwipe(e) {
        state.value.crop = {
            x: minX.value,
            y: minY.value,
            width: (maxX.value - minX.value),
            height: (maxY.value - minY.value),
        }
    },
    onSwipeEnd() {
        emit('crop', state.value.crop)
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
            v-if="isSwiping && state.crop"
            class="overlay"
            :d="`
                M 0,0 V ${height} H ${width} V 0 Z
                M ${state.crop.x},${state.crop.y} H ${state.crop.x + state.crop.width} V ${state.crop.y + state.crop.height} H ${state.crop.x} Z
            `"
            />
        </svg>
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

.overlay {
    opacity: 0.5;
    fill: #020202;
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
