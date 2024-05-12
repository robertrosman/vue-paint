import type { ToolSvgProps, ToolComposable, InitializeOptions } from "@/types"
import { createDataUrl } from "@/utils/createDataUrl"
import { h } from "vue"

export interface Background {
    type: "background"
    data: string
}

interface UseBackgroundOptions {
    blob: Blob | Promise<Blob>
}

/**
 * Use background to set a background image. There are several ways to create a blob. 
 * Note that you don't need to await the promise, you can pass it as option as is.
 * @example
 * const blob1 = await canvasToBlob(canvas)
 * const blob2 = await urlToBlob(url)
 */
export function useBackground({ blob }: UseBackgroundOptions): ToolComposable<Background> {
    const type = "background"

    async function initialize() {
        return createDataUrl(await blob).then(data => ({
            type,
            data
        }) as Background)
    }

    const toolSvg  = {
        props: { history: Array, activeShape: Object, width: Number, height: Number },
        setup(props: ToolSvgProps) {
            function getBackground() {
                return props.history.find<Background>((shape): shape is Background => shape.type === 'background')
            }
            return () => getBackground() ? h('image', {
                'xlink:href': getBackground()?.data,
                width: props.width
            }) : undefined
        },
        layer: -1_000_000,
    }

    return { type, initialize, toolSvg }
}