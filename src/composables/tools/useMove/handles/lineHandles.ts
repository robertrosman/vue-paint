import type { Handle } from "@/types"

interface LineLike {
  x1: number
  y1: number
  x2: number
  y2: number
}

export const lineHandles: Handle<LineLike>[] = [
    {
        name: 'start',
        opposite: 'end',
        position: ({x1, y1}) => ({x: x1, y: y1}),
        onMove: ({x, y}) => ({x1: x, y1: y})
    },
    {
        name: 'base',
        position: ({x1, y1, x2, y2}) => ({x: x1 + (x2 - x1) / 2, y: y1 + (y2 - y1) / 2}),
        onMove: ({x, y}) => ({x1: x, y1: y, x2: x, y2: y})
    },
    {
        name: 'end',
        opposite: 'start',
        position: ({x2, y2}) => ({x: x2, y: y2}),
        onMove: ({x, y}) => ({x2: x, y2: y})
    },
]