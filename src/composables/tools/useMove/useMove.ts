import { useSimplifiedHistory } from '@/composables/useSimplifiedHistory'
import type { BaseShape, DrawEvent, ExportParameters, ImageHistory, Movement, Shape, Tool, ToolSvgComponentProps } from '@/types'
import { h, toRefs } from 'vue'

export interface Move extends BaseShape, Movement {
  type: 'move'
  targets: string[]
  x: number
  y: number
}

export interface UseMoveOptions {
  /** Should active shape have handles regardless of what tool is being used?  */
  handlesOnActiveShape?: boolean

  /** Radius on the handles. Defaults to 10. */
  handleRadius?: number
}

export function useMove({
  handlesOnActiveShape = false,
  handleRadius = 10
}: UseMoveOptions = {}): Tool<Move> {
  const type = 'move'

  const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="currentColor" d="m19 10l-4 4v-3h-4v4h3l-4 4l-4-4h3v-4H5v3l-4-4l4-4v3h4V5H6l4-4l4 4h-3v4h4V6z"/></svg>`

  let targets: string[] = []

  function updateTargets(x: number, y: number) {
    const elements = document.elementsFromPoint(x, y)
    const handle = elements.find(e => e.classList.contains('handle'))
    targets = handle ? [handle.id] : []
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
        const [handle, shapeId] = target.includes('-handle-') ? target.split('-handle-') : ['base', target]
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

  const ToolSvgComponent = {
    props: { history: Array, activeShape: Object, width: Number, height: Number, tools: Array },
    setup(props: ToolSvgComponentProps) {
      const { simplifiedHistory } = useSimplifiedHistory({ ...toRefs(props), includeActiveShape: true })
      return () =>
        simplifiedHistory.value.flatMap((shape, i) => props.tools.find(t => t.type === shape.type)?.handles?.map(handle => {
          const {x, y} = handle.position(shape)
          return h('circle', {
            id: `${handle.name}-handle-${shape.id}`, 
            class: `handle use-tool-move ${handlesOnActiveShape && i === simplifiedHistory.value.length - 1 ? 'is-active' : ''}`,
            cx: x,
            cy: y
          })
      }))
    },
    layer: 1_000
  }

  const svgStyle = `
    circle.handle {
      r: 0;
      stroke: #000;
      stroke-width: 2;
      stroke-opacity: 0.5;
      fill: #fff;
      fill-opacity: 0.3;
      transition: r 0.1s ease-out;
    }

    .active-tool-move circle.handle, 
    .vp-editor circle.handle.is-active {
      r: ${handleRadius};
    }

    .active-tool-move circle.handle:hover,
    .vp-editor circle.handle.is-active:hover {
      r: ${handleRadius * 1.5};
    }
  `

  function beforeExport({ svg }: ExportParameters) {
    svg.querySelectorAll('circle.handle').forEach(handle => handle.remove())
  }

  return { type, icon, onDrawStart, onDraw, onDrawEnd, simplifyHistory, ToolSvgComponent, svgStyle, beforeExport }
}
