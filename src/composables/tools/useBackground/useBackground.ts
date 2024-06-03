import type { ToolSvgComponentProps, Tool, BaseShape, SvgStyleParameters } from '@/types'
import { createDataUrl } from '@/utils/createDataUrl'
import { randomId } from '@/utils/randomId'
import { computed, h } from 'vue'

export interface Background extends BaseShape {
  type: 'background'
  data?: string
  color?: string
}

interface UseBackgroundOptions {
  blob?: Blob | Promise<Blob>
  color?: string
}

/**
 * Use background to set a background image. There are several ways to create a blob.
 * Note that you don't need to await the promise, you can pass it as option as is.
 * @example
 * const blob1 = await canvasToBlob(canvas)
 * const blob2 = await urlToBlob(url)
 */
export function useBackground({ blob, color }: UseBackgroundOptions): Tool<Background> {
  const type = 'background'

  async function onInitialize(): Promise<Background> {
    const data = blob ? await createDataUrl(await blob) : undefined
    return {
        type,
        id: randomId(),
        data,
        color
    }
  }

  const ToolSvgComponent = {
    props: { history: Array, activeShape: Object, width: Number, height: Number, tools: Array },
    setup(props: ToolSvgComponentProps) {
      const background = computed(() => {
        return props.history.find<Background>(
          (shape): shape is Background => shape.type === 'background'
        )
      })
      return () =>
        background.value?.data
          ? h('image', {
              href: background.value.data,
              id: background.value.id,
              width: props.width
            })
          : undefined
    },
    layer: -1_000_000
  }

  function svgStyle({ svgId }: SvgStyleParameters) {
    return `
      #${svgId} {
        background-color: ${color}
      }
    `
  }

  return { type, onInitialize, ToolSvgComponent, svgStyle }
}
