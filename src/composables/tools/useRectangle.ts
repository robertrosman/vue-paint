import type { DrawEvent, ToolComposable } from "@/types"
import { shapeSvgComponent } from "@/utils/shapeSvgComponent"
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

    function onDraw({ settings, minX, minY, maxX, maxY }: DrawEvent): Rectangle {
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

    const shapeSvg = shapeSvgComponent<Rectangle>(rectangle => h('rect', {
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

    return { type, onDraw, shapeSvg, svgStyle }
}