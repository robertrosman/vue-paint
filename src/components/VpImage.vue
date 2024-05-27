<script setup lang="ts">
import { computed, unref } from 'vue'
import type { Shape, Tool, ToolType } from '../types'

const props = defineProps<{
  tools: Tool<any>[]
  activeShape?: Shape
  history: any[]
  width: number
  height: number
}>()

function getTool(toolType: ToolType) {
  return props.tools.find((tool) => tool.type === toolType)
}

const style = computed(() => props.tools.map((tool) => tool.svgStyle ? unref(tool.svgStyle) : '').join('\n'))

const lowLayers = computed(() =>
  props.tools.filter((tool) => tool.toolSvg && (tool.toolSvg.layer ?? 0) <= 0)
)
const highLayers = computed(() =>
  props.tools.filter((tool) => tool.toolSvg && (tool.toolSvg.layer ?? 0) > 0)
)
</script>

<template>
  <svg :viewBox="`0 0 ${width} ${height}`" xmlns="http://www.w3.org/2000/svg" class="vp-image">
    <component
      v-for="tool in lowLayers"
      :key="tool.type"
      :is="tool.toolSvg"
      :history
      :activeShape
      :width
      :height
    />
    <component
      v-for="shape in history"
      :key="shape.id"
      :id="shape.id"
      :is="getTool(shape.type)?.shapeSvg"
      :shape
      :history
    />
    <component
      v-if="activeShape"
      :id="activeShape.id"
      :is="getTool(activeShape.type)?.shapeSvg"
      :shape="activeShape"
      :history
      :width
      :height
      is-active
    />
    <component
      v-for="tool in highLayers"
      :key="tool.type"
      :is="tool.toolSvg"
      :history
      :activeShape
      :width
      :height
    />
    <svg:style>
      {{ style }}
    </svg:style>
  </svg>
</template>
