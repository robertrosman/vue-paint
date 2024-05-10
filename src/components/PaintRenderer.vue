<script setup lang="ts">
import { computed, ref, toRef, unref, watchEffect, type MaybeRef, type Ref } from 'vue';
import type { Arrow, Crop, SaveParameters, Shape } from '../types'
import { getArrowId } from '@/utils/getArrowId';
import SvgShape from './SvgShape.vue';
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

    activeShape: Shape | undefined
    history: Shape[]
    width: number
    height: number
}>()

const allShapes = computed(() => props.activeShape ? [
    props.activeShape,
    ...props.history
] : props.history)

const crop = computed(() => getCrop(props.history, props.activeShape))

const backgroundSrc = ref()
watchEffect(() => {
    const unreffed = unref(props.background)
    if (!unreffed) {
        return undefined
    }
    createDataUrl(unreffed).then(src => backgroundSrc.value = src)
})

const arrowMarkers = computed(() =>
    allShapes.value
        .filter<Arrow>((shape): shape is Arrow => shape.type === 'arrow')
        .filter((shape, index, self) => self.findIndex(s => getArrowId(s) === getArrowId(shape)) === index) // Unique matches only
        .map(shape => ({
            id: getArrowId(shape),
            color: shape.color
        }))
)


</script>

<template>
    <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`" xmlns="http://www.w3.org/2000/svg">
        <image v-if="background" :xlink:href="backgroundSrc" :width="width" />
        <svg-shape v-for="shape, i in history" :key="i" :shape="shape" />
        <svg-shape v-if="activeShape" :shape="activeShape" />
        <path v-if="crop" class="overlay" :d="`
                M 0,0 V ${height} H ${width} V 0 Z
                M ${crop.x},${crop.y} H ${crop.x + crop.width} V ${crop.y + crop.height} H ${crop.x} Z
            `" />
        <defs>
            <marker v-for="marker in arrowMarkers" :id="marker.id" :key="marker.id" viewBox="0 0 10 10" refX="2.5"
                refY="2.5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                <polygon points="0,5 1.7,2.5 0,0 5,2.5" :fill="marker.color"></polygon>
            </marker>
        </defs>
        <svg:style>
            rect,
            line {
            stroke-linecap: round;
            stroke-linejoin: round;
            fill-opacity: 0;
            }
            .overlay {
            opacity: 0.7;
            fill: #020202;
            }
        </svg:style>
    </svg>
</template>