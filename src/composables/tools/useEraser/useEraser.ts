import type { BaseShape, DrawEvent, ImageHistory, Tool } from '@/types'

export interface Eraser extends BaseShape {
  type: 'eraser'
  targets: string[]
}

export function useEraser(): Tool<Eraser> {
  const type = 'eraser'

  const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m16.24 3.56l4.95 4.94c.78.79.78 2.05 0 2.84L12 20.53a4.01 4.01 0 0 1-5.66 0L2.81 17c-.78-.79-.78-2.05 0-2.84l10.6-10.6c.79-.78 2.05-.78 2.83 0M4.22 15.58l3.54 3.53c.78.79 2.04.79 2.83 0l3.53-3.53l-4.95-4.95z"/></svg>`

  const targets: string[] = []

  function updateTargets(x: number, y: number) {
    const elements = document.elementsFromPoint(x, y)
    const rootIndex = elements.findIndex(e => e.classList.contains('vp-image'))
    const newTargets = elements
      .slice(0, rootIndex)
      .map(e => e.id)
      .filter(e => e && !targets.includes(e))
    targets.push(...newTargets)
  }

  function onDrawStart({ id, absoluteX, absoluteY }: DrawEvent): Eraser {
    targets.length = 0
    updateTargets(absoluteX, absoluteY)
    return {
      type,
      id, 
      targets: structuredClone(targets)
    }
  }

  function onDraw({ id, absoluteX, absoluteY }: DrawEvent): Eraser {
    updateTargets(absoluteX, absoluteY)
    return {
      type,
      id, 
      targets: structuredClone(targets)
    }
  }

  function simplifyHistory(history: ImageHistory<BaseShape[]>) {
    const eraseIds = history
      .filter<Eraser>((shape): shape is Eraser => shape.type === 'eraser')
      .flatMap(s => s.targets)
    return history.filter(s => s.type !== 'eraser' && !eraseIds.includes(s.id))
  }

  return { type, icon, onDrawStart, onDraw, simplifyHistory }
}
