import type { DrawEvent, ToolComposable } from "@/types"
import { shapeSvgComponent } from "@/utils/shapeSvgComponent"
import type { Position } from "@vueuse/core"
import { h, ref } from "vue"

export interface Freehand {
    type: "freehand"
    path: string
    thickness: number
    color: string
}

export interface Options {
    smoothness?: number
}

// This code is originally based on the excellent answer here: https://stackoverflow.com/a/40700068/829505
export function useFreehand(options?: Options): ToolComposable<Freehand> {
    const type = "freehand"

    const buffer: Position[] = []
    let path = ''
    const bufferSize = (options?.smoothness ?? 4)

    function appendToBuffer (pos: Position) {
        buffer.push(pos);
        while (buffer.length > bufferSize) {
            buffer.shift();
        }
    }

    // Calculate the average point, starting at offset in the buffer
    function getAveragePoint (offset: number) {
        const len = buffer.length
        if (len % 2 === 1 || len >= bufferSize) {
            let totalX = 0
            let totalY = 0
            let pt, i
            let count = 0
            for (i = offset; i < len; i++) {
                count++
                pt = buffer[i]
                totalX += pt.x
                totalY += pt.y
            }
            return {
                x: totalX / count,
                y: totalY / count
            }
        }
        return null;
    };

    function getSmoothPath () {
        let pos = getAveragePoint(0)

        if (pos) {
            // Get the smoothed part of the path that will not change
            path += " L" + pos.x + " " + pos.y

            // Get the last part of the path (close to the current mouse position)
            // This part will change if the mouse moves again
            let tmpPath = ''
            for (let offset = 2; offset < buffer.length; offset += 2) {
                pos = getAveragePoint(offset)
                if (pos) {
                    tmpPath += " L" + pos.x + " " + pos.y
                }
            }
            return path + tmpPath
        }
        return path
    };

    function onDrawStart({ x, y }: DrawEvent) {
        buffer.length = 0
        appendToBuffer({ x: x.value, y: y.value })
        path = "M" + x.value + " " + y.value
    }

    function onDraw({ settings, x, y }: DrawEvent): Freehand | undefined {
        appendToBuffer({ x: x.value, y: y.value })
        if (path) {
            return {
                type,
                path: getSmoothPath(),
                thickness: settings.thickness,
                color: settings.color
            }
        }
    }

    const shapeSvg = shapeSvgComponent<Freehand>(freehand => h('path', {
        d: freehand.path,
        class: 'freehand',
        stroke: freehand.color,
        'stroke-width': freehand.thickness
    }))

    const svgStyle = `
        .freehand {
            stroke-linecap: round;
            stroke-linejoin: round;
            fill-opacity: 0;
        }
    `

    return { type, onDrawStart, onDraw, shapeSvg, svgStyle }
}
