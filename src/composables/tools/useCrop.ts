import type { ToolSvgProps, DrawEvent, ToolComposable, ExportParameters, Shape } from "@/types"
import { computed, h } from "vue"

export interface Crop {
    type: "crop"
    x: number
    y: number
    height: number
    width: number
}

function getCrop (history: Shape[], activeShape: Shape | undefined) {
    if (activeShape?.type === "crop") {
        return activeShape
    }
    const cropShapes = history.filter<Crop>((shape): shape is Crop => shape.type === 'crop')
    if (cropShapes.length > 0) {
        return cropShapes.reverse()[0]
    }
}

export function useCrop(): ToolComposable<Crop> {
    const type = "crop"

    function onDraw({ minX, minY, maxX, maxY }: DrawEvent): Crop {
        return {
            type,
            x: minX.value,
            y: minY.value,
            width: (maxX.value - minX.value),
            height: (maxY.value - minY.value)
        }
    }

    const toolSvg  = {
        props: { history: Array, activeShape: Object, width: Number, height: Number },
        setup(props: ToolSvgProps) {
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

    function beforeExport({ svg, history}: ExportParameters) {
        const crop = getCrop(history, undefined)
        if (crop) {
            const { x, y, width, height } = crop
            svg.setAttribute('width', String(width))
            svg.setAttribute('height', String(height))
            svg.setAttribute('viewBox', `${x} ${y} ${width} ${height}`)
            svg.querySelector(".overlay")?.remove()
        }
    }

    return { type, onDraw, svgStyle, toolSvg, beforeExport }
}