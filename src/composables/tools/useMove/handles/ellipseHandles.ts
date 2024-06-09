import type { Handle } from "@/types"

export interface EllipseLike {
  x: number
  y: number
  width: number
  height: number
  base: 'center' | 'edge'
}

const doubleDiagonalMultiplier = Math.sqrt(2) * 2 // https://www.youtube.com/watch?v=T4ZxGHSe3TA Kinda based on this algorithm and multiplied by 2 to double the radius
const diagonalMultiplier = Math.sqrt(2) // https://www.youtube.com/watch?v=T4ZxGHSe3TA Kinda based on this algorithm

export const ellipseHandles: Handle<EllipseLike>[] = [
    {
        name: 'base',
        position: ({ x, y }) => ({ x, y }),
        onMove: ({ x, y }) => ({ x, y })
    },
    {
        name: 'top',
        position: ({ x, y, height }) => ({ x, y: y - height / 2 }),
        onMove: ({ y }, { base }) => (base === 'center' 
            ? { height: -y * 2 }
            : { y: y / 2, height: -y}
        )
    },
    {
        name: 'top-right',
        opposite: 'bottom-left',
        position: ({ x, y, height, width }) => ({ x: x + width / doubleDiagonalMultiplier, y: y - height / doubleDiagonalMultiplier }),
        onMove: ({ x, y }, { base }) => (base === 'center'
            ? { width: x * diagonalMultiplier * 2, height: -y * diagonalMultiplier  * 2}
            : { x: x / 2, y: y / 2, width: x * diagonalMultiplier, height: -y * diagonalMultiplier }
        )
    },
    {
        name: 'right',
        position: ({ x, y, width }) => ({ x: x + width / 2, y }),
        onMove: ({ x }, { base }) => (base === 'center' 
            ? { width: x * 2 }
            : { x: x / 2, width: x}
        )
    },
    {
        name: 'bottom-right',
        opposite: 'top-left',
        position: ({ x, y, height, width }) => ({ x: x + width / doubleDiagonalMultiplier, y: y + height / doubleDiagonalMultiplier }),
        onMove: ({ x, y }, { base }) => (base === 'center'
            ? { width: x * diagonalMultiplier * 2, height: y * diagonalMultiplier  * 2}
            : { x: x / 2, y: y / 2, width: x * diagonalMultiplier, height: y * diagonalMultiplier }
        )
    },
    {
        name: 'bottom',
        position: ({ x, y, height }) => ({ x, y: y + height / 2 }),
        onMove: ({ y }, { base }) => (base === 'center' 
            ? { height: y * 2 }
            : { y: y / 2, height: y}
        )
    },
    {
        name: 'bottom-left',
        opposite: 'top-right',
        position: ({ x, y, height, width }) => ({ x: x - width / doubleDiagonalMultiplier, y: y + height / doubleDiagonalMultiplier }),
        onMove: ({ x, y }, { base }) => (base === 'center'
            ? { width: -x * diagonalMultiplier * 2, height: y * diagonalMultiplier  * 2}
            : { x: x / 2, y: y / 2, width: -x * diagonalMultiplier, height: y * diagonalMultiplier }
        )
    },
    {
        name: 'left',
        position: ({ x, y, width }) => ({ x: x - width / 2, y }),
        onMove: ({ x }, { base }) => (base === 'center' 
            ? { width: -x * 2 }
            : { x: x / 2, width: -x}
        )
    },
    {
        name: 'top-left',
        opposite: 'bottom-right',
        position: ({ x, y, height, width }) => ({ x: x - width / doubleDiagonalMultiplier, y: y - height / doubleDiagonalMultiplier }),
        onMove: ({ x, y }, { base }) => (base === 'center'
            ? { width: -x * diagonalMultiplier * 2, height: -y * diagonalMultiplier  * 2}
            : { x: x / 2, y: y / 2, width: -x * diagonalMultiplier, height: -y * diagonalMultiplier }
        )
    },
]