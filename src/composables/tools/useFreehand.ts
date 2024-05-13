import type { DrawEvent, ToolComposable } from "@/types"
import { shapeSvgComponent } from "@/utils/shapeSvgComponent"
import type { Position } from "@vueuse/core"
import { h } from "vue"

export interface Freehand {
    type: "freehand"

    /** The path is svg formatted, but can be a bit daunting at first for human people. It is basically a collection of all points
     * to connect where every point is notated like `L${x} ${y}`, but the first one starts with M instead of L. */
    path: string

    /** How thick the freehand line is. */
    thickness: number

    /** The color of the freehand line. */
    color: string
}

export interface Options {
    /** The smoothness defines how sharp the edges will be. A higher number means more smoothness. Defaults to 4. */
    smoothness?: number
}

// TODO: Add some more smoothness with bezier magic: https://francoisromain.medium.com/smooth-a-svg-path-with-cubic-bezier-curves-e37b49d46c74
/** useFreehand is like a pencil. You can draw whatever shapes you want wihout boundaries. It tries to smoothen out sharp edges with an algorithm found here originally: https://stackoverflow.com/a/40700068/829505 */
export function useFreehand(options?: Options): ToolComposable<Freehand> {
    const type = "freehand"

    const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14"><path fill="currentColor" fill-rule="evenodd" d="M8.61 2.66c-.227-.198-.817-.365-1.602.129c-2.508 1.58-4.693 4.43-5.432 5.463a.75.75 0 1 1-1.22-.873c.75-1.047 3.078-4.112 5.853-5.86C7.41.763 8.75.795 9.594 1.527c.421.365.684.89.688 1.486c.004.591-.246 1.177-.702 1.698c-1.427 1.632-3.312 3.845-4.104 4.925c-.104.142-.111.25-.102.312c.01.07.047.136.11.183a.411.411 0 0 0 .299.067c.14-.017.36-.094.628-.339c.226-.208.461-.43.703-.657c.745-.701 1.55-1.46 2.356-2.053c.838-.616 1.818-.787 2.561-.333c.371.227.632.59.723 1.024c.09.43.004.878-.213 1.29c-.232.442-.434.76-.615 1.046l-.014.023a10.6 10.6 0 0 0-.485.819a.506.506 0 0 0-.024.415c.024.06.047.089.06.101c.092.007.172-.016.299-.114c.178-.139.377-.374.676-.766a.75.75 0 0 1 1.192.911c-.285.373-.594.764-.948 1.04c-.392.304-.867.489-1.444.413c-.633-.082-1.048-.57-1.231-1.037a2.007 2.007 0 0 1 .09-1.658c.19-.364.37-.647.541-.916l.021-.034c.177-.279.352-.556.555-.942c.085-.162.077-.255.071-.284a.068.068 0 0 0-.036-.051c-.043-.027-.347-.138-.89.262c-.726.533-1.433 1.2-2.16 1.884c-.255.24-.513.483-.775.723c-.923.846-2.047.959-2.838.367c-.77-.576-.981-1.68-.32-2.582c.837-1.142 2.767-3.405 4.185-5.026l.513.448l-.513-.448c.271-.31.332-.555.331-.702a.468.468 0 0 0-.171-.362Zm2.863 8.883l-.003-.002c.002 0 .003.001.003.002" clip-rule="evenodd"/></svg>`

    const buffer: Position[] = []
    let path = ''
    const bufferSize = (options?.smoothness ?? 4)

    function appendToBuffer (pos: Position) {
        buffer.push(pos);
        while (buffer.length > bufferSize) {
            buffer.shift();
        }
    }

    /** Calculate the average point, starting at offset in the buffer */
    function getAveragePoint (offset: number) {
        const len = buffer.length
        if (len % 2 === 1 || len >= bufferSize) {
            let totalX = 0
            let totalY = 0
            let pt, i
            for (i = offset; i < len; i++) {
                pt = buffer[i]
                totalX += pt.x
                totalY += pt.y
            }
            return {
                x: totalX / (len - offset),
                y: totalY / (len - offset)
            }
        }
        return null;
    };

    function getSmoothPath () {
        let pos = getAveragePoint(0)

        if (pos) {
            // Get the smoothed part of the path that will not change
            path += ` L${pos.x} ${pos.y}`

            // Get the last part of the path (close to the current mouse position)
            // This part will change if the mouse moves again
            let tmpPath = ''
            for (let offset = 2; offset < buffer.length; offset += 2) {
                pos = getAveragePoint(offset)
                if (pos) {
                    tmpPath += ` L${pos.x} ${pos.y}`
                }
            }
            return path + tmpPath
        }
        return path
    };

    /** Initiates the draw by cleaning up previous state and starting a new path */
    function onDrawStart({ settings, x, y }: DrawEvent): Freehand {
        buffer.length = 0
        appendToBuffer({ x: x.value, y: y.value })
        path = `M${x.value} ${y.value}`
        return {
            type,
            path: getSmoothPath(),
            thickness: settings.thickness,
            color: settings.color
        }
    }

    /** Adds new point to path and returns complete Freehand object */
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

    /** Render an [svg path](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/path) with the given settings.  */
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

    return { type, icon, onDrawStart, onDraw, shapeSvg, svgStyle }
}
