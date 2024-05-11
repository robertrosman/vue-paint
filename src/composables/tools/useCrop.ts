import type { SvgOnceProps, ToShapeArguments, ToolComposable } from "@/types"
import { getCrop } from "@/utils/getCrop"
import { computed, h } from "vue"

export interface Crop {
    type: "crop"
    x: number
    y: number
    height: number
    width: number
}

export function useCrop(): ToolComposable<Crop> {
    const type = "crop"

    function toShape({ minX, minY, maxX, maxY }: ToShapeArguments): Crop {
        return {
            type,
            x: minX.value,
            y: minY.value,
            width: (maxX.value - minX.value),
            height: (maxY.value - minY.value)
        }
    }

    const svgOnce  = {
        props: { history: Array, activeShape: Object, width: Number, height: Number },
        setup(props: SvgOnceProps) {
            const crop = computed(() => getCrop(props.history, props.activeShape))
            return () => crop.value ? h('path', {
                class: "overlay",
                d: `M 0,0 V ${props.height} H ${props.width} V 0 Z
                    M ${crop.value.x},${crop.value.y} H ${crop.value.x + crop.value.width} V ${crop.value.y + crop.value.height} H ${crop.value.x} Z
                `
            }) : undefined
        },
        layer: 1_000_000,
    }

    const svgStyle = `
        .overlay {
            opacity: 0.7;
            fill: #020202;
        }
    `

    return { type, toShape, svgStyle, svgOnce }
}