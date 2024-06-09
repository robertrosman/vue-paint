import type { Handle, Movement } from "@/types"

interface LineLike {
  x1: number
  y1: number
  x2: number
  y2: number
}

export const lineHandles: Handle<LineLike>[] = [
    {
        name: 'start',
        position: ({x1, y1}: LineLike) => ({x: x1, y: y1}),
        onMove: ({x, y}: Movement) => ({x1: x, y1: y}),
        opposite: 'end'
    },
    {
        name: 'base',
        position: ({x1, y1, x2, y2}: LineLike) => ({x: x1 + (x2 - x1) / 2, y: y1 + (y2 - y1) / 2}),
        onMove: ({x, y}: Movement) => ({x1: x, y1: y, x2: x, y2: y})
    },
    {
        name: 'end',
        position: ({x2, y2}: LineLike) => ({x: x2, y: y2}),
        onMove: ({x, y}: Movement) => ({x2: x, y2: y}),
        opposite: 'start'
    },
]