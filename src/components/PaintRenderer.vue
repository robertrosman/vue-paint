<script setup lang="ts">
import { computed } from 'vue';
import type { Shape, ToolComposable } from '../types'

const props = defineProps<{
    tools: ToolComposable<unknown>[]
    activeShape?: Shape
    history: Shape[]
    width: number
    height: number
}>()

function getTool(toolType: string) {
    return props.tools.find(tool => tool.type === toolType)
}

const style = computed(() => props.tools.map(tool => tool.svgStyle ?? '').join("\n"))

const lowLayers = computed(() => props.tools.filter(tool => tool.toolSvg && (tool.toolSvg.layer ?? 0) <= 0))
const highLayers = computed(() => props.tools.filter(tool => tool.toolSvg && (tool.toolSvg.layer ?? 0) > 0))

</script>

<template>
    <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`" xmlns="http://www.w3.org/2000/svg">
        <component v-for="tool in lowLayers" :key="tool.type" :is="tool.toolSvg" :history :activeShape :width :height />
        <component v-for="shape, i in history" :key="i" :is="getTool(shape.type)?.shapeSvg" :shape :history />
        <component v-if="activeShape" :is="getTool(activeShape.type)?.shapeSvg" :shape="activeShape" :history :width
            :height />
        <component v-for="tool in highLayers" :key="tool.type" :is="tool.toolSvg" :history :activeShape :width
            :height />
        <svg:style>{{ style }}</svg:style>
    </svg>
</template>