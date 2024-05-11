import type { ToShapeArguments, ToolComposable } from "@/types"
import { svgShapeComponent } from "@/utils/svgShapeComponent"
import { h } from "vue"

export interface Rectangle {
    type: "rectangle"
    x: number
    y: number
    height: number
    width: number
    thickness: number
    color: string
}

export function useRectangle(): ToolComposable<Rectangle> {
    const type = "rectangle"

    function toShape({ settings, minX, minY, maxX, maxY }: ToShapeArguments): Rectangle {
        return {
            type,
            x: minX.value,
            y: minY.value,
            width: (maxX.value - minX.value),
            height: (maxY.value - minY.value),
            thickness: settings.thickness,
            color: settings.color
        }
    }

    const svgShape = svgShapeComponent<Rectangle>(rectangle => h('rect', {
        x: rectangle.x,
        y: rectangle.y,
        width: rectangle.width,
        height: rectangle.height,
        stroke: rectangle.color,
        'stroke-width': rectangle.thickness
    }))

    const svgStyle = `
        rect {
            stroke-linecap: round;
            stroke-linejoin: round;
            fill-opacity: 0;
        }
    `

    return { type, toShape, svgShape, svgStyle }
}