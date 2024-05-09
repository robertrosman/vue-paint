<script setup lang="ts">
import { useElementBounding, usePointerSwipe } from '@vueuse/core'
import { computed, ref, unref, watchEffect, type MaybeRef } from 'vue';
import type { Crop, SaveParameters, Settings, Shape, Tool } from '../types'
import PaintRenderer from './PaintRenderer.vue';
import { createDataUrl } from '@/utils/createDataUrl';

const emit = defineEmits<{
    (e: 'crop', crop: Crop | undefined): void
    (e: 'save', { svg, crop }: SaveParameters): void
    (e: 'clear'): void
}>()

const settings = defineModel<Settings>("settings", {
    default: () => ({
        tool: "line",
        thickness: 5,
        color: "#c82d2d"
    })
})

const props = defineProps<{
    /**
     * Use background prop to set a background image. There are several ways to create a blob, like these:
     * @example
     * const blob1 = await canvasToBlob(canvas)
     * const blob2 = await urlToBlob(url)
     */
    background?: MaybeRef<Blob>
}>()

const history = defineModel<Shape[]>("history", { default: [] })

const crop = defineModel<Crop | undefined>("crop", { default: undefined })

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

const { posStart, posEnd } = usePointerSwipe(svgRef, {
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

const minX = computed(() => Math.max(0, Math.min(posStart.x - left.value, posEnd.x - left.value)))
const minY = computed(() => Math.max(0, Math.min(posStart.y - top.value, posEnd.y - top.value)))
const maxX = computed(() => Math.min(width.value, Math.max(posStart.x - left.value, posEnd.x - left.value)))
const maxY = computed(() => Math.min(height.value, Math.max(posStart.y - top.value, posEnd.y - top.value)))

const backgroundSrc = ref()
watchEffect(() => {
    const unreffed = unref(props.background)
    if (!unreffed) {
        return undefined
    }
    createDataUrl(unreffed).then(src => backgroundSrc.value = src)
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
    emit('save', { svg, crop })
}

function clear() {
    history.value = []
    crop.value = undefined
    emit('clear')
}

</script>

<template>
    <div ref="container" class="container">
        <paint-renderer ref="svgRef" :activeShape :history :width :height :background :crop />

        <div class="toolbar">
            <button @click="setTool('crop')">Crop</button>
            <button @click="setTool('line')">Line</button>
            <button @click="setTool('arrow')">Arrow</button>
            <button @click="setTool('rectangle')">Rectangle</button>
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
