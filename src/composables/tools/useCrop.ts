import type { ToShapeArguments, ToolComposable } from "@/types"

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

    const svgStyle = `
        .overlay {
            opacity: 0.7;
            fill: #020202;
        }
    `

    return { type, toShape, svgStyle }
}