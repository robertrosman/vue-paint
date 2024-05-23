import type { ToolSvgProps, DrawEvent, Tool, BaseShape } from '@/types'
import { shapeSvgComponent } from '@/utils/shapeSvgComponent'
import { computed, h } from 'vue'

export interface Arrow {
  type: 'arrow'
  x1: number
  y1: number
  x2: number
  y2: number
  thickness: number
  color: string
}

export function useArrow(): Tool<Arrow> {
  const type = 'arrow'

  const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15"><path fill="currentColor" d="M4.5 0h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .854.354L2.5 3.207l11.646 11.647l.708-.708L3.207 2.5L4.854.854A.5.5 0 0 0 4.5 0"/></svg>`

  function getArrowId(arrow: Arrow) {
    return `arrow-${arrow.color.replace(/[^a-z0-9]/gi, '')}`
  }

  function onDraw({ settings, posStart, x, y }: DrawEvent): Arrow {
    return {
      type,
      x1: posStart.x,
      y1: posStart.y,
      x2: x,
      y2: y,
      thickness: settings.thickness,
      color: settings.color
    }
  }

  const shapeSvg = shapeSvgComponent<Arrow>((arrow) =>
    h('line', {
      x1: arrow.x1,
      y1: arrow.y1,
      x2: arrow.x2,
      y2: arrow.y2,
      stroke: arrow.color,
      'stroke-width': arrow.thickness,
      'marker-end': `url(#${getArrowId(arrow)})`
    })
  )

  const toolSvg = {
    props: { history: Array, activeShape: Object, width: Number, height: Number },
    setup(props: ToolSvgProps) {
      const arrowMarkers = computed(() => {
        return [...props.history, props.activeShape]
          .filter<Arrow>((shape): shape is Arrow => shape?.type === 'arrow')
          .filter(
            (shape, index, self) =>
              self.findIndex((s) => getArrowId(s) === getArrowId(shape)) === index
          ) // Unique matches only
          .map((shape) => ({
            id: getArrowId(shape),
            color: shape.color
          }))
      })

      return () =>
        arrowMarkers.value.map((marker) =>
          h(
            'defs',
            h(
              'marker',
              {
                id: marker.id,
                key: marker.id,
                viewBox: '0 0 10 10',
                refX: '2.5',
                refY: '2.5',
                markerWidth: '8',
                markerHeight: '8',
                orient: 'auto-start-reverse'
              },
              [
                h('polygon', {
                  points: '0,5 1.7,2.5 0,0 5,2.5',
                  fill: marker.color
                })
              ]
            )
          )
        )
    }
  }

  return { type, icon, onDraw, shapeSvg, toolSvg }
}
