import { useSimplifiedHistory } from '@/composables/useSimplifiedHistory'
import type { BaseShape, DrawEvent, ImageHistory, Movement, Shape, Tool, ToolSvgProps } from '@/types'
import { h, toRefs } from 'vue'

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
    const handle = elements.find(e => e.classList.contains('handle'))
    targets = handle ? [handle.id.replace('handle-', '')] : []
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
  
  function onDrawEnd({ activeShape }: DrawEvent): Move | undefined {
    return targets.length === 0
      ? undefined
      : activeShape as Move
  }

  function simplifyHistory(history: ImageHistory<Shape[]>, tools: Tool<any>[]) {
    const flatMoves = history
      .filter<Move>((move): move is Move => move.type === 'move')
      .flatMap(move => move.targets.map(target => {
        const [_, shapeId, handle = 'base'] = target.match(/^([^-]+)(?:-(.*))?$/) ?? []
        return { shapeId, handle, x: move.x, y: move.y }
      }))

    return history.map(shape => {
      const clonedShape = {...shape}
      flatMoves.filter(move => shape.id === move.shapeId)
        .map(move => tools.find(tool => tool.type === shape.type)?.handles?.find(h => h.name === move.handle)?.onMove(move))
        .forEach(m => Object.entries(m ?? {}).forEach(([key, value]) => {
          clonedShape[key as keyof typeof clonedShape] += value
        }))
      return clonedShape
    }).filter(shape => shape.type !== 'move')
  }

  const toolSvg = {
    props: { history: Array, activeShape: Object, width: Number, height: Number, tools: Array },
    setup(props: ToolSvgProps) {
      const { simplifiedHistory } = useSimplifiedHistory(toRefs(props))
      return () =>
        simplifiedHistory.value.flatMap(shape => props.tools.find(t => t.type === shape.type)?.handles?.map(handle => {
          const {x, y} = handle.position(shape)
          return h('circle', { id: `handle-${shape.id}-${handle.name}`, class: 'handle', cx: x, cy: y, r: 10 })
      }))
    },
    layer: 1_000
  }

  const svgStyle = `
    circle.handle {
      stroke: #000;
      stroke-width: 2;
      stroke-opacity: 0.5;
      fill: #fff;
      fill-opacity: 0.3;
      transition: r 0.1s ease-out;
    }

    circle.handle:hover {
      r: 15;
    }
  `


  return { type, icon, onDrawStart, onDraw, onDrawEnd, simplifyHistory, toolSvg, svgStyle }
}
