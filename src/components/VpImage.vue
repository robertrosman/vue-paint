<script setup lang="ts">
import { computed, ref, toRefs, unref } from 'vue'
import type { Shape, Tool, ToolType } from '../types'
import { useSimplifiedHistory } from '@/composables/useSimplifiedHistory';
import { randomId } from '@/utils/randomId';

const props = defineProps<{
  tools: Tool<any>[]
  activeShape?: Shape
  history: any[]
  width: number
  height: number
}>()

const svg = ref()
const svgId = ref(randomId())

defineExpose({
  svg
})

function getTool(toolType: ToolType) {
  return props.tools.find((tool) => tool.type === toolType)
}

const style = computed(() => {
  return props.tools.map((tool) => {
    if (!tool.svgStyle) {
      return ''
    }
    else if (typeof tool.svgStyle === 'function') {
      return tool.svgStyle({ svgId: svgId.value })
    }
    else {
      return unref(tool.svgStyle)
    }
  }).join('\n')
})

const { simplifiedHistory } = useSimplifiedHistory({ ...toRefs(props), includeActiveShape: false })

const lowLayers = computed(() =>
  props.tools
    .filter((tool) => tool.ToolSvgComponent && (tool.ToolSvgComponent.layer ?? 0) <= 0)
    .sort((a, b) => (a.ToolSvgComponent?.layer ?? 0) - (b.ToolSvgComponent?.layer ?? 0))
)
const highLayers = computed(() =>
  props.tools
    .filter((tool) => tool.ToolSvgComponent && (tool.ToolSvgComponent.layer ?? 0) > 0)
    .sort((a, b) => (a.ToolSvgComponent?.layer ?? 0) - (b.ToolSvgComponent?.layer ?? 0))
)
</script>

<template>
  <svg ref="svg" :viewBox="`0 0 ${width} ${height}`" :id="svgId" xmlns="http://www.w3.org/2000/svg" class="vp-image">

    <component v-for="tool in lowLayers" :key="tool.type" :is="tool.ToolSvgComponent" :history :tools :activeShape
      :width :height />

    <component v-for="shape in simplifiedHistory" :key="shape.id + shape.id === activeShape?.id" :id="shape.id"
      :is="getTool(shape.type)?.ShapeSvgComponent" :shape :history :tools :width :height
      :is-active="shape.id === activeShape?.id" />

    <component v-if="activeShape" :id="activeShape.id" :is="getTool(activeShape.type)?.ShapeSvgComponent"
      :shape="activeShape" :history :tools :width :height is-active />

    <component v-for="tool in highLayers" :key="tool.type" :is="tool.ToolSvgComponent" :history :tools :activeShape
      :width :height />

    <svg:style>
      {{ style }}
    </svg:style>
  </svg>
</template>