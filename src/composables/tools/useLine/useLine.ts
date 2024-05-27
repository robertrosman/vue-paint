import type { BaseShape, DrawEvent, Tool } from '@/types'
import { lineMove } from '@/utils/moveFunctions'
import { shapeSvgComponent } from '@/utils/shapeSvgComponent'
import { h } from 'vue'

export interface Line extends BaseShape {
  type: 'line'
  x1: number
  y1: number
  x2: number
  y2: number
  thickness: number
  color: string
}

export function useLine(): Tool<Line> {
  const type = 'line'

  const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M21.71 3.29a1 1 0 0 0-1.42 0l-18 18a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l18-18a1 1 0 0 0 0-1.42"/></svg>`

  function onDraw({ settings, id, posStart, x, y }: DrawEvent): Line {
    return {
      type,
      id,
      x1: posStart.x,
      y1: posStart.y,
      x2: x,
      y2: y,
      thickness: settings.thickness,
      color: settings.color
    }
  }

  const shapeSvg = shapeSvgComponent<Line>((line) =>
    h('line', {
      x1: line.x1,
      y1: line.y1,
      x2: line.x2,
      y2: line.y2,
      stroke: line.color,
      'stroke-width': line.thickness
    })
  )

  const svgStyle = `
        line {
            stroke-linecap: round;
            stroke-linejoin: round;
            fill-opacity: 0;
        }
    `

  return { type, icon, onDraw, shapeSvg, svgStyle, onMove: lineMove }
}
