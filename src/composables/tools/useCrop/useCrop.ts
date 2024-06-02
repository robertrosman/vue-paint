import type { ToolSvgComponentProps, DrawEvent, Tool, ExportParameters, Shape, BaseShape, ImageHistory } from '@/types'
import { computed, h, toRefs } from 'vue'
import { rectangleHandles } from '../useMove/handles/rectangleHandles'
import { useSimplifiedHistory } from '@/composables/useSimplifiedHistory'

export interface Crop extends BaseShape {
  type: 'crop'
  x: number
  y: number
  width: number
  height: number
}

export function useCrop(): Tool<Crop> {
  const type = 'crop'

  const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M17 23v-4H7q-.825 0-1.412-.587T5 17V7H1V5h4V1h2v16h16v2h-4v4zm0-8V7H9V5h8q.825 0 1.413.588T19 7v8z"/></svg>`

  function onDraw({ id, minX, minY, maxX, maxY }: DrawEvent): Crop {
    return {
      type,
      id,
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    }
  }

  function simplifyHistory(history: ImageHistory<Shape[]>) {
    const crops = history.filter(shape => shape.type === 'crop')
    return history.filter(shape => shape.type !== 'crop' || shape.id === crops[crops.length - 1].id)
  }


  const ToolSvgComponent = {
    props: { history: Array, activeShape: Object, width: Number, height: Number, tools: Array },
    setup(props: ToolSvgComponentProps) {
      const { simplifiedHistory } = useSimplifiedHistory({ ...toRefs(props), includeActiveShape: true })
      const crop = computed(() => simplifiedHistory.value.find(s => s.type === 'crop'))
      return () =>
        crop.value
          ? h('path', {
              class: 'overlay',
              id: crop.value.id,
              d: `M 0,0 V ${props.height} H ${props.width} V 0 Z
                    M ${crop.value.x},${crop.value.y} H ${crop.value.x + crop.value.width} V ${crop.value.y + crop.value.height} H ${crop.value.x} Z
                `
            })
          : undefined
    },
    layer: 1_000_000
  }

  const svgStyle = `
        .overlay {
            opacity: 0.7;
            fill: #020202;
        }
    `

  function beforeExport({ svg, history }: ExportParameters) {
    const crop = simplifyHistory(history).find<Crop>((shape): shape is Crop => shape.type === 'crop')
    if (crop) {
      const { x, y, width, height } = crop
      svg.setAttribute('width', String(width))
      svg.setAttribute('height', String(height))
      svg.setAttribute('viewBox', `${x} ${y} ${width} ${height}`)
      svg.querySelector('.overlay')?.remove()
    }
  }

  return { type, icon, onDraw, svgStyle, simplifyHistory, ToolSvgComponent, beforeExport, handles: rectangleHandles }
}
