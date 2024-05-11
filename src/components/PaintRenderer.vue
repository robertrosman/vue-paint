<script setup lang="ts">
import { computed, ref, unref, watchEffect, type MaybeRef } from 'vue';
import type { Crop, SaveParameters, Shape, ToolComposable } from '../types'
import { createDataUrl } from '@/utils/createDataUrl';
import { getCrop } from '@/utils/getCrop';

const emit = defineEmits<{
    (e: 'crop', crop: Crop | undefined): void
    (e: 'save', { svg, crop }: SaveParameters): void
    (e: 'clear'): void
}>()

const props = defineProps<{
    /**
     * Use background prop to set a background image. There are several ways to create a blob, like these:
     * @example
     * const blob1 = await canvasToBlob(canvas)
     * const blob2 = await urlToBlob(url)
     */
    background?: MaybeRef<Blob>

    tools: ToolComposable<unknown>[]
    activeShape?: Shape
    history: Shape[]
    width: number
    height: number
}>()


const backgroundSrc = ref()
watchEffect(() => {
    const unreffed = unref(props.background)
    if (!unreffed) {
        return undefined
    }
    createDataUrl(unreffed).then(src => backgroundSrc.value = src)
})

function getTool(toolType: string) {
    return props.tools.find(tool => tool.type === toolType)
}

const style = computed(() => props.tools.map(tool => tool.svgStyle ?? '').join("\n"))

const lowLayers = computed(() => props.tools.filter(tool => tool.toolSvg && (tool.toolSvg.layer ?? 0) <= 0))
const highLayers = computed(() => props.tools.filter(tool => tool.toolSvg && (tool.toolSvg.layer ?? 0) > 0))

</script>

<template>
    <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`" xmlns="http://www.w3.org/2000/svg">
        <image v-if="background" :xlink:href="backgroundSrc" :width="width" />
        <component v-for="tool in lowLayers" :key="tool.type" :is="tool.toolSvg" :history :activeShape :width :height />
        <component v-for="shape, i in history" :key="i" :is="getTool(shape.type).shapeSvg" :shape :history />
        <component v-if="activeShape" :is="getTool(activeShape.type).shapeSvg" :shape="activeShape" :history :width
            :height />
        <component v-for="tool in highLayers" :key="tool.type" :is="tool.toolSvg" :history :activeShape :width
            :height />
        <svg:style>{{ style }}</svg:style>
    </svg>
</template>