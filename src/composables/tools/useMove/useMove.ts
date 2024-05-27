import type { BaseShape, DrawEvent, ImageHistory, Movement, Shape, Tool } from '@/types'

export interface Move extends BaseShape, Movement {
  type: 'move'
  targets: string[]
  x: number
  y: number
}

export function useMove(): Tool<Move> {
  const type = 'move'

  const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="currentColor" d="m19 10l-4 4v-3h-4v4h3l-4 4l-4-4h3v-4H5v3l-4-4l4-4v3h4V5H6l4-4l4 4h-3v4h4V6z"/></svg>`

  let targets: string[] = []

  function updateTargets(x: number, y: number) {
    const elements = document.elementsFromPoint(x, y)
    const rootIndex = elements.findIndex(e => e.classList.contains('vp-image'))
    targets = elements
      .slice(0, rootIndex)
      .map(e => e.id)
      .filter(e => e && !targets.includes(e))
  }

  function onDrawStart({ id, absoluteX, absoluteY }: DrawEvent): Move {
    updateTargets(absoluteX, absoluteY)
    return {
      type,
      id, 
      targets: structuredClone(targets),
      x: 0,
      y: 0
    }
  }

  function onDraw({ id, posStart, x, y }: DrawEvent): Move {
    return {
      type,
      id, 
      targets: structuredClone(targets),
      x: x - posStart.x,
      y: y - posStart.y,
    }
  }

  function simplifyHistory(history: ImageHistory<Shape[]>, tools: Tool<any>[]) {
    return history.map(shape => {
      const clonedShape = {...shape}
      history
        .filter<Move>((m): m is Move => m.type === 'move')
        .filter(m => m.targets.includes(shape.id))
        .map(m => tools.find(t => t.type === shape.type)?.onMove?.(m))
        .forEach(m => Object.entries(m ?? {}).forEach(([key, value]) => {
          clonedShape[key as keyof typeof clonedShape] += value
        }))
      return clonedShape
    }).filter(shape => shape.type !== 'move')
  }

  return { type, icon, onDrawStart, onDraw, simplifyHistory }
}
