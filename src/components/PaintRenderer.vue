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

const crop = computed(() => getCrop(props.history, props.activeShape))

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

</script>

<template>
    <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`" xmlns="http://www.w3.org/2000/svg">
        <image v-if="background" :xlink:href="backgroundSrc" :width="width" />
        <component v-for="shape, i in history" :key="i" :is="getTool(shape.type).svgShape" :shape="shape" />
        <component v-if="activeShape" :is="getTool(activeShape.type).svgShape" :shape="activeShape" />
        <path v-if="crop" class="overlay" :d="`
                M 0,0 V ${height} H ${width} V 0 Z
                M ${crop.x},${crop.y} H ${crop.x + crop.width} V ${crop.y + crop.height} H ${crop.x} Z
            `" />
        <defs>
            <component v-for="tool in tools" :key="tool.type" :is="tool.svgDefs" :history :activeShape />
        </defs>
        <svg:style>{{ style }}</svg:style>
    </svg>
</template>