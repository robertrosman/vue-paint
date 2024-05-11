import type { ToShapeArguments, ToolComposable } from "@/types"
import { svgShapeComponent } from "@/utils/svgShapeComponent"
import { h } from "vue"

export interface Line {
    type: "line"
    x1: number
    y1: number
    x2: number
    y2: number
    thickness: number
    color: string
}

export function useLine(): ToolComposable<Line> {
    const type = "line"

    function toShape({ settings, posStart, posEnd, left, top}: ToShapeArguments): Line {
        return {
            type,
            x1: posStart.x - left.value,
            y1: posStart.y - top.value,
            x2: posEnd.x - left.value,
            y2: posEnd.y - top.value,
            thickness: settings.thickness,
            color: settings.color
        }
    }

    const svgShape = svgShapeComponent<Line>(line => h('line', {
        x1: line.x1,
        y1: line.y1,
        x2: line.x2,
        y2: line.y2,
        stroke: line.color,
        'stroke-width': line.thickness
    }))

    const svgStyle = `
        line {
            stroke-linecap: round;
            stroke-linejoin: round;
            fill-opacity: 0;
        }
    `

    return { type, toShape, svgShape, svgStyle }
}