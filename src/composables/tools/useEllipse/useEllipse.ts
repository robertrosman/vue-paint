import type { BaseShape, DrawEvent, Tool } from '@/types'
import { ellipseHandles } from '@/composables/tools/useMove/handles/ellipseHandles'
import { createShapeSvgComponent } from '@/utils/createShapeSvgComponent'
import { h } from 'vue'

export interface Ellipse extends BaseShape {
  type: 'ellipse'
  
  /** The x position of the center */
  x: number

  /** The y position of the center */
  y: number

  /** The height of the ellipse */
  height: number

  /** The width of the ellipse */
  width: number

  /** The stroke width of the ellipse */
  thickness: number

  /** Should the starting point of your draw be the center or edge of the ellipse? Defaults to 'edge'. */
  base: 'edge' | 'center'
  color: string
}

export interface UseEllipseOptions {
  base?: Ellipse["base"]
}

export function useEllipse({ base = 'edge'}: UseEllipseOptions = {}): Tool<Ellipse> {
  const type = 'ellipse'
  const diagonalMultiplier = Math.sqrt(2) // https://www.youtube.com/watch?v=T4ZxGHSe3TA Kinda based on this algorithm and multiplied by 2 to double the radius

  const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 6c4.41 0 8 2.69 8 6s-3.59 6-8 6s-8-2.69-8-6s3.59-6 8-6m0-2C6.5 4 2 7.58 2 12s4.5 8 10 8s10-3.58 10-8s-4.5-8-10-8"/></svg>`

  function onDraw({ settings, id, minX, minY, maxX, maxY, posStart }: DrawEvent): Ellipse {
    const dimensions = base === 'edge'
      ? {
        x: minX + (maxX - minX) / 2,
        y: minY + (maxY - minY) / 2,
        width: (maxX - minX) * diagonalMultiplier,
        height: (maxY - minY) * diagonalMultiplier,
      }
      : {
        x: posStart.x,
        y: posStart.y,
        width: (maxX - minX) * diagonalMultiplier * 2,
        height: (maxY - minY) * diagonalMultiplier * 2,
      }

    return {
      type,
      id,
      base,
      ...dimensions,
      thickness: settings.thickness,
      color: settings.color
    }
  }

  const ShapeSvgComponent = createShapeSvgComponent<Ellipse>((ellipse) =>
    h('ellipse', {
      cx: ellipse.x,
      cy: ellipse.y,
      rx: ellipse.width / 2,
      ry: ellipse.height / 2,
      stroke: ellipse.color,
      'stroke-width': ellipse.thickness
    })
  )

  const svgStyle = `
        ellipse {
            stroke-linecap: round;
            stroke-linejoin: round;
            fill-opacity: 0;
        }
    `

  return { type, icon, onDraw, ShapeSvgComponent, svgStyle, handles: ellipseHandles }
}
