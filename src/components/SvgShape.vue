<script setup lang="ts">
import type { Shape } from '@/types';
import { getArrowId } from '@/utils/getArrowId';

const props = defineProps<{
    shape: Shape
}>()
</script>

<template>
    <rect v-if="shape.type === 'rectangle'" :x="shape.x" :y="shape.y" :width="shape.width" :height="shape.height"
        :stroke="shape.color" :stroke-width="shape.thickness" />

    <line v-if="shape.type === 'line'" :x1="shape.x1" :y1="shape.y1" :x2="shape.x2" :y2="shape.y2" :stroke="shape.color"
        :stroke-width="shape.thickness" />

    <line v-if="shape.type === 'arrow'" :x1="shape.x1" :y1="shape.y1" :x2="shape.x2" :y2="shape.y2"
        :stroke="shape.color" :stroke-width="shape.thickness" :marker-end="`url(#${getArrowId(shape)})`" />
</template>
