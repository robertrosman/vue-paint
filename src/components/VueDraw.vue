<script setup lang="ts">
import { useElementBounding, usePointer } from '@vueuse/core'
import { computed, ref, watch } from 'vue';

export interface State {
    crop?: Crop
}

export interface Crop {
    x: number
    y: number
    height: number
    width: number
}

const emit = defineEmits<{
  (e: 'crop', crop: Crop): void
}>()
const container = ref()
const state = defineModel<State>({ default: () => ({
    crop: undefined
})})

const { x, y, pressure } = usePointer({ target: container })
const { top, left, width, height } = useElementBounding(container)

const startX = ref()
const startY = ref()
const minX = computed(() => Math.min(startX.value, x.value - left.value))
const minY = computed(() => Math.min(startY.value, y.value - top.value))
const maxX = computed(() => Math.max(startX.value, x.value - left.value))
const maxY = computed(() => Math.max(startY.value, y.value - top.value))



watch(pressure, async () => {
  if (pressure.value) {
    startX.value = x.value - left.value
    startY.value = y.value - top.value
  }
  else {
    emit('crop', state.value.crop)
    startX.value = undefined
    startY.value = undefined
  }
})


watch([pressure, x, y], async () => {
  if (pressure.value) {
    state.value.crop = {
        x: minX.value,
        y: minY.value,
        width: (maxX.value - minX.value),
        height: (maxY.value - minY.value),
    }
  }
})
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
            v-if="pressure && state.crop"
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
