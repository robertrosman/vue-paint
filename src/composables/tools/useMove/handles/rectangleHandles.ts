import type { Handle } from "@/types"

interface RectangleLike {
  x: number
  y: number
  width: number
  height: number
}

export const rectangleHandles: Handle<RectangleLike>[] = [
    {
        name: 'base',
        position: ({ x, y, width, height }) => ({ x: x + width / 2, y: y + height / 2 }),
        onMove: ({ x, y }) => ({ x, y })
    },
    {
        name: 'top',
        position: ({ x, y, width }) => ({ x: x + width / 2, y }),
        onMove: ({ y }) => ({ y, height: -y })
    },
    {
        name: 'top-right',
        opposite: 'bottom-left',
        position: ({ x, y, width }) => ({ x: x + width, y }),
        onMove: ({ x, y }) => ({ width: x, height: -y, y })
    },
    {
        name: 'right',
        position: ({ x, y, width, height }) => ({ x: x + width, y: y + height / 2 }),
        onMove: ({ x }) => ({ width: x })
    },
    {
        name: 'bottom-right',
        opposite: 'top-left',
        position: ({ x, y, width, height }) => ({ x: x + width, y: y + height }),
        onMove: ({ x, y }) => ({ width: x, height: y })
    },
    {
        name: 'bottom',
        position: ({ x, y, width, height }) => ({ x: x + width / 2, y: y + height }),
        onMove: ({ y }) => ({ height: y })
    },
    {
        name: 'bottom-left',
        opposite: 'top-right',
        position: ({ x, y, height }) => ({ x, y: y + height }),
        onMove: ({ x, y }) => ({ x, width: -x, height: y })
    },
    {
        name: 'left',
        position: ({ x, y, height }) => ({ x, y: y + height / 2 }),
        onMove: ({ x }) => ({ x, width: -x })
    },
    {
        name: 'top-left',
        opposite: 'bottom-right',
        position: ({ x, y }) => ({ x, y }),
        onMove: ({ x, y }) => ({ x, y, width: -x, height: -y })
    },
]